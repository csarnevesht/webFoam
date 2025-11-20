
import { Point } from "../geometry/types";
export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.hypot(dx, dy);
}
