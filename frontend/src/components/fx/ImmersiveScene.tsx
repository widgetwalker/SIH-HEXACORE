"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ImmersiveSceneProps {
  accent?: string;
  secondary?: string;
  className?: string;
}

/**
 * Full-viewport WebGL backdrop:
 *  - drifting additive particle field with scroll-responsive colors
 *  - waving wireframe terrain with depth-based animation
 *  - 6-storey wireframe campus tower + rotating icosahedron core
 *  - expanding hazard pulse rings with pulsation
 *  - mouse parallax + scroll-driven camera dolly + color fader
 *  - subtle distant-orbit ring for atmosphere
 */
export default function ImmersiveScene({
  accent = "#00D4AA",
  secondary = "#3B82F6",
  className = "",
}: ImmersiveSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050810, 0.032);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      120
    );
    camera.position.set(0, 3.4, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const cAccent = new THREE.Color(accent);
    const cSecondary = new THREE.Color(secondary);

    /* Particle field — per-particle mix factor stored for scroll-tint */
    const COUNT = 2400;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const mixFactors = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 34 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      const u = Math.random();
      mixFactors[i] = u;
      const c = new THREE.Color().lerpColors(cAccent, cSecondary, u);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* Waving wireframe terrain */
    const tGeo = new THREE.PlaneGeometry(90, 90, 72, 72);
    const tMat = new THREE.MeshBasicMaterial({
      color: cSecondary,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const terrain = new THREE.Mesh(tGeo, tMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -6;
    scene.add(terrain);
    const tPosAttr = tGeo.attributes.position as THREE.BufferAttribute;
    const tBase = (tPosAttr.array as Float32Array).slice();

    /* Depth: distant orbit ring */
    const distRingGeo = new THREE.RingGeometry(25, 27, 64);
    const distRingMat = new THREE.MeshBasicMaterial({
      color: cAccent,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
    });
    const distRing = new THREE.Mesh(distRingGeo, distRingMat);
    distRing.rotation.x = -Math.PI / 2;
    distRing.position.y = -10;
    scene.add(distRing);

    /* Wireframe campus tower */
    const tower = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: cAccent, transparent: true, opacity: 0.55 });
    const lineMatDim = new THREE.LineBasicMaterial({ color: cSecondary, transparent: true, opacity: 0.3 });
    for (let f = 0; f < 6; f++) {
      const w = 4.6 - f * 0.18;
      const box = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, 1.15, w));
      const floor = new THREE.LineSegments(box, f % 2 === 0 ? lineMat : lineMatDim);
      floor.position.y = -4.4 + f * 1.35;
      tower.add(floor);
    }
    const core = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.9, 1)),
      new THREE.LineBasicMaterial({ color: cAccent, transparent: true, opacity: 0.9 })
    );
    core.position.y = 4.6;
    tower.add(core);
    scene.add(tower);

    /* Expanding hazard pulse rings */
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.98, 1, 96),
        new THREE.MeshBasicMaterial({
          color: cAccent,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -4.9;
      scene.add(ring);
      rings.push(ring);
    }

    /* Interaction state */
    let mx = 0, my = 0, tx = 0, ty = 0, scrollP = 0, raf = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollP = window.scrollY / max;
    };
    const onResize = () => {
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();

      tx += (mx - tx) * 0.04;
      ty += (my - ty) * 0.04;

      camera.position.x = tx * 2.2;
      camera.position.y = 3.4 + ty * -1.2 + scrollP * 4.5;
      camera.position.z = 15 - scrollP * 5;
      camera.lookAt(0, scrollP * 3, 0);

      particles.rotation.y = t * 0.015;
      tower.rotation.y = t * 0.12 + scrollP * Math.PI * 0.75;
      core.rotation.x = t * (0.4 + scrollP * 0.1);
      core.rotation.y = t * (0.55 + scrollP * 0.2);
      core.position.y = 4.6 + Math.sin(t * (1.4 + scrollP * 0.3)) * 0.25;

      /* Scroll-tint particles + opacity fade (inspired by scrolltide.co / neuform.io depth) */
      // subtle opacity fade on scroll so foreground stays legible
      (particles.material as THREE.PointsMaterial).opacity = 0.75 - scrollP * 0.18;
      // re-tint ~10x/sec to avoid per-frame cost
      if (Math.floor(t * 10) % 3 === 0) {
        const colAttr = pGeo.getAttribute("color") as THREE.BufferAttribute;
        const arr = colAttr.array as Float32Array;
        const tint = scrollP * 0.4; // 0..0.4 shift toward secondary
        for (let i = 0; i < COUNT; i++) {
          const u = mixFactors[i];
          // base mix + scroll bias toward secondary
          const bias = Math.min(1, u + tint * (1 - u) * 0.6);
          const c = new THREE.Color().lerpColors(cAccent, cSecondary, bias);
          arr[i * 3] = c.r;
          arr[i * 3 + 1] = c.g;
          arr[i * 3 + 2] = c.b;
        }
        colAttr.needsUpdate = true;
      }

      /* Distant orbit ring rotation */
      distRing.rotation.y = t * 0.08 + scrollP * 0.3;
      distRing.rotation.x = Math.sin(t * 0.5) * 0.1;

      const arr = (tGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const x = tBase[i];
        const y = tBase[i + 1];
        const wave = Math.sin(x * 0.28 + t * 0.7 + scrollP * 2) * Math.cos(y * 0.24 + t * 0.5 - scrollP * 1.5);
        arr[i + 2] = wave * (1 + scrollP * 0.2) * 1.15;
      }
      tGeo.attributes.position.needsUpdate = true;

      rings.forEach((ring, i) => {
        const p = (t * 0.35 + i / 3) % 1;
        const s = 1 + Math.sin(t * 2 + i) * 0.3 + p * 12;
        ring.scale.set(s, s, s);
        const baseOpacity = 0.45 * (1 - p);
        (ring.material as THREE.MeshBasicMaterial).opacity = baseOpacity * (0.7 + Math.sin(t * 3 + i) * 0.3);
      });

      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    onScroll();
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
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
  }, [accent, secondary]);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    />
  );
}
