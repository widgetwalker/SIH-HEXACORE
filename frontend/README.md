# SafeZone Frontend — SIH 2026 (HEXACORE)

> Gamified disaster-preparedness for Indian campuses: landing + learn + 3D simulate + command + admin. `npm run dev` → http://localhost:3000

## Quick Start
Run from inside this `frontend/` folder (where `package.json` lives):
```bash
npm install
npm run dev     # Turbopack @ http://localhost:3000
npm run build   # production check (must stay green)
```
On PowerShell, `&&` isn't a valid separator between commands — run each line above on its own, or join with `;`.

Requires Node 18.17+ / 20+ · Next.js 16.3.2 (App Router, Turbopack) · React 19 · Three.js r149

No `.env` file, database, or backend is required — the whole app installs, builds, and runs on a bare clone. The only optional piece is `GEMINI_API_KEY` in `.env.local`, which powers Mitra's chat replies in `/simulate`; without it Mitra just shows "offline" instead of breaking anything.

## Routes
| Route | File | What lives there |
|-------|------|------------------|
| `/` | `src/app/page.tsx` → `LandingPage` | ImmersiveScene WebGL backdrop, hero, stats, pillars, radar CTA |
| `/learn` | `src/app/learn/page.tsx` | 5 age tiers + modules + badges |
| `/simulate` | `src/app/simulate/page.tsx` | Briefing → playable drill (`EvacuationGame`) → generated debrief |
| `/command` | `src/app/command/page.tsx` | Floor matrix + blueprint SVG + CAP feed |
| `/admin` | `src/app/admin/page.tsx` | KPIs + canvas heatmap + drill log |

## Simulation controls (`/simulate`)
WASD/Arrows move · SHIFT crawl (saves O₂ in smoke) · B hold box-breathe (drops panic) · walk into amber **D**oor to open (doors block fire/smoke until opened) · reach any green **E** beacon to evacuate.

## Design system
`src/app/globals.css` is the source of truth: **Geist** font (stitch taste bans Inter), CSS vars (`--accent-*`, `--bg-*`, `--border-*`), `.hud-panel`, `.btn-*`, `.badge-*`, `noise-overlay`, keyframes. Prefer vars over hardcoded hex so scenarios can theme.

## FX & animation layer (updated Aug 26 v3 — 360° slow, shader cover)
| Technique | Where | Inspo from `~/Desktop/design.inspo` |
|-----------|-------|--------------------------------------|
| **GSAP** `gsap.to / fromTo` | `SimulatePage.tsx: vignette` (panic>60 opacity 0.3s power2.inOut) + `Mitra` panel slide/fade | GSAP benchmark for timelines |
| **GSAP ScrollTrigger** pin scrub 300% | `HazardScrollScene.tsx` 3-act (collapse→tsunami→fire) pinned `.scene`, scrub 1 | scrolltide.co + GSAP |
| **CSS spring** `cubic-bezier(0.23,1,0.32,1)` 220ms panic / 400ms O₂ | HUD meters — emil: UI <300ms, panic urgent. Per-hazard ScenarioEffects replace generic blur | emilkowalski + stitch taste |
| **react-spring** installed | kept as asset for future `animated.div` meters (currently CSS-driven to stay TS-clean) | React Spring physics |
| **ImmersiveScene** (fallback) scroll-tint | `ImmersiveScene.tsx` particles `mixFactors[]` + tint, terrain wave, orbit ring — kept intact | scrolltide.co / neuform.io / horizonX depth |
| **HazardScrollScene** cinematic scifi (360° slow) | **Slow 360° orbit 0→0.33 (camera circles as building collapses, single purposeful motion — emil), PBR glass tower 7 floors `BoxGeometry 8,3,8 clearcoat 1.0`, emissive `InstancedMesh` windows, water `ShaderMaterial 140×140 Gerstner + foam`, fire `ShaderMaterial embers 1400 + curtain` covering screen before hero — all from `design.inspo` | neuform.io / podium-studios / recent.design / GSAP ScrollTrigger |
| **ScenarioEffects** per-hazard overlays | `ScenarioEffects.tsx` (framer-motion): quake screen shake + debris, fire spread glow + embers, toxic gas clouds + chromatic aberration, blackout flashlight + flicker — replaces generic blur vignette | stitch taste + emil (UI <300ms) |
| **Reveal / Parallax / Tilt / Ripple / CountUp / CustomCursor** | `src/components/fx/` | existing FX layer |

> **Why 360° slow + cinematic cover?** Per `emilkowalski` (one decisive motion, not spin-soup) and `impeccable`/`tasteskill` — single slow 360° as building collapses (0→0.33) feels deliberate, tsunami lifts debris (0.33→0.66), fire+smoke curtain covers lens (0.74→0.96) before hero `TRAIN TODAY` reveals — judges feel disaster arc, not decoration. `prefers-reduced-motion` falls back to `ImmersiveScene`.

## Scenarios
`src/data/scenarios.json` → `floorplan.ts` parses `#` wall `.` floor `P` spawn `E` exit `F` fire seed `D` door. Add a new entry, no code change. See `docs/08_CURRENT_IMPLEMENTATION_STATUS.md §2.2` for full legend + 4 shipped maps.

## Telemetry
`telemetry.ts` → `saveRun/loadRuns` → `localStorage` key `safezone_drill_runs_v1` (cap 500). `generateDebrief(run)` builds ✓/✗ lines from real behavior. Admin heatmap aggregates `routeHeat[]` per cell.

## Conventions (read `AGENTS.md` before coding)
- Check `node_modules/next/dist/docs/` for this Next.js version — APIs may differ from training data.
- All `<Link>` use `prefetch` where possible.
- `touch-action: manipulation`, `-webkit-tap-highlight-color: transparent` globally; `:active scale(0.95)` on interactives.
- Cleanup Three.js: dispose geometries/materials, `cancelAnimationFrame`, remove listeners, `renderer.dispose()`.

## Useful files
`src/components/fx/ImmersiveScene.tsx` · `src/components/simulate/game/EvacuationGame.tsx` (856 lines) · `src/components/simulate/SimulatePage.tsx` · `src/data/scenarios.json` · `src/app/globals.css`
