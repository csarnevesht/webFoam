import React from "react";
import { useWorkflowStore, WorkflowType } from "../../state/workflowStore";

export const WorkflowSelector: React.FC = () => {
    const setWorkflow = useWorkflowStore((state) => state.setWorkflow);

    const options: { id: WorkflowType; label: string; desc: string }[] = [
        {
            id: "TEXT",
            label: "Cut Text",
            desc: "Create and cut text using system fonts.",
        },
        {
            id: "2D_PARTS",
            label: "Cut 2D Parts",
            desc: "Import DXF/SVG or draw 2D parts for standard cutting.",
        },
        {
            id: "TAPERED",
            label: "Cut Tapered Parts",
            desc: "Cut parts with different root and tip profiles (4-Axis).",
        },
        {
            id: "ROTARY",
            label: "Rotary / TwistRot",
            desc: "Cut complex 3D shapes using a rotary axis.",
        },
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#1e1e1e",
            color: "#fff"
        }}>
            <h1 style={{ marginBottom: "2rem", fontSize: "2.5rem" }}>DevFoam Web</h1>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "2rem",
                maxWidth: "800px"
            }}>
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setWorkflow(opt.id)}
                        style={{
                            padding: "2rem",
                            backgroundColor: "#2d2d2d",
                            border: "1px solid #444",
                            borderRadius: "8px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3d3d3d")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2d2d2d")}
                    >
                        <h3 style={{ margin: "0 0 0.5rem 0", color: "#646cff" }}>{opt.label}</h3>
                        <p style={{ margin: 0, color: "#aaa" }}>{opt.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
