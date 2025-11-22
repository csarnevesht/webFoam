
import { Point, Point4D } from "./types";

export interface GCodeOptions {
  feedRate: number;
  units: "mm" | "inch";
  origin: Point;
  scale: number;
  axisNames?: { x: string; y: string; u: string; v: string }; // Defaults to X Y U V
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

export function generateGCode4Axis(polyline: Point4D[], opt: GCodeOptions): string {
  if (polyline.length === 0) return "";

  const axes = opt.axisNames || { x: "X", y: "Y", u: "U", v: "V" };
  const lines: string[] = [];

  lines.push(opt.units === "mm" ? "G21" : "G20");
  lines.push("G90");

  const start = polyline[0];
  const sx = (start.x - opt.origin.x) * opt.scale;
  const sy = (start.y - opt.origin.y) * opt.scale;
  const su = (start.u - opt.origin.x) * opt.scale;
  const sv = (start.v - opt.origin.y) * opt.scale;

  lines.push(`G0 ${axes.x}${sx.toFixed(3)} ${axes.y}${sy.toFixed(3)} ${axes.u}${su.toFixed(3)} ${axes.v}${sv.toFixed(3)}`);
  lines.push(`G1 F${opt.feedRate.toFixed(1)}`);

  for (let i = 1; i < polyline.length; i++) {
    const p = polyline[i];
    const x = (p.x - opt.origin.x) * opt.scale;
    const y = (p.y - opt.origin.y) * opt.scale;
    const u = (p.u - opt.origin.x) * opt.scale;
    const v = (p.v - opt.origin.y) * opt.scale;

    lines.push(`G1 ${axes.x}${x.toFixed(3)} ${axes.y}${y.toFixed(3)} ${axes.u}${u.toFixed(3)} ${axes.v}${v.toFixed(3)}`);
  }

  lines.push("M2");
  return lines.join("\n");
}

