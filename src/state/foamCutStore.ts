
import { create } from "zustand";
import { Contour, OptimizedPath, Point } from "../geometry/types";

export type Tool = "select" | "pan" | "line" | "polyline" | "text";

// Store custom entry points for contours (contourId -> entryT)
export type CustomEntryPoints = Map<string, number>;

interface FoamCutState {
  contours: Contour[];
  optimizedPath?: OptimizedPath;
  customEntryPoints: CustomEntryPoints;
  kerf: number;
  units: "mm" | "inch";
  scale: number;
  origin: Point;
  feedRate: number;
  activeTool: Tool;
  setContours: (c: Contour[]) => void;
  setOptimizedPath: (p?: OptimizedPath) => void;
  setCustomEntryPoint: (contourId: string, entryT: number) => void;
  clearCustomEntryPoints: () => void;
  setKerf: (k: number) => void;
  setUnits: (u: "mm" | "inch") => void;
  setFeedRate: (f: number) => void;
  setScale: (s: number) => void;
  setActiveTool: (t: Tool) => void;
}
export const useFoamCutStore = create<FoamCutState>((set) => ({
  contours: [],
  optimizedPath: undefined,
  customEntryPoints: new Map(),
  kerf: 0,
  units: "mm",
  scale: 1,
  origin: { x: 0, y: 0 },
  feedRate: 1500,
  activeTool: "select",
  setContours: (contours) => set({ contours }),
  setOptimizedPath: (optimizedPath) => set({ optimizedPath }),
  setCustomEntryPoint: (contourId, entryT) =>
    set((state) => {
      const newMap = new Map(state.customEntryPoints);
      newMap.set(contourId, entryT);
      return { customEntryPoints: newMap };
    }),
  clearCustomEntryPoints: () => set({ customEntryPoints: new Map() }),
  setKerf: (kerf) => set({ kerf }),
  setUnits: (units) => set({ units }),
  setFeedRate: (feedRate) => set({ feedRate }),
  setScale: (scale) => set({ scale }),
  setActiveTool: (activeTool) => set({ activeTool }),
}));
