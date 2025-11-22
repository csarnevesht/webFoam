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
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
            <div style={{
                width: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                backgroundColor: "#1e1e1e",
                borderRight: "1px solid #333",
                padding: "20px"
            }}>
                <h2 style={{
                    marginBottom: "10px",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <span style={{ color: "#64ffda" }}>✈️</span> Tapered Setup
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <h3 style={{ margin: 0, fontSize: "1rem", color: "#ddd" }}>1. Root Profile (XY)</h3>
                        <input
                            type="file"
                            accept=".dxf"
                            onChange={(e) => handleFileUpload(e, 'root')}
                            style={{ fontSize: "0.8rem", color: "#aaa" }}
                        />
                        <div style={{ fontSize: "0.8rem", color: rootPath.length ? "#4caf50" : "#666" }}>
                            {rootPath.length ? `Loaded ${rootPath.length} points` : "No file loaded"}
                        </div>
                    </div>

                    <div style={{ height: "1px", backgroundColor: "#333" }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <h3 style={{ margin: 0, fontSize: "1rem", color: "#ddd" }}>2. Tip Profile (UV)</h3>
                        <input
                            type="file"
                            accept=".dxf"
                            onChange={(e) => handleFileUpload(e, 'tip')}
                            style={{ fontSize: "0.8rem", color: "#aaa" }}
                        />
                        <div style={{ fontSize: "0.8rem", color: tipPath.length ? "#4caf50" : "#666" }}>
                            {tipPath.length ? `Loaded ${tipPath.length} points` : "No file loaded"}
                        </div>
                    </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "#333", margin: "0.5rem 0" }} />

                <button className="primary" onClick={handleGenerate} disabled={!rootPath.length || !tipPath.length} style={{ width: "100%" }}>
                    Generate 4-Axis Path
                </button>

                {generatedPath.length > 0 && (
                    <div className="panel" style={{ padding: "1rem", backgroundColor: "#252525", borderRadius: "8px", marginTop: "1rem" }}>
                        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>3. Result</h3>
                        <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "#aaa" }}>Generated {generatedPath.length} synced points.</p>
                        <button className="primary" onClick={handleDownloadGCode} style={{ width: "100%" }}>Download G-Code</button>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, backgroundColor: "#111", position: "relative" }}>
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
