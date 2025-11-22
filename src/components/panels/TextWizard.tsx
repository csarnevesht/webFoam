import React, { useState, useEffect } from "react";
import { useFoamCutStore } from "../../state/foamCutStore";
import { generateGCode } from "../../geometry/gcode";
import { runFullOptimization } from "../../geometry/pipeline";
import { Canvas2D } from "../canvas/Canvas2D";
import opentype from "opentype.js";
import paper from "paper";

export const TextWizard: React.FC = () => {
    const [text, setText] = useState("HELLO");
    const [fontSize, setFontSize] = useState(50);
    const [fontUrl, setFontUrl] = useState("https://unpkg.com/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf");
    const [status, setStatus] = useState<string>("");
    const [gcode, setGcode] = useState<string>("");
    const [showGCode, setShowGCode] = useState(false);

    const { setContours, setOptimizedPath, contours, optimizedPath, origin, feedRate, units, scale } = useFoamCutStore();

    // Reset GCode when text changes
    useEffect(() => {
        setGcode("");
    }, [text, fontSize, fontUrl]);

    const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const buffer = event.target?.result as ArrayBuffer;
                const font = opentype.parse(buffer);
                generatePathFromFont(font);
            } catch (err) {
                setStatus(`Error parsing font file: ${err}`);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const generatePathFromFont = (font: opentype.Font) => {
        setStatus("Generating paths...");

        try {
            const path = font.getPath(text, 0, fontSize, fontSize);
            const svgPathData = path.toPathData(2);

            let project = paper.project;
            if (!project) {
                // Canvas2D should have initialized it, but just in case
                project = new paper.Project(document.createElement('canvas'));
            }

            // Clear previous paths from the active layer to avoid duplicates
            project.activeLayer.removeChildren();

            const paperPath = project.importSVG(`<path d="${svgPathData}" />`);

            if (!paperPath) {
                setStatus("Failed to create path from font data");
                return;
            }

            const newContours: any[] = [];

            const processItem = (item: paper.Item, idx: number) => {
                if (item instanceof paper.Path) {
                    if (!item.closed) item.closed = true;
                    item.strokeColor = new paper.Color(0.2, 0.4, 1);
                    item.strokeWidth = 2;
                    item.fillColor = null;

                    newContours.push({
                        id: `char_${Date.now()}_${idx}`,
                        path: item,
                        isHole: false,
                        islandId: `island_${Date.now()}_${idx}`,
                        bounds: item.bounds ? {
                            x: item.bounds.x,
                            y: item.bounds.y,
                            width: item.bounds.width,
                            height: item.bounds.height,
                        } : undefined,
                        area: item.area
                    });
                } else if (item instanceof paper.CompoundPath || item instanceof paper.Group) {
                    if (item.children) {
                        item.children.forEach((child, childIdx) => processItem(child, idx * 100 + childIdx));
                    }
                }
            };

            processItem(paperPath, 0);
            setContours(newContours);

            // Auto-optimize to generate path
            const optimized = runFullOptimization(newContours, { origin });
            if (optimized) {
                setOptimizedPath(optimized);
                setStatus(`Generated ${newContours.length} contours and optimized path.`);
            } else {
                setStatus(`Generated ${newContours.length} contours.`);
            }

            // Fit view
            setTimeout(() => {
                if (paper.view && paperPath.bounds) {
                    paper.view.center = paperPath.bounds.center;
                    paper.view.zoom = Math.min(
                        paper.view.viewSize.width / paperPath.bounds.width,
                        paper.view.viewSize.height / paperPath.bounds.height
                    ) * 0.8;
                }
            }, 100);

        } catch (err) {
            setStatus(`Error generating path: ${err}`);
        }
    };

    const handleGenerate = async () => {
        setStatus("Loading font...");
        try {
            opentype.load(fontUrl, (err, font) => {
                if (err) {
                    setStatus(`Error loading font: ${err}`);
                    return;
                }
                if (!font) {
                    setStatus("Font loaded but object is null");
                    return;
                }
                generatePathFromFont(font);
            });
        } catch (e) {
            setStatus(`Error: ${e}`);
        }
    };

    const handleGenerateGCode = () => {
        if (!optimizedPath) {
            alert("No path generated. Please click 'Generate Paths' first.");
            return;
        }
        const code = generateGCode(optimizedPath.polyline, { feedRate, units, origin, scale });
        setGcode(code);
        setShowGCode(true);
    };

    const handleZoomIn = () => {
        if (paper.view) paper.view.zoom *= 1.2;
    };

    const handleZoomOut = () => {
        if (paper.view) paper.view.zoom /= 1.2;
    };

    const handleFitView = () => {
        if (paper.view && contours.length > 0) {
            // Logic to fit all contours
            // For now just reset
            paper.view.zoom = 1;
            paper.view.center = new paper.Point(0, 0);
        }
    };

    return (
        <div style={{ padding: "1rem", display: "flex", gap: "1rem", height: "100%" }}>
            <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto" }}>
                <div className="panel" style={{ padding: "1rem", backgroundColor: "#2d2d2d", borderRadius: "8px" }}>
                    <h3>Text Settings</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label>Text to Cut</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ padding: "0.5rem", fontSize: "1.2rem" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label>Font Size (mm)</label>
                        <input
                            type="number"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            style={{ padding: "0.5rem" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label>Font Source</label>
                        <input
                            type="text"
                            value={fontUrl}
                            onChange={(e) => setFontUrl(e.target.value)}
                            style={{ padding: "0.5rem" }}
                            placeholder="https://..."
                        />
                        <div style={{ marginTop: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', color: '#aaa' }}>Or upload local font (TTF/OTF):</label>
                            <input
                                type="file"
                                accept=".ttf,.otf,.woff"
                                onChange={handleFontUpload}
                            />
                        </div>
                    </div>
                </div>

                <button className="primary" onClick={handleGenerate}>
                    Generate Paths
                </button>

                <button className="secondary" onClick={handleGenerateGCode} disabled={!optimizedPath}>
                    Generate & Show G-Code
                </button>

                {status && (
                    <div className="info-box" style={{ padding: "1rem", backgroundColor: "#333", borderRadius: "4px", color: status.includes("Error") ? "#ff6b6b" : "#4caf50" }}>
                        {status}
                    </div>
                )}

                {showGCode && (
                    <div className="panel" style={{ padding: "1rem", backgroundColor: "#2d2d2d", borderRadius: "8px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>G-Code</h3>
                            <button className="ghost" onClick={() => setShowGCode(false)}>Close</button>
                        </div>
                        <textarea
                            value={gcode}
                            readOnly
                            style={{ width: "100%", flex: 1, minHeight: "150px", fontFamily: "monospace", backgroundColor: "#111", color: "#0f0", border: "none", padding: "0.5rem" }}
                        />
                        <button className="primary" style={{ marginTop: '0.5rem' }} onClick={() => {
                            const blob = new Blob([gcode], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "text_cut.nc";
                            a.click();
                        }}>Download .nc</button>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, backgroundColor: "#111", borderRadius: "8px", position: "relative", overflow: "hidden" }}>
                <Canvas2D />

                {/* Overlay Controls */}
                <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
                    <button className="icon-btn" onClick={handleZoomIn} title="Zoom In">➕</button>
                    <button className="icon-btn" onClick={handleZoomOut} title="Zoom Out">➖</button>
                    <button className="icon-btn" onClick={handleFitView} title="Fit View">Target</button>
                </div>
                <div style={{ position: "absolute", top: "1rem", left: "1rem", color: "#aaa", pointerEvents: "none" }}>
                    Use mouse wheel to zoom, drag to pan.
                </div>
            </div>
        </div>
    );
};
