
import React from "react";
import { TopBar } from "./components/layout/TopBar";
import { LeftToolbar } from "./components/layout/LeftToolbar";
import { RightPanel } from "./components/layout/RightPanel";
import { Canvas2D } from "./components/canvas/Canvas2D";
import { WorkflowSelector } from "./components/layout/WorkflowSelector";
import { TaperedLayout } from "./components/layout/TaperedLayout";
import { TextLayout } from "./components/layout/TextLayout";
import { TwistRotLayout } from "./components/layout/TwistRotLayout";
import { useWorkflowStore } from "./state/workflowStore";

export default function App() {
  const currentWorkflow = useWorkflowStore((state) => state.currentWorkflow);

  if (currentWorkflow === 'HOME') {
    return <WorkflowSelector />;
  }

  if (currentWorkflow === 'TAPERED') {
    return <TaperedLayout />;
  }

  if (currentWorkflow === 'TEXT') {
    return <TextLayout />;
  }

  if (currentWorkflow === 'ROTARY') {
    return <TwistRotLayout />;
  }

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
