import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export const MachinePanel: React.FC = () => {
  const { kerf, units, feedRate, scale, setKerf, setUnits, setFeedRate, setScale } = useFoamCutStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{
        margin: "0 0 0.5rem 0",
        fontSize: "16px",
        fontWeight: 600,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span style={{ color: "#2196f3" }}>⚙️</span> Machine & G-code
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Units</label>
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value as "mm" | "inch")}
            style={{
              padding: "0.5rem",
              backgroundColor: "#252525",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "0.9rem",
              width: "100%",
              cursor: "pointer"
            }}
          >
            <option value="mm">Millimeters (mm)</option>
            <option value="inch">Inches (inch)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Kerf (offset)</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="number"
              value={kerf}
              onChange={(e) => setKerf(parseFloat(e.target.value) || 0)}
              step="0.01"
              style={{
                padding: "0.5rem",
                paddingRight: "2.5rem",
                backgroundColor: "#252525",
                border: "1px solid #333",
                color: "#fff",
                borderRadius: "4px",
                fontSize: "0.9rem",
                width: "100%"
              }}
            />
            <span style={{ position: "absolute", right: "0.75rem", color: "#666", fontSize: "0.85rem", pointerEvents: "none" }}>
              {units}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Feed Rate</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="number"
              value={feedRate}
              onChange={(e) => setFeedRate(parseFloat(e.target.value) || 0)}
              step="10"
              style={{
                padding: "0.5rem",
                paddingRight: "4rem",
                backgroundColor: "#252525",
                border: "1px solid #333",
                color: "#fff",
                borderRadius: "4px",
                fontSize: "0.9rem",
                width: "100%"
              }}
            />
            <span style={{ position: "absolute", right: "0.75rem", color: "#666", fontSize: "0.85rem", pointerEvents: "none" }}>
              {units}/min
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Scale</label>
          <input
            type="number"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
            step="0.1"
            style={{
              padding: "0.5rem",
              backgroundColor: "#252525",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "0.9rem",
              width: "100%"
            }}
          />
        </div>
      </div>
    </div>
  );
};
