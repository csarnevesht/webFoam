name: "FoamCut Web - MVP Phase 0 Complete Implementation"
description: |

## Purpose
Complete implementation of FoamCut Web MVP (Phase 0) - a browser-based hot-wire foam cutting application that replicates core features from legacy software like devFoam. This PRP provides comprehensive context for AI agents to implement all remaining features and polish the application to production-ready state.

## Core Principles
1. **Context is King**: All necessary documentation, examples, and caveats included
2. **Validation Loops**: TypeScript compilation + manual testing workflow provided
3. **Information Dense**: Use existing codebase patterns and conventions
4. **Progressive Success**: Build incrementally, validate visually, then enhance
5. **Follow UI Design**: Strict adherence to dark theme design in docs/UI.md

---

## Goal
Build a production-ready browser-based foam cutting application with:
- **Complete UI**: Dark theme, professional SaaS aesthetic, three-panel layout
- **Full DXF/SVG Import**: Parse, display, and optimize cutting paths
- **Drawing Tools**: Line, polyline, and text tools for creating geometry
- **Path Optimization**: TSP-based ordering with hole/island detection
- **G-code Export**: 2-axis hot wire cutter G-code generation
- **Real-time Visualization**: Blue contours, red paths, green arrows/START labels

## Why
- **Business value**: Modernize legacy foam cutting software for web platform
- **User impact**: Enable CAD-to-CNC workflow entirely in browser
- **Integration**: Replace desktop software (devFoam) with accessible web app
- **Problems solved**:
  - Eliminate software installation barriers
  - Enable cross-platform foam cutting workflow
  - Provide real-time path visualization and optimization

## What
A single-page React application where users can:

1. **Import** DXF or SVG files containing 2D geometry
2. **Draw** simple shapes (lines, polylines, text) directly on canvas
3. **Visualize** imported/drawn geometry as blue contours on dark canvas
4. **Optimize** cutting paths using TSP algorithms for minimal travel distance
5. **Configure** machine settings (units, kerf, feedrate, scale, origin)
6. **Export** G-code for 2-axis hot wire cutting machines
7. **View** optimized paths with directional arrows and START labels

### Success Criteria
- [ ] Dark-themed UI matches design spec in docs/UI.md
- [ ] DXF/SVG import displays geometry correctly with auto-fit view
- [ ] All drawing tools (select, pan, line, polyline, text) work smoothly
- [ ] Path optimization generates continuous route with TSP ordering
- [ ] Visualization shows blue contours, red path, green arrows/START
- [ ] All panels (Contours, Path Optimization, Machine) are functional
- [ ] G-code export produces valid 2-axis code
- [ ] TypeScript compiles without errors
- [ ] Application runs smoothly in Chrome/Firefox/Safari

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Core Libraries
- url: http://paperjs.org/reference/
  why: Paper.js API for canvas rendering, path manipulation, coordinate transforms
  critical_sections:
    - Project: http://paperjs.org/reference/project/
    - Path: http://paperjs.org/reference/path/
    - View: http://paperjs.org/reference/view/
    - Tool: http://paperjs.org/reference/tool/

- url: https://github.com/gdsestimating/dxf-parser
  why: DXF parsing library - handles LINE, POLYLINE, CIRCLE, ARC, SPLINE entities
  gotcha: Y-axis must be flipped (DXF uses bottom-left, Paper.js uses top-left)

- url: https://github.com/pmndrs/zustand
  why: State management - contours, optimized path, machine settings
  pattern: "const useFoamCutStore = create<State>((set) => ({ ... }))"

- url: https://react.dev/reference/react
  why: React 18 hooks - useEffect, useRef, useState
  critical: useEffect for Paper.js initialization, useRef for canvas element

- url: https://vitejs.dev/config/
  why: Build tool configuration - already configured, no changes needed

# MUST READ - Project Documentation
- file: docs/UI.md
  why: Complete UI design specification - colors, typography, layout, spacing
  critical: Follow dark theme exactly (bg #0B1120, accent #3B82F6, text #E5E7EB)

- file: docs/INITIAL.md
  why: Feature requirements, gotchas, coordinate systems, performance notes
  sections:
    - Coordinate System (lines 72-76): Y-axis flipping DXF→Paper.js
    - Common Gotchas (lines 85-95): Canvas initialization, path visibility, view fitting
    - UI Design Notes (lines 102-106): Path colors, canvas background

- file: docs/ARCHITECTURE.md
  why: System architecture - geometry engine in src/geometry

- file: docs/UI_MOCKUPS.md
  why: Layout structure references (minimal content currently)

# MUST READ - Codebase Patterns
- file: src/state/foamCutStore.ts
  why: Zustand store pattern - how to add state and setters
  pattern: State interface + create((set) => ({...})) pattern

- file: src/components/canvas/Canvas2D.tsx
  why: Paper.js initialization, tool handlers, rendering loop
  critical_patterns:
    - Paper.js initialization in useEffect with projectInitialized ref
    - Tool handling with paper.Tool and onMouseDown/Drag/Up
    - View updates with paper.view.update()
    - Coordinate transforms and view fitting (lines 192-287)

- file: src/utils/dxfImport.ts
  why: DXF entity parsing - handles all entity types with Y-axis flip
  pattern: Switch on entity.type, create Paper.js paths, flip Y coordinates

- file: src/components/layout/TopBar.tsx
  why: File import handling - async file reading, DXF/SVG parsing, view fitting
  critical: importDxfString usage, view bounds calculation (lines 192-287)

- file: src/geometry/pipeline.ts
  why: Path optimization pipeline - buildContours → islands → TSP → polyline
  flow: runFullOptimization orchestrates entire geometry engine

- file: src/geometry/types.ts
  why: TypeScript interfaces for Contour, OptimizedPath, EntryExit, Island

# G-code Standard
- url: https://en.wikipedia.org/wiki/G-code
  sections:
    - G21/G20 for units (mm/inch)
    - G0 for rapid moves (travel)
    - G1 for linear moves (cutting)
    - M2 for program end
  critical: G-code coordinate system uses bottom-left origin (like DXF)
```

### Current Codebase Tree
```bash
.
├── INITIAL.md              # Feature requirements and gotchas
├── PRPs/                   # This directory
├── docs/
│   ├── ARCHITECTURE.md     # System architecture
│   ├── SPEC.md             # Phase 0 spec (minimal)
│   ├── UI.md               # UI design specification (CRITICAL)
│   └── UI_MOCKUPS.md       # Layout mockups
├── index.html              # Vite entry point
├── package.json            # Dependencies
├── src/
│   ├── App.tsx             # Main layout: TopBar + LeftToolbar + Canvas + RightPanel
│   ├── main.tsx            # React entry point
│   ├── components/
│   │   ├── canvas/
│   │   │   └── Canvas2D.tsx          # Paper.js canvas + tool handlers
│   │   ├── layout/
│   │   │   ├── TopBar.tsx            # Import/Export/Generate buttons
│   │   │   ├── LeftToolbar.tsx       # Tool selection (select/pan/line/polyline/text)
│   │   │   └── RightPanel.tsx        # Panels container
│   │   └── panels/
│   │       ├── ContoursPanel.tsx     # Contours list + visibility toggles
│   │       ├── MachinePanel.tsx      # Machine settings (units/kerf/feedrate/origin)
│   │       └── PathOptimizationPanel.tsx  # Path optimization controls
│   ├── geometry/
│   │   ├── buildContours.ts          # Convert Paper.js paths to Contour objects
│   │   ├── entryExit.ts              # Compute optimal entry/exit points
│   │   ├── gcode.ts                  # Generate G-code from polyline
│   │   ├── islands.ts                # Detect holes and islands
│   │   ├── kerf.ts                   # Kerf compensation (future)
│   │   ├── pipeline.ts               # runFullOptimization orchestrator
│   │   ├── polylineBuilder.ts        # Build continuous polyline from contours
│   │   ├── tspOrdering.ts            # TSP-based island and contour ordering
│   │   └── types.ts                  # TypeScript types
│   ├── state/
│   │   └── foamCutStore.ts           # Zustand global state
│   └── utils/
│       ├── dxfImport.ts              # DXF parsing with dxf-parser
│       ├── id.ts                     # ID generation utilities
│       ├── math.ts                   # Math utilities
│       └── svgImport.ts              # SVG import (via Paper.js importSVG)
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite config
```

### Desired Additions
```bash
# New files to create:
examples/                          # Example DXF files for testing
  ├── simple-shape.dxf             # Basic closed rectangle/circle
  ├── nested-shapes.dxf            # Shape with a hole (island)
  ├── text-example.dxf             # Text converted to paths
  ├── complex.dxf                  # Multiple entities (lines, arcs, circles)
  └── islands-and-holes.dxf        # Multiple islands with holes

src/
  ├── index.css                    # Global styles (dark theme)
  └── components/
      └── layout/
          └── StatusBar.tsx        # Optional: Status bar with coordinates/zoom

# Files to enhance:
src/components/layout/LeftToolbar.tsx     # Add icons, active state styling
src/components/layout/RightPanel.tsx      # Add scrollable panel container
src/components/panels/*.tsx               # Complete panel implementations
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL GOTCHAS from INITIAL.md and codebase analysis:

// 1. Paper.js Initialization
// MUST initialize Paper.js project BEFORE any import/drawing operations
// Pattern in Canvas2D.tsx:
const projectInitialized = useRef(false);
useEffect(() => {
  if (!canvasRef.current || projectInitialized.current) return;
  paper.setup(canvasRef.current);
  projectInitialized.current = true;
}, []);

// 2. Coordinate System Y-Axis Flipping
// DXF uses bottom-left origin, Paper.js uses top-left origin
// Always flip Y when importing DXF:
const point = new paper.Point(entity.x, -entity.y);
// G-code export also needs Y-flipping for machine coordinates

// 3. Path Visibility
// Paths must be explicitly styled AFTER creation
// Pattern from dxfImport.ts:
path.strokeColor = new paper.Color(0.2, 0.4, 1); // Blue
path.strokeWidth = 3;
path.fillColor = null;
path.visible = true;
path.opacity = 1;
path.bringToFront();

// 4. View Fitting After Import
// Calculate combined bounds and fit view with padding
// Pattern from TopBar.tsx (lines 192-287):
let bounds = null;
paths.forEach(p => {
  if (p.bounds) bounds = bounds ? bounds.unite(p.bounds) : p.bounds.clone();
});
const padding = Math.max(bounds.width, bounds.height) * 0.2;
const expandedBounds = bounds.expand(padding);
const zoom = Math.min(
  paper.view.viewSize.width / expandedBounds.width,
  paper.view.viewSize.height / expandedBounds.height,
  2 // Max zoom
);
paper.view.zoom = zoom;
paper.view.center = expandedBounds.center;
paper.view.update();

// 5. State Updates Trigger Re-renders
// Zustand store updates cause React re-renders
// Canvas2D re-renders on contours/optimizedPath changes (lines 39-280)
// Ensure paths persist in Paper.js project across renders

// 6. TypeScript Types for Paper.js
// Paper.js includes its own types - NO @types/paper needed
// Use 'any' for path property in Contour interface (runtime is paper.Path)

// 7. Tool Cleanup
// MUST remove previous tool before creating new one
if (paper.tool) paper.tool.remove();
paper.tool = new paper.Tool();

// 8. View Updates
// After any Paper.js change, call paper.view.update()
// May need multiple calls for complex updates (see Canvas2D.tsx lines 272-279)

// 9. DXF Entity Support
// Supported: LINE, POLYLINE, LWPOLYLINE, CIRCLE, ARC, SPLINE, ELLIPSE, POINT
// Unsupported entities are logged but skipped (no error)

// 10. Closed Path Detection
// Only closed paths included in path optimization
// Auto-close paths where start/end points are within 0.1 units

// 11. Performance
// Large DXF files (100+ entities) may be slow to parse/render
// TSP optimization is O(n²) - consider progress indicator for 50+ contours

// 12. Browser Canvas
// Paper.js requires HTMLCanvasElement ref
// Ensure canvas ref is set BEFORE Paper.js initialization

// 13. React Strict Mode
// May cause double initialization in development
// Use projectInitialized ref to prevent duplicate setup

// 14. Dark Theme UI
// Canvas background should be #fafafa (light) for contrast with dark UI
// Path colors: Blue (#3366ff), Red (#ff3333), Green (#33ff33)
```

## Implementation Blueprint

### Data Models and Structure

```typescript
// All core types already defined in src/geometry/types.ts
// No new types needed, but document the existing structure:

export type Point = { x: number; y: number };

export interface Contour {
  id: string;                    // Unique identifier (e.g., "c_1234567890")
  path: any;                     // paper.Path at runtime (TypeScript 'any')
  isHole: boolean;               // True if contour is a hole (interior)
  parentId?: string;             // ID of outer contour (if this is a hole)
  islandId: string;              // Island grouping ID
  bounds?: { x: number; y: number; width: number; height: number };
  area?: number;                 // Signed area (negative for holes)
}

export interface EntryExit {
  contourId: string;             // Which contour
  entryT: number;                // Normalized parameter (0-1) for entry point
  exitT: number;                 // Normalized parameter (0-1) for exit point
}

export interface OptimizedPath {
  contoursOrdered: string[];     // Order of contour IDs
  entryExits: EntryExit[];       // Entry/exit points for each contour
  polyline: Point[];             // Complete continuous path as point sequence
  length: number;                // Total path length in units
}

export interface Island {
  id: string;                    // Island identifier
  outer: Contour;                // Outer boundary
  holes: Contour[];              // Interior holes
  allContours: Contour[];        // outer + holes combined
}

// Zustand store state (src/state/foamCutStore.ts):
export type Tool = "select" | "pan" | "line" | "polyline" | "text";

interface FoamCutState {
  contours: Contour[];           // All contours from import/drawing
  optimizedPath?: OptimizedPath; // Result of path optimization
  kerf: number;                  // Kerf compensation (mm)
  units: "mm" | "inch";          // Machine units
  scale: number;                 // Design units → machine units scaling
  origin: Point;                 // Origin point for G-code
  feedRate: number;              // Cutting feed rate
  activeTool: Tool;              // Currently selected tool

  // Setters
  setContours: (c: Contour[]) => void;
  setOptimizedPath: (p?: OptimizedPath) => void;
  setKerf: (k: number) => void;
  setUnits: (u: "mm" | "inch") => void;
  setFeedRate: (f: number) => void;
  setScale: (s: number) => void;
  setActiveTool: (t: Tool) => void;
}
```

### Implementation Tasks (in order)

```yaml
Task 1: Global Styling and Dark Theme
MODIFY src/main.tsx:
  - Import global CSS file
  - Ensure React renders into #root element

CREATE src/index.css:
  - PATTERN: Follow docs/UI.md color palette exactly
  - Background: #0B1120 (deep slate)
  - Text: #E5E7EB (near white)
  - Borders: #1F2937
  - Accent: #3B82F6 (blue-500)
  - Typography: Inter, SF Pro, or system-ui
  - CSS reset: margin 0, box-sizing border-box
  - Button styles: consistent padding, hover states
  - Input styles: dark theme form elements

Task 2: TopBar Styling
MODIFY src/components/layout/TopBar.tsx:
  - REPLACE inline styles with CSS classes
  - PATTERN: Follow docs/UI.md TopBar spec (lines 60-102)
  - Height: 56px (~14 in Tailwind spacing)
  - Background: gradient from-slate-950 to-slate-900
  - Border-bottom: 1px solid #1F2937
  - Left section: Logo icon + "FoamCut Web" + "Beta" pill
  - Center section: Menu items (File/View/Help) - optional
  - Right section: Import button, Export SVG button, Generate Path button (primary), Export G-code button
  - Button styling: Ghost buttons for Import/Export, Primary (blue bg) for Generate Path

Task 3: LeftToolbar Styling and Icons
MODIFY src/components/layout/LeftToolbar.tsx:
  - PATTERN: Follow docs/UI.md LeftToolbar spec (lines 104-143)
  - Width: 80-96px
  - Background: bg-slate-950
  - Border-right: 1px solid #1F2937
  - Vertical stack of tool buttons
  - Each button: 40x40px icon + label underneath
  - Active state: bg-slate-800/80, border border-blue-500/60
  - Hover state: bg-slate-800
  - Tools: Select (arrow), Pan (hand), Line, Polyline, Text ("T"), Transform (optional), Delete (trash) - optional
  - Use Unicode symbols or SVG icons for tool icons
  - Wire up activeTool state from Zustand store
  - setActiveTool on button click

Task 4: RightPanel Container and Styling
MODIFY src/components/layout/RightPanel.tsx:
  - PATTERN: Follow docs/UI.md RightPanel spec (lines 185-307)
  - Width: 320px
  - Background: bg-slate-950
  - Border-left: 1px solid #1F2937
  - Padding: 12-16px
  - Scrollable: overflow-y auto with custom scrollbar
  - Stack panels vertically with spacing
  - Import and render: ContoursPanel, PathOptimizationPanel, MachinePanel

Task 5: ContoursPanel Implementation
MODIFY src/components/panels/ContoursPanel.tsx:
  - PATTERN: Panel card from docs/UI.md (lines 196-228)
  - Container: bg-slate-900, rounded-xl, border border-slate-800, p-3.5, mb-3
  - Header: "Contours" title + badge showing count (e.g., "7")
  - Toggles:
    - [x] Show raw shapes (toggle visibility of contours in canvas)
    - [x] Show cutting path (toggle visibility of optimized path)
  - List of contours (chips or rows):
    - Each row: Contour ID + type (OUTER/HOLE) + Island ID
    - Click row → highlight in canvas (set selected state)
    - Use monospace font for IDs
  - Read contours from Zustand store
  - Style: text-slate-100 for title, text-slate-400 for labels

Task 6: PathOptimizationPanel Implementation
MODIFY src/components/panels/PathOptimizationPanel.tsx:
  - PATTERN: Panel card from docs/UI.md (lines 230-263)
  - Title: "Path Optimization"
  - Description: "Control sampling and penalty parameters for continuous path engine"
  - Controls:
    1. Slider: "Samples per contour" (default 32, range 8-128)
       - Display current value in a bubble/badge
    2. Slider + Input: "Crossing penalty λ" (default 1.0, range 0-5, step 0.1)
    3. Toggles (switch-style):
       - [x] Cut holes before outer (default on)
       - [x] Optimize island order (TSP) (default on)
  - Buttons:
    - "Recompute Path" (blue outline) - calls runFullOptimization
    - "Reset" (ghost button) - resets to defaults
  - Info area:
    - Total path length: {optimizedPath.length.toFixed(2)} units
    - Contours: {contours.length} ({islands.length} islands, {holes.length} holes)
  - Wire up to Zustand store (may need new state for samples/penalty)

Task 7: MachinePanel Implementation
MODIFY src/components/panels/MachinePanel.tsx:
  - PATTERN: Panel card from docs/UI.md (lines 265-307)
  - Title: "Machine & G-code"
  - Controls:
    1. Units: Segmented control [mm] [inch]
       - Wire to units state in Zustand
    2. Kerf: Number input with "mm" label
       - Wire to kerf state
    3. Scale: Number input "Design units → mm"
       - Wire to scale state
    4. Feedrate: Number input (mm/min or inch/min based on units)
       - Wire to feedRate state
    5. Origin: Radio group
       - (●) Bottom-left
       - ( ) Center
       - ( ) Custom (hint: "Click canvas to set custom origin")
       - Wire to origin state
  - G-code export section:
    - Primary button: "Export G-code"
    - Preview: "G21 · G90 · {lineCount} lines" (small text)
  - All inputs styled for dark theme

Task 8: Canvas2D Text Tool Implementation
MODIFY src/components/canvas/Canvas2D.tsx:
  - ADD text tool handler to tool switch (around line 342)
  - Pattern: Similar to line/polyline tools
  - On click: Prompt user for text input (window.prompt or inline text editor)
  - Create paper.PointText at click location:
    ```typescript
    const text = new paper.PointText({
      point: e.point,
      content: userInput,
      fontSize: 24,
      fontFamily: 'Arial',
      fillColor: new paper.Color(0.2, 0.4, 1)
    });
    ```
  - Convert text to paths: text.rasterize() or use outlines
  - Add resulting paths to contours
  - Update cursor to "text" when text tool active

Task 9: Canvas Background and Grid
MODIFY src/components/canvas/Canvas2D.tsx:
  - PATTERN: docs/UI.md canvas spec (lines 145-182)
  - Canvas container background: bg-slate-950
  - Canvas element background: #fafafa (light gray for contrast)
  - Optional: Draw subtle grid (thin lines, very low opacity)
  - Optional: Draw crosshair at origin (0, 0)
  - Optional: Coordinate display in bottom-right corner

Task 10: Enhance Path Visualization
MODIFY src/components/canvas/Canvas2D.tsx (rendering effect):
  - Ensure contours render as blue (#3366ff) strokes
  - Ensure optimized path renders as red (#ff3333) stroke
  - Ensure green arrows (#33ff33) drawn along optimized path
  - Ensure green "START" labels at entry points
  - Pattern already implemented (lines 140-235), verify colors match spec
  - Add drop shadow to START circles for "glow" effect

Task 11: Example DXF Files
CREATE examples/simple-shape.dxf:
  - Simple closed rectangle (100x100 units)
  - DXF entities: LWPOLYLINE with 4 vertices, closed flag

CREATE examples/nested-shapes.dxf:
  - Outer rectangle (200x200) + inner circle (radius 40)
  - Test island/hole detection

CREATE examples/text-example.dxf:
  - Text "FOAM" converted to polylines
  - Multiple closed contours from letter outlines

CREATE examples/complex.dxf:
  - Mix of LINE, CIRCLE, ARC, POLYLINE entities
  - Test all DXF entity types

CREATE examples/islands-and-holes.dxf:
  - 2-3 islands, each with 1-2 holes
  - Test TSP ordering across islands

Task 12: Error Handling and User Feedback
MODIFY src/components/layout/TopBar.tsx:
  - REPLACE alert() calls with styled toast notifications or inline messages
  - Handle DXF parse errors gracefully with user-friendly messages
  - Show loading state during file import (spinner)
  - Show success message after successful import

MODIFY src/geometry/pipeline.ts:
  - ADD error handling for edge cases (no contours, invalid paths)
  - Return undefined if optimization fails, handle in UI

Task 13: Performance and Polish
MODIFY src/components/canvas/Canvas2D.tsx:
  - Debounce view updates if needed (for large files)
  - Add progress indicator for TSP optimization (if >50 contours)
  - Optimize rendering loop (avoid unnecessary re-renders)

MODIFY src/components/layout/TopBar.tsx:
  - Add keyboard shortcuts (Ctrl+O for import, Ctrl+E for export)
  - Add tooltip hints on buttons

Task 14: Testing and Validation
MANUAL TESTING WORKFLOW:
  1. Start dev server: npm run dev
  2. Import examples/simple-shape.dxf
     - Verify: Blue rectangle appears, view auto-fits
  3. Click "Generate Path"
     - Verify: Red path appears around rectangle with green arrows and START label
  4. Export G-code
     - Verify: Valid G-code file downloads
  5. Import examples/nested-shapes.dxf
     - Verify: Outer rectangle + inner circle (hole) both visible
  6. Generate Path
     - Verify: Path cuts hole first, then outer boundary
  7. Test drawing tools:
     - Select Line tool → draw line
     - Select Polyline tool → draw multi-point polyline → double-click to close
     - Select Text tool → click → enter text → verify text converts to paths
  8. Test pan/zoom:
     - Select Pan tool → drag canvas → verify view pans
     - Mouse wheel → verify zoom (if implemented)
  9. Test panels:
     - Adjust sliders in Path Optimization panel
     - Click "Recompute Path" → verify path updates
     - Change units in Machine panel → verify G-code updates
     - Set custom origin → verify G-code coordinates adjust
```

### Per-Task Pseudocode (Selected Complex Tasks)

```typescript
// Task 1: Global Styling
// src/index.css
:root {
  --bg-shell: #0B1120;        // Deep slate shell
  --bg-canvas: #0F172A;       // Canvas area background
  --bg-panel: #020617;        // Panel/card background
  --bg-panel-hover: #111827;  // Hover state
  --border: #1F2937;          // Borders
  --accent-primary: #3B82F6;  // Blue accent
  --accent-success: #22C55E;  // Green for success
  --text-main: #E5E7EB;       // Near white
  --text-muted: #9CA3AF;      // Muted gray
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'SF Pro', system-ui, -apple-system, sans-serif;
  color: var(--text-main);
  background: var(--bg-shell);
  font-size: 14px;
}

button {
  // PATTERN: Consistent button styles
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-panel);
  color: var(--text-main);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

button:hover {
  background: var(--bg-panel-hover);
  transform: scale(1.03);
}

button.primary {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

// Task 6: PathOptimizationPanel Implementation
// Pseudocode for panel structure and logic

import { useFoamCutStore } from "../../state/foamCutStore";
import { runFullOptimization } from "../../geometry/pipeline";

export const PathOptimizationPanel = () => {
  const { contours, optimizedPath, setOptimizedPath, origin } = useFoamCutStore();

  // Local state for optimization parameters
  const [samplesPerContour, setSamplesPerContour] = useState(32);
  const [crossingPenalty, setCrossingPenalty] = useState(1.0);
  const [cutHolesFirst, setCutHolesFirst] = useState(true);
  const [optimizeIslandOrder, setOptimizeIslandOrder] = useState(true);

  const handleRecompute = () => {
    if (contours.length === 0) {
      alert("No contours to optimize");
      return;
    }

    const paths = contours.map(c => c.path);

    // PATTERN: Call runFullOptimization with current settings
    // Note: Current implementation doesn't support all these params yet
    // May need to modify entryExit.ts and pipeline.ts to accept these
    const optimized = runFullOptimization(paths, origin);

    if (optimized) {
      setOptimizedPath(optimized);
    }
  };

  const handleReset = () => {
    setSamplesPerContour(32);
    setCrossingPenalty(1.0);
    setCutHolesFirst(true);
    setOptimizeIslandOrder(true);
  };

  // Calculate island/hole counts
  const islands = groupIntoIslands(contours);
  const holes = contours.filter(c => c.isHole);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3>Path Optimization</h3>
        <p className="panel-description">
          Control sampling and penalty parameters for the continuous path engine.
        </p>
      </div>

      <div className="panel-body">
        {/* Slider: Samples per contour */}
        <div className="control-group">
          <label>Samples per contour</label>
          <input
            type="range"
            min={8}
            max={128}
            step={8}
            value={samplesPerContour}
            onChange={(e) => setSamplesPerContour(Number(e.target.value))}
          />
          <span className="value-badge">{samplesPerContour}</span>
        </div>

        {/* Slider + Input: Crossing penalty */}
        <div className="control-group">
          <label>Crossing penalty λ</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={crossingPenalty}
            onChange={(e) => setCrossingPenalty(Number(e.target.value))}
          />
        </div>

        {/* Toggles */}
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={cutHolesFirst}
              onChange={(e) => setCutHolesFirst(e.target.checked)}
            />
            Cut holes before outer
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={optimizeIslandOrder}
              onChange={(e) => setOptimizeIslandOrder(e.target.checked)}
            />
            Optimize island order (TSP)
          </label>
        </div>

        {/* Buttons */}
        <div className="button-row">
          <button className="primary" onClick={handleRecompute}>
            Recompute Path
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>

        {/* Info area */}
        {optimizedPath && (
          <div className="info-area">
            <div>Total path length: {optimizedPath.length.toFixed(2)} units</div>
            <div>
              Contours: {contours.length} ({islands.length} islands, {holes.length} holes)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Task 8: Text Tool Implementation
// Pseudocode for text tool handler in Canvas2D.tsx

else if (tool === "text") {
  paper.tool = new paper.Tool();
  paper.tool.onMouseDown = async (e: paper.ToolEvent) => {
    // PATTERN: Prompt for text input
    const userText = window.prompt("Enter text:");
    if (!userText) return;

    // Create text at click location
    const text = new paper.PointText({
      point: e.point,
      content: userText,
      fontSize: 48,
      fontFamily: 'Arial',
      fillColor: new paper.Color(0.2, 0.4, 1)
    });

    // CRITICAL: Convert text to paths for cutting
    // Paper.js PointText doesn't have direct path conversion
    // Workaround: Use a library or create manual outlines
    // For MVP: Create bounding box paths around text
    const bounds = text.bounds;
    const outlinePath = new paper.Path.Rectangle(bounds);
    outlinePath.strokeColor = new paper.Color(0.2, 0.4, 1);
    outlinePath.strokeWidth = 2;
    outlinePath.closed = true;

    // Remove text, keep outline
    text.remove();

    // Add to contours
    const newContour = {
      id: `c_${Date.now()}`,
      path: outlinePath,
      isHole: false,
      parentId: undefined,
      islandId: `island_${Date.now()}`,
      bounds: outlinePath.bounds ? {
        x: outlinePath.bounds.x,
        y: outlinePath.bounds.y,
        width: outlinePath.bounds.width,
        height: outlinePath.bounds.height,
      } : undefined,
      area: outlinePath.area,
    };

    const currentContours = useFoamCutStore.getState().contours;
    setContours([...currentContours, newContour]);
  };
}
```

### Integration Points
```yaml
STYLES:
  - CREATE: src/index.css
  - IMPORT in: src/main.tsx
  - Global dark theme styles for entire app

STATE MANAGEMENT:
  - MAY NEED to extend: src/state/foamCutStore.ts
  - ADD state for:
    - samplesPerContour: number (default 32)
    - crossingPenalty: number (default 1.0)
    - showRawShapes: boolean (default true)
    - showCuttingPath: boolean (default true)
  - ADD setters for new state

GEOMETRY ENGINE:
  - MODIFY: src/geometry/pipeline.ts
  - MAY NEED to pass additional params to runFullOptimization:
    - samplesPerContour (currently hardcoded to 32 in entryExit.ts)
    - crossingPenaltyWeight (currently hardcoded to 1.0)
  - MODIFY: src/geometry/entryExit.ts
  - MODIFY: src/geometry/tspOrdering.ts
  - Make parameters configurable via options object

PANEL COMPONENTS:
  - COMPLETE implementations in: src/components/panels/
  - Wire all panels to Zustand store state
  - Follow UI.md design specification exactly

EXAMPLES:
  - CREATE: examples/*.dxf files
  - Test files for manual validation
  - Document how to create DXF files (use QCAD, LibreCAD, or AutoCAD)
```

## Validation Loop

### Level 1: TypeScript Compilation
```bash
# Run these FIRST - fix any errors before proceeding
npm run build

# Expected: No TypeScript errors, successful build output
# If errors: READ the error messages, fix type issues, re-run
```

### Level 2: Development Server
```bash
# Start development server
npm run dev

# Expected: Server starts on http://localhost:5173
# Open in Chrome/Firefox/Safari
# Check browser console for any runtime errors
```

### Level 3: Manual Testing Workflow
```bash
# Test Sequence 1: Basic Import and Visualization
1. Open http://localhost:5173
   - Verify: Dark-themed UI appears
   - Verify: TopBar, LeftToolbar, Canvas, RightPanel all visible

2. Click "Import" button → select examples/simple-shape.dxf
   - Verify: Blue rectangle appears on canvas
   - Verify: View auto-fits to show entire rectangle
   - Verify: Contours panel shows 1 contour

3. Click "Generate Path ▶" button
   - Verify: Red path appears tracing rectangle
   - Verify: Green arrows show direction along path
   - Verify: Green "START" label at entry point
   - Verify: Path Optimization panel shows path length

4. Click "Export G-code" button
   - Verify: foamcut.nc file downloads
   - Open file: Verify G21, G90, G0/G1 commands present, ends with M2

# Test Sequence 2: Nested Shapes (Islands and Holes)
1. Click "Import" → select examples/nested-shapes.dxf
   - Verify: Outer rectangle + inner circle both visible in blue
   - Verify: Contours panel shows 2 contours (1 outer, 1 hole)

2. Click "Generate Path"
   - Verify: Red path cuts inner circle first, then outer rectangle
   - Verify: Arrows show continuous path from hole to outer

# Test Sequence 3: Drawing Tools
1. Click Line tool in LeftToolbar
   - Verify: Tool button shows active state (blue border)
   - Verify: Canvas cursor changes to crosshair

2. Click and drag on canvas → release
   - Verify: Blue line appears
   - Verify: Line added to Contours panel

3. Click Polyline tool
   - Click multiple points on canvas
   - Double-click to close polyline
   - Verify: Closed polyline appears in blue
   - Verify: Added to Contours panel

4. Click Text tool
   - Click on canvas
   - Enter "TEST" in prompt
   - Verify: Text outline paths appear
   - Verify: Paths added to contours

# Test Sequence 4: Pan and Zoom
1. Click Pan tool
   - Drag canvas → verify view pans smoothly

2. Mouse wheel (if implemented)
   - Verify: View zooms in/out around cursor

# Test Sequence 5: Panel Interactions
1. Path Optimization Panel:
   - Adjust "Samples per contour" slider
   - Click "Recompute Path"
   - Verify: Path updates (may look slightly different)

2. Machine Panel:
   - Change units from "mm" to "inch"
   - Export G-code
   - Verify: G-code uses G20 (inch mode) instead of G21

3. Change feedrate → export G-code
   - Verify: G-code F values match new feedrate

# Test Sequence 6: Complex File
1. Import examples/islands-and-holes.dxf
   - Verify: Multiple islands with holes visible
   - Verify: All contours listed in Contours panel

2. Generate Path
   - Verify: TSP orders islands efficiently
   - Verify: Each island's holes cut before outer boundary
   - Verify: Path length shown in optimization panel
```

### Level 4: Visual Regression
```bash
# Compare UI to design spec
1. TopBar:
   - Height ~56px? ✓
   - Gradient background? ✓
   - Logo + title + beta pill? ✓
   - Buttons styled correctly? ✓

2. LeftToolbar:
   - Width 80-96px? ✓
   - Tool icons visible? ✓
   - Active tool highlighted? ✓

3. Canvas:
   - Light gray (#fafafa) background? ✓
   - Dark shell around canvas? ✓
   - Paths visible and colored correctly? ✓

4. RightPanel:
   - Width ~320px? ✓
   - Dark background? ✓
   - Panels stacked with spacing? ✓
   - All controls functional? ✓

# Performance check
1. Import large file (100+ entities)
   - Does UI remain responsive? ✓
   - Any lag during rendering? Document if >1s

2. Generate path with 50+ contours
   - TSP completes in reasonable time (<5s)? ✓
   - Progress indicator shown if slow? ✓
```

## Final Validation Checklist
- [ ] TypeScript compiles without errors
- [ ] Development server starts without errors
- [ ] All example DXF files import successfully
- [ ] Path optimization generates continuous routes
- [ ] G-code export produces valid output
- [ ] All drawing tools (line, polyline, text) work
- [ ] Pan tool works smoothly
- [ ] All panels render correctly with dark theme
- [ ] All panel controls wire to state and function correctly
- [ ] UI matches docs/UI.md specification (colors, typography, spacing)
- [ ] No console errors in browser (Chrome, Firefox, Safari)
- [ ] Islands and holes handled correctly in optimization
- [ ] View auto-fits after DXF import
- [ ] Arrows and START labels appear on optimized path

---

## Anti-Patterns to Avoid
- ❌ Don't modify Paper.js paths during React renders without triggering view updates
- ❌ Don't create new tools without removing old ones (memory leak)
- ❌ Don't forget Y-axis flipping when importing DXF or exporting G-code
- ❌ Don't use alert() - use styled notifications or inline messages
- ❌ Don't hardcode colors - follow UI.md spec exactly
- ❌ Don't skip path.visible = true after creation (paths won't show)
- ❌ Don't forget to call paper.view.update() after Paper.js changes
- ❌ Don't include open paths in optimization (only closed contours)
- ❌ Don't modify src/geometry/*.ts files unless needed for params
- ❌ Don't create custom path optimization algorithms - use existing TSP approach
- ❌ Don't add features beyond MVP scope (3D, multi-axis, kerf compensation)

## Success Indicators
✅ Clean, professional dark-themed UI that feels like "engineering SaaS"
✅ Smooth file import with auto-fit and immediate visual feedback
✅ Intuitive drawing tools with clear visual states
✅ Fast path optimization with clear visualization
✅ Valid G-code output ready for CNC machines
✅ All panels functional with real-time state updates
✅ Responsive UI with no lag or janky animations
✅ Zero TypeScript errors, zero runtime console errors
✅ Works across browsers (Chrome, Firefox, Safari)

---

## Confidence Score: 8.5/10

**High confidence due to:**
- Comprehensive codebase already in place (60% complete)
- Clear UI design specification in docs/UI.md
- Well-documented gotchas and patterns in INITIAL.md
- Existing geometry engine fully implemented and working
- Zustand state management already set up
- Paper.js integration working with import/drawing
- All core libraries documented and patterns understood

**Minor uncertainty on:**
- Text tool implementation (Paper.js text-to-path conversion is non-trivial)
  - Workaround: Use bounding box or simple outline for MVP
- Performance with very large DXF files (100+ entities)
  - Mitigation: Add progress indicators and consider debouncing
- Cross-browser canvas rendering edge cases
  - Mitigation: Test in all major browsers during validation

**Recommended approach:**
1. Start with styling tasks (1-4) to establish visual foundation
2. Implement panels (5-7) to enable user control
3. Add text tool with simplified implementation (8)
4. Polish canvas and visualization (9-10)
5. Create example files and test thoroughly (11-14)
6. Iterate on any issues discovered during testing

This PRP provides complete context for one-pass implementation with high success probability.
