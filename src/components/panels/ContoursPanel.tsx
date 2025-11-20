
import React from "react";
import { useFoamCutStore } from "../../state/foamCutStore";
export const ContoursPanel: React.FC = () => {
  const contours = useFoamCutStore((s) => s.contours);
  return (
    <div style={{ marginBottom: 8 }}>
      <h4>Contours</h4>
      <ul>{contours.map((c) => <li key={c.id}>{c.id}</li>)}</ul>
    </div>
  );
};
