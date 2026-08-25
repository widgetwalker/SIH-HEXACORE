# 03. Technical Architecture & Tech Stack Strategy

> **📋 Implementation Status:** This document describes the full design blueprint. For what is currently built and working, see [08_CURRENT_IMPLEMENTATION_STATUS.md](./08_CURRENT_IMPLEMENTATION_STATUS.md).


## 1. Web App vs. Website: Architectural Recommendation

For the Smart India Hackathon (SIH) and nationwide school/college deployment, we explicitly recommend a **High-Performance Progressive Web Application (PWA)** rather than a static website or a heavy native app.

```
+--------------------------------------------------------------------------------------------------+
|                                 ARCHITECTURE TRADE-OFF DECISION                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ OPTION A: STATIC WEBSITE ] ────► ❌ REJECTED                                                 |
|   • Lacks 3D simulation canvas and WebGPU hardware acceleration.                                 |
|   • Fails completely when internet/power drops during real disasters.                            |
|   • Cannot handle sub-50ms bidirectional multi-agency live telemetry.                            |
|                                                                                                  |
|   [ OPTION B: NATIVE DESKTOP/MOBILE APP ] ────► ❌ REJECTED                                      |
|   • High installation barrier: Requires App Store/Play Store/MSI installations.                  |
|   • Incompatible with diverse, locked-down school computer labs (Linux, Windows 7/10, ChromeOS). |
|   • Heavy storage footprint (>500 MB).                                                           |
|                                                                                                  |
|   [ OPTION C: MODERN PROGRESSIVE WEB APP (PWA) ] ────► ✅ RECOMMENDED ARCHITECTURE               |
|   • Zero install barrier: Instant URL access on any browser/Chromebook/mobile phone.             |
|   • 60 FPS 3D Rendering via Three.js / React Three Fiber / WebGPU.                               |
|   • Offline-First Resilience: Service Workers & IndexedDB cache lessons, maps & 3D models.      |
|   • Sub-50ms Latency: Bidirectional WebSockets + WebRTC local mesh sync.                         |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### Comparative Analysis Matrix:

| Evaluation Criteria | Static / Traditional Website | Native Desktop/Mobile App | Our Proposed PWA Web App Architecture |
| :--- | :--- | :--- | :--- |
| **Installation Friction** | Zero install | High (App Store / APK / MSI installer) | **Zero install** (Instant URL access or "Add to Home Screen") |
| **Device Compatibility** | High | Low (Platform-specific builds needed) | **100% Cross-Platform** (Chromebooks, Windows Labs, Android, iOS, macOS) |
| **Offline Disaster Resilience** | None (Fails immediately when network drops) | Good (Local files stored) | **Exceptional** (Service Workers + IndexedDB cache all modules and blueprints) |
| **3D Rendering & Game Physics** | Poor / Not supported | High (Native DirectX/Vulkan) | **Ultra-Smooth** (Three.js / React Three Fiber / WebGPU with 60 FPS) |
| **Real-Time Latency (Alerts/Drills)** | Polling only (> 3000 ms) | Push notifications (Variable 1–5s) | **Sub-50ms** (Bidirectional WebSockets + WebRTC data channels) |
| **Resource Efficiency** | Low memory, no simulation | High memory footprint (> 500 MB) | **Optimized bundle (< 15 MB core)** with lazy-loaded 3D assets |

---

## 2. High-Performance Tech Stack Blueprint

```
+--------------------------------------------------------------------------------------------------+
|                                    FULL-STACK SYSTEM TOPOLOGY                                    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ 1. CLIENT TIER (Progressive Web Application) ]                                               |
|   • Next.js 15 (React 19, App Router, Turbopack)                                                 |
|   • Three.js / React Three Fiber / Drei / Rapier Physics (3D WebGPU Canvas)                      |
|   • Zustand (High-speed atomic client state) + TanStack Query v5                                 |
|   • MapLibre GL / Canvas (Campus GIS Alert Overlays)                                             |
|   • Workbox 7 Service Worker + Dexie.js (IndexedDB Local Offline Cache)                          |
|                                       │                                                          |
|                      Sub-50ms WebSockets + REST API                                              |
|                                       ▼                                                          |
|   [ 2. API GATEWAY & REAL-TIME TRANSPORT TIER ]                                                  |
|   • FastAPI (Python 3.12, AsyncIO, Uvicorn / Granian)                                            |
|   • WebSocket Hub (python-socketio + Redis Pub/Sub Session Broker)                              |
|   • CAP v1.2 Ingestion Engine (NDMA SACHET / IMD Webhook & Poller)                               |
|   • Stateless JWT Authentication & Multi-Tenant RBAC                                             |
|                     ┌─────────────────┴─────────────────┐                                        |
|                     ▼                                   ▼                                        |
|   [ 3. DATA & CACHING TIER ]             [ 4. FRONTIER AI / ML SERVICES TIER ]                   |
|   • PostgreSQL 16 + PostGIS 3.4          • GenAI Scenario Synthesis Agent                        |
|   • Redis 7 (In-Memory Pub/Sub)          • GNN Dynamic A* Evacuation Route Optimizer             |
|   • IndexedDB (Local Edge Storage)       • Edge CV MediaPipe Posture Validator                   |
|                                          • "Mitra" Crisis Voice/Text NLP Bot                     |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Breakdown & Advanced Libraries

### 3.1 Frontend Ecosystem
- **Core Framework:** `Next.js 15` (Turbopack, Server-Side Rendering for ultra-fast initial page loads, React 19 Client Components for interactive canvases).
- **3D Simulation & Graphics:**
  - `@react-three/fiber` & `@react-three/drei`: Declarative Three.js 3D rendering pipeline.
  - `@react-three/rapier`: Lightweight WebAssembly (Wasm) physics engine for rigid-body collisions, falling debris, and player navigation.
  - `three-custom-shader-material`: Custom GLSL shaders for realistic smoke plume dissipation and thermal fire glow.
  - *Graceful Fallback:* 2.5D HTML5 Canvas / SVG isometric renderer automatically activated on hardware lacking WebGL2 acceleration.
- **Geospatial & Floorplan Mapping:**
  - `maplibre-gl`: High-performance vector map renderer for district, city, and campus-level hazard overlays.
  - `konva` / `react-konva`: High-speed 2D canvas for floor-by-floor blueprint interaction and real-time student marker placement.
- **State Management & Data Synchronization:**
  - `zustand`: Lightweight (< 1 kB) atomic state store with zero boilerplate for real-time player telemetry and panic metrics.
  - `@tanstack/react-query`: Intelligent server caching, background revalidation, and optimistic updates.
  - `socket.io-client`: Auto-reconnecting WebSocket client with binary packet support.
- **Styling & Design System:**
  - `TailwindCSS v3.4` + `@radix-ui/react-*` accessible primitives: Sleek dark-mode aesthetic, glassmorphism overlays, HUD indicators.
  - `framer-motion`: Smooth UI transitions, alert banners, and micro-animations.
  - `lucide-react`: Crisp, modern iconography.

---

### 3.2 Backend Ecosystem
- **API Framework:** `FastAPI (Python 3.12)`:
  - Asynchronous event loop (`asyncio`) delivering 40,000+ requests/sec with Pydantic v2 validation.
  - Native OpenAPI 3.1 documentation generation.
- **Real-Time Transport:** `python-socketio` + `Redis Pub/Sub`:
  - Horizontally scalable pub/sub architecture capable of synchronizing 50,000 concurrent students across drills.
  - Message latency: **< 35 ms** in local Indian data centers.
- **Geo-Spatial Database:** `PostgreSQL 16` + `PostGIS 3.4`:
  - Stores campus polygons, floor plan graph nodes, evacuation corridors, and national disaster coordinates.
  - Spatial queries: `ST_DWithin` for geofenced alert triggers, `ST_ShortestPath` for baseline route calculations.
- **ORM & Migrations:** `SQLAlchemy 2.0 (Async)` + `Alembic`.
- **In-Memory Cache & Session Broker:** `Redis 7 (Cluster)`:
  - Caches live student telemetry, active drill states, and SACHET alert streams with sub-millisecond read latency.

---

## 4. Offline-First Resilience Architecture

Disasters routinely sever internet connectivity, power grids, and cellular towers. The platform incorporates a 3-tier offline survival strategy:

```
[ Student / Teacher Device ]
            │
            ▼
[ Workbox 7 Service Worker ] ─── (Checks Connectivity)
            │
            ├───► IF ONLINE:  Fetch Latest Lessons & Sync Telemetry with Cloud Server
            │
            └───► IF OFFLINE: Instant Render (<100ms) from IndexedDB (Dexie.js) Cache
                               • Offline 3D Models (.glb compressed)
                               • Floor Blueprints & NDMA Guides
                               • Local WebRTC Mesh Headcount Sync
```

1. **Pre-Caching Strategy:** All critical educational content, floor blueprints, NDMA Do's & Don'ts audio clips, and 3D asset bundles (`.glb` compressed via Draco) are cached in `IndexedDB` on initial application load.
2. **Local Peer-to-Peer Mesh (WebRTC):** If the primary school internet fails during a campus drill or emergency, devices on the same local Wi-Fi or ad-hoc hotspot discover peers via WebRTC data channels to maintain real-time headcount synchronization without external internet.
3. **Optimistic Outbox Pattern:** Actions performed offline (e.g., student marked safe by warden) are queued locally and automatically synced with the central cloud once connectivity is restored.

---

## 5. Security, RBAC & Multi-Tenancy

```
+--------------------------------------------------------------------------------------------------+
|                                    PLATFORM ACCESS & RBAC MATRIX                                 |
+--------------------------------------------------------------------------------------------------+
|  • Stateless JWT & OAuth2 Authentication                                                         |
|  • AES-256 Data Encryption at Rest & TLS 1.3 in Transit                                          |
|                                                                                                  |
|  [ ROLE 1: STUDENT / LEARNER ]        ──► Access Modules, 3D Simulator, Badges, Personal SOS     |
|  [ ROLE 2: TEACHER / FLOOR WARDEN ]   ──► Classroom Roster, Floor Map, QR Headcount Scanner      |
|  [ ROLE 3: SCHOOL ADMIN / EOC LEAD ]  ──► Campus EOC Dashboard, Drill Launcher, Sensor Monitor   |
|  [ ROLE 4: EMERGENCY RESPONDER NDRF ] ──► Multi-Campus GIS Map, Trapped Heatmap, 3D Blueprints  |
|  [ ROLE 5: SDMA / NDMA STATE ANALYST] ──► State Readiness Analytics, Macro CAP Alert Trigger     |
+--------------------------------------------------------------------------------------------------+
```

### Role-Based Access Permissions:

| Role | Accessible Views | Permissions |
| :--- | :--- | :--- |
| **Student** | Learning Modules, 3D Simulator, Personal Badges, SOS Beacon | View lessons, participate in drills, broadcast personal SOS, view emergency floor evacuation path. |
| **Floor Warden / Teacher** | Classroom Roster, Floor Map, QR Headcount Scanner | Mark students safe/missing, report blocked stairways/hazards, initiate floor-level drill. |
| **School Administrator** | Campus EOC Dashboard, Drill Analytics, IoT Sensor Feeds | Launch campus-wide drill, broadcast emergency alert, export NDMA compliance audit reports. |
| **NDRF / Fire Responder** | Multi-Campus GIS Map, Live Trapped Heatmap, Floor Blueprints | View real-time trapped person counts, hazardous material locations, structural integrity sensor telemetry. |
| **SDMA / NDMA Analyst** | State/District Overview, Aggregated Readiness Scores | Monitor macro compliance, trigger official CAP alert broadcasts, benchmark institutional safety ratings. |

---
*Next Section: [04_FRONTIER_AI_ML_SYSTEMS.md](./04_FRONTIER_AI_ML_SYSTEMS.md)*