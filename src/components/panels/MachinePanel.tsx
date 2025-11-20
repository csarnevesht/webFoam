
import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export const MachinePanel: React.FC = () => {
  const { kerf, units, feedRate, scale, setKerf, setUnits, setFeedRate, setScale } = useFoamCutStore();

  return (
    <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4 }}>
      <h4 style={{ margin: "0 0 8px 0" }}>Machine &amp; G-code</h4>
      <div style={{ fontSize: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Units:</label>
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value as "mm" | "inch")}
            style={{ width: "100%", padding: 4 }}
          >
            <option value="mm">Millimeters (mm)</option>
            <option value="inch">Inches (inch)</option>
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Kerf (offset):</label>
          <input
            type="number"
            value={kerf}
            onChange={(e) => setKerf(parseFloat(e.target.value) || 0)}
            step="0.01"
            style={{ width: "100%", padding: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Feed Rate:</label>
          <input
            type="number"
            value={feedRate}
            onChange={(e) => setFeedRate(parseFloat(e.target.value) || 0)}
            step="10"
            style={{ width: "100%", padding: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Scale:</label>
          <input
            type="number"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
            step="0.1"
            style={{ width: "100%", padding: 4 }}
          />
        </div>
      </div>
    </div>
  );
};
