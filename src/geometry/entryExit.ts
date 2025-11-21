
import { Contour, EntryExit, Point } from "./types";
export interface EntryExitOptions {
  samplesPerContour: number;
  crossingPenaltyWeight: number;
  origin: Point;
  customEntryPoints?: Map<string, number>;
}
export function computeEntryExits(contours: Contour[], options: EntryExitOptions): EntryExit[] {
  return contours.map((c) => {
    // Use custom entry point if available, otherwise default to 0
    const entryT = options.customEntryPoints?.get(c.id) ?? 0;

    console.log(`Entry/Exit for ${c.id}: entryT=${entryT.toFixed(3)} ${options.customEntryPoints?.has(c.id) ? '(custom)' : '(default)'}`);

    return {
      contourId: c.id,
      entryT,
      exitT: entryT // For now, exit at same point as entry (complete loop)
    };
  });
}
