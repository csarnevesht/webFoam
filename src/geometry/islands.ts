
import { Contour, Island } from "./types";
import { generateId } from "../utils/id";
export function groupIntoIslands(contours: Contour[]): Island[] {
  if (contours.length === 0) return [];
  const id = generateId("island");
  return [{
    id,
    outer: contours[0],
    holes: [],
    allContours: contours,
  }];
}
