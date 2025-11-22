import React from "react";
import { useWorkflowStore } from "../../state/workflowStore";
import { TextWizard } from "../panels/TextWizard";

export const TextLayout: React.FC = () => {
    const setWorkflow = useWorkflowStore((state) => state.setWorkflow);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <div className="topbar">
                <div className="topbar-left">
                    <button
                        className="ghost"
                        onClick={() => setWorkflow('HOME')}
                        style={{ marginRight: '1rem' }}
                        title="Home"
                    >
                        🏠
                    </button>
                    <div className="logo">
                        <span className="logo-icon">🔤</span>
                        <span className="logo-text" style={{
                            background: "linear-gradient(45deg, #fff, #888)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Text Cutter
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, overflow: "hidden", background: "var(--bg-canvas)" }}>
                <TextWizard />
            </div>
        </div>
    );
};
