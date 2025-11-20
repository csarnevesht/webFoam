
import DxfParser from "dxf-parser";
import paper from "paper";

export function importDxfString(dxf: string, project: paper.Project): paper.Path[] {
  const parser = new DxfParser();
  const paths: paper.Path[] = [];

  try {
    const dxfData = parser.parseSync(dxf);
    
    if (!dxfData || !dxfData.entities) {
      return paths;
    }

    const entities = dxfData.entities;

    entities.forEach((entity: any) => {
      try {
        let path: paper.Path | null = null;

        switch (entity.type) {
          case "LINE":
            if (entity.start && entity.end && 
                typeof entity.start.x === 'number' && typeof entity.start.y === 'number' &&
                typeof entity.end.x === 'number' && typeof entity.end.y === 'number') {
              path = new paper.Path();
              // DXF uses bottom-left origin, Paper.js uses top-left, so flip Y
              path.add(new paper.Point(entity.start.x, -entity.start.y));
              path.add(new paper.Point(entity.end.x, -entity.end.y));
              path.strokeColor = new paper.Color(0.2, 0.4, 1);
              path.strokeWidth = 1;
            }
            break;

          case "LWPOLYLINE":
          case "POLYLINE":
            if (entity.vertices && Array.isArray(entity.vertices) && entity.vertices.length > 0) {
              path = new paper.Path();
              let validVertices = 0;
              entity.vertices.forEach((vertex: any) => {
                if (vertex && (typeof vertex.x === 'number' || typeof vertex.x === 'undefined') && 
                    (typeof vertex.y === 'number' || typeof vertex.y === 'undefined')) {
                  const x = vertex.x ?? 0;
                  const y = vertex.y ?? 0;
                  path!.add(new paper.Point(x, -y)); // Flip Y axis
                  validVertices++;
                }
              });
              
              if (validVertices < 2) {
                // Not enough valid vertices, skip this path
                if (path) path.remove();
                path = null;
                break;
              }
              
              // Check if polyline is closed
              if (entity.closed || (validVertices > 2 && 
                  entity.vertices[0] && entity.vertices[validVertices - 1] &&
                  entity.vertices[0].x === entity.vertices[validVertices - 1].x &&
                  entity.vertices[0].y === entity.vertices[validVertices - 1].y)) {
                path!.closed = true;
              }
              
              path!.strokeColor = new paper.Color(0.2, 0.4, 1);
              path!.strokeWidth = 1;
            }
            break;

          case "CIRCLE":
            if (entity.center && typeof entity.center.x === 'number' && typeof entity.center.y === 'number' &&
                typeof entity.radius === 'number' && entity.radius > 0) {
              const center = new paper.Point(entity.center.x, -entity.center.y);
              path = new paper.Path.Circle(center, entity.radius);
              path.strokeColor = new paper.Color(0.2, 0.4, 1);
              path.strokeWidth = 1;
              path.fillColor = undefined;
            }
            break;

          case "ARC":
            if (entity.center && typeof entity.center.x === 'number' && typeof entity.center.y === 'number' &&
                typeof entity.radius === 'number' && entity.radius > 0 &&
                typeof entity.startAngle === 'number' && typeof entity.endAngle === 'number') {
              const center = new paper.Point(entity.center.x, -entity.center.y);
              const startAngle = (entity.startAngle * Math.PI) / 180;
              const endAngle = (entity.endAngle * Math.PI) / 180;
              
              // Create arc using Path.Arc with three points
              const startPoint = new paper.Point(
                center.x + Math.cos(startAngle) * entity.radius,
                center.y + Math.sin(startAngle) * entity.radius
              );
              const midAngle = startAngle + (endAngle - startAngle) / 2;
              const midPoint = new paper.Point(
                center.x + Math.cos(midAngle) * entity.radius,
                center.y + Math.sin(midAngle) * entity.radius
              );
              const endPoint = new paper.Point(
                center.x + Math.cos(endAngle) * entity.radius,
                center.y + Math.sin(endAngle) * entity.radius
              );
              
              path = new paper.Path.Arc(startPoint, midPoint, endPoint);
              path.strokeColor = new paper.Color(0.2, 0.4, 1);
              path.strokeWidth = 1;
            }
            break;

          case "SPLINE":
            if (entity.controlPoints && Array.isArray(entity.controlPoints) && entity.controlPoints.length > 0) {
              path = new paper.Path();
              let validPoints = 0;
              entity.controlPoints.forEach((point: any) => {
                if (point && typeof point.x === 'number' && typeof point.y === 'number') {
                  path!.add(new paper.Point(point.x, -point.y));
                  validPoints++;
                }
              });
              
              if (validPoints < 2) {
                // Not enough valid points, skip this path
                if (path) path.remove();
                path = null;
                break;
              }
              
              // Try to smooth the spline
              if (path!.segments.length > 2) {
                path!.smooth();
              }
              
              path!.strokeColor = new paper.Color(0.2, 0.4, 1);
              path!.strokeWidth = 1;
            }
            break;

          case "ELLIPSE":
            // Handle ellipse if needed
            if (entity.center && typeof entity.center.x === 'number' && typeof entity.center.y === 'number' &&
                entity.majorAxisEndPoint && typeof entity.majorAxisEndPoint.x === 'number' &&
                typeof entity.ratio === 'number' && entity.ratio > 0) {
              // Convert ellipse to path (simplified - could be improved)
              const center = new paper.Point(entity.center.x, -entity.center.y);
              const majorAxis = Math.hypot(entity.majorAxisEndPoint.x, entity.majorAxisEndPoint.y);
              const minorAxis = majorAxis * entity.ratio;
              // Create as circle approximation (could be improved to true ellipse)
              path = new paper.Path.Ellipse({
                center: center,
                radius: [majorAxis, minorAxis]
              });
              path.strokeColor = new paper.Color(0.2, 0.4, 1);
              path.strokeWidth = 1;
              path.fillColor = undefined;
            }
            break;

          case "POINT":
            // Points are typically not drawn, but we could create a small circle
            if (entity.position && typeof entity.position.x === 'number' && typeof entity.position.y === 'number') {
              const point = new paper.Point(entity.position.x, -entity.position.y);
              path = new paper.Path.Circle(point, 1);
              path.fillColor = new paper.Color(0.2, 0.4, 1);
              path.strokeWidth = 0;
            }
            break;

          case "TEXT":
          case "MTEXT":
            // TEXT entities: Create a bounding box around the text
            // True text-to-path conversion requires font data which DXF doesn't provide
            if (entity.position && typeof entity.position.x === 'number' && typeof entity.position.y === 'number') {
              const text = entity.text || entity.string || "";
              const height = entity.height || entity.nominalTextHeight || 10;
              const width = text.length * height * 0.6; // Approximate width

              const x = entity.position.x;
              const y = -entity.position.y; // Flip Y axis

              // Create Paper.js text to get proper bounds
              const paperText = new paper.PointText({
                point: new paper.Point(x, y),
                content: text,
                fontSize: height,
                fontFamily: 'Arial',
                fillColor: new paper.Color(0.2, 0.4, 1)
              });

              // Get bounds and create outline
              const bounds = paperText.bounds;
              if (bounds && bounds.width > 0 && bounds.height > 0) {
                path = new paper.Path.Rectangle(bounds);
                path.strokeColor = new paper.Color(0.2, 0.4, 1);
                path.strokeWidth = 2;
                path.fillColor = null;
                path.closed = true;

                console.log(`TEXT entity "${text}": created bounding box at (${x.toFixed(1)}, ${y.toFixed(1)})`);
              }

              // Remove the text object, keep only the outline
              paperText.remove();
            }
            break;

          default:
            // Unsupported entity type - log for debugging but don't error
            if (process.env.NODE_ENV === 'development') {
              console.debug("Unsupported DXF entity type:", entity.type, entity);
            }
            break;
        }

        if (path) {
          // Ensure path is visible and styled BEFORE adding to project
          path.visible = true;
          path.strokeColor = new paper.Color(0.2, 0.4, 1); // Blue
          path.strokeWidth = 3; // Make very visible
          path.fillColor = null;
          path.opacity = 1;
          
          // Add to project's active layer
          if (!path.parent) {
            project.activeLayer.addChild(path);
            console.log(`  ✅ Added ${entity.type} path #${paths.length} to project`);
          } else {
            console.log(`  ⚠️ Path #${paths.length} already has parent:`, path.parent.constructor.name);
          }
          
          paths.push(path);
          
          // Debug: log all paths (limit to first 5 to avoid spam)
          if (paths.length <= 5) {
            const bounds = path.bounds;
            console.log(`  📍 Path ${paths.length - 1} (${entity.type}):`, {
              segments: path.segments.length,
              closed: path.closed,
              bounds: bounds ? `x:${bounds.x.toFixed(1)} y:${bounds.y.toFixed(1)} w:${bounds.width.toFixed(1)} h:${bounds.height.toFixed(1)}` : 'none',
              visible: path.visible,
              strokeWidth: path.strokeWidth,
              hasParent: !!path.parent
            });
          }
        } else {
          console.log(`  ⚠️ Skipped ${entity.type} - path creation failed`);
        }
      } catch (err) {
        console.warn("Error processing DXF entity:", err, entity);
      }
    });
  } catch (err) {
    console.error("Error parsing DXF:", err);
    throw new Error("Failed to parse DXF file: " + (err instanceof Error ? err.message : String(err)));
  }

  return paths;
}
