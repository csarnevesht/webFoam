import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFoamCutStore } from "../../state/foamCutStore";

export const Preview3D: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const { optimizedPath, origin } = useFoamCutStore();

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1e1e1e);

        // Camera
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(50, 50, 100);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Grid
        const gridHelper = new THREE.GridHelper(200, 20);
        scene.add(gridHelper);

        // Axes
        const axesHelper = new THREE.AxesHelper(20);
        scene.add(axesHelper);

        // Render Path
        let line: THREE.Line | null = null;
        let geometry: THREE.BufferGeometry | null = null;
        let material: THREE.LineBasicMaterial | null = null;

        if (optimizedPath && optimizedPath.polyline.length > 0) {
            const points = optimizedPath.polyline.map(p => new THREE.Vector3(p.x - origin.x, p.y - origin.y, 0));
            geometry = new THREE.BufferGeometry().setFromPoints(points);
            material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
            line = new THREE.Line(geometry, material);
            scene.add(line);
        }

        // Animation Loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Simple rotation for now
            // if (line) line.rotation.y += 0.01;

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry?.dispose();
            material?.dispose();
            renderer.dispose();
        };
    }, [optimizedPath, origin]);

    return <div ref={mountRef} style={{ width: "100%", height: "300px" }} />;
};
