import React from "react";
import { useWorkflowStore } from "../../state/workflowStore";
import { TopBar } from "./TopBar";
import { TextWizard } from "../panels/TextWizard";

export const TextLayout: React.FC = () => {
    const setWorkflow = useWorkflowStore((state) => state.setWorkflow);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <TopBar title="Text Cutter" icon="🔤" showActions={false} />

            <div style={{ flex: 1, overflow: "hidden", background: "var(--bg-canvas)" }}>
                <TextWizard />
            </div>
        </div>
    );
};
