import React from "react";
import { useWorkflowStore } from "../../state/workflowStore";
import { TopBar } from "./TopBar";
import { TaperedWizard } from "../panels/TaperedWizard";

export const TaperedLayout: React.FC = () => {
    const setWorkflow = useWorkflowStore((state) => state.setWorkflow);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <TopBar title="Tapered Parts" icon="📐" showActions={false} />

            <div style={{ flex: 1, overflow: "hidden", background: "var(--bg-canvas)" }}>
                <TaperedWizard />
            </div>
        </div>
    );
};
