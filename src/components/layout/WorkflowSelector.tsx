import React from "react";
import { useWorkflowStore, WorkflowType } from "../../state/workflowStore";

export const WorkflowSelector: React.FC = () => {
    const setWorkflow = useWorkflowStore((state) => state.setWorkflow);

    const options: { id: WorkflowType; label: string; desc: string; icon: string; color: string }[] = [
        {
            id: "TEXT",
            label: "Cut Text",
            desc: "Create and cut text using system fonts.",
            icon: "🔤",
            color: "#646cff"
        },
        {
            id: "2D_PARTS",
            label: "Cut 2D Parts",
            desc: "Import DXF/SVG or draw 2D parts for standard cutting.",
            icon: "📐",
            color: "#ff6464"
        },
        {
            id: "TAPERED",
            label: "Cut Tapered Parts",
            desc: "Cut parts with different root and tip profiles (4-Axis).",
            icon: "✈️",
            color: "#64ffda"
        },
        {
            id: "ROTARY",
            label: "Rotary / TwistRot",
            desc: "Cut complex 3D shapes using a rotary axis.",
            icon: "🌀",
            color: "#00ff88"
        },
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#121212",
            backgroundImage: "radial-gradient(circle at 50% 50%, #1e1e1e 0%, #000000 100%)",
            color: "#fff",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h1 style={{
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    margin: "0 0 0.5rem 0",
                    background: "linear-gradient(45deg, #646cff, #00ff88)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    DevFoam Web
                </h1>
                <p style={{ fontSize: "1.1rem", color: "#888" }}>Select a workflow to begin</p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "2rem",
                maxWidth: "900px",
                width: "90%",
                padding: "1rem"
            }}>
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setWorkflow(opt.id)}
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "2.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "16px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                            backdropFilter: "blur(10px)",
                            overflow: "hidden"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.borderColor = opt.color;
                            e.currentTarget.style.boxShadow = `0 10px 30px -10px ${opt.color}40`;
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                        }}
                    >
                        <div style={{
                            fontSize: "3rem",
                            marginBottom: "1.5rem",
                            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))"
                        }}>
                            {opt.icon}
                        </div>
                        <h3 style={{
                            margin: "0 0 0.5rem 0",
                            color: "#fff",
                            fontSize: "1.5rem",
                            fontWeight: 600
                        }}>
                            {opt.label}
                        </h3>
                        <p style={{
                            margin: 0,
                            color: "#aaa",
                            fontSize: "1rem",
                            lineHeight: 1.5
                        }}>
                            {opt.desc}
                        </p>

                        {/* Decorative gradient glow */}
                        <div style={{
                            position: "absolute",
                            top: "-50%",
                            right: "-50%",
                            width: "200px",
                            height: "200px",
                            background: `radial-gradient(circle, ${opt.color}20 0%, transparent 70%)`,
                            borderRadius: "50%",
                            pointerEvents: "none"
                        }} />
                    </button>
                ))}
            </div>
        </div>
    );
};
