import React, { useRef } from "react";

interface FileInputProps {
    label: string;
    description?: string;
    accept?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileName?: string;
    pointCount?: number;
}

export const FileInput: React.FC<FileInputProps> = ({
    label,
    description,
    accept,
    onChange,
    fileName,
    pointCount
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            onClick={handleClick}
            style={{
                padding: "16px",
                backgroundColor: "#2d2d2d",
                borderRadius: "8px",
                border: "1px solid #444",
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#353535";
                e.currentTarget.style.borderColor = "#555";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#2d2d2d";
                e.currentTarget.style.borderColor = "#444";
            }}
        >
            <input
                type="file"
                ref={inputRef}
                accept={accept}
                onChange={onChange}
                style={{ display: "none" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h3 style={{
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#fff"
                    }}>
                        {label}
                    </h3>
                    {description && (
                        <p style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#aaa"
                        }}>
                            {description}
                        </p>
                    )}
                </div>
                {pointCount !== undefined && pointCount > 0 && (
                    <div style={{
                        backgroundColor: "#00ff8820",
                        color: "#00ff88",
                        fontSize: "11px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: 600
                    }}>
                        LOADED
                    </div>
                )}
            </div>

            <div style={{
                marginTop: "12px",
                fontSize: "12px",
                color: fileName ? "#fff" : "#666",
                display: "flex",
                alignItems: "center",
                gap: "6px"
            }}>
                <span style={{ fontSize: "14px" }}>{fileName ? "📄" : "📁"}</span>
                <span style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px"
                }}>
                    {fileName || "Click to select file..."}
                </span>
            </div>

            {pointCount !== undefined && pointCount > 0 && (
                <div style={{
                    marginTop: "4px",
                    fontSize: "11px",
                    color: "#888",
                    marginLeft: "24px"
                }}>
                    {pointCount} points
                </div>
            )}
        </div>
    );
};
