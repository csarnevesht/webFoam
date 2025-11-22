import React, { useState } from "react";
import { syncTaperedPaths } from "../../geometry/tapered";
import { generateGCode4Axis } from "../../geometry/gcode";
import { Point, Point4D } from "../../geometry/types";
import paper from "paper";
import { importDxfString } from "../../utils/dxfImport";

export const TaperedWizard: React.FC = () => {
    const [rootPath, setRootPath] = useState<Point[]>([]);
    const [tipPath, setTipPath] = useState<Point[]>([]);
    const [generatedPath, setGeneratedPath] = useState<Point4D[]>([]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'root' | 'tip') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();

        // Create a temporary project to parse the DXF
        const tempProject = new paper.Project(document.createElement('canvas'));
        try {
            const paths = importDxfString(text, tempProject);
            if (paths.length > 0 && paths[0].segments.length > 1) {
                // Extract points from the first path
                const points = paths[0].segments.map(s => ({ x: s.point.x, y: s.point.y }));
                // Close loop if needed
                if (paths[0].closed) {
                    points.push({ x: paths[0].firstSegment.point.x, y: paths[0].firstSegment.point.y });
                }

                if (type === 'root') setRootPath(points);
                else setTipPath(points);
            } else {
                alert("No valid path found in DXF");
            }
        } catch (err) {
            console.error(err);
            alert("Error parsing DXF");
        }
        tempProject.remove();
    };

    const handleGenerate = () => {
        if (rootPath.length === 0 || tipPath.length === 0) {
            alert("Please upload both Root and Tip profiles.");
            return;
        }
        const synced = syncTaperedPaths(rootPath, tipPath, 100);
        setGeneratedPath(synced);
    };

    const handleDownloadGCode = () => {
        if (generatedPath.length === 0) return;
        const gcode = generateGCode4Axis(generatedPath, {
            feedRate: 1000,
            units: "mm",
            origin: { x: 0, y: 0 },
            scale: 1,
            axisNames: { x: "X", y: "Y", u: "U", v: "V" }
        });
        const blob = new Blob([gcode], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tapered.nc";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: "2rem", display: "flex", gap: "2rem", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="panel" style={{ padding: "1rem", backgroundColor: "#2d2d2d", borderRadius: "8px" }}>
                    <h3>1. Root Profile (XY)</h3>
                    <input type="file" accept=".dxf" onChange={(e) => handleFileUpload(e, 'root')} />
                    <div style={{ marginTop: "0.5rem", color: rootPath.length ? "#4caf50" : "#aaa" }}>
                        {rootPath.length ? `Loaded ${rootPath.length} points` : "No file loaded"}
                    </div>
                </div>

                <div className="panel" style={{ padding: "1rem", backgroundColor: "#2d2d2d", borderRadius: "8px" }}>
                    <h3>2. Tip Profile (UV)</h3>
                    <input type="file" accept=".dxf" onChange={(e) => handleFileUpload(e, 'tip')} />
                    <div style={{ marginTop: "0.5rem", color: tipPath.length ? "#4caf50" : "#aaa" }}>
                        {tipPath.length ? `Loaded ${tipPath.length} points` : "No file loaded"}
                    </div>
                </div>

                <button className="primary" onClick={handleGenerate} disabled={!rootPath.length || !tipPath.length}>
                    Generate 4-Axis Path
                </button>

                {generatedPath.length > 0 && (
                    <div className="panel" style={{ padding: "1rem", backgroundColor: "#2d2d2d", borderRadius: "8px" }}>
                        <h3>3. Result</h3>
                        <p>Generated {generatedPath.length} synced points.</p>
                        <button className="primary" onClick={handleDownloadGCode}>Download G-Code</button>
                    </div>
                )}
            </div>

            <div style={{ flex: 2, backgroundColor: "#111", borderRadius: "8px", position: "relative" }}>
                {/* Simple SVG visualization */}
                <svg width="100%" height="100%" viewBox="-100 -100 400 400" style={{ position: "absolute", top: 0, left: 0 }}>
                    <g transform="translate(100, 100) scale(1, -1)">
                        {/* Root Path */}
                        <path
                            d={`M ${rootPath.map(p => `${p.x},${p.y}`).join(" L ")}`}
                            fill="none"
                            stroke="#4caf50"
                            strokeWidth="2"
                        />
                        {/* Tip Path */}
                        <path
                            d={`M ${tipPath.map(p => `${p.x},${p.y}`).join(" L ")}`}
                            fill="none"
                            stroke="#2196f3"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />
                        {/* Synced Lines */}
                        {generatedPath.map((p, i) => (
                            i % 5 === 0 && (
                                <line
                                    key={i}
                                    x1={p.x} y1={p.y}
                                    x2={p.u} y2={p.v}
                                    stroke="#ffffff"
                                    strokeOpacity="0.2"
                                />
                            )
                        ))}
                    </g>
                </svg>
                <div style={{ position: "absolute", bottom: "1rem", left: "1rem", color: "#aaa", fontSize: "0.8rem" }}>
                    <span style={{ color: "#4caf50" }}>Green: Root (XY)</span> | <span style={{ color: "#2196f3" }}>Blue: Tip (UV)</span>
                </div>
            </div>
        </div>
    );
};
