
import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export const PathOptimizationPanel: React.FC = () => {
  const optimizedPath = useFoamCutStore((s) => s.optimizedPath);
  
  return (
    <div style={{ marginBottom: 8, padding: 8, border: "1px solid #ddd", borderRadius: 4 }}>
      <h4 style={{ margin: "0 0 8px 0" }}>Path Optimization</h4>
      {optimizedPath ? (
        <div style={{ fontSize: 12 }}>
          <div>Path Length: {(optimizedPath.length / 25.4).toFixed(2)}"</div>
          <div>Contours: {optimizedPath.contoursOrdered.length}</div>
          <div>Points: {optimizedPath.polyline.length}</div>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "#999" }}>Generate path to see statistics</div>
      )}
    </div>
  );
};
