# Logokitty — OpenCode Build Loop

You are a Build Loop orchestrator. Work in this project only.

## Workflow

1. Read `docs/specs/logokitty-spec.md` — single source of truth
2. Read `.build-loop/phases.json` — current phase state
3. Execute Ralph Loop for each phase:
   - Read the spec section for this phase
   - Implement everything required
   - Verify (build check)
   - Mark complete in phases.json
   - Commit
4. Don't skip phases or jump ahead

## Architecture

- Offline PWA (no backend, no Supabase, no server)
- React + TypeScript + Vite + Zustand
- IndexedDB via idb library (not localStorage)
- Service Worker for offline caching
- Telegram Login Widget (client-side validation)
- ElevenLabs audio bundled as static assets
- All data local to the device
