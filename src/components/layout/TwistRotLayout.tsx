import React, { useRef } from "react";
import { TopBar } from "./TopBar";
import { LeftToolbar } from "./LeftToolbar";
import { RightPanel } from "./RightPanel";
import { useTwistRotStore, Point } from "../../state/twistRotStore";
import { parseDatFile } from "../../utils/datParser";
import { TwistRotCanvas } from "../canvas/TwistRotCanvas";

export const TwistRotLayout: React.FC = () => {
    const {
        revolutionCurve,
        rotationCurve,
        twistCurve,
        setRevolutionCurve,
        setRotationCurve,
        setTwistCurve
    } = useTwistRotStore();

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (curve: Point[] | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <TopBar />
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                <LeftToolbar />

                {/* Main Content Area */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#1e1e1e", color: "#fff", padding: "20px" }}>
                    <h2 style={{ marginBottom: "20px" }}>TwistRot Configuration</h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "40px" }}>
                        {/* Revolution Curve */}
                        <div style={{ padding: "15px", backgroundColor: "#2d2d2d", borderRadius: "8px" }}>
                            <h3>Revolution Curve</h3>
                            <p style={{ fontSize: "0.9em", color: "#aaa", marginBottom: "10px" }}>Defines the side profile.</p>
                            <input
                                type="file"
                                accept=".dat"
                                onChange={(e) => handleFileUpload(e, setRevolutionCurve)}
                                style={{ marginBottom: "10px" }}
                            />
                            <div style={{ height: "150px", border: "1px dashed #444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {revolutionCurve ? `${revolutionCurve.length} points loaded` : "No file loaded"}
                            </div>
                        </div>

                        {/* Rotation Curve */}
                        <div style={{ padding: "15px", backgroundColor: "#2d2d2d", borderRadius: "8px" }}>
                            <h3>Rotation Curve</h3>
                            <p style={{ fontSize: "0.9em", color: "#aaa", marginBottom: "10px" }}>Defines the cross-section shape.</p>
                            <input
                                type="file"
                                accept=".dat"
                                onChange={(e) => handleFileUpload(e, setRotationCurve)}
                                style={{ marginBottom: "10px" }}
                            />
                            <div style={{ height: "150px", border: "1px dashed #444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {rotationCurve ? `${rotationCurve.length} points loaded` : "No file loaded"}
                            </div>
                        </div>

                        {/* Twist Curve */}
                        <div style={{ padding: "15px", backgroundColor: "#2d2d2d", borderRadius: "8px" }}>
                            <h3>Twist Curve</h3>
                            <p style={{ fontSize: "0.9em", color: "#aaa", marginBottom: "10px" }}>Defines the twist along height.</p>
                            <input
                                type="file"
                                accept=".dat"
                                onChange={(e) => handleFileUpload(e, setTwistCurve)}
                                style={{ marginBottom: "10px" }}
                            />
                            <div style={{ height: "150px", border: "1px dashed #444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {twistCurve ? `${twistCurve.length} points loaded` : "No file loaded"}
                            </div>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div style={{ flex: 1, backgroundColor: "#000", borderRadius: "8px", overflow: "hidden" }}>
                        <TwistRotCanvas />
                    </div>
                </div>

                <RightPanel />
            </div>
        </div>
    );
};
