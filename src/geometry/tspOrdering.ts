
import { Contour, Island } from "./types";
export function orderContoursWithinIsland(island: Island): string[] {
  return island.allContours.map((c) => c.id);
}
export function orderIslands(islands: Island[]): Island[] {
  return islands;
}
