# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is a **design-handoff package**, not a production application. The files here are a high-fidelity HTML/JSX prototype of a three-screen financial planner UI (Form → Loading → Results). Per `README.md`: the intended workflow is to **recreate these designs in a target codebase** (e.g. an existing React/Next.js app) using that codebase's own framework, components, and patterns — not to extend the prototype itself.

If asked to "build the app" without a target codebase being specified, default to **React + TypeScript + Tailwind CSS** as recommended in the README, and confirm with the user before scaffolding.

## How the prototype runs

There is no build system, no `package.json`, no tests, and no lint config. The prototype is a single static HTML file that loads React 18 + Babel-standalone from a CDN and compiles JSX in the browser:

- Entry point: `Financial Planner.html`
- Components are loaded as `<script type="text/babel" src="planner/*.jsx">` from inside the HTML
- `planner/constants.js` is plain JS and is loaded *first* — it defines globals (`C`, `FONT`, `SLICE_COLORS`, `GEO_COLORS`, `REGIONS`, `HOME_COUNTRIES`, `DURATIONS`, `buildPrompt`) that every JSX file relies on. Component files reference these as globals; there are no `import`/`export` statements anywhere.
- To preview locally, serve the directory over HTTP (e.g. `python3 -m http.server`) and open `Financial Planner.html` — opening via `file://` will fail because of the cross-file script loads.

## Architecture (prototype)

State lives in the `App` component inside `Financial Planner.html` and is driven by a single `screen` enum (`'form' | 'loading' | 'results' | 'error'`). The screen components are pure presentational:

- `FormScreen.jsx` — collects `formData` and calls `onSubmit`
- `LoadingScreen.jsx` — shown while the OpenAI request is in flight
- `ResultsScreen.jsx` — renders `portfolioData`; contains the `FundCard` sub-component
- `Charts.jsx` — pure SVG chart primitives (`DonutChart`, `DiversificationGauge`, `RiskBar`, `GeoBar`, `ProjectedBar`) reused by `ResultsScreen`

The OpenAI call is `fetchPortfolio()` in `Financial Planner.html`. It posts to `https://api.openai.com/v1/chat/completions` with `model: gpt-4o-mini` and `response_format: { type: 'json_object' }`. The prompt body is built by `buildPrompt(formData)` in `planner/constants.js` — that function is the contract for the JSON shape the rest of the app expects.

The API key is collected by an in-app modal and stored in `localStorage` under `fp_openai_key`. The repo's `.env` file is a placeholder and is **not read by the browser app**.

## When recreating the design in a target codebase

- `README.md` is the source of truth for design tokens (colors, typography, spacing) and per-screen layout/interaction specs. Read it before producing UI.
- All design tokens are also available programmatically in `planner/constants.js` (`C`, `FONT`, `SLICE_COLORS`, `GEO_COLORS`) — copy values from there to avoid transcription errors.
- The data shape returned from OpenAI is documented in `buildPrompt()` in `planner/constants.js` and in the "State Management" section of `README.md`. Match it exactly.
- Behaviour quirks called out in the README that are easy to miss:
  - "Global (All)" region and specific regions are mutually exclusive; deselecting all specific regions should re-select "Global"
  - Allocations from the API may not sum to exactly 100 — normalise before rendering the donut
  - First 3 fund cards default to expanded; rest collapsed
  - In production, the OpenAI key must not live in the browser — route the call through a server-side function

## Code style

- **Comments sparingly.** Only add a comment to explain a complex function or to record a non-obvious tradeoff. Do not narrate what the code does — well-named identifiers and types are enough. If a reader could infer the comment from the code, delete it.

## Testing

- When implementing a feature, add tests alongside it that cover the golden path and the edge cases the feature was written to handle.
- After making code changes, run the relevant tests automatically to confirm the change works as intended before reporting the task complete. Do not rely on type-checking or visual inspection alone.
- If a test runner does not yet exist in the target codebase you're working in, set one up as part of the first feature that needs tests, and mention it to the user.

## Conventions specific to the prototype

- Styling is **inline JS objects** referencing `C` and `FONT` from `constants.js`, plus a small block of global CSS in the `<style>` tag of `Financial Planner.html` (scrollbar, range slider thumb, keyframes `spin` / `fadeUp` / `fadeIn`). There is no Tailwind, no CSS modules, no styled-components.
- Charts are hand-rolled SVG (no Recharts/D3). If touching `Charts.jsx`, keep the SVG-only approach unless the user asks to swap libraries.
- Do not add a build step, package manager, or TypeScript to the prototype itself — its constraint is "open the HTML file and it works." If the user wants those things, they want a recreation in a target codebase, not a refactor of this one.
