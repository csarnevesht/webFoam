
import { Contour, OptimizedPath, Point } from "./types";
import { groupIntoIslands } from "./islands";
import { orderContoursWithinIsland, orderIslands } from "./tspOrdering";
import { computeEntryExits } from "./entryExit";
import { buildContinuousPolyline } from "./polylineBuilder";

export function runFullOptimization(contours: Contour[], origin: Point = { x: 0, y: 0 }): OptimizedPath | undefined {
  if (!contours.length) return undefined;
  const islands = groupIntoIslands(contours);
  const orderedIslands = orderIslands(islands);
  const orderedContours: Contour[] = [];
  orderedIslands.forEach((island) => {
    const ids = orderContoursWithinIsland(island);
    ids.forEach((id) => {
      const c = island.allContours.find((cc) => cc.id === id);
      if (c) orderedContours.push(c);
    });
  });
  const entryExits = computeEntryExits(orderedContours, {
    samplesPerContour: 32,
    crossingPenaltyWeight: 1.0,
    origin,
  });
  const polyline = buildContinuousPolyline(orderedContours, entryExits, {
    step: 1,
    origin,
  });
  const length = polyline.reduce((acc, p, i, arr) => {
    if (i === 0) return 0;
    const prev = arr[i - 1];
    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    return acc + Math.hypot(dx, dy);
  }, 0);
  return {
    contoursOrdered: orderedContours.map((c) => c.id),
    entryExits,
    polyline,
    length,
  };
}
