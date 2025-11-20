
import { Contour, EntryExit, Point } from "./types";
export interface PathGenerationOptions {
  step: number;
  origin: Point;
}

export function buildContinuousPolyline(
  contours: Contour[],
  entryExits: EntryExit[],
  options: PathGenerationOptions
): Point[] {
  console.log("=== BUILD CONTINUOUS POLYLINE START ===");
  console.log("Contours to trace:", contours.length);
  console.log("Origin:", options.origin);

  const pts: Point[] = [];

  // Start at origin
  pts.push({ x: options.origin.x, y: options.origin.y });
  console.log("Starting at origin:", pts[0]);

  contours.forEach((contour, idx) => {
    console.log(`\n--- Processing Contour ${idx} (${contour.id}) ---`);

    const path = contour.path;
    if (!path) {
      console.warn(`⚠️ Contour ${idx} has no path!`);
      return;
    }

    if (!path.segments || path.segments.length === 0) {
      console.warn(`⚠️ Contour ${idx} has no segments!`);
      return;
    }

    console.log(`Path has ${path.segments.length} segments, closed: ${path.closed}`);

    // Find entry/exit for this contour
    const entryExit = entryExits.find(ee => ee.contourId === contour.id);
    if (!entryExit) {
      console.warn(`⚠️ No entry/exit found for contour ${contour.id}`);
      return;
    }

    console.log(`Entry t: ${entryExit.entryT}, Exit t: ${entryExit.exitT}`);

    // Get the length of the path to calculate entry point
    const pathLength = path.length || 0;
    console.log(`Path length: ${pathLength.toFixed(2)}`);

    // Calculate entry point position
    const entryPoint = path.getPointAt(entryExit.entryT * pathLength);
    if (!entryPoint) {
      console.warn(`⚠️ Could not get entry point at t=${entryExit.entryT}`);
      return;
    }

    console.log(`Entry point: (${entryPoint.x.toFixed(2)}, ${entryPoint.y.toFixed(2)})`);

    // Add rapid move to entry point (if not already there)
    const lastPt = pts[pts.length - 1];
    const distToEntry = Math.hypot(entryPoint.x - lastPt.x, entryPoint.y - lastPt.y);
    if (distToEntry > 0.01) {
      pts.push({ x: entryPoint.x, y: entryPoint.y });
      console.log(`Added rapid move to entry (distance: ${distToEntry.toFixed(2)})`);
    }

    // Sample points along the path
    // For hot wire cutting, we want to trace the entire contour
    const numSamples = Math.max(50, Math.ceil(pathLength / options.step));
    console.log(`Sampling ${numSamples} points along path`);

    let pointsAdded = 0;
    for (let i = 0; i <= numSamples; i++) {
      // Calculate t value (0 to 1) starting from entry
      const t = i / numSamples;
      const offset = entryExit.entryT + t * (1 - entryExit.entryT + entryExit.exitT);
      const normalizedT = offset % 1; // Wrap around if needed

      const point = path.getPointAt(normalizedT * pathLength);
      if (point) {
        pts.push({ x: point.x, y: point.y });
        pointsAdded++;

        // Log first and last few points
        if (i <= 2 || i >= numSamples - 2) {
          console.log(`  Sample ${i}: t=${normalizedT.toFixed(3)} → (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`);
        }
      }
    }

    console.log(`✅ Added ${pointsAdded} points for contour ${idx}`);
    console.log(`Total polyline points so far: ${pts.length}`);
  });

  console.log("\n=== BUILD CONTINUOUS POLYLINE END ===");
  console.log(`Final polyline: ${pts.length} total points`);
  console.log("First point:", pts[0]);
  console.log("Last point:", pts[pts.length - 1]);

  return pts;
}
