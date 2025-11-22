
import { Contour, EntryExit, EntryExitOverride, Point } from "./types";
export interface EntryExitOptions {
  samplesPerContour: number;
  crossingPenaltyWeight: number;
  origin: Point;
  customEntryPoints?: Map<string, EntryExitOverride>;
}
export function computeEntryExits(contours: Contour[], options: EntryExitOptions): EntryExit[] {
  return contours.map((c) => {
    const override = options.customEntryPoints?.get(c.id);
    const entryT = override?.entryT ?? 0;
    const exitT = override?.exitT ?? entryT;

    console.log(
      `Entry/Exit for ${c.id}: entryT=${entryT.toFixed(3)} ${override?.entryT !== undefined ? "(custom entry)" : "(default)"} exitT=${exitT.toFixed(3)} ${override?.exitT !== undefined ? "(custom exit)" : "(default)"}`
    );

    return {
      contourId: c.id,
      entryT,
      exitT,
    };
  });
}
