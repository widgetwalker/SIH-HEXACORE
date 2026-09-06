"use client";

import { useEffect, useRef, useCallback } from "react";
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

const FLOOR_WIDTH = 5;
const FLOOR_DEPTH = 3.5;
const SLAB_THICKNESS = 0.14;
const FLOOR_GAP_COLLAPSED = 1.4;
const FLOOR_GAP_EXPLODED = 3.2;

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
  const telemetryRef = useRef(telemetry);
  const selectedFloorRef = useRef(selectedFloor);
  const onSelectFloorRef = useRef(onSelectFloor);
  const explodedRef = useRef(false);
  const floorGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const studentDotsRef = useRef<Map<string, THREE.InstancedMesh>>(new Map());
  const hazardSpritesRef = useRef<Map<string, THREE.Sprite[]>>(new Map());
  const animatingRef = useRef(false);

  telemetryRef.current = telemetry;
  selectedFloorRef.current = selectedFloor;
  onSelectFloorRef.current = onSelectFloor;

  const toggleExploded = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    const newExploded = !explodedRef.current;
    explodedRef.current = newExploded;
    const gap = newExploded ? FLOOR_GAP_EXPLODED : FLOOR_GAP_COLLAPSED;
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

    setTimeout(() => {
      animatingRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || 400;
    const h = mount.clientHeight || 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d18);

    const aspect = w / h;
    const frustumSize = 12;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controls.target.set(0, 3, 0);
    controls.update();

    scene.add(new THREE.HemisphereLight(0xbed7ff, 0x101827, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 10, 6);
    scene.add(keyLight);

    const building = new THREE.Group();
    scene.add(building);

    const floorGroups = new Map<string, THREE.Group>();
    const interactiveMeshes: THREE.Mesh[] = [];

    telemetry.floors.forEach((floor, index) => {
      const y = (telemetry.floors.length - 1 - index) * FLOOR_GAP_COLLAPSED;
      const group = new THREE.Group();
      group.position.y = y;
      group.userData.floorId = floor.id;

      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(FLOOR_WIDTH, SLAB_THICKNESS, FLOOR_DEPTH),
        new THREE.MeshStandardMaterial({
          color: 0x142238,
          metalness: 0.35,
          roughness: 0.7,
        })
      );
      slab.userData.floorId = floor.id;
      group.add(slab);
      interactiveMeshes.push(slab);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(FLOOR_WIDTH, 0.5, FLOOR_DEPTH)),
        new THREE.LineBasicMaterial({
          color: FLOOR_COLORS[floor.status],
          transparent: true,
          opacity: 0.6,
        })
      );
      edge.position.y = 0.25;
      group.add(edge);

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

    const studentDots = new Map<string, THREE.InstancedMesh>();
    telemetry.floors.forEach((floor) => {
      const geometry = new THREE.SphereGeometry(0.06, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0x00d4aa });
      const mesh = new THREE.InstancedMesh(geometry, material, 60);
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
    hazardSpritesRef.current = hazardSprites;

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

    const resize = () => {
      const nw = mount.clientWidth;
      const nh = Math.max(mount.clientHeight, 1);
      const na = nw / nh;
      camera.left = frustumSize * na / -2;
      camera.right = frustumSize * na / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const dummy = new THREE.Object3D();

    let raf = 0;
    const animate = (time: number) => {
      const selected = selectedFloorRef.current;
      const currentTelemetry = telemetryRef.current;

      floorGroups.forEach((group, floorId) => {
        const active = floorId === selected;
        group.scale.setScalar(active ? 1.03 : 1);

        const edge = group.children.find(
          (c) => c instanceof THREE.LineSegments
        ) as THREE.LineSegments | undefined;
        if (edge && edge.material instanceof THREE.LineBasicMaterial) {
          const floorData = currentTelemetry.floors.find((f) => f.id === floorId);
          if (floorData) {
            edge.material.color.setHex(FLOOR_COLORS[floorData.status]);
            edge.material.opacity = active ? 0.9 : 0.5;
          }
        }
      });

      hazardSprites.forEach((sprites) => {
        sprites.forEach((sprite, i) => {
          const pulse = 1 + Math.sin(time * 0.005 + i * 2) * 0.15;
          sprite.scale.set(0.5 * pulse, 0.5 * pulse, 1);
        });
      });

      const dotsMesh = selected ? studentDotsRef.current.get(selected) : undefined;
      if (dotsMesh) {
        const liveParticipants = currentTelemetry.liveParticipants ?? {};
        let count = 0;
        Object.entries(liveParticipants).forEach(([, info]) => {
          if (info.floorId !== selected) return;
          const x = (Math.random() - 0.5) * (FLOOR_WIDTH - 0.8);
          const z = (Math.random() - 0.5) * (FLOOR_DEPTH - 0.8);
          dummy.position.set(x, SLAB_THICKNESS / 2 + 0.15, z);
          dummy.updateMatrix();
          dotsMesh.setMatrixAt(count, dummy.matrix);
          const color = new THREE.Color(CATEGORY_COLORS[info.category] ?? 0x00d4aa);
          dotsMesh.setColorAt(count, color);
          count++;
        });
        dotsMesh.count = Math.max(count, 1);
        dotsMesh.instanceMatrix.needsUpdate = true;
        if (dotsMesh.instanceColor) dotsMesh.instanceColor.needsUpdate = true;
        dotsMesh.visible = count > 0;
      }

      studentDotsRef.current.forEach((mesh, floorId) => {
        if (floorId !== selected) mesh.visible = false;
      });

      controls.update();
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
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
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={styles.floorStackWrap}>
      <div
        ref={mountRef}
        className={styles.floorStackCanvas}
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
          {explodedRef.current ? "Collapse" : "Explode"}
        </button>
      </div>
    </div>
  );
}
