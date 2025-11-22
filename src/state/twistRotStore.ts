import { create } from 'zustand';

export interface Point {
    x: number;
    y: number;
}

interface TwistRotState {
    revolutionCurve: Point[] | null;
    rotationCurve: Point[] | null;
    twistCurve: Point[] | null;

    setRevolutionCurve: (curve: Point[] | null) => void;
    setRotationCurve: (curve: Point[] | null) => void;
    setTwistCurve: (curve: Point[] | null) => void;
}

export const useTwistRotStore = create<TwistRotState>((set) => ({
    revolutionCurve: null,
    rotationCurve: null,
    twistCurve: null,

    setRevolutionCurve: (curve) => set({ revolutionCurve: curve }),
    setRotationCurve: (curve) => set({ rotationCurve: curve }),
    setTwistCurve: (curve) => set({ twistCurve: curve }),
}));
