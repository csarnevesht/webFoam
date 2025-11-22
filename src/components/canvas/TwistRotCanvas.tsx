import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useTwistRotStore } from "../../state/twistRotStore";
import { generateTwistRotGeometry } from "../../utils/meshGenerator";

export const TwistRotCanvas: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const { revolutionCurve, rotationCurve, twistCurve } = useTwistRotStore();
    const sceneRef = useRef<THREE.Scene | null>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const frameIdRef = useRef<number>(0);

    // Initialize Scene
    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1e1e1e);
        sceneRef.current = scene;

        // Camera
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(50, 50, 100);
        camera.lookAt(0, 40, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        scene.add(directionalLight);

        // Grid & Axes
        const gridHelper = new THREE.GridHelper(200, 20);
        scene.add(gridHelper);
        const axesHelper = new THREE.AxesHelper(20);
        scene.add(axesHelper);

        // Animation Loop
        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);

            controls.update();

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(frameIdRef.current);
            controls.dispose();
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Update Mesh when curves change
    useEffect(() => {
        if (!sceneRef.current) return;

        // Remove old mesh
        if (meshRef.current) {
            sceneRef.current.remove(meshRef.current);
            meshRef.current.geometry.dispose();
            (meshRef.current.material as THREE.Material).dispose();
            meshRef.current = null;
        }

        // Generate new geometry
        const geometry = generateTwistRotGeometry(revolutionCurve, rotationCurve, twistCurve);
        if (geometry) {
            const material = new THREE.MeshStandardMaterial({
                color: 0x00ff88,
                roughness: 0.5,
                metalness: 0.5,
                side: THREE.DoubleSide,
                flatShading: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            sceneRef.current.add(mesh);
            meshRef.current = mesh;
            console.log("Generated TwistRot Mesh");
        }

    }, [revolutionCurve, rotationCurve, twistCurve]);

    return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};
