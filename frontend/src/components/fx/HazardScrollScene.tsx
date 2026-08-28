"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImmersiveScene from "@/components/fx/ImmersiveScene";

gsap.registerPlugin(ScrollTrigger);

interface HazardScrollSceneProps {
  accent?: string;
  secondary?: string;
  className?: string;
}

/**
 * Cinematic sci-fi hazard scroll scene — GSAP ScrollTrigger 3-act.
 *  Keep ImmersiveScene.tsx as fallback (wireframe low-level).
 *  This version is high-visual: PBR glass tower, emissive window grids,
 *  podium + halo, volumetric dust, scroll-scrubbed collapse / tsunami / fire.
 *
 *  Act 1 (0.00-0.33) — Collapse: floors shear + fall, rubble, dust burst
 *  Act 2 (0.33-0.66) — Tsunami: water plane rises through podium, debris floats
 *  Act 3 (0.66-1.00) — Fire: ember points + volumetric glow engulf tower
 *
 *  Inspo: design.inspo #3 neuform.io, #4 scrolltide.co, #27 horizonX, #6 GSAP timelines
 */
export default function HazardScrollScene({
  accent = "#00D4AA",
  secondary = "#3B82F6",
  className = "",
}: HazardScrollSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReduced(reduced);
    const mount = mountRef.current;
    if (!mount || reduced) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050810, 0.028);
    scene.background = new THREE.Color(0x050810);

    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 180);
    camera.position.set(0, 6, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const cAccent = new THREE.Color(accent);
    const cSecondary = new THREE.Color(secondary);
    const cAccentDim = cAccent.clone().multiplyScalar(0.6);
    const cDark = new THREE.Color(0x0a0f1e);

    // Lights — cinematic
    scene.add(new THREE.AmbientLight(0x8ea0c8, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(12, 18, 10);
    scene.add(key);
    const rim = new THREE.DirectionalLight(cSecondary.getHex(), 0.9);
    rim.position.set(-14, 10, -10);
    scene.add(rim);
    const fillPoint = new THREE.PointLight(cAccent.getHex(), 18, 40);
    fillPoint.position.set(0, 8, 0);
    scene.add(fillPoint);
    const firePoint = new THREE.PointLight(0xff6a1a, 0, 30);
    firePoint.position.set(0, 4, 0);
    scene.add(firePoint);

    // Fog/dust particles — large soft
    const DUST_COUNT = 1800;
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const dustCol = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 70;
      dustPos[i * 3 + 1] = Math.random() * 28 - 4;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      const m = Math.random() > 0.5 ? cAccent : cSecondary;
      const j = 0.85 + Math.random() * 0.3;
      dustCol[i * 3] = m.r * j;
      dustCol[i * 3 + 1] = m.g * j;
      dustCol[i * 3 + 2] = m.b * j;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustCol, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Terrain — subtle, cinematic, not wireframe meh
    const tGeo = new THREE.PlaneGeometry(120, 120, 64, 64);
    const tMat = new THREE.MeshStandardMaterial({
      color: 0x0e162e,
      roughness: 0.92,
      metalness: 0.08,
      transparent: true,
      opacity: 0.95,
    });
    const terrain = new THREE.Mesh(tGeo, tMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -5.8;
    scene.add(terrain);
    const tPos = tGeo.attributes.position as THREE.BufferAttribute;
    const tBase = (tPos.array as Float32Array).slice();

    // Podium + city halo
    const podium = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.9, 18),
      new THREE.MeshStandardMaterial({ color: 0x131c36, roughness: 0.8, metalness: 0.15, emissive: cDark, emissiveIntensity: 0.3 } as THREE.MeshStandardMaterialParameters)
    );
    podium.position.y = -4.95;
    scene.add(podium);
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(9.5, 10.2, 64),
      new THREE.MeshBasicMaterial({ color: cAccent, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = -4.48;
    scene.add(halo);

    // --- Sci-fi tower: PBR glass + window grid + edge glow ---
    const tower = new THREE.Group();
    scene.add(tower);

    interface FloorEntry {
      solid: THREE.Mesh;
      edge: THREE.LineSegments;
      windows: THREE.InstancedMesh;
      y0: number;
    }
    const floors: FloorEntry[] = [];
    const floorCount = 7;
    for (let f = 0; f < floorCount; f++) {
      const t = f / (floorCount - 1);
      const w = 5.2 - t * 1.2;
      const d = 5.2 - t * 1.1;
      const h = 1.35;
      const y = -4.4 + f * 1.48;

      // Solid glass block — high-poly cinematic scifi (beveled, clearcoat, fresnel)
      const solidGeo = new THREE.BoxGeometry(w, h, d, 8, 3, 8);
      const solidMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().lerpColors(cDark, cAccentDim, 0.15 + t * 0.12),
        roughness: 0.22,
        metalness: 0.28,
        transparent: true,
        opacity: 0.93,
        emissive: cAccent,
        emissiveIntensity: 0.08 + t * 0.05,
        transmission: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        ior: 1.45,
      } as THREE.MeshPhysicalMaterialParameters);
      const solid = new THREE.Mesh(solidGeo, solidMat);
      solid.position.y = y;
      tower.add(solid);

      // Edge glow — cinematic wireframe but with depth (not meh flat lines)
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w + 0.04, h + 0.04, d + 0.04)),
        new THREE.LineBasicMaterial({ color: f % 2 === 0 ? cAccent : cSecondary, transparent: true, opacity: 0.72 })
      );
      edge.position.y = y;
      tower.add(edge);

      // Window grid — instanced emissive slits per floor (scifi)
      const winCount = 14;
      const winGeo = new THREE.PlaneGeometry(0.22, 0.42);
      const winMat = new THREE.MeshBasicMaterial({ color: cAccent, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
      const inst = new THREE.InstancedMesh(winGeo, winMat, winCount * 4);
      let idx = 0;
      const dummy = new THREE.Object3D();
      const faces = [
        { n: new THREE.Vector3(0, 0, 1), off: d / 2 + 0.02 },
        { n: new THREE.Vector3(0, 0, -1), off: d / 2 + 0.02 },
        { n: new THREE.Vector3(1, 0, 0), off: w / 2 + 0.02 },
        { n: new THREE.Vector3(-1, 0, 0), off: w / 2 + 0.02 },
      ];
      for (const face of faces) {
        for (let k = 0; k < winCount / 4; k++) {
          const x = (Math.random() - 0.5) * (w * 0.76);
          const z = (Math.random() - 0.5) * (d * 0.76);
          const isFront = face.n.z !== 0;
          dummy.position.set(
            isFront ? x : face.n.x * face.off,
            y + (Math.random() - 0.5) * 0.55,
            isFront ? face.n.z * face.off : z
          );
          dummy.rotation.y = face.n.x !== 0 ? Math.PI / 2 : 0;
         _dummyUpdate(dummy, inst, idx++);
        }
      }
      // Fill remaining with hidden
      for (; idx < inst.count; idx++) {
_dummyUpdate(dummy, inst, idx, true);
      }
      inst.instanceMatrix.needsUpdate = true;
      tower.add(inst);
      floors.push({ solid, edge, windows: inst, y0: y });
    }

    function _dummyUpdate(d: THREE.Object3D, inst: THREE.InstancedMesh, i: number, hide = false) {
      if (hide) d.position.set(999, 999, 999);
      d.updateMatrix();
      inst.setMatrixAt(i, d.matrix);
    }

    // Crown icosa core — more cinematic: shader-ish emissive + inner core
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 6.2;
    const coreOuter = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 1),
      new THREE.MeshStandardMaterial({ color: cAccent, emissive: cAccent, emissiveIntensity: 1.2, roughness: 0.35, metalness: 0.2, wireframe: false, transparent: true, opacity: 0.92 })
    );
    const coreWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.12, 1)),
      new THREE.LineBasicMaterial({ color: cAccent, transparent: true, opacity: 0.9 })
    );
    coreGroup.add(coreOuter, coreWire);
    tower.add(coreGroup);

    // Water plane for Act 2 — tsunami: HIGH-POLY + SHADER (not low-poly flat)
    const waterGeo = new THREE.PlaneGeometry(140, 140, 140, 140); // 19600 verts vs 96² — cinematic density
    const waterUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDeep: { value: new THREE.Color(0x062a4a) },
      uShallow: { value: new THREE.Color(0x1aa3e6) },
      uFoam: { value: new THREE.Color(0xe6f7ff) },
      uOpacity: { value: 0 },
    };
    const waterMat = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: `
        uniform float uTime; uniform float uScroll;
        varying vec2 vUv; varying float vWave; varying vec3 vPos;
        void main(){
          vUv = uv;
          vec3 pos = position;
          // Gerstner-like multi-wave, scroll amplifies
          float a = 0.5 + uScroll * 0.6;
          float w1 = sin(pos.x * 0.14 + uTime * 1.15) * cos(pos.y * 0.11 + uTime * 0.95) * 0.95 * a;
          float w2 = sin(pos.x * 0.08 - uTime * 0.75) * sin(pos.y * 0.09 + uTime * 0.62) * 0.65 * a;
          float w3 = cos(length(pos.xy) * 0.04 + uTime * 1.1) * 0.35 * a;
          pos.z += w1 + w2 + w3;
          vWave = w1 + w2;
          vPos = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFoam; uniform float uOpacity; uniform float uScroll;
        varying vec2 vUv; varying float vWave; varying vec3 vPos;
        void main(){
          // depth gradient + wave-driven shallow
          float depth = smoothstep(-7.0, 7.0, vPos.z + vWave*0.5);
          vec3 col = mix(uDeep, uShallow, depth * (0.55 + uScroll*0.25));
          // foam on crests — high wave = more foam
          float foam = smoothstep(0.42, 0.88, vWave);
          foam *= smoothstep(0.0, 0.4, uScroll); // only when water visible
          col = mix(col, uFoam, foam * 0.72);
          // fresnel rim — scifi sheen
          float fres = pow(1.0 - abs(dot(normalize(vec3(0.0,0.0,1.0)), vec3(0.0,1.0,0.0))), 1.8);
          col += fres * 0.08;
          gl_FragColor = vec4(col, uOpacity * (0.82 + foam*0.18));
        }
      `,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -12;
    water.visible = false;
    scene.add(water);
    // keep CPU base for compatibility but shader now drives waves — no per-vertex JS loop needed

    // Fire ember + flame field — HIGH-POLY SHADER (not low-poly PointsMaterial)
    const EMBER = 1400;
    const ePos = new Float32Array(EMBER * 3);
    const eCol = new Float32Array(EMBER * 3);
    const eSize = new Float32Array(EMBER);
    for (let i = 0; i < EMBER; i++) {
      ePos[i * 3] = (Math.random() - 0.5) * 15;
      ePos[i * 3 + 1] = Math.random() * 9.5 - 1.2;
      ePos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      const t = Math.random();
      const c = new THREE.Color().lerpColors(new THREE.Color(0xfff3a0), new THREE.Color(0xff1a1a), t * 0.85 + 0.15);
      // bias core to yellow-white, tips to red
      eCol[i * 3] = c.r; eCol[i * 3 + 1] = c.g; eCol[i * 3 + 2] = c.b;
      eSize[i] = 0.08 + Math.random() * 0.18;
    }
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3));
    eGeo.setAttribute("color", new THREE.BufferAttribute(eCol, 3));
    eGeo.setAttribute("size", new THREE.BufferAttribute(eSize, 1));
    const emberUniforms = { uTime: { value: 0 }, uOpacity: { value: 0 } };
    const eMat = new THREE.ShaderMaterial({
      uniforms: emberUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        attribute float size; attribute vec3 color;
        varying vec3 vColor; varying float vAlpha;
        uniform float uTime;
        void main(){
          vColor = color;
          vec3 pos = position;
          // turbulent rise + swirl, not uniform lift
          float n = sin(uTime * 0.9 + pos.x * 0.8) * 0.12 + cos(uTime * 1.1 + pos.z * 0.7) * 0.1;
          pos.y += uTime * 0.28 + n;
          pos.x += sin(uTime * 0.6 + length(pos.xz) * 0.4) * 0.08;
          // flicker size
          float flick = 1.0 + sin(uTime * 12.0 + pos.y * 3.0 + pos.x * 5.0) * 0.45;
          vAlpha = 0.85 + sin(uTime * 7.0 + pos.y) * 0.15;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * flick * (420.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha; uniform float uOpacity;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float alpha = smoothstep(0.5, 0.18, d) * vAlpha * uOpacity;
          // hot core white-yellow
          vec3 col = mix(vec3(1.0,0.96,0.72), vColor, smoothstep(0.0, 0.52, d));
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const embers = new THREE.Points(eGeo, eMat);
    scene.add(embers);

    // Additional flame volume — large additive planes at tower base (not just points)
    const flameField = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(
        new THREE.PlaneGeometry(7 + i * 1.8, 5.5 + i * 0.9),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff5a1a).lerp(new THREE.Color(0xffb700), Math.random()*0.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
      );
      p.position.set((Math.random()-0.5)*2.5, 0.8 + i*0.45, (Math.random()-0.5)*2.5);
      p.rotation.y = (i / 5) * Math.PI;
      flameField.add(p);
    }
    flameField.visible = false;
    scene.add(flameField);

    // Debris for collapse — lifted by tsunami (floating)
    const debris: THREE.Mesh[] = [];
    for (let i = 0; i < 18; i++) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.5 + Math.random() * 0.9, 0.2 + Math.random() * 0.4, 0.5 + Math.random() * 0.9),
        new THREE.MeshStandardMaterial({ color: 0x2a334d, roughness: 0.95 })
      );
      m.position.set((Math.random() - 0.5) * 8, -4.2 + Math.random() * 0.6, (Math.random() - 0.5) * 8);
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      m.visible = false;
      // store original for float phase
      (m as unknown as { baseY: number }).baseY = m.position.y;
      scene.add(m);
      debris.push(m);
    }

    // Cinematic full-screen fire+smoke curtain — covers lens before hero reveal
    // Impeccable: one decisive motion, not many; emil: ease-out for enter
    const curtainGeo = new THREE.PlaneGeometry(36, 36, 1, 1);
    const curtainUniforms = { uTime: { value: 0 }, uOpacity: { value: 0 }, uCover: { value: 0 } };
    const curtainMat = new THREE.ShaderMaterial({
      uniforms: curtainUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime; uniform float uOpacity; uniform float uCover;
        varying vec2 vUv;
        // taste: no neon purple — warm fire + cold smoke only
        void main(){
          vec2 uv = vUv;
          // turbulent smoke wisps
          float n1 = sin(uv.x*6.0 + uTime*0.22) * cos(uv.y*4.5 + uTime*0.18) * 0.12;
          float n2 = sin(uv.x*12.0 - uTime*0.31) * 0.06;
          float smoke = smoothstep(0.35, 0.92, length(uv - 0.5) * 1.35 + n1 + n2);
          // fire tongues from bottom
          float fire = smoothstep(0.75, 0.05, uv.y + sin(uv.x*8.0 + uTime*0.85)*0.07 + n1*0.4);
          fire *= smoothstep(0.0, 0.45, uCover);
          fire *= (0.72 + sin(uTime*3.2 + uv.x*14.0)*0.18);
          vec3 smokeCol = mix(vec3(0.06,0.08,0.11), vec3(0.22,0.24,0.28), smoke*0.55 + uCover*0.2);
          vec3 fireCol = mix(vec3(0.95,0.42,0.08), vec3(0.62,0.12,0.02), fire*0.6 + uv.y*0.2);
          // composite: smoke base + fire on top where cover is high
          vec3 col = mix(smokeCol, fireCol, fire * (0.85 + 0.15 * sin(uTime*5.0)));
          float alpha = clamp(uOpacity * (0.92 + smoke*0.08 + fire*0.22), 0.0, 1.0);
          // vignette so edges stay dark, center burns
          float vig = smoothstep(0.82, 0.45, length(uv - 0.5));
          alpha *= mix(0.72, 1.0, vig);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const curtain = new THREE.Mesh(curtainGeo, curtainMat);
    curtain.position.set(0, 0, -9.5);
    curtain.frustumCulled = false;
    curtain.visible = false;
    camera.add(curtain);
    scene.add(camera); // ensure camera is in scene graph for add

    // Scroll progress (0..1) driven by page scroll
    let scrollP = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    // --- GSAP Timeline driven by full page scroll ---
    const tl = gsap.timeline({ paused: true });

    const updateScrollProgress = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      scrollP = p;
      tl.progress(p, false);
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        scrollP = self.progress;
        tl.progress(self.progress, false);
      },
    });

    // Act 1 collapse — stagger floors
    floors.forEach((fl, i) => {
      const delay = i * 0.03;
      tl.to(fl.solid.position, { y: -5.2 + Math.random() * 0.5, duration: 0.18, ease: "power2.in" }, 0.02 + delay);
      tl.to(fl.solid.rotation, { z: (Math.random() - 0.5) * 0.5, x: (Math.random() - 0.5) * 0.35, duration: 0.22, ease: "power2.in" }, 0.02 + delay);
      tl.to(fl.edge.material, { opacity: 0.05, duration: 0.25 }, 0.02 + delay);
      tl.to(fl.windows.material, { opacity: 0.0, duration: 0.2 }, 0.04 + delay);
    });
    tl.to(halo.material, { opacity: 0.0, duration: 0.15 }, 0.05);
    tl.to(dustMat, { opacity: 0.0, duration: 0.15 }, 0.05); // dust cleared before water

    // Act 2 water — shader opacity via uniform
    tl.add(() => { water.visible = true; }, 0.33);
    tl.to(water.position, { y: 4.2, duration: 0.28, ease: "sine.inOut" }, 0.33);
    tl.to(waterUniforms.uOpacity, { value: 0.92, duration: 0.22, ease: "sine.inOut" }, 0.33);
    tl.to(debris.map((d) => d.position), { y: 2.5, duration: 0.15, stagger: 0.01 } as unknown as gsap.TweenVars, 0.38); // float
    // Act 2 -> Act 3 transition: water recedes as fire takes over
    tl.to(water.position, { y: -2, duration: 0.18, ease: "sine.inOut" }, 0.62);
    tl.to(waterUniforms.uOpacity, { value: 0.0, duration: 0.18, ease: "sine.inOut" }, 0.62);

    // Act 3 fire — shader uniforms + flame field fade
    tl.add(() => { flameField.visible = true; }, 0.66);
    tl.to(emberUniforms.uOpacity, { value: 0.95, duration: 0.22, ease: "sine.out" }, 0.66);
    flameField.children.forEach((m, i) => {
      const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial;
      tl.to(mat, { opacity: 0.42 - i * 0.05, duration: 0.24, ease: "sine.out" }, 0.66 + i * 0.02);
    });
    tl.to(firePoint, { intensity: 32, distance: 42, duration: 0.2 }, 0.66);
    tl.to(coreOuter.material as THREE.MeshStandardMaterial, { emissiveIntensity: 2.6, duration: 0.14 }, 0.68);
    tl.to(scene.fog as THREE.FogExp2, { density: 0.072, duration: 0.2 } as unknown as gsap.TweenVars, 0.68);

    // Act 3 → Cover: fire+smoke curtain over lens before hero reveal (emil: one decisive enter, ease-out)
    tl.add(() => { curtain.visible = true; }, 0.74);
    tl.to(curtainUniforms.uCover, { value: 1, duration: 0.2, ease: "power2.out" }, 0.74);
    tl.to(curtainUniforms.uOpacity, { value: 1, duration: 0.2, ease: "power2.out" }, 0.74);
    // hold fully covered 0.82-0.96 — hero stays hidden behind curtain
    tl.to(curtainUniforms.uOpacity, { value: 1, duration: 0.14 }, 0.82);
    // gentle fade at very end so hero can breathe as pin releases — still cinematic
    tl.to(curtainUniforms.uOpacity, { value: 0.0, duration: 0.12, ease: "power1.inOut" }, 0.96);

    // Ensure initial state
    debris.forEach((d) => (d.visible = true));
    tl.progress(0, false);

    // Tick — render + subtle ambient anim independent of scroll scrub
    const onResize = () => {
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let lastAct = -1;
    const tick = () => {
      const t = clock.getElapsedTime();
      // Emil/Impeccable: single purposeful motion — camera orbit only, no spin soup
      // Dust holds still (was rotating) — only subtle opacity, not rotation
      dust.position.y = -0.2 + Math.sin(t * 0.18) * 0.08; // barely breathing

      // Water shader uniforms — high-poly Gerstner, not CPU per-vertex loop
      waterUniforms.uTime.value = t;
      waterUniforms.uScroll.value = scrollP;
      curtainUniforms.uTime.value = t;

      // Tsunami lift: debris floats with water — building particles up with tide
      if (scrollP > 0.34 && scrollP < 0.68) {
        debris.forEach((d, i) => {
          d.position.y += Math.sin(t * 0.55 + i * 0.9) * 0.0012;
          d.rotation.x += 0.0009;
          d.rotation.z += 0.0011;
        });
      }

      // Embers — shader-driven (no rotation, was embers.rotation.y)
      emberUniforms.uTime.value = t;
      // Flame field holds — no sway/rotation, only intensity via uniforms

      // Core holds static — was spinning 0.35 rad/s, now still for calm scifi
      fillPoint.intensity = 16 + Math.sin(t * 0.45) * 1.2 + scrollP * 2.0;

      // ── 360° orbit around tower — completes exactly when tsunami starts (scrollP 0→0.33)
      // radius 17, height rises 6→8.5 during orbit, then holds with slow drift
      const orbitRadius = 17;
      const orbitProgress = Math.min(scrollP / 0.33, 1);
      const orbitAngle = orbitProgress * Math.PI * 2; // 0→360°
      // smooth lerp so ScrollTrigger scrub 1 doesn't jitter
      const targetX = Math.cos(orbitAngle) * orbitRadius;
      const targetZ = Math.sin(orbitAngle) * orbitRadius;
      const targetY = 6 + orbitProgress * 2.2 + (scrollP > 0.33 ? (scrollP - 0.33) * 2.0 : 0); // continue gentle rise
      // after orbit completes, add slow ambient drift so scene stays alive
      const driftX = scrollP > 0.33 ? Math.sin(t * 0.07) * 0.9 : 0;
      const driftZ = scrollP > 0.33 ? Math.cos(t * 0.06) * 0.9 : 0;
      camera.position.x += (targetX + driftX - camera.position.x) * 0.06;
      camera.position.z += (targetZ + driftZ - camera.position.z) * 0.06;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 1.2 + scrollP * 1.8, 0);

      const act = scrollP < 0.33 ? 0 : scrollP < 0.66 ? 1 : 2;
      if (act !== lastAct) {
        lastAct = act;
        gsap.to(camera.position, { z: camera.position.z - 0.6, duration: 0.28, yoyo: true, repeat: 1, ease: "sine.inOut" });
      }

      // Terrain — barely breathing, not rotating (emil: reduce frequency)
      const arr2 = (tGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < arr2.length; i += 3) {
        const x = tBase[i];
        const y = tBase[i + 1];
        arr2[i + 2] = Math.sin(x * 0.14 + t * 0.22) * Math.cos(y * 0.12 + t * 0.18) * 0.18;
      }
      (tGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      tl.scrollTrigger?.kill(true);
      tl.kill();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateScrollProgress);
      scene.traverse((o) => {
        const obj = o as THREE.Mesh;
        if (obj.geometry) obj.geometry.dispose();
        const m = obj.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [accent, secondary]);

  return (
    <>
      <div ref={mountRef} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, display: isReduced ? "none" : "block" }} />
      {isReduced && (
        <div aria-hidden="true" className={className} style={{ position: "absolute", inset: 0 }}>
          <ImmersiveScene />
        </div>
      )}
    </>
  );
}
