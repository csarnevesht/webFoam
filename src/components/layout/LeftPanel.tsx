import React from "react";
import { PathOptimizationPanel } from "../panels/PathOptimizationPanel";
import { MachinePanel } from "../panels/MachinePanel";

export const LeftPanel: React.FC = () => {
    return (
        <div className="left-panel" style={{
            width: "300px",
            backgroundColor: "#1e1e1e",
            borderRight: "1px solid #333",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto"
        }}>
            <PathOptimizationPanel />
            <MachinePanel />
        </div>
    );
};
