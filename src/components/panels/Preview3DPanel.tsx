import React, { useState } from "react";
import { Preview3D } from "../canvas/Preview3D";

export const Preview3DPanel: React.FC = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="panel-card">
            <div className="panel-header" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>3D Preview</h3>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{expanded ? "▼" : "▶"}</span>
            </div>
            {expanded && (
                <div className="panel-body" style={{ padding: 0, overflow: 'hidden', borderRadius: '6px' }}>
                    <Preview3D />
                </div>
            )}
        </div>
    );
};
