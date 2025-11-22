import React, { useRef } from "react";
import { useFoamCutStore } from "../../state/foamCutStore";
import { generateGCode } from "../../geometry/gcode";
import { runFullOptimization } from "../../geometry/pipeline";
import { importDxfString } from "../../utils/dxfImport";
import paper from "paper";
import { useWorkflowStore } from "../../state/workflowStore";

interface TopBarProps {
  title?: string;
  icon?: string;
  showActions?: boolean;
  rightContent?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = "FoamCut Web",
  icon = "🔷",
  showActions = true,
  rightContent
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setWorkflow = useWorkflowStore((state) => state.setWorkflow);
  const {
    contours,
    optimizedPath,
    kerf,
    units,
    scale,
    origin,
    feedRate,
    setContours,
    customEntryPoints,
    samplesPerContour,
    crossingPenaltyWeight,
    useCustomEntryPoints,
  } = useFoamCutStore();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();

    try {
      const project = paper.project;
      if (!project) {
        alert("Canvas not ready. Please wait a moment and try again.");
        return;
      }

      if (file.name.endsWith(".svg")) {
        // SVG import
        try {
          const svgItem = project.importSVG(text);
          if (!svgItem) {
            alert("Failed to import SVG file.");
            return;
          }

          // Convert SVG items to paths
          const paths: paper.Path[] = [];
          const collectPaths = (item: any): void => {
            if (item instanceof paper.Path) {
              if (!item.closed && item.segments.length > 2) {
                item.closed = true;
              }
              if (item.closed && item.segments.length > 2) {
                paths.push(item);
              }
            } else if (item instanceof paper.Group || item instanceof paper.CompoundPath) {
              if (item.children) {
                item.children.forEach((child: any) => collectPaths(child));
              }
            }
          };

          collectPaths(svgItem);

          if (paths.length === 0) {
            alert("No closed paths found in SVG. Please ensure the SVG contains closed shapes.");
            svgItem.remove();
            return;
          }

          // Style paths
          paths.forEach((path) => {
            path.strokeColor = new paper.Color(0.2, 0.4, 1);
            path.strokeWidth = 3;
            path.fillColor = null;
            path.visible = true;
            path.opacity = 1;
          });

          // Build contours
          const newContours = paths.map((p, idx) => ({
            id: `c_${Date.now()}_${idx}`,
            path: p,
            isHole: false,
            parentId: undefined,
            islandId: `island_${idx}`,
            bounds: p.bounds ? {
              x: p.bounds.x,
              y: p.bounds.y,
              width: p.bounds.width,
              height: p.bounds.height,
            } : undefined,
            area: p.area,
          }));

          setContours(newContours);

          // Fit view to imported content
          setTimeout(() => {
            if (paths.length > 0 && paths[0].bounds) {
              let bounds = paths[0].bounds.clone();
              paths.forEach(p => {
                if (p.bounds) bounds = bounds.unite(p.bounds);
              });

              const padding = Math.max(bounds.width, bounds.height) * 0.2;
              const expandedBounds = bounds.expand(padding);
              const zoom = Math.min(
                paper.view.viewSize.width / expandedBounds.width,
                paper.view.viewSize.height / expandedBounds.height,
                2
              );
              paper.view.zoom = zoom;
              paper.view.center = expandedBounds.center;
              paper.view.update();
            }
          }, 100);
        } catch (error) {
          console.error("SVG import error:", error);
          alert("Failed to import SVG file: " + (error instanceof Error ? error.message : String(error)));
        }
      } else if (file.name.endsWith(".dxf")) {
        const project = paper.project;
        if (!project) {
          alert("Canvas not ready. Please wait a moment and try again.");
          return;
        }

        try {
          console.log("=== DXF IMPORT START ===");
          console.log("Project active:", !!project);
          console.log("Project layers:", project.layers.length);
          console.log("Items before import:", project.activeLayer.children.length);

          const paths = importDxfString(text, project);
          console.log("✅ DXF import created", paths.length, "paths");
          console.log("Items after import:", project.activeLayer.children.length);

          if (paths.length === 0) {
            alert("No valid paths found in DXF file.");
            return;
          }

          // Ensure all paths are styled and visible as blue contours
          console.log("🔵 Styling paths...");
          paths.forEach((path, idx) => {
            // Verify path exists and has segments
            if (!path || path.segments.length === 0) {
              console.warn(`⚠️ Path ${idx} is invalid - no segments`);
              return;
            }

            path.strokeColor = new paper.Color(0.2, 0.4, 1); // Blue
            path.strokeWidth = 3; // Make it very visible
            path.fillColor = null;
            path.visible = true;
            path.opacity = 1;
            path.bringToFront();

            // Debug all paths
            if (path.bounds) {
              const bounds = path.bounds;
              console.log(`Path ${idx}:`, {
                type: path.constructor.name,
                segments: path.segments.length,
                closed: path.closed,
                bounds: `x:${bounds.x.toFixed(1)} y:${bounds.y.toFixed(1)} w:${bounds.width.toFixed(1)} h:${bounds.height.toFixed(1)}`,
                firstPoint: path.firstSegment ? path.firstSegment.point.toString() : 'none',
                visible: path.visible,
                strokeWidth: path.strokeWidth,
                strokeColor: path.strokeColor ? 'set' : 'missing',
                hasParent: !!path.parent,
                parentType: path.parent ? path.parent.constructor.name : 'none'
              });
            } else {
              console.warn(`⚠️ Path ${idx} has no bounds!`);
            }
          });
          console.log("✅ Finished styling", paths.length, "paths");

          console.log("Total paths in project:", project.activeLayer.children.length);

          // Close open paths that have enough segments to form closed shapes
          paths.forEach(path => {
            if (!path.closed && path.segments.length > 2) {
              // Check if start and end are close enough to consider it closed
              const start = path.firstSegment.point;
              const end = path.lastSegment.point;
              const dist = start.getDistance(end);
              if (dist < 0.1) {
                path.closed = true;
              }
            }
          });

          // Build contours from closed paths only (for path optimization)
          const closedPaths = paths.filter(p => p.closed && p.segments.length > 2);
          const newContours = closedPaths.map((p, idx) => ({
            id: `c_${Date.now()}_${idx}`,
            path: p,
            isHole: false,
            parentId: undefined,
            islandId: `island_${idx}`,
            bounds: p.bounds ? {
              x: p.bounds.x,
              y: p.bounds.y,
              width: p.bounds.width,
              height: p.bounds.height,
            } : undefined,
            area: p.area,
          }));

          // Update store to trigger Canvas2D re-render
          setContours(newContours);

          // Force immediate view update - wait a bit for React to update
          setTimeout(() => {
            // Fit view to show all imported content
            console.log("🔍 Calculating view bounds...");
            if (paths.length > 0) {
              let bounds: paper.Rectangle | null = null;
              let validBoundsCount = 0;
              paths.forEach((path, idx) => {
                if (path.bounds) {
                  const b = path.bounds;
                  if (b.width > 0 && b.height > 0) {
                    validBoundsCount++;
                    if (!bounds) {
                      bounds = b.clone();
                      console.log(`  First bounds (from path ${idx}):`, bounds.toString());
                    } else {
                      const oldBounds = bounds.clone();
                      bounds = bounds.unite(b);
                      console.log(`  After union with path ${idx}:`, bounds.toString());
                    }
                  } else {
                    console.warn(`  ⚠️ Path ${idx} has invalid bounds (w:${b.width} h:${b.height})`);
                  }
                } else {
                  console.warn(`  ⚠️ Path ${idx} has no bounds property`);
                }
              });

              console.log("📊 Bounds calculation:", {
                totalPaths: paths.length,
                validBounds: validBoundsCount,
                combinedBounds: bounds ? bounds.toString() : 'null',
                boundsCenter: bounds ? bounds.center.toString() : 'null',
                boundsSize: bounds ? `${bounds.width.toFixed(1)} x ${bounds.height.toFixed(1)}` : 'null'
              });
              console.log("📐 View size:", paper.view.viewSize.toString());

              if (bounds && bounds.width > 0 && bounds.height > 0) {
                // Add some padding (20% on each side)
                const padding = Math.max(bounds.width, bounds.height) * 0.2;
                const expandedBounds = bounds.expand(padding);

                // Calculate zoom to fit (make sure we don't zoom too much)
                const zoomX = paper.view.viewSize.width / expandedBounds.width;
                const zoomY = paper.view.viewSize.height / expandedBounds.height;
                const zoom = Math.min(zoomX, zoomY, 2); // Allow some zoom but not too much

                console.log("🎯 Setting view transform:", {
                  originalBounds: bounds.toString(),
                  expandedBounds: expandedBounds.toString(),
                  padding: padding.toFixed(1),
                  zoomX: zoomX.toFixed(3),
                  zoomY: zoomY.toFixed(3),
                  finalZoom: zoom.toFixed(3),
                  center: expandedBounds.center.toString(),
                  viewSize: paper.view.viewSize.toString()
                });

                // Set view transform
                paper.view.zoom = zoom;
                paper.view.center = expandedBounds.center;

                console.log("✅ View set - verifying:", {
                  actualZoom: paper.view.zoom,
                  actualCenter: paper.view.center.toString(),
                  actualViewSize: paper.view.viewSize.toString()
                });

                // Force immediate update
                paper.view.update();

                // Verify paths are still in project
                console.log("📦 Final check - project state:", {
                  totalItems: project.activeLayer.children.length,
                  pathCount: project.activeLayer.children.filter((item: any) => item instanceof paper.Path).length
                });
              } else {
                // If no valid bounds, try to find any bounds from project
                const allBounds = project.activeLayer.bounds;
                if (allBounds && allBounds.width > 0 && allBounds.height > 0) {
                  const padding = Math.max(allBounds.width, allBounds.height) * 0.2;
                  const expandedBounds = allBounds.expand(padding);
                  const zoomX = paper.view.viewSize.width / expandedBounds.width;
                  const zoomY = paper.view.viewSize.height / expandedBounds.height;
                  const zoom = Math.min(zoomX, zoomY, 1);
                  paper.view.zoom = zoom;
                  paper.view.center = expandedBounds.center;
                  console.log("Using project bounds - zoom:", zoom, "center:", expandedBounds.center);
                } else {
                  // If still no bounds, center on origin
                  console.log("No bounds found, centering on origin");
                  paper.view.center = new paper.Point(0, 0);
                  paper.view.zoom = 1;
                }
              }
            }

            // Force view update and redraw multiple times to ensure it takes
            console.log("🎬 Final view state:", {
              center: paper.view.center.toString(),
              zoom: paper.view.zoom.toFixed(3),
              size: paper.view.viewSize.toString()
            });

            // Force Paper.js to update multiple times
            for (let i = 0; i < 3; i++) {
              paper.view.update();
            }

            // Verify paths are still there and visible
            const finalPathCount = paper.project.activeLayer.children.filter((item: any) =>
              item instanceof paper.Path && item.visible
            ).length;

            console.log("✅ Import complete - Final state:", {
              totalItems: paper.project.activeLayer.children.length,
              visiblePaths: finalPathCount,
              viewCenter: paper.view.center.toString(),
              viewZoom: paper.view.zoom.toFixed(3)
            });

            console.log("=== DXF IMPORT END ===");
          }, 100);
        } catch (error) {
          console.error("DXF import error:", error);
          alert("Failed to import DXF file: " + (error instanceof Error ? error.message : String(error)));
        }
      } else {
        alert("Please select a DXF file.");
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import file: " + (error instanceof Error ? error.message : String(error)));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleExportSVG = () => {
    const project = paper.project;
    if (!project) {
      alert("Canvas not ready.");
      return;
    }

    const svg = project.exportSVG({ asString: true }) as string;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "foamcut-export.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGeneratePath = () => {
    console.log("=== GENERATE PATH START ===");
    console.log("Contours in store:", contours.length);

    if (contours.length === 0) {
      alert("Please import or draw contours first.");
      return;
    }

    contours.forEach((c, idx) => {
      console.log(`Contour ${idx}:`, {
        id: c.id,
        closed: c.path?.closed,
        segments: c.path?.segments?.length,
        bounds: c.bounds
      });
    });

    console.log("Running optimization with", contours.length, "contours");
    console.log("Custom entry points:", customEntryPoints.size);

    const optimized = runFullOptimization(contours, {
      origin,
      samplesPerContour,
      crossingPenaltyWeight,
      customEntryPoints: useCustomEntryPoints ? customEntryPoints : undefined,
    });
    console.log("Optimization result:", optimized ? `${optimized.polyline.length} points, ${optimized.length.toFixed(2)} units` : 'undefined');

    if (optimized) {
      console.log("Optimized path details:");
      console.log("  - Contours ordered:", optimized.contoursOrdered);
      console.log("  - Entry/exits:", optimized.entryExits.length);
      console.log("  - First 5 polyline points:", optimized.polyline.slice(0, 5));
      console.log("  - Last 5 polyline points:", optimized.polyline.slice(-5));

      useFoamCutStore.getState().setOptimizedPath(optimized);
      console.log("✅ Optimized path set in store");
    } else {
      console.log("⚠️ Optimization returned undefined");
    }
    console.log("=== GENERATE PATH END ===");
  };

  const handleExportGCode = () => {
    if (!optimizedPath || optimizedPath.polyline.length === 0) {
      alert("Please generate a path first.");
      return;
    }

    const gcode = generateGCode(optimizedPath.polyline, {
      feedRate,
      units,
      origin,
      scale,
    });

    const blob = new Blob([gcode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "foamcut.nc";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          className="ghost"
          onClick={() => setWorkflow('HOME')}
          style={{ marginRight: '1rem' }}
        >
          🏠
        </button>
        <div className="logo">
          <span className="logo-icon">{icon}</span>
          <span className="logo-text" style={{
            background: "linear-gradient(45deg, #fff, #888)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {title}
          </span>
          {title === "FoamCut Web" && <span className="badge beta">Beta</span>}
        </div>
      </div>

      <div className="topbar-center">
        {/* Optional: Menu items like File, View, Help */}
      </div>

      <div className="topbar-right">
        {rightContent}
        {showActions && !rightContent && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.dxf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button className="ghost" onClick={handleImportClick} title="Import File">
              📁 <span style={{ display: "none" }}>Import</span>
            </button>
            <button className="ghost" onClick={handleExportSVG} title="Export SVG">
              💾 <span style={{ display: "none" }}>Export SVG</span>
            </button>
            <button className="primary" onClick={handleGeneratePath}>
              ⚡ Generate Path
            </button>
            <button className="ghost" onClick={handleExportGCode} title="Export G-code">
              📄 <span style={{ display: "none" }}>Export G-code</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
