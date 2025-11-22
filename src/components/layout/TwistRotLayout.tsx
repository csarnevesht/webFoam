import React, { useState } from "react";
import { TopBar } from "./TopBar";
import { LeftToolbar } from "./LeftToolbar";
import { RightPanel } from "./RightPanel";
import { useTwistRotStore, Point } from "../../state/twistRotStore";
import { parseDatFile } from "../../utils/datParser";
import { TwistRotCanvas } from "../canvas/TwistRotCanvas";
import { FileInput } from "../ui/FileInput";

export const TwistRotLayout: React.FC = () => {
    const {
        revolutionCurve,
        rotationCurve,
        twistCurve,
        setRevolutionCurve,
        setRotationCurve,
        setTwistCurve
    } = useTwistRotStore();

    // Local state for file names (since we can't easily get them from the store if we only store points)
    // In a real app, we might want to store metadata in the store too.
    const [fileNames, setFileNames] = useState({
        revolution: "",
        rotation: "",
        twist: ""
    });

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (curve: Point[] | null) => void,
        key: keyof typeof fileNames
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileNames(prev => ({ ...prev, [key]: file.name }));

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                const points = parseDatFile(content);
                setter(points);
                console.log("Parsed points:", points);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#121212" }}>
            <TopBar title="Rotary / TwistRot" icon="🌀" showActions={false} />
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                <LeftToolbar />

                {/* Configuration Sidebar */}
                <div style={{
                    width: "300px",
                    backgroundColor: "#1e1e1e",
                    borderRight: "1px solid #333",
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    overflowY: "auto"
                }}>
                    <h2 style={{
                        marginBottom: "24px",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <span style={{ color: "#00ff88" }}>🌀</span> TwistRot Setup
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <FileInput
                            label="Revolution Curve"
                            description="Defines the side profile"
                            accept=".dat"
                            onChange={(e) => handleFileUpload(e, setRevolutionCurve, 'revolution')}
                            fileName={fileNames.revolution}
                            pointCount={revolutionCurve?.length}
                        />

                        <FileInput
                            label="Rotation Curve"
                            description="Defines the cross-section"
                            accept=".dat"
                            onChange={(e) => handleFileUpload(e, setRotationCurve, 'rotation')}
                            fileName={fileNames.rotation}
                            pointCount={rotationCurve?.length}
                        />

                        <FileInput
                            label="Twist Curve"
                            description="Defines twist along height"
                            accept=".dat"
                            onChange={(e) => handleFileUpload(e, setTwistCurve, 'twist')}
                            fileName={fileNames.twist}
                            pointCount={twistCurve?.length}
                        />
                    </div>

                    <div style={{
                        marginTop: "auto",
                        padding: "16px",
                        backgroundColor: "#252525",
                        borderRadius: "8px",
                        border: "1px solid #333"
                    }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>Controls</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px", fontSize: "12px", color: "#aaa" }}>
                            <span>🖱️ Left</span> <span>Rotate</span>
                            <span>🖱️ Right</span> <span>Pan</span>
                            <span>🖱️ Wheel</span> <span>Zoom</span>
                        </div>
                    </div>
                </div>

                {/* Main Visualization Area */}
                <div style={{ flex: 1, position: "relative", backgroundColor: "#000" }}>
                    <TwistRotCanvas />

                    {/* Overlay Title */}
                    <div style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        pointerEvents: "none",
                        zIndex: 10
                    }}>
                        <h1 style={{
                            margin: 0,
                            color: "#fff",
                            fontSize: "24px",
                            fontWeight: 300,
                            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                        }}>
                            3D Preview
                        </h1>
                    </div>
                </div>

                <RightPanel />
            </div>
        </div>
    );
};
