
import { create } from "zustand";
import { Contour, OptimizedPath, Point } from "../geometry/types";

export type Tool = "select" | "pan" | "line" | "polyline" | "text";

interface FoamCutState {
  contours: Contour[];
  optimizedPath?: OptimizedPath;
  kerf: number;
  units: "mm" | "inch";
  scale: number;
  origin: Point;
  feedRate: number;
  activeTool: Tool;
  setContours: (c: Contour[]) => void;
  setOptimizedPath: (p?: OptimizedPath) => void;
  setKerf: (k: number) => void;
  setUnits: (u: "mm" | "inch") => void;
  setFeedRate: (f: number) => void;
  setScale: (s: number) => void;
  setActiveTool: (t: Tool) => void;
}
export const useFoamCutStore = create<FoamCutState>((set) => ({
  contours: [],
  optimizedPath: undefined,
  kerf: 0,
  units: "mm",
  scale: 1,
  origin: { x: 0, y: 0 },
  feedRate: 1500,
  activeTool: "select",
  setContours: (contours) => set({ contours }),
  setOptimizedPath: (optimizedPath) => set({ optimizedPath }),
  setKerf: (kerf) => set({ kerf }),
  setUnits: (units) => set({ units }),
  setFeedRate: (feedRate) => set({ feedRate }),
  setScale: (scale) => set({ scale }),
  setActiveTool: (activeTool) => set({ activeTool }),
}));
