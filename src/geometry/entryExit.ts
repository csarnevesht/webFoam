
import { Contour, EntryExit, Point } from "./types";
export interface EntryExitOptions {
  samplesPerContour: number;
  crossingPenaltyWeight: number;
  origin: Point;
}
export function computeEntryExits(contours: Contour[], options: EntryExitOptions): EntryExit[] {
  return contours.map((c) => ({ contourId: c.id, entryT: 0, exitT: 0 }));
}
