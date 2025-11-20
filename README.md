# FoamCut Web

A modern, browser-based hot-wire foam cutting application that enables CAD-to-CNC workflows entirely in the browser. FoamCut Web provides a complete solution for importing, optimizing, and exporting cutting paths for 2-axis hot wire cutting machines.

## Features

- **DXF/SVG Import**: Import 2D geometry from DXF or SVG files
- **Drawing Tools**: Create geometry directly on the canvas with line, polyline, and text tools
- **Path Optimization**: Automatic TSP-based path ordering for minimal travel distance
- **Real-time Visualization**: 
  - Blue contours for imported/drawn geometry
  - Red paths for optimized cutting routes
  - Green arrows and START labels for path direction
- **Machine Configuration**: Configure units, kerf compensation, feedrate, scale, and origin
- **G-code Export**: Generate valid 2-axis hot wire cutter G-code
- **Modern UI**: Dark theme with professional SaaS aesthetic

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Paper.js** - Canvas rendering and path manipulation
- **Zustand** - State management
- **dxf-parser** - DXF file parsing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webFoam
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## Project Structure

```
webFoam/
├── src/
│   ├── components/          # React components
│   │   ├── canvas/         # Canvas rendering components
│   │   ├── layout/         # Layout components (TopBar, LeftToolbar, RightPanel)
│   │   └── panels/         # Feature panels (Contours, Machine, PathOptimization)
│   ├── geometry/           # Geometry processing engine
│   │   ├── buildContours.ts
│   │   ├── entryExit.ts
│   │   ├── gcode.ts
│   │   ├── islands.ts
│   │   ├── kerf.ts
│   │   ├── pipeline.ts
│   │   ├── polylineBuilder.ts
│   │   ├── tspOrdering.ts
│   │   └── types.ts
│   ├── state/              # Zustand store
│   │   └── foamCutStore.ts
│   ├── utils/              # Utility functions
│   │   ├── dxfImport.ts
│   │   ├── id.ts
│   │   └── math.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── SPEC.md
│   ├── UI.md
│   └── UI_MOCKUPS.md
├── PRPs/                   # Product Requirements Plans
└── package.json
```

## Usage

1. **Import Geometry**: Use the file import feature to load DXF or SVG files containing your 2D geometry
2. **Draw Geometry**: Use the drawing tools in the left toolbar to create lines, polylines, or text
3. **Configure Settings**: Adjust machine settings in the right panel (units, kerf, feedrate, etc.)
4. **Optimize Paths**: Use the Path Optimization panel to generate optimized cutting paths
5. **Export G-code**: Once paths are optimized, export the G-code for your cutting machine

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests (Vitest)

### Key Concepts

- **Coordinate System**: DXF files use bottom-left origin, while Paper.js uses top-left. The application handles Y-axis flipping automatically.
- **Path Optimization**: Uses Traveling Salesman Problem (TSP) algorithms to minimize travel distance between cutting paths.
- **Kerf Compensation**: Automatically adjusts paths to account for wire thickness.

## Documentation

For more detailed information, see:
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [UI Design Specification](docs/UI.md)
- [Product Requirements Plan](PRPs/foamcut-web-mvp.md)

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

