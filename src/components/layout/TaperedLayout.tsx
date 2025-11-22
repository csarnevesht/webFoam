import React from "react";
import { useWorkflowStore } from "../../state/workflowStore";
import { TaperedWizard } from "../panels/TaperedWizard";

export const TaperedLayout: React.FC = () => {
    const setWorkflow = useWorkflowStore((state) => state.setWorkflow);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <div className="topbar">
                <div className="topbar-left">
                    <button
                        className="ghost"
                        onClick={() => setWorkflow('HOME')}
                        style={{ marginRight: '1rem' }}
                    >
                        🏠 Home
                    </button>
                    <div className="logo">
                        <div className="logo-icon">📐</div>
                        <span className="logo-text">Tapered Parts</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
                <TaperedWizard />
            </div>
        </div>
    );
};
