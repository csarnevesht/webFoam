
import { Contour, OptimizedPath, Point } from "./types";
import { groupIntoIslands } from "./islands";
import { orderContoursWithinIsland, orderIslands } from "./tspOrdering";
import { computeEntryExits } from "./entryExit";
import { buildContinuousPolyline } from "./polylineBuilder";

export function runFullOptimization(contours: Contour[], origin: Point = { x: 0, y: 0 }): OptimizedPath | undefined {
  console.log("\n========== FULL OPTIMIZATION START ==========");
  console.log("Input contours:", contours.length);

  if (!contours.length) {
    console.log("⚠️ No contours provided!");
    return undefined;
  }

  // Log input contours
  contours.forEach((c, idx) => {
    console.log(`Contour ${idx}: ${c.id}`, {
      segments: c.path?.segments?.length || 0,
      closed: c.path?.closed,
      bounds: c.bounds
    });
  });

  console.log("\n--- Step 1: Group into islands ---");
  const islands = groupIntoIslands(contours);
  console.log(`Created ${islands.length} islands`);
  islands.forEach((island, idx) => {
    console.log(`Island ${idx}:`, {
      id: island.id,
      outer: island.outer.id,
      holes: island.holes.length,
      allContours: island.allContours.length
    });
  });

  console.log("\n--- Step 2: Order islands ---");
  const orderedIslands = orderIslands(islands);
  console.log(`Ordered ${orderedIslands.length} islands`);

  console.log("\n--- Step 3: Order contours within islands ---");
  const orderedContours: Contour[] = [];
  orderedIslands.forEach((island, islandIdx) => {
    console.log(`Processing island ${islandIdx}...`);
    const ids = orderContoursWithinIsland(island);
    console.log(`  Ordered IDs: [${ids.join(", ")}]`);

    ids.forEach((id) => {
      const c = island.allContours.find((cc) => cc.id === id);
      if (c) {
        orderedContours.push(c);
        console.log(`  ✅ Added contour ${c.id}`);
      } else {
        console.warn(`  ⚠️ Could not find contour with ID ${id}`);
      }
    });
  });
  console.log(`Total ordered contours: ${orderedContours.length}`);

  console.log("\n--- Step 4: Compute entry/exits ---");
  const entryExits = computeEntryExits(orderedContours, {
    samplesPerContour: 32,
    crossingPenaltyWeight: 1.0,
    origin,
  });
  console.log(`Computed ${entryExits.length} entry/exit pairs`);
  entryExits.forEach((ee, idx) => {
    console.log(`  ${idx}: contour=${ee.contourId}, entry=${ee.entryT}, exit=${ee.exitT}`);
  });

  console.log("\n--- Step 5: Build continuous polyline ---");
  const polyline = buildContinuousPolyline(orderedContours, entryExits, {
    step: 1,
    origin,
  });

  console.log("\n--- Step 6: Calculate total length ---");
  const length = polyline.reduce((acc, p, i, arr) => {
    if (i === 0) return 0;
    const prev = arr[i - 1];
    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    return acc + Math.hypot(dx, dy);
  }, 0);
  console.log(`Total path length: ${length.toFixed(2)} units`);

  const result = {
    contoursOrdered: orderedContours.map((c) => c.id),
    entryExits,
    polyline,
    length,
  };

  console.log("\n========== FULL OPTIMIZATION END ==========");
  console.log("Result:", {
    contoursOrdered: result.contoursOrdered.length,
    entryExits: result.entryExits.length,
    polylinePoints: result.polyline.length,
    length: result.length.toFixed(2)
  });

  return result;
}
