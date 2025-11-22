
import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export const PathOptimizationPanel: React.FC = () => {
  const optimizedPath = useFoamCutStore((s) => s.optimizedPath);
  const samplesPerContour = useFoamCutStore((s) => s.samplesPerContour);
  const crossingPenaltyWeight = useFoamCutStore((s) => s.crossingPenaltyWeight);
  const useCustomEntryPoints = useFoamCutStore((s) => s.useCustomEntryPoints);
  const setSamplesPerContour = useFoamCutStore((s) => s.setSamplesPerContour);
  const setCrossingPenaltyWeight = useFoamCutStore((s) => s.setCrossingPenaltyWeight);
  const setUseCustomEntryPoints = useFoamCutStore((s) => s.setUseCustomEntryPoints);

  return (
    <div style={{ marginBottom: 8, padding: 8, border: "1px solid #ddd", borderRadius: 4 }}>
      <h4 style={{ margin: "0 0 8px 0" }}>Path Optimization</h4>

      <div style={{ marginBottom: 8, fontSize: 12 }}>
        <label style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Samples / contour</span>
          <input
            type="number"
            value={samplesPerContour}
            min={4}
            max={256}
            step={1}
            style={{ width: 60 }}
            onChange={(e) => setSamplesPerContour(Math.max(4, Math.min(256, Number(e.target.value) || 32)))}
          />
        </label>
        <label style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Crossing penalty</span>
          <input
            type="number"
            value={crossingPenaltyWeight}
            min={0.1}
            max={5}
            step={0.1}
            style={{ width: 60 }}
            onChange={(e) => setCrossingPenaltyWeight(Number(e.target.value) || 1)}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={useCustomEntryPoints}
            onChange={(e) => setUseCustomEntryPoints(e.target.checked)}
          />
          Use custom start points
        </label>
      </div>

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
