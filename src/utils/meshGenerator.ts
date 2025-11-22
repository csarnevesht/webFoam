import * as THREE from "three";
import { Point } from "../state/twistRotStore";

// Helper to interpolate a value from a curve (sorted by Y or X depending on usage)
const interpolate = (curve: Point[], value: number, valueKey: 'x' | 'y', resultKey: 'x' | 'y'): number => {
    if (!curve || curve.length === 0) return 0;
    if (curve.length === 1) return curve[0][resultKey];

    // Find segment
    for (let i = 0; i < curve.length - 1; i++) {
        const p1 = curve[i];
        const p2 = curve[i + 1];
        const v1 = p1[valueKey];
        const v2 = p2[valueKey];

        if ((value >= v1 && value <= v2) || (value >= v2 && value <= v1)) {
            const t = (value - v1) / (v2 - v1);
            return p1[resultKey] + t * (p2[resultKey] - p1[resultKey]);
        }
    }

    // Extrapolate or clamp? Let's clamp to ends
    const first = curve[0];
    const last = curve[curve.length - 1];
    if (Math.abs(value - first[valueKey]) < Math.abs(value - last[valueKey])) {
        return first[resultKey];
    } else {
        return last[resultKey];
    }
};

export const generateTwistRotGeometry = (
    revolutionCurve: Point[] | null,
    rotationCurve: Point[] | null,
    twistCurve: Point[] | null
): THREE.BufferGeometry | null => {
    if (!revolutionCurve || !rotationCurve || revolutionCurve.length < 2 || rotationCurve.length < 3) {
        return null;
    }

    // 1. Determine height range from Revolution Curve (assuming Y is height)
    let minY = Infinity;
    let maxY = -Infinity;
    revolutionCurve.forEach(p => {
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });

    const height = maxY - minY;
    if (height <= 0) return null;

    // 2. Settings
    const heightSegments = 100;
    const vertices: number[] = [];
    const indices: number[] = [];

    // 3. Generate vertices
    for (let i = 0; i <= heightSegments; i++) {
        const t = i / heightSegments;
        const currentY = minY + t * height;

        // Get Radius from Revolution Curve (X is radius, Y is height)
        // We interpolate X based on current Y
        const radius = interpolate(revolutionCurve, currentY, 'y', 'x');

        // Get Twist Angle from Twist Curve (X is height, Y is angle in degrees)
        // If no twist curve, angle is 0
        let twistAngle = 0;
        if (twistCurve && twistCurve.length > 0) {
            twistAngle = interpolate(twistCurve, currentY, 'x', 'y');
        }
        const twistRad = (twistAngle * Math.PI) / 180;

        // Generate ring of points from Rotation Curve
        // Rotation curve is the cross-section shape (X, Y)
        // We need to scale it by radius (assuming rotation curve is normalized or relative)
        // Actually, usually rotation curve defines the shape, and revolution curve defines the scale factor?
        // Let's assume Revolution Curve X is a scale factor if Rotation Curve is "unit" size,
        // OR Revolution Curve X is the actual radius and Rotation Curve is the shape normalized to 1.
        // Let's assume: Final Point = RotationPoint * (Radius / MaxRotationRadius) * RotationMatrix(Twist)
        // For simplicity: Scale = Radius.

        // We need to close the loop for the mesh if rotation curve is closed
        // Let's assume rotation curve is a loop.

        const cosT = Math.cos(twistRad);
        const sinT = Math.sin(twistRad);

        for (let j = 0; j < rotationCurve.length; j++) {
            const p = rotationCurve[j];

            // Scale
            // If radius is 0, point is on axis
            const sx = p.x * (radius / 10); // normalization factor? Let's just use radius directly for now? 
            // If revolution curve X is e.g. 10, and rotation curve is 10 wide, result is 100?
            // Usually Revolution Curve defines the outer envelope.
            // Let's assume we just multiply. If it's too big we can adjust.
            // A common way: Revolution X is the distance from center to the surface.
            // Rotation curve defines the shape relative to a unit circle.
            // Let's just do: x = p.x * radius * 0.1, y = p.y * radius * 0.1 (arbitrary scale fix)
            // Or better: just p.x + radius? No.
            // Let's stick to: p.x * radius / 10.

            const scaledX = p.x * (radius > 0 ? radius / 10 : 0);
            const scaledY = p.y * (radius > 0 ? radius / 10 : 0);

            // Rotate (Twist)
            const rx = scaledX * cosT - scaledY * sinT;
            const ry = scaledX * sinT + scaledY * cosT;

            // Push vertex (x, z, -y) -> Three.js Y is up.
            // Let's map:
            // Curve Y -> Three.js Y (Height)
            // Curve X/Y (Rotation) -> Three.js X/Z (Plane)
            vertices.push(rx, currentY, ry);
        }
    }

    // 4. Generate indices
    const pointsPerRing = rotationCurve.length;
    for (let i = 0; i < heightSegments; i++) {
        for (let j = 0; j < pointsPerRing; j++) {
            const nextJ = (j + 1) % pointsPerRing;

            const a = i * pointsPerRing + j;
            const b = i * pointsPerRing + nextJ;
            const c = (i + 1) * pointsPerRing + j;
            const d = (i + 1) * pointsPerRing + nextJ;

            // Two triangles per quad
            // a - b
            // | / |
            // c - d
            indices.push(a, c, b);
            indices.push(b, c, d);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
};
