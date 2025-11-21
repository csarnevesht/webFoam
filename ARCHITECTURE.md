# FoamCut Web – Architecture & Implementation

- React + TypeScript + Vite
- Paper.js for 2D geometry / drawing
- Zustand for state
- Vitest for tests

See SPEC.md for func
# FoamCut Web – Architecture Document

## 1. Tech Stack Overview

| Layer | Technology |
|-------|------------|
| UI | React + TS |
| Geometry | Paper.js |
| State | Zustand |
| Export | G-code generator |

## 2. Project Structure

src/
  geometry/
  components/
  state/
  utils/

## 3. Geometry Pipeline

1. SVG import
2. Contour building
3. Island grouping
4. TSP ordering
5. Entry/exit optimization
6. Polyline generation
7. G-code export

## 4. Rendering Engine

Paper.js handles all vector drawing and sampling.

## 5. State Flow

Zustand manages contours, options, and optimized path.

## 6. Future Phases

Undo/redo, DXF, advanced optimization, 4-axis, nesting.
tional scope. This file focuses on structure and modules.
