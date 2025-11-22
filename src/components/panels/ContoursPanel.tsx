import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";

export const ContoursPanel: React.FC = () => {
  const contours = useFoamCutStore((s) => s.contours);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3>Contours</h3>
        <div className="panel-description">
          {contours.length} contour{contours.length !== 1 ? 's' : ''} detected
        </div>
      </div>

      <div className="panel-body">
        {contours.length === 0 ? (
          <div className="panel-empty-state">
            No contours loaded. Import a DXF/SVG or draw something.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {contours.map((c) => (
              <div key={c.id} className="contour-item">
                <div className="contour-info">
                  <span className="contour-id">{c.id}</span>
                  <span className="contour-meta">
                    {c.path?.segments.length || 0} pts • {c.isHole ? 'Hole' : 'Outer'}
                  </span>
                </div>
                <div className="badge" style={{ background: c.path?.closed ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                  {c.path?.closed ? 'Closed' : 'Open'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
