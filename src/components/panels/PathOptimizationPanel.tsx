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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
      <h2 style={{
        margin: "0 0 0.5rem 0",
        fontSize: "16px",
        fontWeight: 600,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span style={{ color: "#4caf50" }}>⚡</span> Path Optimization
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Samples per contour</label>
          <input
            type="number"
            value={samplesPerContour}
            min={4}
            max={256}
            step={1}
            style={{
              padding: "0.5rem",
              backgroundColor: "#252525",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "0.9rem",
              width: "100%"
            }}
            onChange={(e) => setSamplesPerContour(Math.max(4, Math.min(256, Number(e.target.value) || 32)))}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Crossing penalty weight</label>
          <input
            type="number"
            value={crossingPenaltyWeight}
            min={0.1}
            max={5}
            step={0.1}
            style={{
              padding: "0.5rem",
              backgroundColor: "#252525",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "0.9rem",
              width: "100%"
            }}
            onChange={(e) => setCrossingPenaltyWeight(Number(e.target.value) || 1)}
          />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "0.25rem" }}>
          <input
            type="checkbox"
            checked={useCustomEntryPoints}
            onChange={(e) => setUseCustomEntryPoints(e.target.checked)}
            style={{ accentColor: "#4caf50" }}
          />
          <span style={{ color: "#ddd", fontSize: "0.9rem" }}>Use custom start/exit points</span>
        </label>
      </div>

      {optimizedPath ? (
        <div style={{
          backgroundColor: "#252525",
          borderRadius: "6px",
          padding: "0.75rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          fontSize: "0.85rem",
          border: "1px solid #333"
        }}>
          <div style={{ color: "#aaa" }}>Path Length:</div>
          <div style={{ color: "#fff", textAlign: "right", fontFamily: "monospace" }}>{(optimizedPath.length / 25.4).toFixed(2)}"</div>

          <div style={{ color: "#aaa" }}>Contours:</div>
          <div style={{ color: "#fff", textAlign: "right", fontFamily: "monospace" }}>{optimizedPath.contoursOrdered.length}</div>

          <div style={{ color: "#aaa" }}>Points:</div>
          <div style={{ color: "#fff", textAlign: "right", fontFamily: "monospace" }}>{optimizedPath.polyline.length}</div>
        </div>
      ) : (
        <div style={{
          padding: "0.75rem",
          backgroundColor: "#252525",
          borderRadius: "6px",
          color: "#888",
          fontSize: "0.85rem",
          textAlign: "center",
          border: "1px solid #333",
          fontStyle: "italic"
        }}>
          Generate path to see statistics
        </div>
      )}
    </div>
  );
};
