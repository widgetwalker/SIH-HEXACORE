"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import type { FloorTelemetry, CommandTelemetry } from "./telemetry";
import styles from "./CommandPage.module.css";

interface Props {
  telemetry: CommandTelemetry;
  selectedFloor: string | null;
  onSelectFloor: (floorId: string) => void;
}

const FLOOR_WIDTH = 6;
const FLOOR_DEPTH = 4;
const SLAB_THICKNESS = 0.16;
const FLOOR_GAP_COLLAPSED = 2.4;
const FLOOR_GAP_EXPLODED = 4.5;

const FLOOR_COLORS: Record<FloorTelemetry["status"], number> = {
  danger: 0xef4444,
  warning: 0xf59e0b,
  clear: 0x00d4aa,
  safe: 0x00d4aa,
};

const CATEGORY_COLORS: Record<string, number> = {
  safe: 0x00d4aa,
  trapped: 0xf59e0b,
  missing: 0xef4444,
};

function createHazardSprite(type: "fire" | "smoke"): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  if (type === "fire") {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(32, 36, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(32, 36, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔥", 32, 32);
  } else {
    ctx.fillStyle = "rgba(156,163,175,0.6)";
    ctx.beginPath();
    ctx.arc(32, 36, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9ca3af";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💨", 32, 32);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5, 0.5, 1);
  return sprite;
}

export default function FloorStack3D({ telemetry, selectedFloor, onSelectFloor }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef(telemetry);
  const selectedFloorRef = useRef(selectedFloor);
  const onSelectFloorRef = useRef(onSelectFloor);
  const [exploded, setExploded] = useState(false);
  const explodedRef = useRef(false);
  const floorGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const studentDotsRef = useRef<Map<string, THREE.InstancedMesh>>(new Map());
  const animatingRef = useRef(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  telemetryRef.current = telemetry;
  selectedFloorRef.current = selectedFloor;
  onSelectFloorRef.current = onSelectFloor;

  const toggleExploded = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    const next = !explodedRef.current;
    explodedRef.current = next;
    setExploded(next);
    const gap = next ? FLOOR_GAP_EXPLODED : FLOOR_GAP_COLLAPSED;
    const floors = telemetryRef.current.floors;

    floors.forEach((floor, index) => {
      const group = floorGroupsRef.current.get(floor.id);
      if (!group) return;
      const targetY = (floors.length - 1 - index) * gap;
      gsap.to(group.position, {
        y: targetY,
        duration: 0.6,
        ease: "power2.inOut",
        delay: index * 0.05,
      });
    });

    const wrap = wrapRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (wrap && renderer && camera) {
      const newH = next ? 700 : 440;
      gsap.to(wrap, {
        height: newH,
        duration: 0.6,
        ease: "power2.inOut",
        onUpdate: () => {
          const nw = mountRef.current?.clientWidth ?? 500;
          const nh = Math.max(mountRef.current?.clientHeight ?? 440, 1);
          const frustumSize = next ? 24 : 14;
          const na = nw / nh;
          camera.left = frustumSize * na / -2;
          camera.right = frustumSize * na / 2;
          camera.top = frustumSize / 2;
          camera.bottom = frustumSize / -2;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        },
      });
    }

    setTimeout(() => {
      animatingRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = 500;
    const h = 440;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d18);

    const aspect = w / h;
    const frustumSize = 16;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100
    );
    camera.position.set(12, 6, 12);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controls.target.set(0, 1, 0);
    controls.update();

    scene.add(new THREE.HemisphereLight(0xbed7ff, 0x101827, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 10, 6);
    scene.add(keyLight);

    const building = new THREE.Group();
    scene.add(building);

    const floorGroups = new Map<string, THREE.Group>();
    const interactiveMeshes: THREE.Mesh[] = [];
    const edgeMeshes = new Map<string, THREE.LineSegments>();

    const slabGeometry = new THREE.BoxGeometry(FLOOR_WIDTH, SLAB_THICKNESS, FLOOR_DEPTH);
    const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(FLOOR_WIDTH, 0.8, FLOOR_DEPTH));

    telemetry.floors.forEach((floor, index) => {
      const y = (telemetry.floors.length - 1 - index) * FLOOR_GAP_COLLAPSED;
      const group = new THREE.Group();
      group.position.y = y;
      group.userData.floorId = floor.id;

      const slabMaterial = new THREE.MeshStandardMaterial({
        color: 0x142238,
        metalness: 0.35,
        roughness: 0.7,
      });
      const slab = new THREE.Mesh(slabGeometry, slabMaterial);
      slab.userData.floorId = floor.id;
      group.add(slab);
      interactiveMeshes.push(slab);

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: FLOOR_COLORS[floor.status],
        transparent: true,
        opacity: 0.6,
      });
      const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      edge.position.y = 0.25;
      group.add(edge);
      edgeMeshes.set(floor.id, edge);

      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 128;
      labelCanvas.height = 32;
      const lCtx = labelCanvas.getContext("2d")!;
      lCtx.fillStyle = "rgba(0,0,0,0)";
      lCtx.fillRect(0, 0, 128, 32);
      lCtx.fillStyle = "#94a3b8";
      lCtx.font = "bold 18px monospace";
      lCtx.textAlign = "left";
      lCtx.textBaseline = "middle";
      lCtx.fillText(floor.id, 8, 16);
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelMat = new THREE.SpriteMaterial({ map: labelTexture, transparent: true });
      const labelSprite = new THREE.Sprite(labelMat);
      labelSprite.scale.set(0.8, 0.2, 1);
      labelSprite.position.set(-FLOOR_WIDTH / 2 - 0.6, 0.25, 0);
      group.add(labelSprite);

      floorGroups.set(floor.id, group);
      building.add(group);
    });

    floorGroupsRef.current = floorGroups;

    const studentDotGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const studentDotMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4aa });
    const studentDots = new Map<string, THREE.InstancedMesh>();
    telemetry.floors.forEach((floor) => {
      const mesh = new THREE.InstancedMesh(studentDotGeometry, studentDotMaterial, 60);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.visible = false;
      const group = floorGroups.get(floor.id);
      if (group) {
        group.add(mesh);
        studentDots.set(floor.id, mesh);
      }
    });
    studentDotsRef.current = studentDots;

    const hazardSprites = new Map<string, THREE.Sprite[]>();
    telemetry.floors.forEach((floor) => {
      const sprites: THREE.Sprite[] = [];
      const group = floorGroups.get(floor.id);
      if (!group) return;

      if (floor.status === "danger" || floor.status === "warning") {
        const fireSprite = createHazardSprite("fire");
        fireSprite.position.set(1.2, 0.5, -0.5);
        group.add(fireSprite);
        sprites.push(fireSprite);

        if (floor.trapped > 3) {
          const smokeSprite = createHazardSprite("smoke");
          smokeSprite.position.set(-0.8, 0.5, 0.8);
          group.add(smokeSprite);
          sprites.push(smokeSprite);
        }
      }
      hazardSprites.set(floor.id, sprites);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let clickStart = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      clickStart = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = e.clientX - clickStart.x;
      const dy = e.clientY - clickStart.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveMeshes)[0];
      const floorId = hit?.object.userData.floorId;
      if (typeof floorId === "string") {
        onSelectFloorRef.current(floorId);
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);

    const dummy = new THREE.Object3D();
    let lastSelected: string | null = null;
    let frameCount = 0;

    let raf = 0;
    const animate = () => {
      frameCount++;
      const selected = selectedFloorRef.current;
      const currentTelemetry = telemetryRef.current;

      if (selected !== lastSelected) {
        floorGroups.forEach((group, floorId) => {
          group.scale.setScalar(floorId === selected ? 1.03 : 1);
        });
        edgeMeshes.forEach((edge, floorId) => {
          const floorData = currentTelemetry.floors.find((f) => f.id === floorId);
          if (floorData && edge.material instanceof THREE.LineBasicMaterial) {
            edge.material.color.setHex(FLOOR_COLORS[floorData.status]);
            edge.material.opacity = floorId === selected ? 0.9 : 0.5;
          }
        });
        lastSelected = selected;
      }

      if (frameCount % 3 === 0) {
        const liveParticipants = currentTelemetry.liveParticipants ?? {};
        const dotsMesh = selected ? studentDotsRef.current.get(selected) : undefined;
        if (dotsMesh) {
          let count = 0;
          Object.entries(liveParticipants).forEach(([, info]) => {
            if (info.floorId !== selected || count >= 60) return;
            const x = (Math.random() - 0.5) * (FLOOR_WIDTH - 0.8);
            const z = (Math.random() - 0.5) * (FLOOR_DEPTH - 0.8);
            dummy.position.set(x, SLAB_THICKNESS / 2 + 0.15, z);
            dummy.updateMatrix();
            dotsMesh.setMatrixAt(count, dummy.matrix);
            const color = new THREE.Color(CATEGORY_COLORS[info.category] ?? 0x00d4aa);
            dotsMesh.setColorAt(count, color);
            count++;
          });
          dotsMesh.count = count;
          dotsMesh.instanceMatrix.needsUpdate = true;
          if (dotsMesh.instanceColor) dotsMesh.instanceColor.needsUpdate = true;
          dotsMesh.visible = count > 0;
        }

        studentDotsRef.current.forEach((mesh, floorId) => {
          if (floorId !== selected) mesh.visible = false;
        });
      }

      controls.update();
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
        if (obj instanceof THREE.Sprite) {
          obj.material.map?.dispose();
          obj.material.dispose();
        }
      });
      renderer.dispose();
      rendererRef.current = null;
      cameraRef.current = null;
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.floorStackWrap}>
      <div
        ref={mountRef}
        className={`${styles.floorStackCanvas} ${exploded ? styles.expanded : ""}`}
        onDoubleClick={toggleExploded}
        aria-label="Interactive 3D floor stack — double-click to explode"
      />
      <div className={styles.floorStackControls}>
        <span className={styles.floorStackLegend}>
          <span><i className={styles.legendSafe} /> Safe</span>
          <span><i className={styles.legendWarning} /> Warning</span>
          <span><i className={styles.legendDanger} /> Danger</span>
        </span>
        <button
          className={styles.explodeBtn}
          onClick={toggleExploded}
          type="button"
        >
          {exploded ? "Collapse" : "Explode"}
        </button>
      </div>
    </div>
  );
}
