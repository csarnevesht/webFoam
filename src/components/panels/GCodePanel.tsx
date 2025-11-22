import React, { useMemo, useState } from "react";
import { useFoamCutStore } from "../../state/foamCutStore";
import { generateGCode } from "../../geometry/gcode";

export const GCodePanel: React.FC = () => {
  const { optimizedPath, feedRate, units, origin, scale } = useFoamCutStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const gcode = useMemo(() => {
    if (!optimizedPath || optimizedPath.polyline.length === 0) {
      return "";
    }
    return generateGCode(optimizedPath.polyline, {
      feedRate,
      units,
      origin,
      scale,
    });
  }, [optimizedPath, feedRate, units, origin, scale]);

  const gcodeStats = useMemo(() => {
    if (!gcode) return null;
    const lines = gcode.split("\n");
    const moveCommands = lines.filter(l => l.startsWith("G0") || l.startsWith("G1")).length;
    return {
      totalLines: lines.length,
      moveCommands,
      rapidMoves: lines.filter(l => l.startsWith("G0")).length,
      feedMoves: lines.filter(l => l.startsWith("G1")).length,
    };
  }, [gcode]);

  const handleCopyToClipboard = () => {
    if (gcode) {
      navigator.clipboard.writeText(gcode);
      alert("G-code copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (gcode) {
      const blob = new Blob([gcode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "foamcut.nc";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3>G-code Preview</h3>
      </div>

      {!gcode ? (
        <div className="panel-empty-state">
          Generate a path to see G-code preview
        </div>
      ) : (
        <div className="panel-body">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Lines</span>
              <span className="stat-value">{gcodeStats?.totalLines || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rapid Moves</span>
              <span className="stat-value">{gcodeStats?.rapidMoves || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Feed Moves</span>
              <span className="stat-value">{gcodeStats?.feedMoves || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Units</span>
              <span className="stat-value">{units === "mm" ? "Metric" : "Imperial"}</span>
            </div>
          </div>

          <div className="control-group">
            <div className="gcode-preview-header">
              <button
                className="ghost small"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "▼ Collapse" : "▶ Expand"} Code
              </button>
              <div className="button-group">
                <button className="ghost small" onClick={handleCopyToClipboard}>
                  📋 Copy
                </button>
                <button className="primary small" onClick={handleDownload}>
                  💾 Download
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="gcode-preview">
                <pre className="gcode-content">
                  {gcode.split("\n").map((line, idx) => (
                    <div key={idx} className="gcode-line">
                      <span className="line-number">{(idx + 1).toString().padStart(4, " ")}</span>
                      <span className={`line-content ${line.startsWith("G0") ? "rapid" : line.startsWith("G1") ? "feed" : "command"}`}>
                        {line}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            )}
          </div>

          {!isExpanded && (
            <div className="control-group">
              <div className="info-box">
                <strong>First 5 lines:</strong>
                <pre className="gcode-snippet">
                  {gcode.split("\n").slice(0, 5).join("\n")}
                </pre>
              </div>
              <div className="info-box" style={{ marginTop: 8 }}>
                <strong>Last 3 lines:</strong>
                <pre className="gcode-snippet">
                  {gcode.split("\n").slice(-3).join("\n")}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
