
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
  // Simple placeholder: line of points.
  const pts: Point[] = [];
  pts.push({ x: options.origin.x, y: options.origin.y });
  contours.forEach((c, i) => {
    pts.push({ x: options.origin.x + (i + 1) * 10, y: options.origin.y });
  });
  return pts;
}
