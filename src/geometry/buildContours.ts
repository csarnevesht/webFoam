
import { Contour } from "./types";
import { generateId } from "../utils/id";
export function buildContours(paths: any[]): Contour[] {
  // Minimal implementation: wrap each path as a Contour with no hierarchy.
  return paths.map((p) => ({
    id: generateId("c"),
    path: p,
    isHole: false,
    parentId: undefined,
    islandId: "island_1",
    bounds: undefined,
    area: undefined,
  }));
}
