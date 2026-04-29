# Financial Planner

A React + Vite + TypeScript financial planning app with an Express backend. The frontend collects investment preferences, the backend keeps the OpenAI API key server-side, and `/api/portfolio` returns a personalized portfolio recommendation.

## Project Structure

```text
.
├── client/          # React + Vite + Tailwind frontend
├── server/          # Express + TypeScript API server
├── package.json     # npm workspaces and root scripts
└── .env             # local secrets, not committed
```

## Environment

Create a root `.env` file:

```bash
OPENAI_API_KEY=sk-...
PORT=3001
```

`Port=3001` and `port=3001` are also accepted for compatibility, but `PORT` is preferred.

## Scripts

Install dependencies:

```bash
npm install
```

Run the local app:

```bash
npm run dev
```

The client runs at `http://localhost:5173` and proxies API requests to the server at `http://localhost:3001`.

Build both workspaces:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

Type-check both workspaces:

```bash
npm run typecheck
```

## API

`GET /api/health`

Returns:

```json
{ "ok": true }
```

`POST /api/portfolio`

Accepts:

```json
{
  "homeCountry": "us",
  "amount": 100000,
  "duration": "10+",
  "riskCategory": "Balanced",
  "numRecommendations": 8,
  "selectedRegions": ["global"]
}
```

Returns a JSON portfolio with `summary` and `holdings`, shaped by the prompt in `server/src/prompt.ts`.

## Security Notes

- The OpenAI key is read only by the server from `.env`.
- The browser never receives or stores the OpenAI key.
- `.env`, `node_modules`, and build outputs are ignored by git.

## Deployment

This repository is configured for a split deployment:

- Backend API: Render Web Service, configured by `render.yaml`.
- Frontend: GitHub Pages, configured by `.github/workflows/deploy-frontend.yml`.

Render needs these environment variables:

```bash
NODE_ENV=production
OPENAI_API_KEY=sk-...
CLIENT_ORIGIN=https://YOUR_GITHUB_USERNAME.github.io
```

If you deploy GitHub Pages to a custom domain, set `CLIENT_ORIGIN` to that domain instead.

GitHub Actions needs this repository variable:

```bash
VITE_API_BASE_URL=https://YOUR_RENDER_SERVICE.onrender.com
```

The frontend workflow automatically sets the Vite base path to `/${REPOSITORY_NAME}/`, which is the right default for project Pages URLs like `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`.

## Verification

The current app has been verified with:

```bash
npm run typecheck
npm run build
npm run dev
curl -s http://localhost:3001/api/health
npm start
curl -s http://localhost:3001/api/health
```
