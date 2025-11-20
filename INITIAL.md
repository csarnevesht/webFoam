# FoamCut Web – Initial Setup

## FEATURE:

**FoamCut Web** is a browser-based application for hot-wire foam cutting that replicates and modernizes core features from legacy software like devFoam. The MVP (Phase 0) focuses on continuous-path 2D cutting, enabling users to:

- **Import** DXF files
- **Draw** simple geometry (lines, polylines, text)
- **Build** closed contours from imported or drawn shapes
- **Detect** holes and islands in the geometry
- **Generate** continuous optimized cutting paths using TSP (Traveling Salesman Problem) algorithms
- **Visualize** paths with directional arrows, start points, and color coding:
  - Blue outlines for contours
  - Red path for optimized cutting route
  - Green arrows showing direction
  - Green "START" labels at entry points
- **Export** G-code for 2-axis hot wire cutters

### Key Technical Features:
- Paper.js integration for 2D vector graphics
- TSP-based path optimization for minimal travel distance
- Island and hole detection for complex nested shapes
- Entry/exit point computation for efficient cutting
- Real-time visualization on HTML5 canvas

## EXAMPLES:

Examples folder structure (to be created):
```
examples/
  ├── simple-shape.dxf         # Basic closed shape
  ├── nested-shapes.dxf        # Shapes with holes
  ├── text-example.dxf         # Text converted to paths
  ├── complex.dxf              # DXF file with multiple entities
  └── islands-and-holes.dxf    # Multiple islands with holes
```

**Example Workflows:**
1. **Import DXF** → Generate Path → Export G-code
2. **Draw polyline** → Close to contour → Generate Path → Export
3. **Import DXF** → Edit contours → Optimize → Export G-code

## DOCUMENTATION:

### Project Documentation:
- **docs/SPEC.md** - Phase 0 specification and requirements
- **docs/ARCHITECTURE.md** - System architecture (geometry engine in `src/geometry`)
- **docs/UI_MOCKUPS.md** - UI layout and structure references
- **docs/UI.md** - Detailed UI design guidelines (dark theme, engineering SaaS aesthetic)

### Key Libraries & APIs:
- **Paper.js** (v0.12.18) - 2D vector graphics library
  - Documentation: http://paperjs.org/reference/
  - Used for: Canvas rendering and path manipulation
- **dxf-parser** (v1.1.2) - DXF file parsing
  - Documentation: https://github.com/gdsestimating/dxf-parser
  - Used for: Parsing DXF entities (LINE, POLYLINE, CIRCLE, ARC, SPLINE)
- **Zustand** (v5.0.0) - State management
  - Documentation: https://github.com/pmndrs/zustand
  - Used for: Application state (contours, optimized path, machine settings)
- **React** (v18.3.0) + **TypeScript** (v5.5.0)
- **Vite** (v5.0.0) - Build tool and dev server

### External References:
- Hot wire foam cutting machine specifications
- G-code standard (G21/G20 for units, G0/G1 for movement, M2 for end)
- TSP (Traveling Salesman Problem) algorithms for path optimization
- Vector graphics coordinate systems and transformations

## OTHER CONSIDERATIONS:

### Coordinate System:
- **Paper.js** uses a top-left origin coordinate system
- **DXF** uses a bottom-left origin (Y-axis is flipped)
- The DXF importer flips the Y-axis: `y = -entity.y` to convert from DXF to Paper.js coordinates
- **G-code export** handles coordinate transformation based on user-selected origin point

### Path Optimization:
- Uses TSP (Traveling Salesman Problem) to order contours for minimal travel distance
- Groups contours into islands (outer boundaries with holes)
- Orders islands, then orders contours within each island
- Computes entry/exit points for each contour to minimize crossing distance
- Builds continuous polyline from all contours with optimal entry/exit connections

### Common Gotchas:
1. **Canvas Rendering**: Paper.js project must be initialized before importing files. The Canvas2D component handles this via `useEffect` with `projectInitialized` ref.
2. **Path Visibility**: After importing DXF files, paths must be explicitly styled and brought to front. The Canvas2D component re-styles paths on each render.
3. **View Fitting**: When importing files, the view must be centered and zoomed to show all content. Bounds calculation uses `path.bounds.unite()` to find the combined bounding box.
4. **Path Closing**: Only closed paths can be used for path optimization. Open paths (lines, arcs) are displayed but not included in optimization.
5. **State Management**: Zustand store updates trigger React re-renders. Importing adds paths to Paper.js project AND updates the store's `contours` array.
6. **TypeScript Types**: Paper.js types are included in the library. No `@types/paper` needed (deprecated - Paper.js provides its own types).
7. **DXF Entity Types**: Not all DXF entities are supported. Currently handles: LINE, POLYLINE, LWPOLYLINE, CIRCLE, ARC, SPLINE. Others are logged but skipped.
8. **Browser Canvas**: Paper.js requires a canvas element. Ensure the canvas ref is set before initializing Paper.js.
9. **View Updates**: After changing Paper.js paths or view settings, call `paper.view.update()` to refresh the canvas.
10. **Debugging**: Extensive console logging has been added to track import, styling, and view fitting. Check browser console for detailed logs.

### Performance:
- Large DXF files with many entities may take time to parse and render
- Path optimization is O(n²) for TSP ordering - may be slow for 100+ contours
- Canvas redraws on every state change - consider debouncing if needed

### UI Design Notes:
- Follow dark theme from `docs/UI.md`: slate backgrounds, blue accents, minimal color
- Canvas background: `#fafafa` (light gray) - may need to match dark theme
- Path colors: Blue (#3366ff) for contours, Red (#ff3333) for optimized path, Green (#33ff33) for start points
- Use consistent spacing and typography as specified in UI.md

### Development Workflow:
1. Run `npm run dev` to start development server
2. Import test DXF files to verify functionality
3. Use browser console (F12) to see detailed debug logs
4. Check Paper.js project state via `paper.project.activeLayer.children`
5. Verify view settings via `paper.view.center` and `paper.view.zoom`
