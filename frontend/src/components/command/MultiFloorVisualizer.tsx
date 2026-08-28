"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { FloorTelemetry } from "./telemetry";
import styles from "./CommandPage.module.css";

interface Props {
  floors: FloorTelemetry[];
  selectedFloor: string | null;
  onSelectFloor: (floorId: string) => void;
}

const FLOOR_HEIGHT = 1.55;
const FLOOR_WIDTH = 5.2;
const FLOOR_DEPTH = 3.6;

function floorColor(status: FloorTelemetry["status"]): number {
  if (status === "danger") return 0xef4444;
  if (status === "warning") return 0xf59e0b;
  return 0x00d4aa;
}

export default function MultiFloorVisualizer({ floors, selectedFloor, onSelectFloor }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const floorsRef = useRef(floors);
  const selectedFloorRef = useRef(selectedFloor);
  const onSelectFloorRef = useRef(onSelectFloor);
  floorsRef.current = floors;
  selectedFloorRef.current = selectedFloor;
  onSelectFloorRef.current = onSelectFloor;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d18);
    scene.fog = new THREE.Fog(0x070d18, 10, 24);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(8.8, 8.6, 12.8);
    camera.lookAt(0, 3.9, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 7;
    controls.maxDistance = 24;
    controls.target.set(0, 3.85, 0);
    controls.update();

    scene.add(new THREE.HemisphereLight(0xbed7ff, 0x101827, 1.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 10, 6);
    scene.add(keyLight);

    const building = new THREE.Group();
    scene.add(building);

    const floorGroups = new Map<string, THREE.Group>();
    const interactiveMeshes: THREE.Mesh[] = [];
    const hazardMarkers: THREE.Mesh[] = [];
    const routePoints: THREE.Vector3[] = [];

    floors.forEach((floor, index) => {
      const y = (floors.length - 1 - index) * FLOOR_HEIGHT;
      const group = new THREE.Group();
      group.position.y = y;
      group.userData.floorId = floor.id;

      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(FLOOR_WIDTH, 0.16, FLOOR_DEPTH),
        new THREE.MeshStandardMaterial({ color: 0x142238, metalness: 0.35, roughness: 0.7 })
      );
      slab.userData.floorId = floor.id;
      group.add(slab);
      interactiveMeshes.push(slab);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(FLOOR_WIDTH, 0.65, FLOOR_DEPTH)),
        new THREE.LineBasicMaterial({ color: floorColor(floor.status), transparent: true, opacity: 0.72 })
      );
      edge.position.y = 0.38;
      group.add(edge);

      const statusLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 12, 12),
        new THREE.MeshBasicMaterial({ color: floorColor(floor.status) })
      );
      statusLight.position.set(-2.45, 0.45, 1.72);
      group.add(statusLight);

      if (floor.status === "danger" || floor.status === "warning") {
        const hazard = new THREE.Mesh(
          new THREE.SphereGeometry(0.26, 16, 16),
          new THREE.MeshBasicMaterial({ color: floorColor(floor.status), transparent: true, opacity: 0.9 })
        );
        hazard.position.set(0.65, 0.7, 0.1);
        group.add(hazard);
        hazardMarkers.push(hazard);
      }

      floorGroups.set(floor.id, group);
      building.add(group);
      routePoints.unshift(new THREE.Vector3(2.25, y + 0.22, 1.5));
    });

    const route = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(routePoints),
      new THREE.LineBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.8 })
    );
    building.add(route);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(7.2, 48),
      new THREE.MeshBasicMaterial({ color: 0x0b1729, transparent: true, opacity: 0.85 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.22;
    scene.add(ground);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handlePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveMeshes)[0];
      const floorId = hit?.object.userData.floorId;
      if (typeof floorId === "string") onSelectFloorRef.current(floorId);
    };
    renderer.domElement.addEventListener("pointerup", handlePointer);

    const resize = () => {
      const width = mount.clientWidth;
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let animationFrame = 0;
    const animate = (time: number) => {
      const selected = selectedFloorRef.current;
      floorGroups.forEach((group, floorId) => {
        const active = floorId === selected;
        group.position.x = active ? -0.25 : 0;
        group.scale.setScalar(active ? 1.04 : 1);
      });
      hazardMarkers.forEach((marker, index) => {
        const pulse = 1 + Math.sin(time * 0.004 + index) * 0.18;
        marker.scale.setScalar(pulse);
      });
      controls.update();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerup", handlePointer);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    floorsRef.current = floors;
  }, [floors]);

  return (
    <div className={styles.visualizerWrap}>
      <div ref={mountRef} className={styles.visualizerCanvas} aria-label="Interactive multi-floor 3D visualizer" />
      <div className={styles.visualizerLegend}>
        <span><i className={styles.legendSafe} /> Safe</span>
        <span><i className={styles.legendWarning} /> Warning</span>
        <span><i className={styles.legendDanger} /> Danger</span>
        <span className={styles.visualizerHint}>Click a floor to inspect</span>
      </div>
    </div>
  );
}
