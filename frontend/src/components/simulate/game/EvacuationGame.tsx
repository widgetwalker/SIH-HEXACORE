"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { parseFloorplan, SCENARIOS, type BlockageEvent, type Scenario } from "./floorplan";
import type { RunTelemetry, TelemetryEvent } from "./telemetry";
import styles from "./EvacuationGame.module.css";

type BlockageWithWarn = BlockageEvent & { warned?: boolean };

export interface GameState {
  status: "running" | "won" | "lost";
  time: number;
  oxygen: number;
  panic: number;
  crouching: boolean;
  breathing: boolean;
  message: string;
  score: number;
  hazardLabel: string;
  distToExit: number;
  guideDir: "forward" | "back" | "left" | "right" | null;
}

interface Props {
  scenario?: Scenario;
  onState: (s: GameState) => void;
  onEnd?: (run: RunTelemetry) => void;
}

/*
 * Playable evacuation drill (doc 02 §2 runtime loop):
 *  - scenario floorplans loaded from JSON (multi-exit, doors)
 *  - procedural fire ignition + cell-to-cell spread; closed doors block
 *    fire & smoke until the player pushes through them
 *  - smoke layer drains oxygen unless crawling (SHIFT); panic meter causes
 *    cognitive freeze >70; hold B to box-breathe and recover
 *  - scripted blockage events collapse corridors mid-run (compound disasters)
 *  - NPC crowd flows toward exits via a BFS distance field
 *  - synthesized alarm / fire crackle / heartbeat audio (WebAudio, no assets)
 *  - full run telemetry recorded for generated debriefs + admin analytics
 */

const CELL = 2;
const NPC_COUNT = 18;

export default function EvacuationGame({ scenario, onState, onEnd }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onStateRef = useRef(onState);
  onStateRef.current = onState;
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  /* ── mobile touch input — virtual joystick (dx/dz) + hold-buttons for
     crouch/box-breathe. Mutated directly by pointer handlers below and read
     each tick alongside `keys`, so touch and keyboard combine seamlessly. ── */
  const touchStateRef = useRef({ dx: 0, dz: 0, crouch: false, breathe: false });
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickKnobRef = useRef<HTMLDivElement>(null);
  const joystickPointerId = useRef<number | null>(null);

  const updateJoystick = (clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    const knob = joystickKnobRef.current;
    if (!base || !knob) return;
    const rect = base.getBoundingClientRect();
    const maxR = rect.width / 2;
    let dx = clientX - (rect.left + rect.width / 2);
    let dy = clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    const nx = dx / maxR;
    const ny = dy / maxR;
    const deadzone = 0.15;
    const mag = Math.hypot(nx, ny);
    touchStateRef.current.dx = mag < deadzone ? 0 : nx;
    touchStateRef.current.dz = mag < deadzone ? 0 : ny;
  };

  const onJoystickDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    joystickPointerId.current = e.pointerId;
    updateJoystick(e.clientX, e.clientY);
  };
  const onJoystickMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (joystickPointerId.current !== e.pointerId) return;
    updateJoystick(e.clientX, e.clientY);
  };
  const onJoystickUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (joystickPointerId.current !== e.pointerId) return;
    joystickPointerId.current = null;
    touchStateRef.current.dx = 0;
    touchStateRef.current.dz = 0;
    if (joystickKnobRef.current) {
      joystickKnobRef.current.style.transform = "translate(-50%, -50%)";
    }
  };
  // Pressed-visual state lives in React, not as a directly-mutated DOM class -
  // touchStateRef (read imperatively by the tick loop) is unaffected, but the
  // *visual* pressed style was being set via classList.toggle, which the next
  // re-render (SimulatePage re-renders ~7x/sec on live game-state updates)
  // would silently overwrite back to the plain className from JSX, causing
  // the pressed glow to flicker off mid-press.
  const [crouchPressed, setCrouchPressed] = useState(false);
  const [breathePressed, setBreathePressed] = useState(false);

  const setCrouch = (v: boolean) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    touchStateRef.current.crouch = v;
    setCrouchPressed(v);
  };
  const setBreathe = (v: boolean) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    touchStateRef.current.breathe = v;
    setBreathePressed(v);
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── floorplan from JSON ── */
    const scen: Scenario = scenario ?? SCENARIOS[0];
    const fp = parseFloorplan(scen);
    const { rows, cols, walls, doors, fireSeeds, exits, spawn, idxOf } = fp;
    const TIME_LIMIT = scen.timeLimit;

    const cellToWorld = (c: number, r: number) =>
      new THREE.Vector3((c - cols / 2 + 0.5) * CELL, 0, (r - rows / 2 + 0.5) * CELL);

    /* ── scene setup ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050810);
    scene.fog = new THREE.FogExp2(0x050810, scen.fogDensity);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      200
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    /* beacon meshes registered here so the tick loop can animate them */
    const animBeacons: { beacon: THREE.Mesh; ring: THREE.Mesh }[] = [];

    // Cinematic lighting — key + rim + ambient (scifi sim, not flat Lambert)
    scene.add(new THREE.AmbientLight(0xdbe8ff, 0.42));
    const sun = new THREE.DirectionalLight(0xffffff, 1.05);
    sun.position.set(10, 18, 8);
    scene.add(sun);
    const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.55);
    rimLight.position.set(-12, 12, -10);
    scene.add(rimLight);
    // Dynamic fire point lights pool — moved to nearest fires each tick
    const fireLights: THREE.PointLight[] = [];
    for (let i = 0; i < 4; i++) {
      const pl = new THREE.PointLight(0xff7a1a, 0, 9, 1.8);
      pl.position.set(999, 999, 999);
      scene.add(pl);
      fireLights.push(pl);
    }

    /* ── floor + grid — PBR concrete, not flat Lambert ── */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(cols * CELL, rows * CELL),
      new THREE.MeshStandardMaterial({ color: 0x0d1426, roughness: 0.92, metalness: 0.06 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = false;
    scene.add(floor);
    const grid = new THREE.GridHelper(cols * CELL, cols, 0x1e2d55, 0x152040);
    (grid.material as THREE.LineBasicMaterial).transparent = true;
    (grid.material as THREE.LineBasicMaterial).opacity = 0.35;
    grid.position.y = 0.02;
    scene.add(grid);

    /* ── walls / doors — PBR walls + emissive edge, metal doors ── */
    const wallGeo = new THREE.BoxGeometry(CELL, 2.6, CELL);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a2544, roughness: 0.88, metalness: 0.08, emissive: 0x0a1020, emissiveIntensity: 0.18 });
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!walls.has(idxOf(c, r))) continue;
        const w = new THREE.Mesh(wallGeo, wallMat);
        w.position.copy(cellToWorld(c, r)).setY(1.3);
        scene.add(w);
      }
    }
    /* door meshes: closed = amber PBR slab with emissive; opened = flat teal threshold */
    const doorMeshes = new Map<number, THREE.Mesh>();
    const doorMatClosed = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45, metalness: 0.22, emissive: 0x3a1f00, emissiveIntensity: 0.45 });
    doors.forEach((idx) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const d = new THREE.Mesh(new THREE.BoxGeometry(CELL * 0.9, 2.4, CELL * 0.35), doorMatClosed.clone());
      d.position.copy(cellToWorld(c, r)).setY(1.2);
      d.rotation.y = fp.at(c, r - 1) === "#" || fp.at(c, r + 1) === "#" ? 0 : Math.PI / 2;
      scene.add(d);
      doorMeshes.set(idx, d);
    });

    /* ── exit beacons (multiple supported) — cinematic emissive pillars ── */
    const exitWorlds = exits.map((e) => cellToWorld(e.c, e.r));
    for (const ew of exitWorlds) {
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 6, 24, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 1.15, transparent: true, opacity: 0.42, side: THREE.DoubleSide })
      );
      beacon.position.copy(ew).setY(3);
      scene.add(beacon);
      // soft point light at beacon — cheap, 1 per exit
      const bl = new THREE.PointLight(0x10b981, 2.2, 10);
      bl.position.copy(ew).setY(1.2);
      scene.add(bl);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.7, 0.95, 32),
        new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(ew).setY(0.05);
      scene.add(ring);
      animBeacons.push({ beacon, ring });
    }

    /* ── player — PBR capsule + rim glow + point light ── */
    const player = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.42, 0.8, 6, 14),
      new THREE.MeshStandardMaterial({ color: 0x00d4aa, emissive: 0x0a4438, emissiveIntensity: 0.65, roughness: 0.45, metalness: 0.18 })
    );
    body.position.y = 0.85;
    player.add(body);
    const playerLight = new THREE.PointLight(0x00d4aa, 1.2, 6);
    playerLight.position.set(0, 0.9, 0);
    player.add(playerLight);
    player.position.copy(cellToWorld(spawn.c, spawn.r));
    scene.add(player);

    /* ── fire & smoke visuals — hyper-real shader-driven, not block planes
       flame uses canvas gradient texture + 3-plane cross + emissive flicker;
       smoke uses soft puff texture + slow drift + opacity tied to density      ── */
    const flameCol = new THREE.Color(scen.colors.flame);
    const glowCol = new THREE.Color(scen.colors.glow);
    const smokeCol = new THREE.Color(scen.colors.smoke);

    // Procedural flame texture — radial soft flame (no external asset)
    const makeFlameTex = () => {
      const s = 128;
      const c = document.createElement("canvas");
      c.width = s; c.height = s;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(s/2, s*0.72, 6, s/2, s*0.72, s*0.62);
      // inner white-yellow -> orange -> red -> transparent
      g.addColorStop(0, "#fffbe6");
      g.addColorStop(0.22, flameCol.getStyle());
      g.addColorStop(0.48, glowCol.getStyle());
      g.addColorStop(0.78, "rgba(120,20,0,0.0)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,s,s);
      // vertical stretch so flame is teardrop, not circle
      const tex = new THREE.CanvasTexture(c);
      return tex;
    };
    const makeSmokeTex = () => {
      const s = 128;
      const c = document.createElement("canvas");
      c.width = s; c.height = s;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(s/2, s/2, 8, s/2, s/2, s*0.62);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.35, "rgba(180,185,195,0.55)");
      g.addColorStop(0.7, "rgba(90,95,105,0.18)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,s,s);
      const tex = new THREE.CanvasTexture(c);
      return tex;
    };
    const flameTex = makeFlameTex();
    const smokeTex = makeSmokeTex();

    const fireSet = new Set<number>();
    const smokeSet = new Set<number>();
    const fireMeshes = new Map<number, THREE.Group>();
    const smokeMeshes = new Map<number, THREE.Mesh>();
    const fireMat = new THREE.MeshBasicMaterial({
      map: flameTex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      alphaTest: 0.02,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: glowCol.getHex(),
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const smokeMat = new THREE.MeshBasicMaterial({
      map: smokeTex,
      color: smokeCol.getHex(),
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide,
      alphaTest: 0.01,
    });

    const isOpenForSpread = (c: number, r: number) => {
      if (c < 0 || r < 0 || c >= cols || r >= rows || walls.has(idxOf(c, r))) return false;
      const idx = idxOf(c, r);
      if (doors.has(idx) && !openedDoors.has(idx)) return false;
      return true;
    };

    /* doors start closed; the player opens them by walking into them */
    const openedDoors = new Set<number>();

    const addFire = (idx: number) => {
      if (fireSet.has(idx) || walls.has(idx)) return;
      fireSet.add(idx);
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const g = new THREE.Group();
      // 3-plane cross + diagonal for volumetric flame, not flat block
      const flameGeo = new THREE.PlaneGeometry(CELL * 0.95, 2.35);
      const f1 = new THREE.Mesh(flameGeo, fireMat);
      f1.position.y = 1.18;
      const f2 = f1.clone();
      f2.rotation.y = Math.PI / 2;
      const f3 = f1.clone();
      f3.rotation.y = Math.PI / 4;
      // inner bright core
      const coreGeo = new THREE.PlaneGeometry(CELL * 0.52, 1.45);
      const coreMat = new THREE.MeshBasicMaterial({ map: flameTex, color: 0xfff2a0, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 1.05;
      core.rotation.y = Math.PI / 2;
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(CELL * 1.55, CELL * 1.55), glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.04;
      g.add(f1, f2, f3, core, glow);
      g.position.copy(cellToWorld(c, r));
      // subtle random tilt for organic
      g.rotation.y = (Math.random() - 0.5) * 0.4;
      scene.add(g);
      fireMeshes.set(idx, g);
    };

    const recomputeSmoke = () => {
      fireSet.forEach((idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nc = c + dc;
            const nr = r + dr;
            if (!isOpenForSpread(nc, nr)) continue;
            const nIdx = idxOf(nc, nr);
            if (smokeSet.has(nIdx)) continue;
            smokeSet.add(nIdx);
            const m = new THREE.Mesh(new THREE.PlaneGeometry(CELL * (0.92 + Math.random()*0.18), CELL * (0.92 + Math.random()*0.18)), smokeMat);
            m.rotation.x = -Math.PI / 2;
            m.rotation.z = (Math.random()-0.5)*0.6;
            m.position.copy(cellToWorld(nc, nr)).setY(1.65 + Math.random()*0.18);
            // store drift phase for tick
            (m as unknown as { drift: number }).drift = Math.random()*Math.PI*2;
            scene.add(m);
            smokeMeshes.set(nIdx, m);
          }
        }
      });
    };

    /* ignite one random seed */
    addFire(fireSeeds[Math.floor(Math.random() * fireSeeds.length)]);
    recomputeSmoke();

    /* ── input ── */
    const keys = new Set<string>();
    const touchState = touchStateRef.current;
    const isTypingTarget = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return; // let Mitra's chat input (and any other field) take keys normally
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      keys.add(k);
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase()); // always release, even if focus moved to a text field mid-press
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    /* mouse-look: moving the mouse orbits/tilts the chase camera around the player
       (movement stays on WASD, world-fixed — only the view swings with the mouse) */
    const BASE_CAM_DIST = 9.5;
    const MIN_CAM_DIST = 4;
    const MAX_CAM_DIST = 18;
    const CAM_HEIGHT = 13;
    const MAX_YAW = 0.9;
    const MAX_LIFT = 5;
    let mouseYaw = 0;
    let mouseLift = 0;
    let camDist = BASE_CAM_DIST;
    let isDragging = false;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isDragging = true; // left-click only
    };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return; // only orbit when click-dragging
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // negated: moving the mouse left should pan the view left, not orbit the camera left
      mouseYaw = -nx * MAX_YAW;
      mouseLift = -ny * MAX_LIFT;
    };
    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    /* scroll wheel zoom — only over the 3D canvas, so it doesn't hijack page/chat scroll */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camDist = Math.min(MAX_CAM_DIST, Math.max(MIN_CAM_DIST, camDist + e.deltaY * 0.01));
    };
    mount.addEventListener("wheel", onWheel, { passive: false });

    const onResize = () => {
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    /* ── sim state ── */
    let status: GameState["status"] = "running";
    let time = 0;
    let oxygen = 100;
    let panic = 10;
    let spreadTimer = 0;
    let emitTimer = 0;
    let sampleTimer = 0;
    let raf = 0;
    let ended = false;
    const clock = new THREE.Clock();

    /* telemetry accumulators */
    const routeHeat = new Array<number>(rows * cols).fill(0);
    const violations: TelemetryEvent[] = [];
    let panicPeak = 10;
    let panicFreezeSeconds = 0;
    let smokeStandingSeconds = 0;
    let smokeCrouchSeconds = 0;
    let breathCount = 0;
    let breathingPrev = false;
    let distanceTraveled = 0;
    let fireCellEntries = 0;
    let wasInFire = false;
    let deathCell: { c: number; r: number } | undefined;
    let exitUsed: { c: number; r: number } | undefined;
    let bannerMsg = "";
    let bannerUntil = 0;

    /* ── scripted mid-run blockages ── */
    const blockages = [...(scen.blockages ?? [])].sort((a, b) => a.t - b.t);
    let nextBlockage = 0;
    const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x3a3f4a, roughness: 0.96, metalness: 0.04 });
    const applyBlockage = (cells: [number, number][], message: string) => {
      for (const [c, r] of cells) {
        const idx = idxOf(c, r);
        walls.add(idx);
        smokeSet.delete(idx);
        const old = smokeMeshes.get(idx);
        if (old) { scene.remove(old); smokeMeshes.delete(idx); }
        fireSet.delete(idx);
        const fm = fireMeshes.get(idx);
        if (fm) { scene.remove(fm); fireMeshes.delete(idx); }
        const rubble = new THREE.Mesh(wallGeo, rubbleMat);
        rubble.position.copy(cellToWorld(c, r)).setY(1.3);
        rubble.rotation.y = Math.random() * 0.4 - 0.2;
        scene.add(rubble);
      }
      bannerMsg = message;
      bannerUntil = time + 6;
      violations.push({
        t: time,
        type: "route_blocked",
        detail: message,
        cell: cells[0] ? { c: cells[0][0], r: cells[0][1] } : undefined,
      });
      recomputeSmoke();
      fieldDirty = true;
    };

    /* ── NPC crowd (BFS flow-field toward nearest reachable exit) ── */
    interface NpcAgent {
      mesh: THREE.Mesh;
      speed: number;
      dead: boolean;
      deadTimer: number;
      fade: number;
    }
    const npcs: NpcAgent[] = [];
    let distField = new Int16Array(rows * cols).fill(-1);
    let fieldDirty = true;
    let fieldTimer = 0;

    const passableForNpc = (c: number, r: number) => {
      if (c < 0 || r < 0 || c >= cols || r >= rows) return false;
      const idx = idxOf(c, r);
      if (walls.has(idx)) return false;
      if (doors.has(idx) && !openedDoors.has(idx)) return false;
      return true;
    };

    const rebuildField = () => {
      distField = new Int16Array(rows * cols).fill(-1);
      const q: number[] = [];
      for (const e of exits) {
        distField[e.idx] = 0;
        q.push(e.idx);
      }
      let head = 0;
      while (head < q.length) {
        const idx = q[head++];
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const d = distField[idx];
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const nc = c + dc;
          const nr = r + dr;
          if (!passableForNpc(nc, nr)) continue;
          const nIdx = idxOf(nc, nr);
          if (distField[nIdx] !== -1) continue;
          distField[nIdx] = d + 1;
          q.push(nIdx);
        }
      }
      fieldDirty = false;
    };

    const npcGeo = new THREE.CapsuleGeometry(0.28, 0.5, 4, 8);
    for (let i = 0; i < NPC_COUNT; i++) {
      /* spawn on open floor away from exits & fire seeds */
      for (let tries = 0; tries < 60; tries++) {
        const c = 1 + Math.floor(Math.random() * (cols - 2));
        const r = 1 + Math.floor(Math.random() * (rows - 2));
        const idx = idxOf(c, r);
        if (walls.has(idx) || doors.has(idx) || fireSeeds.includes(idx)) continue;
        if (exits.some((e) => Math.abs(e.c - c) + Math.abs(e.r - r) < 6)) continue;
        const hueVar = 0xd97706 + Math.floor((Math.random() - 0.5) * 0x0a0a0a);
        const mesh = new THREE.Mesh(
          npcGeo,
          new THREE.MeshStandardMaterial({ color: hueVar, roughness: 0.68, metalness: 0.08, transparent: true, opacity: 0.96 })
        );
        const w = cellToWorld(c, r);
        mesh.position.set(
          w.x + (Math.random() - 0.5) * 0.8,
          0.55,
          w.z + (Math.random() - 0.5) * 0.8
        );
        scene.add(mesh);
        npcs.push({ mesh, speed: 1.9 + Math.random() * 1.2, dead: false, deadTimer: 0, fade: 1 });
        break;
      }
    }

    /* ── synthesized audio (no assets) ── */
    let audioCtx: AudioContext | null = null;
    let masterGain: GainNode | null = null;
    let crackleGain: GainNode | null = null;
    let alarmInterval: ReturnType<typeof setInterval> | null = null;
    let beatTimer = 0;

    const beep = (freq: number, dur: number, when: number, vol: number) => {
      if (!audioCtx || !masterGain) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(vol, when + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      osc.connect(gain).connect(masterGain);
      osc.start(when);
      osc.stop(when + dur + 0.05);
    };
    const thump = (vol: number) => {
      if (!audioCtx || !masterGain) return;
      const t0 = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(58, t0);
      osc.frequency.exponentialRampToValueAtTime(38, t0 + 0.12);
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
      osc.connect(gain).connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.16);
    };
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.45;
      masterGain.connect(audioCtx.destination);

      /* looping fire crackle: filtered white noise, level driven per-frame */
      const noiseLen = audioCtx.sampleRate * 2;
      const noiseBuf = audioCtx.createBuffer(1, noiseLen, audioCtx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseLen; i++) data[i] = Math.random() * 2 - 1;
      const src = audioCtx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 420;
      bandpass.Q.value = 0.7;
      crackleGain = audioCtx.createGain();
      crackleGain.gain.value = 0;
      src.connect(bandpass).connect(crackleGain).connect(masterGain);
      src.start();

      /* evacuation alarm: two quick square beeps every ~2.2s */
      alarmInterval = setInterval(() => {
        if (!audioCtx || status !== "running") return;
        const t = audioCtx.currentTime;
        beep(760, 0.14, t, 0.06);
        beep(760, 0.14, t + 0.22, 0.06);
      }, 2200);
    } catch {
      /* audio unavailable - drill continues silently */
    }

    /* ── movement collision ── */
    const tryMove = (nx: number, nz: number) => {
      const R = 0.45;
      const pts = [
        [nx - R, nz - R], [nx + R, nz - R], [nx - R, nz + R], [nx + R, nz + R],
      ];
      for (const [x, z] of pts) {
        const c = Math.floor(x / CELL + cols / 2);
        const r = Math.floor(z / CELL + rows / 2);
        if (walls.has(idxOf(c, r))) return false;
      }
      return true;
    };

    const buildRunTelemetry = (): RunTelemetry => ({
      runId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      scenarioId: scen.id,
      scenarioName: scen.name,
      status: status === "won" ? "won" : "lost",
      time,
      oxygenLeft: oxygen,
      panicPeak,
      panicFreezeSeconds,
      score: status === "won"
        ? Math.max(0, Math.round(oxygen * 2 + (TIME_LIMIT - time) * 3 + (100 - panic)))
        : 0,
      smokeStandingSeconds,
      smokeCrouchSeconds,
      breathCount,
      distanceTraveled: Math.round(distanceTraveled),
      fireCellEntries,
      exitUsed,
      deathCell,
      violations: violations.slice(0, 40),
      routeHeat,
      cols,
      rows,
      createdAt: Date.now(),
    });

    const finishRun = () => {
      if (ended) return;
      ended = true;
      emit();
      onEndRef.current?.(buildRunTelemetry());
    };

    const emit = () => {
      const score = Math.max(
        0,
        Math.round(oxygen * 2 + (TIME_LIMIT - time) * 3 + (100 - panic))
      );
      const crouching = keys.has("shift") || touchState.crouch;
      const breathing = keys.has("b") || touchState.breathe;
      const pc = Math.floor(player.position.x / CELL + cols / 2);
      const pr = Math.floor(player.position.z / CELL + rows / 2);
      const pIdx = idxOf(pc, pr);
      const nearExit = exitWorlds.some((w) => player.position.distanceTo(w) < CELL * 4);
      let message = exits.length > 1
        ? `Reach any green ASSEMBLY beacon (${exits.length} active)`
        : "Reach the green ASSEMBLY beacon";
      if (time < bannerUntil) message = bannerMsg;
      else if (status === "won") message = "Evacuated to assembly point ✓";
      else if (status === "lost") message = oxygen <= 0 ? `${scen.hazardLabel} exposure fatal - casualty` : "Time expired - drill failed";
      else if (fireSet.has(pIdx)) message = `YOU ARE IN ${scen.hazardLabel} - GET OUT!`;
      else if (breathing) message = "Box-breathing… 4s in, 4s hold, 4s out";
      else if (panic > 70) message = "PANIC HIGH - hold B to box-breathe";
      else if (smokeSet.has(pIdx) && !crouching) message = `${scen.hazardLabel === "TOXIC GAS" ? "Gas!" : "Smoke!"} Hold SHIFT to crawl low`;
      else if (nearExit) message = "Assembly point ahead!";

      /* live routing hint — reuses the same BFS flow-field the NPCs follow */
      const distToExit = distField[pIdx] ?? -1;
      let guideDir: GameState["guideDir"] = null;
      if (distToExit > 0) {
        let bestD = distToExit;
        let bdc = 0, bdr = 0;
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const nc = pc + dc;
          const nr = pr + dr;
          if (!passableForNpc(nc, nr)) continue;
          const nd = distField[idxOf(nc, nr)];
          if (nd !== -1 && nd < bestD) { bestD = nd; bdc = dc; bdr = dr; }
        }
        if (bdc === 1) guideDir = "right";
        else if (bdc === -1) guideDir = "left";
        else if (bdr === 1) guideDir = "back";
        else if (bdr === -1) guideDir = "forward";
      }

      onStateRef.current({ status, time, oxygen, panic, crouching, breathing, message, score, hazardLabel: scen.hazardLabel, distToExit, guideDir });
    };

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      if (status === "running") {
        time += dt;
        const crouching = keys.has("shift") || touchState.crouch;
        const breathing = keys.has("b") || touchState.breathe;

        /* scripted blockage timeline (warn first, then collapse) */
        const pending = blockages[nextBlockage];
        if (
          pending &&
          pending.warnT !== undefined &&
          time >= pending.warnT &&
          time < pending.t
        ) {
          if (!(pending as BlockageWithWarn).warned) {
            (pending as BlockageWithWarn).warned = true;
            if (pending.warnMessage) { bannerMsg = pending.warnMessage; bannerUntil = time + 5; }
          }
        }
        while (nextBlockage < blockages.length && time >= blockages[nextBlockage].t) {
          applyBlockage(blockages[nextBlockage].cells, blockages[nextBlockage].message);
          nextBlockage++;
        }

        /* movement (frozen while box-breathing; slowed by panic + crouch) */
        if (!breathing) {
          let speed = 4.4;
          if (crouching) speed = 2.3;
          if (panic > 70) speed *= 0.55; /* cognitive freeze */
          let dx = 0, dz = 0;
          if (keys.has("w") || keys.has("arrowup")) dz -= 1;
          if (keys.has("s") || keys.has("arrowdown")) dz += 1;
          if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
          if (keys.has("d") || keys.has("arrowright")) dx += 1;
          dx += touchState.dx;
          dz += touchState.dz;
          if (dx || dz) {
            const len = Math.hypot(dx, dz);
            const step = speed * dt;
            distanceTraveled += step;
            const nx = player.position.x + (dx / len) * step;
            const nz = player.position.z + (dz / len) * step;
            if (tryMove(nx, player.position.z)) player.position.x = nx;
            if (tryMove(player.position.x, nz)) player.position.z = nz;
            player.rotation.y = Math.atan2(dx, dz);
          }
        }
        body.scale.y = crouching ? 0.55 : 1;

        const pc = Math.floor(player.position.x / CELL + cols / 2);
        const pr = Math.floor(player.position.z / CELL + rows / 2);
        const pIdx = idxOf(pc, pr);

        /* push through closed doors */
        if (doors.has(pIdx) && !openedDoors.has(pIdx)) {
          openedDoors.add(pIdx);
          fieldDirty = true;
          const dm = doorMeshes.get(pIdx);
          if (dm) {
            (dm.material as THREE.MeshStandardMaterial).color.set(0x00d4aa);
            (dm.material as THREE.MeshStandardMaterial).emissive.set(0x00d4aa);
            (dm.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45;
            (dm.material as THREE.MeshStandardMaterial).opacity = 0.32;
            (dm.material as THREE.MeshStandardMaterial).transparent = true;
            dm.scale.y = 0.12;
            dm.position.y = 0.12;
          }
        }

        /* hazard effects on player */
        let nearFire = false;
        fireSet.forEach((idx) => {
          const fc = idx % cols;
          const fr = Math.floor(idx / cols);
          if (Math.abs(fc - pc) <= 2 && Math.abs(fr - pr) <= 2) nearFire = true;
        });

        /* telemetry: route heat sampling is done in sample block below */
        if (fireSet.has(pIdx)) {
          oxygen -= 35 * dt;
          panic = Math.min(100, panic + 60 * dt);
          if (!wasInFire) {
            fireCellEntries++;
            violations.push({ t: time, type: "entered_fire", cell: { c: pc, r: pr } });
          }
        } else if (smokeSet.has(pIdx)) {
          oxygen -= (keys.has("shift") ? 1.2 : 4.5) * dt;
          panic = Math.min(100, panic + 6 * dt);
          if (keys.has("shift")) smokeCrouchSeconds += dt;
          else smokeStandingSeconds += dt;
        }
        wasInFire = fireSet.has(pIdx);
        if (nearFire) panic = Math.min(100, panic + 8 * dt);
        else if (!smokeSet.has(pIdx)) panic = Math.max(0, panic - 3.5 * dt);
        if (breathing) panic = Math.max(0, panic - 16 * dt);
        if (breathing && !breathingPrev) breathCount++;
        breathingPrev = breathing;

        if (panic > panicPeak) panicPeak = panic;
        if (panic > 70 && !breathing) {
          panicFreezeSeconds += dt;
          if (
            panicFreezeSeconds > 4 &&
            !violations.some((v) => v.type === "panic_freeze")
          ) {
            violations.push({ t: time, type: "panic_freeze", cell: { c: pc, r: pr } });
          }
        }
        if (
          smokeStandingSeconds > 6 &&
          !violations.some((v) => v.type === "smoke_exposure")
        ) {
          violations.push({ t: time, type: "smoke_exposure", cell: { c: pc, r: pr } });
        }

        /* fire spread - closed doors block it */
        spreadTimer += dt;
        if (spreadTimer > scen.spreadInterval) {
          spreadTimer = 0;
          const next: number[] = [];
          fireSet.forEach((idx) => {
            const c = idx % cols;
            const r = Math.floor(idx / cols);
            [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dc, dr]) => {
              if (isOpenForSpread(c + dc, r + dr) && Math.random() < scen.spreadChance) {
                next.push(idxOf(c + dc, r + dr));
              }
            });
          });
          next.forEach(addFire);
          recomputeSmoke();
        }

        /* outcome resolution - any beacon wins */
        const reachedExitIdx = exitWorlds.findIndex((w) => player.position.distanceTo(w) < 1.5);
        if (reachedExitIdx >= 0) {
          exitUsed = exits[reachedExitIdx];
          status = "won";
        } else if (oxygen <= 0) {
          oxygen = 0;
          deathCell = { c: pc, r: pr };
          status = "lost";
        } else if (time >= TIME_LIMIT) {
          deathCell = { c: pc, r: pr };
          status = "lost";
        }
        if (status !== "running") {
          emit();
          finishRun();
        }

        /* telemetry sampling @4Hz */
        sampleTimer += dt;
        if (sampleTimer > 0.25) {
          sampleTimer = 0;
          routeHeat[pIdx]++;
        }

        updateNpcs(dt);
        updateAudio(dt, pc, pr, pIdx);
      }

      /* visuals: flames flicker — 3 planes + core + dynamic point lights */
      fireMeshes.forEach((g, idx) => {
        const s = 1 + 0.18 * Math.sin(t * 13 + idx);
        g.children[0].scale.y = s;
        g.children[1].scale.y = 1 + 0.18 * Math.cos(t * 11 + idx);
        if (g.children[2]) g.children[2].scale.y = 1 + 0.14 * Math.sin(t * 9 + idx * 0.7);
        if (g.children[3]) { // core
          const c = g.children[3] as THREE.Mesh;
          c.scale.y = 1 + 0.22 * Math.sin(t * 15 + idx);
          (c.material as THREE.MeshBasicMaterial).opacity = 0.78 + 0.12 * Math.sin(t * 16 + idx);
        }
        // subtle sway
        g.rotation.z = Math.sin(t * 2.2 + idx) * 0.06;
      });
      // move 4 fire point lights to 4 nearest fires to player (hyper-real without 100 lights)
      {
        const fires = Array.from(fireSet);
        fires.sort((a,b)=>{
          const ac = a%cols, ar=Math.floor(a/cols), bc=b%cols, br=Math.floor(b/cols);
          const da=Math.hypot(ac - Math.floor(player.position.x/CELL+cols/2), ar - Math.floor(player.position.z/CELL+rows/2));
          const db=Math.hypot(bc - Math.floor(player.position.x/CELL+cols/2), br - Math.floor(player.position.z/CELL+rows/2));
          return da-db;
        });
        for(let i=0;i<4;i++){
          const pl = fireLights[i];
          const idx = fires[i];
          if(idx!==undefined){
            const c=idx%cols, r=Math.floor(idx/cols);
            const w=cellToWorld(c,r);
            pl.position.set(w.x, 1.35 + Math.sin(t*4+i)*0.18, w.z);
            const flick = 1.6 + Math.sin(t*12+i*1.7)*0.6 + Math.random()*0.25;
            pl.intensity = flick;
            pl.distance = 9 + Math.sin(t*3+i)*1.2;
          } else pl.intensity = 0;
        }
      }
      // smoke drift
      smokeMeshes.forEach((m)=>{
        const drift = (m as unknown as { drift: number }).drift ?? 0;
        m.position.y = 1.7 + Math.sin(t*0.9+drift)*0.12;
        m.rotation.z += 0.0018 * Math.sin(t*0.7+drift);
        (m.material as THREE.MeshBasicMaterial).opacity = 0.36 + 0.08*Math.sin(t*1.1+drift);
      });
      for (const b of animBeacons) {
        b.beacon.rotation.y = t * 0.8;
        const ringP = (t * 0.7) % 1;
        b.ring.scale.setScalar(1 + ringP * 2.2);
        (b.ring.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - ringP);
      }

      /* camera: third-person follow + click-drag orbit + quake shake intro */
      if (!isDragging) {
        mouseYaw *= 0.92; // smoothly drift back to center
        mouseLift *= 0.92;
      }
      const shake = Math.max(0, 1 - t / 3);
      const camX = player.position.x + Math.sin(mouseYaw) * camDist;
      const camZ = player.position.z + Math.cos(mouseYaw) * camDist;
      const target = new THREE.Vector3(
        camX + (Math.random() - 0.5) * shake * 0.6,
        CAM_HEIGHT + mouseLift + (Math.random() - 0.5) * shake * 0.8,
        camZ
      );
      camera.position.lerp(target, 0.08);
      camera.lookAt(player.position.x, 0.6, player.position.z);

      /* throttled state emit */
      emitTimer += dt;
      if (emitTimer > 0.15 && status === "running") {
        emitTimer = 0;
        emit();
      }

      renderer.render(scene, camera);
      if (status === "running") raf = requestAnimationFrame(tick);
    };

    /* NPC flow-field follow */
    const tmpTarget = new THREE.Vector3();
    function updateNpcs(dt: number) {
      fieldTimer += dt;
      if (fieldDirty && fieldTimer > 0.5) {
        rebuildField();
        fieldTimer = 0;
      }
      for (const npc of npcs) {
        if (npc.dead) {
          npc.deadTimer -= dt;
          if (npc.deadTimer <= 0 && npc.fade > 0) {
            npc.fade = Math.max(0, npc.fade - dt);
            (npc.mesh.material as THREE.MeshStandardMaterial).opacity = npc.fade * 0.9;
          }
          continue;
        }
        const c = Math.round(npc.mesh.position.x / CELL + cols / 2 - 0.5);
        const r = Math.round(npc.mesh.position.z / CELL + rows / 2 - 0.5);
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        const idx = idxOf(c, r);

        /* caught in fire → casualty */
        if (fireSet.has(idx)) {
          npc.deadTimer += dt;
          if (npc.deadTimer > 1.2) {
            npc.dead = true;
            (npc.mesh.material as THREE.MeshStandardMaterial).color.set(0xef4444);
            (npc.mesh.material as THREE.MeshStandardMaterial).emissive.set(0x331111);
            (npc.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
            continue;
          }
        }

        const here = distField[idx];
        if (here === 0) {
          /* evacuated */
          npc.fade -= dt * 2;
          npc.mesh.scale.setScalar(Math.max(0.01, npc.fade));
          (npc.mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, npc.fade);
          if (npc.fade <= 0) npc.mesh.visible = false;
          continue;
        }
        if (here === -1) continue; /* no known path - stand still */

        /* pick best neighbor toward exit */
        let bestD = here;
        let bc = c, br = r;
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const nc = c + dc;
          const nr = r + dr;
          if (!passableForNpc(nc, nr)) continue;
          const nd = distField[idxOf(nc, nr)];
          if (nd !== -1 && nd < bestD) { bestD = nd; bc = nc; br = nr; }
        }
        tmpTarget.copy(cellToWorld(bc, br));
        const inSmoke = smokeSet.has(idx);
        const spd = npc.speed * (inSmoke ? 0.5 : 1);
        const dir = tmpTarget.sub(npc.mesh.position);
        dir.y = 0;
        if (dir.lengthSq() > 0.001) {
          dir.normalize().multiplyScalar(spd * dt);
          npc.mesh.position.add(dir);
        }
        /* simple separation so they don't stack perfectly */
        for (const other of npcs) {
          if (other === npc || other.dead || other.fade <= 0) continue;
          const dx = npc.mesh.position.x - other.mesh.position.x;
          const dz = npc.mesh.position.z - other.mesh.position.z;
          const d2 = dx * dx + dz * dz;
          if (d2 > 0.0001 && d2 < 0.64) {
            const push = (0.8 - Math.sqrt(d2)) * 0.5;
            npc.mesh.position.x += (dx / Math.sqrt(d2)) * push * dt * 4;
            npc.mesh.position.z += (dz / Math.sqrt(d2)) * push * dt * 4;
          }
        }
      }
    }

    /* audio driven by live sim state */
    function updateAudio(dt: number, pc: number, pr: number, pIdx: number) {
      if (!audioCtx || !crackleGain) return;
      /* crackle loudness from proximity to nearest burning cell */
      let nearest = Infinity;
      fireSet.forEach((idx) => {
        const fc = idx % cols;
        const fr = Math.floor(idx / cols);
        const d = Math.max(Math.abs(fc - pc), Math.abs(fr - pr));
        if (d < nearest) nearest = d;
      });
      const level = Number.isFinite(nearest) ? Math.max(0, 1 - nearest / 6) : 0;
      crackleGain.gain.value += (level * 0.28 - crackleGain.gain.value) * Math.min(1, dt * 3);

      /* heartbeat speeds up with panic */
      beatTimer -= dt;
      if (beatTimer <= 0 && panic > 30) {
        const bpm = 55 + (panic / 100) * 85;
        beatTimer = 60 / bpm;
        thump(0.12 + (panic / 100) * 0.15);
        setTimeout(() => thump(0.07), 120);
      }
      void pIdx;
    }

    camera.position.set(player.position.x, 13, player.position.z + 9.5);
    rebuildField();
    emit();
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      if (alarmInterval) clearInterval(alarmInterval);
      try { audioCtx?.close(); } catch { /* already closed */ }
      scene.traverse((o) => {
        const obj = o as THREE.Mesh;
        if (obj.geometry) obj.geometry.dispose();
        const m = obj.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
      <div className={styles.touchControls}>
        <div
          ref={joystickBaseRef}
          className={styles.joystickBase}
          onPointerDown={onJoystickDown}
          onPointerMove={onJoystickMove}
          onPointerUp={onJoystickUp}
          onPointerCancel={onJoystickUp}
        >
          <div ref={joystickKnobRef} className={styles.joystickKnob} />
        </div>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={`${styles.actionBtn} ${crouchPressed ? styles.actionBtnActive : ""}`}
            onPointerDown={setCrouch(true)}
            onPointerUp={setCrouch(false)}
            onPointerLeave={setCrouch(false)}
            onPointerCancel={setCrouch(false)}
            aria-label="Crouch"
          >
            CROUCH
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${breathePressed ? styles.actionBtnActive : ""}`}
            onPointerDown={setBreathe(true)}
            onPointerUp={setBreathe(false)}
            onPointerLeave={setBreathe(false)}
            onPointerCancel={setBreathe(false)}
            aria-label="Box-breathe"
          >
            BREATHE
          </button>
        </div>
      </div>
    </>
  );
}
