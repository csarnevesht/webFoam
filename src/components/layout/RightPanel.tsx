
import React from "react";
import { ContoursPanel } from "../panels/ContoursPanel";
import { PathOptimizationPanel } from "../panels/PathOptimizationPanel";
import { MachinePanel } from "../panels/MachinePanel";

export const RightPanel: React.FC = () => {
  return (
    <div className="right-panel">
      <ContoursPanel />
      <PathOptimizationPanel />
      <MachinePanel />
    </div>
  );
};
