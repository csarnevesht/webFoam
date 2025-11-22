import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export const MachinePanel: React.FC = () => {
  const { kerf, units, feedRate, scale, setKerf, setUnits, setFeedRate, setScale } = useFoamCutStore();

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3>Machine & G-code</h3>
      </div>

      <div className="panel-body">
        <div className="control-group">
          <label>Units</label>
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value as "mm" | "inch")}
          >
            <option value="mm">Millimeters (mm)</option>
            <option value="inch">Inches (inch)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Kerf (offset)</label>
          <div className="input-with-unit">
            <input
              type="number"
              value={kerf}
              onChange={(e) => setKerf(parseFloat(e.target.value) || 0)}
              step="0.01"
            />
            <span className="unit">{units}</span>
          </div>
        </div>

        <div className="control-group">
          <label>Feed Rate</label>
          <div className="input-with-unit">
            <input
              type="number"
              value={feedRate}
              onChange={(e) => setFeedRate(parseFloat(e.target.value) || 0)}
              step="10"
            />
            <span className="unit">{units}/min</span>
          </div>
        </div>

        <div className="control-group">
          <label>Scale</label>
          <input
            type="number"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
};
