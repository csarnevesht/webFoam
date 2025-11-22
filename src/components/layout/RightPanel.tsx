
import React from "react";
import { ContoursPanel } from "../panels/ContoursPanel";
import { GCodePanel } from "../panels/GCodePanel";
import { Preview3DPanel } from "../panels/Preview3DPanel";

export const RightPanel: React.FC = () => {
  return (
    <div className="right-panel">
      <ContoursPanel />
      <GCodePanel />
      <Preview3DPanel />
    </div>
  );
};
