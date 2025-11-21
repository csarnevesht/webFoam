
import React, { useEffect, useRef } from "react";
import paper from "paper";
import { useFoamCutStore } from "../../state/foamCutStore";

export const Canvas2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectInitialized = useRef(false);
  const currentPathRef = useRef<paper.Path | null>(null);
  const polylinePointsRef = useRef<paper.Point[]>([]);
  const { contours, optimizedPath, origin, activeTool, setContours } = useFoamCutStore();

  useEffect(() => {
    if (!canvasRef.current || projectInitialized.current) return;

    // Initialize Paper.js
    paper.setup(canvasRef.current);
    projectInitialized.current = true;
    console.log("✅ Canvas2D: Paper.js initialized");
    console.log("  Canvas size:", canvasRef.current.clientWidth, "x", canvasRef.current.clientHeight);
    console.log("  View size:", paper.view.viewSize.toString());
    console.log("  View center:", paper.view.center.toString());
    console.log("  View zoom:", paper.view.zoom);

    // Set view size
    paper.view.viewSize = new paper.Size(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );

    // Center the view at origin
    paper.view.center = new paper.Point(0, 0);
    paper.view.zoom = 1;

    console.log("  View center after setup:", paper.view.center.toString());
    paper.view.update();

    console.log("✅ Canvas2D: Paper.js initialized, ready for imports");

    return () => {
      // Don't clear on unmount - let paths persist
      // if (projectInitialized.current) {
      //   paper.project.clear();
      //   projectInitialized.current = false;
      // }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !projectInitialized.current) {
      console.log("⏸️ Canvas2D: Not initialized yet");
      return;
    }

    const project = paper.project;
    console.log("🎨 Canvas2D: Rendering effect triggered");
    console.log("  - Project has", project.activeLayer.children.length, "items in activeLayer");
    console.log("  - Contours:", contours.length);
    console.log("  - Optimized path:", !!optimizedPath);
    
    // Remove only visualization layers, keep the imported paths
    const layersToRemove: paper.Layer[] = [];
    project.layers.forEach((layer) => {
      if (layer.data.isVisualization) {
        layersToRemove.push(layer);
      }
    });
    layersToRemove.forEach(layer => layer.remove());

    // Create a new layer for visualizations but don't activate it yet
    const vizLayer = new paper.Layer();
    vizLayer.data.isVisualization = true;

    // Make sure activeLayer is still the main layer with imported paths
    const mainLayer = project.layers.find(l => !l.data.isVisualization) || project.layers[0];

    console.log("📋 Layer analysis:");
    console.log("  Total layers:", project.layers.length);
    project.layers.forEach((layer, idx) => {
      console.log(`  Layer ${idx}:`, {
        isViz: layer.data.isVisualization,
        children: layer.children.length,
        active: layer === project.activeLayer
      });
    });

    if (mainLayer) {
      mainLayer.activate();
      console.log("  ✅ Main layer activated");
    } else {
      console.warn("  ⚠️ No main layer found!");
      return;
    }

    // Style all paths in the main layer (including DXF imports) - make them blue contours
    console.log("🔵 Canvas2D: Styling all paths in main layer...");
    console.log("  Main layer has", mainLayer.children.length, "items");
    let pathCount = 0;
    let styledPaths: any[] = [];

    mainLayer.children.forEach((item: any, idx: number) => {
      if (item instanceof paper.Path) {
        // Style the path
        item.strokeColor = new paper.Color(0.2, 0.4, 1); // Blue
        item.strokeWidth = 3; // Make them very visible
        item.fillColor = null;
        item.visible = true;
        item.opacity = 1;
        item.bringToFront();
        pathCount++;
        
        styledPaths.push({
          index: idx,
          segments: item.segments.length,
          bounds: item.bounds ? item.bounds.toString() : 'no bounds',
          visible: item.visible
        });
      } else if (item instanceof paper.Group || item instanceof paper.CompoundPath) {
        console.log(`  Item ${idx} is a ${item.constructor.name}, has ${item.children ? item.children.length : 0} children`);
        // Handle groups and compound paths recursively
        const styleChildren = (group: any) => {
          if (group.children) {
            group.children.forEach((child: any) => {
              if (child instanceof paper.Path) {
                child.strokeColor = new paper.Color(0.2, 0.4, 1);
                child.strokeWidth = 3;
                child.fillColor = null;
                child.visible = true;
                child.opacity = 1;
                pathCount++;
              } else if (child instanceof paper.Group || child instanceof paper.CompoundPath) {
                styleChildren(child);
              }
            });
          }
        };
        styleChildren(item);
      } else {
        console.log(`  Item ${idx} is ${item.constructor.name} (not a Path)`);
      }
    });
    
    console.log("✅ Canvas2D: Styled", pathCount, "paths");
    if (styledPaths.length > 0) {
      console.log("  Path details:", styledPaths.slice(0, 5));
    }

    // Draw contours in blue (if they're already in the project, style them)
    contours.forEach((contour) => {
      if (contour.path) {
        const path = contour.path as paper.Path;
        if (path && path.parent) {
          // Style the existing path - make sure it's visible
          path.strokeColor = new paper.Color(0.2, 0.4, 1); // Blue
          path.strokeWidth = 2; // Make thicker for visibility
          path.fillColor = null;
          path.visible = true;
          path.opacity = 1;
          path.bringToFront();
        } else if (path) {
          // Clone and add to visualization layer if not in project
          const visualPath = path.clone();
          visualPath.strokeColor = new paper.Color(0.2, 0.4, 1); // Blue
          visualPath.strokeWidth = 2;
          visualPath.fillColor = null;
          visualPath.visible = true;
          vizLayer.addChild(visualPath);
        }
      }
    });

    // Draw optimized path in red with green arrows and START labels
    if (optimizedPath && optimizedPath.polyline.length > 1) {
      const path = new paper.Path();
      path.strokeColor = new paper.Color(1, 0.2, 0.2); // Red
      path.strokeWidth = 2;

      optimizedPath.polyline.forEach((p, idx) => {
        const point = new paper.Point(p.x, p.y);
        if (idx === 0) {
          path.moveTo(point);
        } else {
          path.lineTo(point);
        }
      });
      vizLayer.addChild(path);

      // Draw START labels at entry points for each contour
      const startPoints = new Set<string>();
      optimizedPath.entryExits.forEach((entryExit) => {
        const contour = contours.find(c => c.id === entryExit.contourId);
        if (contour && contour.path) {
          const pathItem = contour.path as paper.Path;
          if (pathItem && pathItem.length > 0) {
            const entryPoint = pathItem.getPointAt(pathItem.length * entryExit.entryT);
            const pointKey = `${entryPoint.x.toFixed(1)},${entryPoint.y.toFixed(1)}`;
            
            if (!startPoints.has(pointKey)) {
              startPoints.add(pointKey);

              // Draw smaller green circle for start point (4px radius instead of 8px)
              const startCircle = new paper.Path.Circle(entryPoint, 4);
              startCircle.fillColor = new paper.Color(0.2, 1, 0.2); // Green
              startCircle.strokeColor = new paper.Color(0, 0.8, 0);
              startCircle.strokeWidth = 1.5;
              startCircle.data.isStartPoint = true;
              startCircle.data.contourId = entryExit.contourId;
              startCircle.data.entryT = entryExit.entryT;
              vizLayer.addChild(startCircle);

              // Add smaller "S" text label instead of "START"
              const text = new paper.PointText({
                point: entryPoint.add(new paper.Point(0, -10)),
                content: "S",
                fillColor: new paper.Color(0, 0.8, 0),
                fontSize: 8,
                fontFamily: "Arial",
                fontWeight: "bold"
              });
              text.data.isStartLabel = true;
              text.data.contourId = entryExit.contourId;
              vizLayer.addChild(text);
            }
          }
        }
      });

      // Draw green direction arrows along the path (more frequent)
      const arrowSpacing = 20; // Distance between arrows in pixels
      let accumulatedDist = 0;
      
      for (let i = 0; i < optimizedPath.polyline.length - 1; i++) {
        const p1 = optimizedPath.polyline[i];
        const p2 = optimizedPath.polyline[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
          accumulatedDist += dist;
          
          // Draw arrow every arrowSpacing pixels
          if (accumulatedDist >= arrowSpacing) {
            accumulatedDist = 0;
            
            const angle = Math.atan2(dy, dx);
            const t = 0.5; // Middle of segment
            const midX = p1.x + (p2.x - p1.x) * t;
            const midY = p1.y + (p2.y - p1.y) * t;
            
            // Create green arrow
            const arrowSize = 6;
            const tipX = midX + Math.cos(angle) * arrowSize;
            const tipY = midY + Math.sin(angle) * arrowSize;
            const leftX = midX - Math.cos(angle) * arrowSize + Math.cos(angle + Math.PI / 2) * arrowSize * 0.4;
            const leftY = midY - Math.sin(angle) * arrowSize + Math.sin(angle + Math.PI / 2) * arrowSize * 0.4;
            const rightX = midX - Math.cos(angle) * arrowSize + Math.cos(angle - Math.PI / 2) * arrowSize * 0.4;
            const rightY = midY - Math.sin(angle) * arrowSize + Math.sin(angle - Math.PI / 2) * arrowSize * 0.4;
            
            const arrow = new paper.Path();
            arrow.moveTo(new paper.Point(tipX, tipY));
            arrow.lineTo(new paper.Point(leftX, leftY));
            arrow.lineTo(new paper.Point(rightX, rightY));
            arrow.lineTo(new paper.Point(tipX, tipY));
            arrow.fillColor = new paper.Color(0.2, 1, 0.2); // Green
            arrow.strokeColor = new paper.Color(0, 0.8, 0);
            arrow.strokeWidth = 0.5;
            vizLayer.addChild(arrow);
          }
        }
      }
    }

    // Force view update and redraw
    paper.view.update();
    paper.view.update();
    
    // Debug: Verify what's actually in the project after rendering
    console.log("🔍 Canvas2D: Final verification...");
    let actualPathCount = 0;
    let visiblePathCount = 0;
    project.activeLayer.children.forEach((item, idx) => {
      if (item instanceof paper.Path) {
        actualPathCount++;
        if (item.visible) visiblePathCount++;
        if (idx < 5) {
          const bounds = item.bounds;
          console.log(`  Path ${idx}:`, {
            segments: item.segments.length, 
            closed: item.closed,
            visible: item.visible,
            opacity: item.opacity,
            bounds: bounds ? `x:${bounds.x.toFixed(1)} y:${bounds.y.toFixed(1)} w:${bounds.width.toFixed(1)} h:${bounds.height.toFixed(1)}` : 'none',
            strokeColor: item.strokeColor ? item.strokeColor.toString() : 'none',
            strokeWidth: item.strokeWidth
          });
        }
      }
    });
    console.log("📊 Canvas2D: Final state:", {
      totalItems: project.activeLayer.children.length,
      pathInstances: actualPathCount,
      visiblePaths: visiblePathCount,
      viewCenter: paper.view.center.toString(),
      viewZoom: paper.view.zoom.toFixed(3),
      viewSize: paper.view.viewSize.toString()
    });
    // Force multiple redraws to ensure visibility
    setTimeout(() => {
      paper.view.update();
      // Second update after a short delay
      setTimeout(() => {
        paper.view.update();
        console.log("🔄 Canvas2D: Completed double redraw");
      }, 50);
    }, 0);
  }, [contours, optimizedPath]);
  
  // Add a separate effect to watch for any changes in project children
  useEffect(() => {
    if (!projectInitialized.current) return;
    
    const project = paper.project;
    let lastItemCount = 0;
    
    const checkAndStyle = () => {
      const currentItemCount = project.activeLayer.children.length;
      if (currentItemCount !== lastItemCount) {
        console.log("🔄 Canvas2D: Detected change in project - items:", lastItemCount, "->", currentItemCount);
        lastItemCount = currentItemCount;
        
        // Style any un-styled paths
        let styledCount = 0;
        project.activeLayer.children.forEach((item: any) => {
          if (item instanceof paper.Path) {
            // Check if path needs styling
            if (!item.strokeColor || item.strokeWidth < 2) {
              item.strokeColor = new paper.Color(0.2, 0.4, 1);
              item.strokeWidth = 3;
              item.fillColor = null;
              item.visible = true;
              item.opacity = 1;
              styledCount++;
            }
          }
        });
        
        if (styledCount > 0) {
          console.log(`  ✅ Auto-styled ${styledCount} paths`);
          paper.view.update();
        }
      }
    };
    
    // Check frequently for new paths
    const interval = setInterval(checkAndStyle, 200);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const handleResize = () => {
      if (canvasRef.current && projectInitialized.current) {
        paper.view.viewSize = new paper.Size(
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );
        paper.view.update();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse wheel zoom functionality
  useEffect(() => {
    if (!canvasRef.current || !projectInitialized.current) return;

    const canvas = canvasRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Get mouse position in view coordinates
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const viewPoint = new paper.Point(mouseX, mouseY);
      const worldPoint = paper.view.viewToProject(viewPoint);

      // Calculate zoom factor
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = paper.view.zoom * zoomFactor;

      // Clamp zoom between 0.1 and 50
      const clampedZoom = Math.max(0.1, Math.min(50, newZoom));

      // Only zoom if within limits
      if (clampedZoom !== paper.view.zoom) {
        // Store old center
        const oldCenter = paper.view.center;

        // Apply zoom
        paper.view.zoom = clampedZoom;

        // Adjust center to zoom towards mouse position
        const offset = worldPoint.subtract(oldCenter);
        const scaledOffset = offset.multiply(1 - zoomFactor);
        paper.view.center = oldCenter.add(scaledOffset);

        paper.view.update();

        console.log(`🔍 Zoom: ${paper.view.zoom.toFixed(2)}x at (${worldPoint.x.toFixed(0)}, ${worldPoint.y.toFixed(0)})`);
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Keyboard shortcuts for zoom and pan
  useEffect(() => {
    if (!projectInitialized.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom shortcuts
      if ((e.key === "+" || e.key === "=") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const newZoom = Math.min(50, paper.view.zoom * 1.2);
        paper.view.zoom = newZoom;
        paper.view.update();
        console.log(`⌨️ Zoom In: ${paper.view.zoom.toFixed(2)}x`);
      } else if ((e.key === "-" || e.key === "_") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const newZoom = Math.max(0.1, paper.view.zoom / 1.2);
        paper.view.zoom = newZoom;
        paper.view.update();
        console.log(`⌨️ Zoom Out: ${paper.view.zoom.toFixed(2)}x`);
      } else if (e.key === "0" && !e.ctrlKey && !e.metaKey) {
        // Reset zoom to 1:1
        e.preventDefault();
        paper.view.zoom = 1;
        paper.view.center = new paper.Point(0, 0);
        paper.view.update();
        console.log(`⌨️ Reset View: 1.00x at origin`);
      }
      // Pan shortcuts with arrow keys
      else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const panAmount = 50 / paper.view.zoom;
        paper.view.center = paper.view.center.add(new paper.Point(-panAmount, 0));
        paper.view.update();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const panAmount = 50 / paper.view.zoom;
        paper.view.center = paper.view.center.add(new paper.Point(panAmount, 0));
        paper.view.update();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const panAmount = 50 / paper.view.zoom;
        paper.view.center = paper.view.center.add(new paper.Point(0, -panAmount));
        paper.view.update();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const panAmount = 50 / paper.view.zoom;
        paper.view.center = paper.view.center.add(new paper.Point(0, panAmount));
        paper.view.update();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Tool handlers
  useEffect(() => {
    if (!canvasRef.current || !projectInitialized.current) return;

    const tool = activeTool;
    const project = paper.project;

    // Clean up previous tool handlers
    if (paper.tool) {
      paper.tool.remove();
    }

    if (tool === "line") {
      paper.tool = new paper.Tool();
      paper.tool.onMouseDown = (e: paper.ToolEvent) => {
        if (currentPathRef.current) {
          currentPathRef.current.remove();
        }
        currentPathRef.current = new paper.Path();
        currentPathRef.current.strokeColor = new paper.Color(0.2, 0.4, 1);
        currentPathRef.current.strokeWidth = 1;
        currentPathRef.current.add(e.point);
      };
      paper.tool.onMouseDrag = (e: paper.ToolEvent) => {
        if (currentPathRef.current) {
          currentPathRef.current.segments[1] = e.point;
        }
      };
      paper.tool.onMouseUp = (e: paper.ToolEvent) => {
        if (currentPathRef.current) {
          currentPathRef.current.add(e.point);
          currentPathRef.current.closed = false;
          
          // Add to contours
          const newContour = {
            id: `c_${Date.now()}`,
            path: currentPathRef.current,
            isHole: false,
            parentId: undefined,
            islandId: `island_${Date.now()}`,
            bounds: currentPathRef.current.bounds ? {
              x: currentPathRef.current.bounds.x,
              y: currentPathRef.current.bounds.y,
              width: currentPathRef.current.bounds.width,
              height: currentPathRef.current.bounds.height,
            } : undefined,
            area: currentPathRef.current.area,
          };
          const currentContours = useFoamCutStore.getState().contours;
          setContours([...currentContours, newContour]);
          currentPathRef.current = null;
        }
      };
    } else if (tool === "polyline") {
      paper.tool = new paper.Tool();
      paper.tool.onMouseDown = (e: paper.ToolEvent) => {
        if (!currentPathRef.current) {
          currentPathRef.current = new paper.Path();
          currentPathRef.current.strokeColor = new paper.Color(0.2, 0.4, 1);
          currentPathRef.current.strokeWidth = 1;
          polylinePointsRef.current = [e.point];
          currentPathRef.current.add(e.point);
        } else {
          // Continue polyline
          currentPathRef.current.add(e.point);
          polylinePointsRef.current.push(e.point);
        }
      };
      paper.tool.onDoubleClick = () => {
        if (currentPathRef.current && polylinePointsRef.current.length > 1) {
          // Close the polyline
          currentPathRef.current.closed = true;
          
          const newContour = {
            id: `c_${Date.now()}`,
            path: currentPathRef.current,
            isHole: false,
            parentId: undefined,
            islandId: `island_${Date.now()}`,
            bounds: currentPathRef.current.bounds ? {
              x: currentPathRef.current.bounds.x,
              y: currentPathRef.current.bounds.y,
              width: currentPathRef.current.bounds.width,
              height: currentPathRef.current.bounds.height,
            } : undefined,
            area: currentPathRef.current.area,
          };
          const currentContours = useFoamCutStore.getState().contours;
          setContours([...currentContours, newContour]);
          currentPathRef.current = null;
          polylinePointsRef.current = [];
        }
      };
    } else if (tool === "pan") {
      paper.tool = new paper.Tool();
      let lastPoint: paper.Point | null = null;
      let isDragging = false;

      paper.tool.onMouseDown = (e: paper.ToolEvent) => {
        lastPoint = e.point;
        isDragging = true;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grabbing";
        }
      };

      paper.tool.onMouseDrag = (e: paper.ToolEvent) => {
        if (lastPoint && isDragging) {
          const delta = e.point.subtract(lastPoint);
          paper.view.center = paper.view.center.subtract(delta);
          paper.view.update();
          lastPoint = e.point;
        }
      };

      paper.tool.onMouseUp = () => {
        isDragging = false;
        lastPoint = null;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grab";
        }
      };
    } else if (tool === "select") {
      paper.tool = new paper.Tool();
      // Basic select tool - could be enhanced with hit testing
      paper.tool.onMouseDown = (e: paper.ToolEvent) => {
        const hit = project.hitTest(e.point, {
          segments: true,
          stroke: true,
          fill: true,
          tolerance: 5,
        });
        if (hit && hit.item) {
          // Highlight selected item
          hit.item.selected = !hit.item.selected;
        }
      };
    }

    // Update cursor based on tool
    if (canvasRef.current) {
      const cursorMap: Record<string, string> = {
        select: "default",
        pan: "grab",
        line: "crosshair",
        polyline: "crosshair",
        text: "text",
      };
      canvasRef.current.style.cursor = cursorMap[tool] || "default";
    }

    return () => {
      if (paper.tool) {
        paper.tool.remove();
      }
    };
  }, [activeTool, setContours]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", background: "#fafafa" }}
    />
  );
};
