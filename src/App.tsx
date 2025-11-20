
import React from "react";
import { TopBar } from "./components/layout/TopBar";
import { LeftToolbar } from "./components/layout/LeftToolbar";
import { RightPanel } from "./components/layout/RightPanel";
import { Canvas2D } from "./components/canvas/Canvas2D";
export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <LeftToolbar />
        <div style={{ flex: 1, minWidth: 0 }}><Canvas2D /></div>
        <RightPanel />
      </div>
    </div>
  );
}
