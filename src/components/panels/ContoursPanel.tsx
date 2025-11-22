import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export const ContoursPanel: React.FC = () => {
  const contours = useFoamCutStore((s) => s.contours);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: 600,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span style={{ color: "#ff9800" }}>✏️</span> Contours
        </h2>
        <span style={{ fontSize: "0.8rem", color: "#666", backgroundColor: "#252525", padding: "2px 8px", borderRadius: "12px" }}>
          {contours.length}
        </span>
      </div>

      {contours.length === 0 ? (
        <div style={{
          padding: "2rem 1rem",
          backgroundColor: "#252525",
          borderRadius: "6px",
          color: "#888",
          fontSize: "0.9rem",
          textAlign: "center",
          border: "1px dashed #444",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <span>No contours loaded</span>
          <span style={{ fontSize: "0.8rem", color: "#666" }}>Import a DXF/SVG or draw something</span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
          {contours.map((c) => (
            <div key={c.id} style={{
              backgroundColor: "#252525",
              borderRadius: "6px",
              padding: "0.75rem",
              border: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.85rem", color: "#ddd", fontFamily: "monospace" }}>
                  {c.id.length > 15 ? c.id.substring(0, 12) + '...' : c.id}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  {c.path?.segments.length || 0} pts • {c.isHole ? 'Hole' : 'Outer'}
                </span>
              </div>
              <div style={{
                fontSize: "0.7rem",
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: c.path?.closed ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 152, 0, 0.1)",
                color: c.path?.closed ? "#4caf50" : "#ff9800",
                border: `1px solid ${c.path?.closed ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 152, 0, 0.2)"}`
              }}>
                {c.path?.closed ? 'Closed' : 'Open'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
