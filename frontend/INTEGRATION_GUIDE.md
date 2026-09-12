# SafeZone UI integration guide

This document records the contracts used by the cadet profile flow and the
Command Hub controls. The current implementation is intentionally usable
without a backend: profile data is stored locally and incident injection uses
a short simulated delay.

## Cadet profile

The browser key is `safezone_cadet_profile_v1`.

```ts
interface CadetProfile {
  name: string;
  age: number;
  grade: string;
  school: string;
  tierId: number;
  tierName: string;
  avatarId: string;
  avatarImage?: string;
}
```

The shared type and storage helpers live in `src/types/profile.ts`:

- `loadCadetProfile()` returns a validated profile or `null`.
- `saveCadetProfile(profile)` persists a profile when browser storage is available.
- `DEFAULT_AVATAR_ID` is `shield`; old records without `avatarId` are migrated on load.
- `PROFILE_AVATARS` contains the six built-in vector profile marks.
- `saveCadetProfile()` dispatches `safezone:cadet-profile-updated` so Navbar and
  other mounted surfaces refresh immediately. The browser `storage` event is
  also observed for cross-tab changes.
- `getTierForAge(age)` in `CadetOnboardingModal.tsx` is the current tier mapping.

`LearnPage` and `ProfilePage` own route-local profile state. `/profile` is the
canonical profile console and contains Dashboard, Certificates, Settings, and
Leaderboard. `AvatarPicker` supports the built-in marks and image uploads from
the device; uploaded data URLs are capped at 1.5 MB for this local MVP. A
backend sync can be added at the existing parent callbacks without changing the
presentational component APIs.

## Command Hub components

### Live threat banner

`LiveThreatBanner` accepts:

```ts
type LiveThreatAlert = {
  source: "Open-Meteo" | "USGS" | "NDMA-CAP" | "Campus-IoT";
  severity: "CRITICAL" | "WARNING" | "ADVISORY";
  title: string;
  detail: string;
  timestamp: string;
};
```

The optional `onAcknowledge` and `onTriggerProtocol` callbacks are wired by
`CommandPage`. The current page seeds a representative alert and can later
replace it with a WebSocket message.

### Incident injection deck

`IncidentInjectionDeck` calls:

```ts
onInjectIncident(
  incidentType: "transformer_fire" | "chemical_spill" | "gas_leak",
  floor: string,
): void;
```

The `isInjecting` prop disables controls and displays the loading state. The
page currently simulates a two-second response, then updates the threat banner.

## Backend endpoints

These endpoints are the intended integration points; they are not required for
the local MVP flow.

### `POST /api/v1/users/profile`

Request body:

```json
{
  "name": "Aarav Sharma",
  "age": 12,
  "grade": "Grade 7",
  "school": "Kendriya Vidyalaya No. 1"
}
```

Response: the complete `CadetProfile`, including `tierId` and `tierName`.

### `GET /api/v1/users/profile/{id}`

Response: the complete `CadetProfile`. A missing profile should return `404`
and allow the client to show onboarding.

### `POST /api/v1/incidents/inject`

Request body:

```json
{
  "incident_type": "chemical_spill",
  "floor": "2F",
  "source": "command_hub_drill"
}
```

Response should include the emitted alert, an incident id, and an accepted
timestamp. The UI can use the same `LiveThreatAlert` shape for the alert.

### `WS /api/v1/alerts/live`

Suggested event payload:

```json
{
  "type": "LIVE_THREAT",
  "alert": {
    "source": "Campus-IoT",
    "severity": "CRITICAL",
    "title": "Gas leak detected",
    "detail": "Immediate evacuation required.",
    "timestamp": "2026-09-06T19:45:00+05:30"
  }
}
```

The connection is owned by `useEmergencyBroadcasts`, uses
`NEXT_PUBLIC_WS_TOKEN`, joins `NEXT_PUBLIC_CAMPUS_ID`, and closes on unmount.
Keep the present `LiveThreatAlert` type as the boundary for the UI.

## Verification checklist

- Clear `safezone_cadet_profile_v1`, open `/learn`, and complete onboarding.
- Refresh `/learn` and confirm the profile remains and onboarding stays closed.
- Open **My Certificates → Edit Profile**, change age, and confirm tier preview updates.
- Click the Navbar profile icon and confirm `/profile` opens with Dashboard, Certificates, Settings, and Leaderboard tabs.
- In Profile → Settings, choose each vector avatar and upload a small image; confirm the Navbar and Learn sidebar update immediately.
- Open `/command`, acknowledge the seeded alert, and trigger the protocol action.
- Set `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_WS_TOKEN`, and
  `NEXT_PUBLIC_CAMPUS_ID`, open `/command` and `/simulate` in separate devices
  or tabs, then inject an incident and confirm the other connected client
  receives the `EMERGENCY_BROADCAST` over the WebSocket.
- Check the onboarding/drawer at 320–375px widths with a virtual keyboard open.
