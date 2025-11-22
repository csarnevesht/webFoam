import React, { useState } from "react";
import { useFoamCutStore } from "../../state/foamCutStore";
import opentype from "opentype.js";
import paper from "paper";

export const TextGeneratorPanel: React.FC = () => {
    const [expanded, setExpanded] = useState(true);
    const [text, setText] = useState("HELLO");
    const [fontSize, setFontSize] = useState(50);
    const [fontUrl, setFontUrl] = useState("https://unpkg.com/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf");
    const [status, setStatus] = useState<string>("");
    const { setContours } = useFoamCutStore();

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
                // If no project (unlikely in this view), create one
                project = new paper.Project(document.createElement('canvas'));
            }

            // Clear existing items if we want to replace? Or just append?
            // For a "Generator", replacing seems appropriate for the "Text" workflow, 
            // but maybe we want to add to existing? 
            // Let's stick to replacing for now to match the Wizard behavior, 
            // but we could add a "Append" checkbox later.

            const paperPath = project.importSVG(`<path d="${svgPathData}" />`);

            if (!paperPath) {
                setStatus("Failed to create path from font data");
                return;
            }

            const contours: any[] = [];

            const processItem = (item: paper.Item, idx: number) => {
                if (item instanceof paper.Path) {
                    if (!item.closed) item.closed = true;
                    item.strokeColor = new paper.Color(0.2, 0.4, 1);
                    item.strokeWidth = 2;
                    item.fillColor = null;
                    // Center the text roughly
                    // item.position = item.position.add(new paper.Point(100, 100));

                    contours.push({
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
            setContours(contours);
            setStatus(`Generated ${contours.length} contours.`);

            // Fit view
            setTimeout(() => {
                if (paper.view) {
                    // Simple zoom extents logic could go here or be triggered by a global event
                    // For now, rely on user zooming or the initial fit
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

    return (
        <div className="panel">
            <div className="panel-header" onClick={() => setExpanded(!expanded)}>
                <h3>Text Generator</h3>
                <span>{expanded ? "▼" : "▶"}</span>
            </div>

            {expanded && (
                <div className="panel-content">
                    <div className="control-group">
                        <label>Text</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="control-group">
                        <label>Size (mm)</label>
                        <input
                            type="number"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Font URL</label>
                        <input
                            type="text"
                            value={fontUrl}
                            onChange={(e) => setFontUrl(e.target.value)}
                            placeholder="https://..."
                            style={{ fontSize: '0.8rem' }}
                        />
                    </div>

                    <div className="control-group">
                        <label>Or Upload Font</label>
                        <input
                            type="file"
                            accept=".ttf,.otf,.woff"
                            onChange={handleFontUpload}
                            style={{ fontSize: '0.8rem' }}
                        />
                    </div>

                    <button className="primary" onClick={handleGenerate} style={{ width: '100%', marginTop: '1rem' }}>
                        Generate Text
                    </button>

                    {status && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: status.includes("Error") ? "#ff6b6b" : "#4caf50" }}>
                            {status}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
