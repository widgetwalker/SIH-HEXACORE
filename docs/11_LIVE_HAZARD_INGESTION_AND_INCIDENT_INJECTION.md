# 11. Live Hazard Ingestion & Incident Injection API Specification

> **Official System Documentation · SafeZone EOC Platform**  
> **Applicability:** Command Center (`/command`), Simulation Hub (`/simulate`), Global Navigation & Mitra AI  
> **Last Updated:** September 8, 2026 · Release v1.4.0

---

## 1. Executive Overview

The **SafeZone Early Warning & Crisis Ingestion Engine** bridges two critical crisis management domains:
1. **Real-Time Live Disaster Ingestion:** Automated ingestion of physical meteorological and geological sensor feeds calibrated for Indian coastal and urban institutions (defaulting to the **Puducherry / Pondicherry sector: `11.9416° N, 79.8083° E`**).
2. **Instant Incident Injection (Drill Mode):** A coordinator-driven webhook and WebSocket broadcast system that injects simulated multi-hazard emergencies (cyclones, flash floods, earthquakes, tsunamis, fires, gas leaks) across all connected student and administrative nodes simultaneously.

---

## 2. API Endpoints Reference

### 2.1. Active Alerts Feed
`GET /api/v1/alerts/live`

Returns all active emergency alerts combining persisted incident records, manual in-memory drill simulations, and real-time external hazard feeds (Open-Meteo and USGS).

#### Request Parameters
| Parameter | Type | In | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `lat` | `float` | Query | `11.9416` | Latitude of the monitored campus/sector (defaults to Puducherry). |
| `lon` | `float` | Query | `79.8083` | Longitude of the monitored campus/sector (defaults to Puducherry). |
| `limit` | `int` | Query | `20` | Maximum number of alert entries to return (1 to 200). |
| `severity` | `string` | Query | `null` | Optional filter (`Extreme`, `Severe`, `Warning`, `Normal`). |

#### Response Schema (`200 OK`)
```json
[
  {
    "id": "drill-storm-cyclone",
    "cap_identifier": "drill-storm-cyclone",
    "sender": "Campus-EOC-Drill",
    "sent_at": "2026-09-07T19:30:21.175707Z",
    "severity": "Extreme",
    "urgency": "Immediate",
    "event_category": "storm-cyclone",
    "headline": "DRILL ALERT: Severe Cyclone / Gale Surge",
    "description": "Simulated crisis in Coastal Campus Perimeter. Execute emergency safety protocols immediately.",
    "instruction": "Follow NDMA safety protocols and proceed to the designated assembly zone.",
    "is_active": true
  },
  {
    "id": "weather-telemetry-5962697",
    "cap_identifier": "weather-telemetry-5962697",
    "sender": "Open-Meteo",
    "sent_at": "2026-09-07T19:28:19.614740Z",
    "severity": "Normal",
    "urgency": "Immediate",
    "event_category": "weather-telemetry",
    "headline": "Sector Telemetry: 28.4°C, Wind 15.7 km/h (11.94°N, 79.81°E)",
    "description": "Relative Humidity: 76% · Precipitation: 0.0 mm/h. Live meteorological radar streaming.",
    "instruction": "Follow NDMA safety protocols and evacuate or shelter as instructed.",
    "is_active": true
  }
]
```

---

### 2.2. Incident Injection Webhook
`POST /api/v1/webhooks/inject-incident`

Dispatches an on-demand multi-hazard drill from the Command Hub. Broadcasts an `EMERGENCY_BROADCAST` frame over the WebSocket hub to all connected clients and stores the incident in the active alert pool.

#### Request Body (`application/json`)
```json
{
  "incident_type": "storm-cyclone",
  "campus_id": "CAMPUS-01"
}
```

#### Supported `incident_type` Values
| Type | Label | Default Location | Severity | Preset Icon |
| :--- | :--- | :--- | :--- | :---: |
| `storm-cyclone` | Severe Cyclone / Gale Surge | Coastal Campus Perimeter | `Extreme` | 🌀 |
| `flash-flood` | Torrential Flash Flood / Cloudburst | Campus Ground & Drainage Corridor | `Extreme` | 🌊 |
| `earthquake-drill` | M6.2 Seismic Tremor & Structural Breach | Academic Blocks A & B | `Extreme` | ⚡ |
| `tsunami-warning` | Tsunami Inundation Warning | Bay of Bengal Coastal Sector | `Extreme` | 🌊 |
| `electrical-fire` | Electrical Transformer Fire | Ground Floor Lobby | `Extreme` | 🔥 |
| `chemical-spill` | Chemical Lab Spill | Science Block, Floor 2 | `Warning` | 🧪 |
| `gas-leak` | Gas Leak Hazard | Near Staircase B | `Extreme` | ☣️ |

#### Response Schema (`202 Accepted`)
```json
{
  "status": "broadcast",
  "incident_type": "storm-cyclone",
  "message": "Severe Cyclone / Gale Surge — Coastal Campus Perimeter",
  "alert_id": "drill-storm-cyclone"
}
```

---

### 2.3. Alert Acknowledgment & Deactivation
`PATCH /api/v1/alerts/{alert_id}/acknowledge`

Marks an emergency alert or simulated drill as acknowledged by an authorized EOC operator. Deactivates the siren, updates the status to `is_active: false`, and archives the incident.

#### Parameters
| Parameter | Type | In | Description |
| :--- | :--- | :--- | :--- |
| `alert_id` | `string` | Path | ID of the alert (`drill-storm-cyclone`, `usgs-...`, or UUID). |

#### Response Schema (`200 OK`)
```json
{
  "id": "drill-storm-cyclone",
  "cap_identifier": "drill-storm-cyclone",
  "sender": "Campus-EOC-Drill",
  "sent_at": "2026-09-07T19:30:21.175707Z",
  "severity": "Extreme",
  "urgency": "Immediate",
  "event_category": "storm-cyclone",
  "headline": "DRILL ALERT: Severe Cyclone / Gale Surge",
  "description": "Simulated crisis in Coastal Campus Perimeter. Execute emergency safety protocols immediately.",
  "instruction": "Follow NDMA safety protocols and proceed to the designated assembly zone.",
  "is_active": false
}
```

---

## 3. Safety, Privacy & Security: Why These APIs Are Safe to Use

### 3.1. Zero Secret / API Key Exposure
- **Open-Meteo & USGS feeds are completely unauthenticated, public utility APIs.**
- They require **no API keys, no bearer tokens, and no authorization headers**.
- There is **zero risk of leaked cloud credentials, unauthorized billing surges, or quota exhaustion** on both developer machines and production deployments.

### 3.2. Privacy & Data Protection (GDPR & Digital Personal Data Protection Act, 2023)
- **Zero Student PII Transmitted:** No student names, cadet IDs, user progress, or IP addresses are ever sent to external weather or earthquake APIs.
- The external call only transmits two geographic floating-point coordinates representing the school/campus sector (e.g. `11.9416, 79.8083`).

### 3.3. Server-Side Controlled Proxying (No Client Rate-Limiting)
- Client browsers and mobile devices **never** query Open-Meteo or USGS directly.
- All requests route through our FastAPI backend (`/api/v1/alerts/live`), which:
  1. Enforces an `8.0-second` timeout (`_HTTP_TIMEOUT = httpx.Timeout(8.0)`).
  2. Aggregates and sanitizes payloads before returning them to clients.
  3. Eliminates client-side CORS errors and prevents IP blacklisting.

### 3.4. Physics-Based Attenuation Filtering (Zero Alarm Fatigue)
Raw earthquake and weather feeds contain hundreds of global events that do not threaten the local institution. The SafeZone backend applies a strict physical hazard classifier:

#### Seismic Hazard Matrix (`_classify_earthquake_threat`)
```python
# Haversine Distance vs. Richter Magnitude Physical Risk Attenuation
if mag >= 7.0 and distance_km <= 1000.0:
    return True, "Extreme"  # Subduction/Tsunami danger radius
if mag >= 6.0 and distance_km <= 400.0:
    return True, "Extreme"  # Severe structural danger zone
if mag >= 5.0 and distance_km <= 180.0:
    return True, "Warning"  # Moderate ground acceleration
if mag >= 4.0 and distance_km <= 60.0:
    return True, "Warning"  # Localized perceptible tremor
return False, "Normal"      # Excluded: No felt impact
```
*Result:* A distant magnitude 4.0 earthquake 2,800+ km away (e.g., Afghanistan) is automatically classified as `Normal` and excluded from triggering campus alarms.

#### Severe Weather Thresholds
- **Torrential Flash Flood:** $\ge 15.0 \text{ mm/h}$ precipitation recorded $\rightarrow$ `Extreme` Flash Flood Warning.
- **Heavy Rain Advisory:** $\ge 8.0 \text{ mm/h}$ rainfall $\rightarrow$ `Warning`.
### 2.4. Mitra Voice Synthesis (TTS Stream)
`GET /api/v1/mitra/tts?text=...&lang=...`  
`POST /api/v1/mitra/tts`

Converts safety protocol instructions and emergency broadcasts into a playable 16-bit PCM WAV audio stream. Ensures all cadets hear voice guidance regardless of browser, OS, or cloud API key status.

#### Request Parameters (GET)
| Parameter | Type | In | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `text` | `string` | Query | `required` | Emergency text/instructions to vocalize (up to 1,000 characters). |
| `lang` | `string` | Query | `en-in` | Voice accent code (`en-in` for Indian English, `en` for global). |

#### Response (`200 OK`)
- **Headers:** `Content-Type: audio/wav`, `Content-Disposition: inline; filename=mitra_speech.wav`, `Cache-Control: public, max-age=3600`
- **Body:** Binary WAV audio stream. Generated via high-efficiency server-side synthesis (`espeak-ng`/`espeak`) with pure-Python procedural chime fallback if binary is uninstalled.
- **Frontend Proxy:** Also accessible directly from Next.js via `/api/mitra/tts?text=...`.

---

## 3. Dual-Layer Voice & Audio Architecture

```
                       [Emergency Alert or Cadet Query]
                                      │
                                      ▼
                      [Mitra Safety Reasoning Layer]
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
       [GEMINI_API_KEY set]                        [GEMINI_API_KEY empty]
        Gemini 1.5 Flash API                    Local Rule-Based Safety Engine
    (Complex conversational Q&A)            (Instant sub-5ms NDMA Protocol Answers)
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      │ (Protocol Text)
                                      ▼
                    [Frontend Vocalization Decision]
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
     [Primary: Zero-Latency]                        [Fallback: 100% Guaranteed]
  Browser Web Speech Synthesis                      Backend WAV Audio Stream
   (window.speechSynthesis)                           (/api/v1/mitra/tts)
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      │
                                      ▼
                      🔊 Audible Voice Output Across
                         All Devices and Platforms
```

1. **Layer 1 (Zero-Latency Browser Speech):** By default, speech is executed in-browser via the W3C Web Speech API (`window.speechSynthesis`) using native Indian English voices (`en-IN`).
2. **Layer 2 (Guaranteed Backend WAV Stream):** If the cadet's browser disables speech, blocks audio autoplay, or runs in a restricted mobile environment, the system automatically falls back to fetching and streaming the audio directly from `/api/v1/mitra/tts` via an HTML5 `Audio` element.
3. **Zero External API Requirement:** Neither layer requires a Gemini API key or third-party cloud speech subscription.

---

## 4. Physical Hazard Filtering & False Alarm Suppression

### 4.1. Earthquake Attenuation Model (USGS)
The Great-Circle Haversine distance $D$ (km) from the monitored campus to the epicenter is calculated in real time:
$$D = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
where $R = 6371\text{ km}$.

- **Physical Ground Motion Filtering:**
  - $D > 500\text{ km}$: Suppressed unless $M \ge 7.0$ (potential regional tsunami threat).
  - $D > 250\text{ km}$: Suppressed if $M < 5.8$.
  - $D > 100\text{ km}$: Suppressed if $M < 5.0$.
  - Shaking Intensity: Classified into `Extreme` ($M \ge 6.0$ local), `Severe` ($M \ge 5.0$), or `Warning` ($M \ge 4.0$).

### 4.2. Meteorological Classification Model (Open-Meteo)
- **Torrential Rainfall / Flash Flood:** $\ge 30.0 \text{ mm/h}$ instantaneous or $\ge 65.0 \text{ mm}$ daily sum $\rightarrow$ `Extreme` Flood Warning.
- **Cyclonic Gale:** $\ge 45.0 \text{ km/h}$ wind velocity $\rightarrow$ `Extreme` Cyclone/Gale Warning.
- **High Wind Advisory:** $\ge 30.0 \text{ km/h}$ wind gusts $\rightarrow$ `Warning`.
- **Severe Weather Codes:** Codes `95, 96, 99` (Thunderstorms with violent hail) $\rightarrow$ `Extreme`.
- **Normal Telemetry Baseline:** Calm conditions (e.g. 28°C, light wind) are labeled `severity: "Normal"` and displayed strictly as informational telemetry without sounding alarms.

### 4.3. Graceful Degradation & Offline Venue Resilience
- If internet connectivity drops or PostgreSQL is temporarily offline:
  1. The backend catches connection errors and yields the active in-memory incident state without throwing `500 Internal Server Error`.
  2. The frontend switches automatically to local cached telemetry and offline rule-based fallback.
  3. The platform remains 100% demo-ready and usable under poor hackathon venue Wi-Fi conditions.

---

## 5. Summary Table of Monitored Sector Presets

| Sector | Latitude | Longitude | State | Risk Classification |
| :--- | :---: | :---: | :--- | :--- |
| **Puducherry Campus (Default)** | `11.9416` | `79.8083` | Puducherry | Coastal Cyclone & Inundation Zone |
| **Karaikal Campus** | `10.9254` | `79.8380` | Puducherry | Estuarine & Coastal Flood Zone |
| **Chennai Coastal** | `13.0827` | `80.2707` | Tamil Nadu | Northeast Monsoon & Cyclonic Surge |
| **Bengaluru Tech Hub** | `12.9716` | `77.5946` | Karnataka | Urban Waterlogging & Lightning Corridor |
| **Mumbai Harbor** | `18.9220` | `72.8347` | Maharashtra | Arabian Sea Gale & High Tide Flood Zone |
| **New Delhi NCR** | `28.6139` | `77.2090` | Delhi | Heatwave & Seismic Zone IV |
| **Guwahati / Northeast Zone** | `26.1445` | `91.7362` | Assam | Brahmaputra Flash Flood & Seismic Zone V |
| **Dehradun Seismic Zone** | `30.3165` | `78.0322` | Uttarakhand | Himalayan Fault Line (Seismic Zone IV/V) |
| **Device GPS Mode** | Dynamic | Dynamic | Live Device | Real-time `navigator.geolocation` lock |

