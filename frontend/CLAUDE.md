@AGENTS.md

## Current integration contracts

- Cadet profile state is persisted under `safezone_cadet_profile_v1` through
  `src/types/profile.ts`; LearnPage and `ProfilePage` own route-local state and
  share updates through `safezone:cadet-profile-updated`.
- `CadetOnboardingModal`, `ProfileView`, and `EditProfileDrawer` consume the
  shared profile shape. Keep backend synchronization at the existing parent
  callbacks rather than adding a second client-side store.
- `/profile` is the canonical profile surface: Dashboard, Certificates,
  Settings, Leaderboard, profile editing, built-in vector avatars, and local
  image upload. The Navbar avatar links there and must never use a hardcoded
  initial.
- `/command` renders `LiveThreatBanner` and `IncidentInjectionDeck`. Their
  payloads and pending backend endpoints are documented in
  `INTEGRATION_GUIDE.md`.
- The current alert/injection path is a local MVP simulation. Do not describe
  it as live CAP ingestion until the backend feed and WebSocket mapping are
  implemented.

## Verification status

Direct TypeScript and targeted lint pass for the touched UI files. Browser/device
QA and the Next production-build parser issue remain documented in the root
`IMPLEMENTATION_SUMMARY.md` and `docs/08_CURRENT_IMPLEMENTATION_STATUS.md`.
