
import React from "react";
import { ContoursPanel } from "../panels/ContoursPanel";
import { PathOptimizationPanel } from "../panels/PathOptimizationPanel";
import { MachinePanel } from "../panels/MachinePanel";
import { GCodePanel } from "../panels/GCodePanel";

export const RightPanel: React.FC = () => {
  return (
    <div className="right-panel">
      <ContoursPanel />
      <PathOptimizationPanel />
      <MachinePanel />
      <GCodePanel />
    </div>
  );
};
