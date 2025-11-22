
export type Point = { x: number; y: number };
export type Point4D = { x: number; y: number; u: number; v: number };

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

export interface EntryExitOverride {
  entryT?: number;
  exitT?: number;
}
export interface OptimizedPath {
  contoursOrdered: ContourId[];
  entryExits: EntryExit[];
  polyline: Point[];
  polyline4D?: Point4D[]; // For tapered cuts
  length: number;
}
export interface Island {
  id: string;
  outer: Contour;
  holes: Contour[];
  allContours: Contour[];
}
