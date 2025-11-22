
import { create } from "zustand";
import { Contour, OptimizedPath, Point, EntryExitOverride } from "../geometry/types";

export type Tool = "select" | "pan" | "line" | "polyline" | "text";

export type CustomEntryPoints = Map<string, EntryExitOverride>;

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
  samplesPerContour: number;
  crossingPenaltyWeight: number;
  useCustomEntryPoints: boolean;
  setContours: (c: Contour[]) => void;
  setOptimizedPath: (p?: OptimizedPath) => void;
  setCustomEntryPoint: (contourId: string, entryT: number) => void;
  setCustomExitPoint: (contourId: string, exitT: number) => void;
  clearCustomEntryPoints: () => void;
  setSamplesPerContour: (value: number) => void;
  setCrossingPenaltyWeight: (value: number) => void;
  setUseCustomEntryPoints: (value: boolean) => void;
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
  samplesPerContour: 32,
  crossingPenaltyWeight: 1.0,
  useCustomEntryPoints: true,
  setContours: (contours) => set({ contours }),
  setOptimizedPath: (optimizedPath) => set({ optimizedPath }),
  setCustomEntryPoint: (contourId, entryT) =>
    set((state) => {
      const newMap = new Map(state.customEntryPoints);
      const existing = newMap.get(contourId) ?? {};
      newMap.set(contourId, { ...existing, entryT });
      return { customEntryPoints: newMap };
    }),
  setCustomExitPoint: (contourId, exitT) =>
    set((state) => {
      const newMap = new Map(state.customEntryPoints);
      const existing = newMap.get(contourId) ?? {};
      newMap.set(contourId, { ...existing, exitT });
      return { customEntryPoints: newMap };
    }),
  clearCustomEntryPoints: () => set({ customEntryPoints: new Map() }),
  setKerf: (kerf) => set({ kerf }),
  setUnits: (units) => set({ units }),
  setFeedRate: (feedRate) => set({ feedRate }),
  setScale: (scale) => set({ scale }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setSamplesPerContour: (value) => set({ samplesPerContour: value }),
  setCrossingPenaltyWeight: (value) => set({ crossingPenaltyWeight: value }),
  setUseCustomEntryPoints: (value) => set({ useCustomEntryPoints: value }),
}));
