import { Point, Point4D } from "./types";

/**
 * Synchronizes two polylines (root and tip) to create a 4-axis path.
 * It resamples both paths to have the same number of points, matching them by
 * normalized accumulated length (0.0 to 1.0).
 */
export function syncTaperedPaths(
    rootPath: Point[],
    tipPath: Point[],
    samples: number = 100
): Point4D[] {
    if (rootPath.length < 2 || tipPath.length < 2) {
        return [];
    }

    const rootLen = getPathLength(rootPath);
    const tipLen = getPathLength(tipPath);

    const result: Point4D[] = [];

    for (let i = 0; i <= samples; i++) {
        const t = i / samples;

        // Get point at fraction t for both paths
        const pRoot = getPointAtFraction(rootPath, rootLen, t);
        const pTip = getPointAtFraction(tipPath, tipLen, t);

        result.push({
            x: pRoot.x,
            y: pRoot.y,
            u: pTip.x,
            v: pTip.y,
        });
    }

    return result;
}

function getPathLength(path: Point[]): number {
    let len = 0;
    for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        len += Math.hypot(dx, dy);
    }
    return len;
}

function getPointAtFraction(path: Point[], totalLen: number, t: number): Point {
    if (t <= 0) return path[0];
    if (t >= 1) return path[path.length - 1];

    const targetDist = totalLen * t;
    let currentDist = 0;

    for (let i = 1; i < path.length; i++) {
        const p1 = path[i - 1];
        const p2 = path[i];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segLen = Math.hypot(dx, dy);

        if (currentDist + segLen >= targetDist) {
            // Interpolate
            const remaining = targetDist - currentDist;
            const ratio = remaining / segLen;
            return {
                x: p1.x + dx * ratio,
                y: p1.y + dy * ratio,
            };
        }

        currentDist += segLen;
    }

    return path[path.length - 1];
}
