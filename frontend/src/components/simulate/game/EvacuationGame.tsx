"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface GameState {
  status: "running" | "won" | "lost";
  time: number;
  oxygen: number;
  panic: number;
  crouching: boolean;
  breathing: boolean;
  message: string;
  score: number;
}

interface Props {
  onState: (s: GameState) => void;
}

/*
 * Playable evacuation drill (doc 02 §2 runtime loop):
 *  - procedural fire ignition + cell-to-cell spread
 *  - smoke layer: drains oxygen unless crawling (SHIFT)
 *  - panic meter: proximity-driven; >70 causes cognitive freeze (slow);
 *    hold B to box-breathe and recover
 *  - outcome resolution: reach assembly beacon = won, O2 empty / timeout = lost
 */

const MAP = [
  "########################",
  "#P........#........#...#",
  "#.........#........#...#",
  "#.....##..#..##....#.F.#",
  "####.###########.###.###",
  "#......................#",
  "#......................#",
  "###.#######.#######.####",
  "#.....#........#.......#",
  "#..F..#........#.......#",
  "#.....#...##...#...#####",
  "#.....#........#...#..E#",
  "###.###.....##.#...#...#",
  "#.......#......#.......#",
  "#.......#..F...........#",
  "########################",
];
const ROWS = MAP.length;
const COLS = MAP[0].length;
const CELL = 2;
const TIME_LIMIT = 120;

const idxOf = (c: number, r: number) => r * COLS + c;
const cellToWorld = (c: number, r: number) =>
  new THREE.Vector3((c - COLS / 2 + 0.5) * CELL, 0, (r - ROWS / 2 + 0.5) * CELL);

export default function EvacuationGame({ onState }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onStateRef = useRef(onState);
  onStateRef.current = onState;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── scene setup ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050810);
    scene.fog = new THREE.FogExp2(0x050810, 0.02);

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

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 0.7);
    sun.position.set(10, 24, 8);
    scene.add(sun);

    /* ── floor + grid ── */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(COLS * CELL, ROWS * CELL),
      new THREE.MeshLambertMaterial({ color: 0x0d1426 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    const grid = new THREE.GridHelper(COLS * CELL, COLS, 0x1b2745, 0x141d36);
    grid.position.y = 0.01;
    scene.add(grid);

    /* ── walls / spawn / exit / fire seeds ── */
    const walls = new Set<number>();
    const fireSeeds: number[] = [];
    let spawn = cellToWorld(1, 1);
    let exitCell = { c: COLS - 2, r: ROWS - 2 };
    const wallGeo = new THREE.BoxGeometry(CELL, 2.6, CELL);
    const wallMat = new THREE.MeshLambertMaterial({ color: 0x1c2a4d });
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const ch = MAP[r][c];
        if (ch === "#") {
          walls.add(idxOf(c, r));
          const w = new THREE.Mesh(wallGeo, wallMat);
          w.position.copy(cellToWorld(c, r)).setY(1.3);
          scene.add(w);
        } else if (ch === "P") {
          spawn = cellToWorld(c, r);
        } else if (ch === "E") {
          exitCell = { c, r };
        } else if (ch === "F") {
          fireSeeds.push(idxOf(c, r));
        }
      }
    }
    const isWall = (c: number, r: number) =>
      c < 0 || r < 0 || c >= COLS || r >= ROWS || walls.has(idxOf(c, r));

    /* ── assembly beacon ── */
    const exitWorld = cellToWorld(exitCell.c, exitCell.r);
    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 6, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    beacon.position.copy(exitWorld).setY(3);
    scene.add(beacon);
    const beaconRing = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.95, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    beaconRing.rotation.x = -Math.PI / 2;
    beaconRing.position.copy(exitWorld).setY(0.05);
    scene.add(beaconRing);

    /* ── player ── */
    const player = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.42, 0.8, 6, 14),
      new THREE.MeshLambertMaterial({ color: 0x00d4aa, emissive: 0x0a4438 })
    );
    body.position.y = 0.85;
    player.add(body);
    player.position.copy(spawn);
    scene.add(player);

    /* ── fire & smoke visuals ── */
    const fireSet = new Set<number>();
    const smokeSet = new Set<number>();
    const fireMeshes = new Map<number, THREE.Group>();
    const smokeMeshes = new Map<number, THREE.Mesh>();
    const fireMat = new THREE.MeshBasicMaterial({
      color: 0xff7a1a,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0x30363f,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const addFire = (idx: number) => {
      if (fireSet.has(idx) || walls.has(idx)) return;
      fireSet.add(idx);
      const c = idx % COLS;
      const r = Math.floor(idx / COLS);
      const g = new THREE.Group();
      const flameGeo = new THREE.PlaneGeometry(CELL * 0.9, 2.2);
      const f1 = new THREE.Mesh(flameGeo, fireMat);
      f1.position.y = 1.1;
      const f2 = f1.clone();
      f2.rotation.y = Math.PI / 2;
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(CELL * 1.4, CELL * 1.4), glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.04;
      g.add(f1, f2, glow);
      g.position.copy(cellToWorld(c, r));
      scene.add(g);
      fireMeshes.set(idx, g);
    };

    const recomputeSmoke = () => {
      fireSet.forEach((idx) => {
        const c = idx % COLS;
        const r = Math.floor(idx / COLS);
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nc = c + dc;
            const nr = r + dr;
            if (isWall(nc, nr)) continue;
            const nIdx = idxOf(nc, nr);
            if (smokeSet.has(nIdx)) continue;
            smokeSet.add(nIdx);
            const m = new THREE.Mesh(new THREE.PlaneGeometry(CELL, CELL), smokeMat);
            m.rotation.x = -Math.PI / 2;
            m.position.copy(cellToWorld(nc, nr)).setY(1.7);
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
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      keys.add(k);
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

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
    let raf = 0;
    const clock = new THREE.Clock();

    const tryMove = (nx: number, nz: number) => {
      const R = 0.45;
      const pts = [
        [nx - R, nz - R], [nx + R, nz - R], [nx - R, nz + R], [nx + R, nz + R],
      ];
      for (const [x, z] of pts) {
        const c = Math.floor(x / CELL + COLS / 2);
        const r = Math.floor(z / CELL + ROWS / 2);
        if (isWall(c, r)) return false;
      }
      return true;
    };

    const emit = () => {
      const score = Math.max(
        0,
        Math.round(oxygen * 2 + (TIME_LIMIT - time) * 3 + (100 - panic))
      );
      const crouching = keys.has("shift");
      const breathing = keys.has("b");
      const pc = Math.floor(player.position.x / CELL + COLS / 2);
      const pr = Math.floor(player.position.z / CELL + ROWS / 2);
      const pIdx = idxOf(pc, pr);
      let message = "Reach the green ASSEMBLY beacon";
      if (status === "won") message = "Evacuated to assembly point ✓";
      else if (status === "lost") message = oxygen <= 0 ? "Oxygen depleted — casualty" : "Time expired — drill failed";
      else if (fireSet.has(pIdx)) message = "YOU ARE IN FLAMES — GET OUT!";
      else if (breathing) message = "Box-breathing… 4s in, 4s hold, 4s out";
      else if (panic > 70) message = "PANIC HIGH — hold B to box-breathe";
      else if (smokeSet.has(pIdx) && !crouching) message = "Smoke! Hold SHIFT to crawl low";
      else if (player.position.distanceTo(exitWorld) < CELL * 4) message = "Assembly point ahead!";
      onStateRef.current({ status, time, oxygen, panic, crouching, breathing, message, score });
    };

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      if (status === "running") {
        time += dt;
        const crouching = keys.has("shift");
        const breathing = keys.has("b");

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
          if (dx || dz) {
            const len = Math.hypot(dx, dz);
            const nx = player.position.x + (dx / len) * speed * dt;
            const nz = player.position.z + (dz / len) * speed * dt;
            if (tryMove(nx, player.position.z)) player.position.x = nx;
            if (tryMove(player.position.x, nz)) player.position.z = nz;
            player.rotation.y = Math.atan2(dx, dz);
          }
        }
        body.scale.y = crouching ? 0.55 : 1;

        /* hazard effects on player */
        const pc = Math.floor(player.position.x / CELL + COLS / 2);
        const pr = Math.floor(player.position.z / CELL + ROWS / 2);
        const pIdx = idxOf(pc, pr);
        let nearFire = false;
        fireSet.forEach((idx) => {
          const fc = idx % COLS;
          const fr = Math.floor(idx / COLS);
          if (Math.abs(fc - pc) <= 2 && Math.abs(fr - pr) <= 2) nearFire = true;
        });
        if (fireSet.has(pIdx)) {
          oxygen -= 35 * dt;
          panic = Math.min(100, panic + 60 * dt);
        } else if (smokeSet.has(pIdx)) {
          oxygen -= (keys.has("shift") ? 1.2 : 4.5) * dt;
          panic = Math.min(100, panic + 6 * dt);
        }
        if (nearFire) panic = Math.min(100, panic + 8 * dt);
        else if (!smokeSet.has(pIdx)) panic = Math.max(0, panic - 3.5 * dt);
        if (breathing) panic = Math.max(0, panic - 16 * dt);

        /* fire spread */
        spreadTimer += dt;
        if (spreadTimer > 2.6) {
          spreadTimer = 0;
          const next: number[] = [];
          fireSet.forEach((idx) => {
            const c = idx % COLS;
            const r = Math.floor(idx / COLS);
            [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dc, dr]) => {
              if (!isWall(c + dc, r + dr) && Math.random() < 0.45) next.push(idxOf(c + dc, r + dr));
            });
          });
          next.forEach(addFire);
          recomputeSmoke();
        }

        /* outcome resolution */
        if (player.position.distanceTo(exitWorld) < 1.5) status = "won";
        else if (oxygen <= 0) { oxygen = 0; status = "lost"; }
        else if (time >= TIME_LIMIT) status = "lost";
        if (status !== "running") emit();
      }

      /* visuals */
      fireMeshes.forEach((g, idx) => {
        const s = 1 + 0.18 * Math.sin(t * 13 + idx);
        g.children[0].scale.y = s;
        g.children[1].scale.y = 1 + 0.18 * Math.cos(t * 11 + idx);
      });
      beacon.rotation.y = t * 0.8;
      const ringP = (t * 0.7) % 1;
      beaconRing.scale.setScalar(1 + ringP * 2.2);
      (beaconRing.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - ringP);

      /* camera: third-person follow + quake shake intro */
      const shake = Math.max(0, 1 - t / 3);
      const target = new THREE.Vector3(
        player.position.x + (Math.random() - 0.5) * shake * 0.6,
        13 + (Math.random() - 0.5) * shake * 0.8,
        player.position.z + 9.5
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
      raf = requestAnimationFrame(tick);
    };

    camera.position.set(spawn.x, 13, spawn.z + 9.5);
    emit();
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
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
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
}
