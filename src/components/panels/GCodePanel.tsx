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
        <span style={{ color: "#e91e63" }}>📄</span> G-code Preview
      </h2>

      {!gcode ? (
        <div style={{
          padding: "2rem 1rem",
          backgroundColor: "#252525",
          borderRadius: "6px",
          color: "#888",
          fontSize: "0.9rem",
          textAlign: "center",
          border: "1px dashed #444"
        }}>
          Generate a path to see G-code preview
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            backgroundColor: "#252525",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #333"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.75rem", color: "#aaa" }}>Total Lines</span>
              <span style={{ fontSize: "0.9rem", color: "#fff", fontFamily: "monospace" }}>{gcodeStats?.totalLines || 0}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.75rem", color: "#aaa" }}>Rapid Moves</span>
              <span style={{ fontSize: "0.9rem", color: "#fff", fontFamily: "monospace" }}>{gcodeStats?.rapidMoves || 0}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.75rem", color: "#aaa" }}>Feed Moves</span>
              <span style={{ fontSize: "0.9rem", color: "#fff", fontFamily: "monospace" }}>{gcodeStats?.feedMoves || 0}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.75rem", color: "#aaa" }}>Units</span>
              <span style={{ fontSize: "0.9rem", color: "#fff" }}>{units === "mm" ? "Metric" : "Imperial"}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#aaa",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                {isExpanded ? "▼ Collapse" : "▶ Expand"} Code
              </button>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={handleCopyToClipboard}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    backgroundColor: "#333",
                    border: "1px solid #444",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  📋 Copy
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    backgroundColor: "#2196f3",
                    border: "none",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  💾 Download
                </button>
              </div>
            </div>

            {isExpanded ? (
              <div style={{
                backgroundColor: "#111",
                borderRadius: "6px",
                border: "1px solid #333",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "0.5rem"
              }}>
                <pre style={{ margin: 0, fontSize: "0.8rem", fontFamily: "monospace", lineHeight: "1.4" }}>
                  {gcode.split("\n").map((line, idx) => (
                    <div key={idx} style={{ display: "flex" }}>
                      <span style={{ color: "#444", width: "30px", textAlign: "right", marginRight: "10px", userSelect: "none" }}>
                        {idx + 1}
                      </span>
                      <span style={{
                        color: line.startsWith("G0") ? "#ff9800" :
                          line.startsWith("G1") ? "#4caf50" :
                            line.startsWith(";") ? "#666" : "#ddd"
                      }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ backgroundColor: "#111", borderRadius: "4px", padding: "0.5rem", border: "1px solid #333" }}>
                  <div style={{ fontSize: "0.7rem", color: "#666", marginBottom: "4px" }}>First 5 lines:</div>
                  <pre style={{ margin: 0, fontSize: "0.8rem", fontFamily: "monospace", color: "#888" }}>
                    {gcode.split("\n").slice(0, 5).join("\n")}
                  </pre>
                </div>
                <div style={{ backgroundColor: "#111", borderRadius: "4px", padding: "0.5rem", border: "1px solid #333" }}>
                  <div style={{ fontSize: "0.7rem", color: "#666", marginBottom: "4px" }}>Last 3 lines:</div>
                  <pre style={{ margin: 0, fontSize: "0.8rem", fontFamily: "monospace", color: "#888" }}>
                    {gcode.split("\n").slice(-3).join("\n")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
