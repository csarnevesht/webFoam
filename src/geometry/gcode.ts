
import { Point } from "./types";
export interface GCodeOptions {
  feedRate: number;
  units: "mm" | "inch";
  origin: Point;
  scale: number;
}
export function generateGCode(polyline: Point[], opt: GCodeOptions): string {
  if (polyline.length === 0) return "";
  const lines: string[] = [];
  lines.push(opt.units === "mm" ? "G21" : "G20");
  lines.push("G90");
  const start = polyline[0];
  const sx = (start.x - opt.origin.x) * opt.scale;
  const sy = (start.y - opt.origin.y) * opt.scale;
  lines.push(`G0 X${sx.toFixed(3)} Y${sy.toFixed(3)}`);
  lines.push(`G1 F${opt.feedRate.toFixed(1)}`);
  for (let i = 1; i < polyline.length; i++) {
    const p = polyline[i];
    const x = (p.x - opt.origin.x) * opt.scale;
    const y = (p.y - opt.origin.y) * opt.scale;
    lines.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)}`);
  }
  lines.push("M2");
  return lines.join("\n");
}
