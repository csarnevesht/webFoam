
import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export type Tool = "select" | "pan" | "line" | "polyline" | "text";

const tools = [
  { id: "select" as Tool, icon: "↖️", label: "Select" },
  { id: "pan" as Tool, icon: "✋", label: "Pan" },
  { id: "line" as Tool, icon: "📏", label: "Line" },
  { id: "polyline" as Tool, icon: "📐", label: "Polyline" },
  { id: "text" as Tool, icon: "T", label: "Text" },
];

export const LeftToolbar: React.FC = () => {
  const activeTool = useFoamCutStore((s) => s.activeTool);
  const setActiveTool = useFoamCutStore((s) => s.setActiveTool);

  return (
    <div className="left-toolbar">
      <div className="toolbar-tools">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-button ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
          >
            <div className="tool-icon">{tool.icon}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
