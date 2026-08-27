# Carbon Autopilot - Agent Guidelines

This repository contains the frontend application for Carbon Autopilot (IHSIH021), a campus carbon operating system for educational institutions.

## Architecture
- **Framework**: TanStack Start (React 19) + Vite + Tailwind CSS
- **Routing**: TanStack Router (file-based routing under `src/routes/`)
- **State Management**: TanStack Query + React Context (`src/lib/carbon-store.tsx`)
- **UI & Components**: Radix UI primitives, Lucide icons, Recharts, Three.js (globe visualization)

## Development Workflow
- `npm run dev` to start the local development server.
- `npm run build` to create a production build.
