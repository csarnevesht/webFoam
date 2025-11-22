import React, { useState } from "react";
import { Preview3D } from "../canvas/Preview3D";

export const Preview3DPanel: React.FC = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="panel">
            <div className="panel-header" onClick={() => setExpanded(!expanded)}>
                <h3>3D Preview</h3>
                <span>{expanded ? "▼" : "▶"}</span>
            </div>
            {expanded && (
                <div className="panel-content">
                    <Preview3D />
                </div>
            )}
        </div>
    );
};
