# CLAUDE.md

Guidance for AI coding agents working in this repository.

## Repository Purpose

This is now a production-oriented React + Vite + TypeScript app with an Express backend. It was migrated from a static design-handoff prototype, and the old prototype files have been removed.

The application flow is:

1. The React client collects investment preferences.
2. The client posts those preferences to `/api/portfolio`.
3. The Express server validates the request, builds the financial-planner prompt, calls OpenAI with the server-side API key, and returns JSON.
4. The client renders loading, results, and error states.

## Structure

- `client/` - Vite React app, TypeScript, Tailwind config, UI components.
- `client/src/lib/constants.ts` - design tokens and static option data.
- `client/src/lib/api.ts` - frontend API client and response normalization.
- `client/src/types.ts` - shared client-side portfolio and form types.
- `client/src/components/` - form, loading, result, and SVG chart components.
- `server/` - Express API server.
- `server/src/env.ts` - `.env` loading and config validation.
- `server/src/prompt.ts` - OpenAI prompt and server-side request type.
- `server/src/openai.ts` - OpenAI chat-completions call.
- `server/src/index.ts` - routes, validation, static production serving.

## Environment

Secrets belong only in the root `.env` file:

```bash
OPENAI_API_KEY=sk-...
PORT=3001
```

Do not expose the OpenAI key to the browser, localStorage, client env vars, or Vite `VITE_*` variables.

## Common Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

In development, Vite runs on `5173` and proxies `/api` to the backend on `3001`. In production, `npm start` serves `client/dist` from the Express server.

## Engineering Notes

- Keep the portfolio response contract aligned across `server/src/prompt.ts`, `client/src/types.ts`, and the result UI.
- Keep request validation server-side in `server/src/index.ts`; client validation is for user experience only.
- Prefer small, typed modules over duplicating data or response-shaping logic.
- Preserve the dark/gold financial planner visual system unless the user asks for a redesign.
- Run `npm run typecheck` and `npm run build` before reporting completion.
