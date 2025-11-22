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
    <div className="panel-card">
      <div className="panel-header">
        <h3>Path Optimization</h3>
      </div>

      <div className="panel-body">
        <div className="control-group">
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
        </div>

        <div className="control-group">
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
        </div>

        <div className="control-group">
          <label className="toggle-label" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={useCustomEntryPoints}
                onChange={(e) => setUseCustomEntryPoints(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </div>
            <span>Use custom start/exit points</span>
          </label>
        </div>

        {optimizedPath ? (
          <div className="info-area">
            <div><span>Path Length:</span> <span className="mono">{(optimizedPath.length / 25.4).toFixed(2)}"</span></div>
            <div><span>Contours:</span> <span className="mono">{optimizedPath.contoursOrdered.length}</span></div>
            <div><span>Points:</span> <span className="mono">{optimizedPath.polyline.length}</span></div>
          </div>
        ) : (
          <div className="panel-empty-state" style={{ padding: "12px 0", fontSize: "11px" }}>
            Generate path to see statistics
          </div>
        )}
      </div>
    </div>
  );
};
