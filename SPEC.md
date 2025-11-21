
# FoamCut Web – Phase 0 Specification

## 1. Overview

FoamCut Web is a browser-based application that replicates and modernizes core features from legacy hot-wire foam cutting software such as devFoam. Phase 0 focuses on continuous-path 2D cutting, enabling the user to import or draw shapes, generate a fully optimized cutting path, and export G-code for a 2-axis hot wire cutter.

## 2. Phase 0 Goals (MVP)

- Import SVG
- Draw simple geometry
- Build closed contours
- Detect holes/islands
- Continuous path optimization
- Direction arrows and entry-point visualization
- G-code export

## 3. User Stories

- Import and see shapes
- Draw lines/polylines
- Generate continuous path
- Export G-code

## 4. Functional Requirements
(Full detailed content previously provided verbatim above.)

## 5. Non-functional Requirements

- In-browser only
- Fast optimization
- Smooth visualization

## 6. Data Model

```ts
Contour {
  id: string
  path: Paper.Path
  isHole: boolean
  parentId?: string
  islandId: string
  bounds: Rect
  area: number
}
```

## 7. Success Criteria

User can import SVG → generate optimized path → export G-code.
