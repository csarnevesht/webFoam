
export type Point = { x: number; y: number };
export type ContourId = string;
export interface Contour {
  id: ContourId;
  path: any; // Paper.Path at runtime
  isHole: boolean;
  parentId?: ContourId;
  islandId: string;
  bounds?: { x: number; y: number; width: number; height: number };
  area?: number;
}
export interface EntryExit {
  contourId: ContourId;
  entryT: number;
  exitT: number;
}
export interface OptimizedPath {
  contoursOrdered: ContourId[];
  entryExits: EntryExit[];
  polyline: Point[];
  length: number;
}
export interface Island {
  id: string;
  outer: Contour;
  holes: Contour[];
  allContours: Contour[];
}
