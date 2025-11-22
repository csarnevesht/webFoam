import { Point } from "../state/twistRotStore";

/**
 * Parses a DAT file content string into an array of Points.
 * Assumes the format is "X Y" per line, separated by whitespace.
 * Ignores empty lines and lines that don't parse to two numbers.
 */
export const parseDatFile = (content: string): Point[] => {
    const points: Point[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);

            if (!isNaN(x) && !isNaN(y)) {
                points.push({ x, y });
            }
        }
    }

    return points;
};
