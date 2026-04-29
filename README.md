# Financial Planner

An AI-powered portfolio planning web application that turns a user's investment goals, risk tolerance, time horizon, home currency, and geographic preferences into a structured portfolio recommendation with allocations, risk analysis, geographic exposure, and projected outcomes.

The project started as a design prototype and was rebuilt into a production-oriented full-stack TypeScript application with a secure backend, typed API boundary, deployment automation, and a polished investment-dashboard interface.

**Live demo:** https://financial-planner-sd6r.onrender.com/

> Educational use only. This app is not financial advice.

## What It Does

Financial Planner guides a user through a concise investment intake flow, sends the normalized preferences to a backend OpenAI integration, and renders the model response as a rich portfolio report.

Core user flow:

1. Select home country and currency.
2. Enter investment amount and time horizon.
3. Choose risk profile: Conservative, Balanced, or Aggressive.
4. Select desired geographic exposure.
5. Generate a portfolio recommendation.
6. Review allocation, diversification, expected return range, risk score, projected outcome, and individual fund rationale.

## Product Highlights

- **Secure AI integration:** OpenAI credentials stay server-side and are never exposed to the browser.
- **Typed full-stack contract:** Request and response shapes are modeled in TypeScript across the client and server.
- **Production deployment:** Render-ready full-stack deployment via `render.yaml`.
- **High-fidelity financial UI:** Dark institutional visual system with custom SVG charts, fund cards, loading states, and responsive layouts.
- **Portfolio analytics:** Allocation donut chart, diversification gauge, risk breakdown, geographic exposure bars, and compounded projection estimates.
- **Robust request validation:** Server validates payloads before calling OpenAI.
- **Clean workspace architecture:** npm workspaces separate the React client and Express API while sharing root scripts.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS config, global CSS, design-token driven inline component styles |
| Backend | Node.js, Express, TypeScript |
| AI | OpenAI Chat Completions API with JSON response mode |
| Tooling | npm workspaces, TypeScript project builds |
| Deployment | Render |

## Architecture

```text
User
  |
  v
React + Vite client
  |
  | POST /api/portfolio
  v
Express API server
  |
  | server-side OPENAI_API_KEY
  v
OpenAI API
  |
  v
Structured JSON portfolio
  |
  v
Typed rendering pipeline:
summary cards, charts, projections, fund cards
```

## Repository Structure

```text
.
├── client/
│   ├── src/
│   │   ├── components/       # Form, loading, results, and SVG chart components
│   │   ├── lib/              # API client, constants, design tokens
│   │   ├── App.tsx           # Client state machine
│   │   └── types.ts          # Portfolio and form types
│   ├── vite.config.ts
│   └── package.json
├── server/
│   ├── src/
│   │   ├── env.ts            # Environment loading and validation
│   │   ├── index.ts          # Express routes and request validation
│   │   ├── openai.ts         # OpenAI API integration
│   │   └── prompt.ts         # Portfolio prompt contract
│   └── package.json
├── render.yaml               # Render deployment blueprint
├── package.json              # Workspace scripts
└── README.md
```

## Security Model

The app intentionally routes all AI calls through the backend.

- `OPENAI_API_KEY` is read only by the Express server.
- The browser calls `/api/portfolio`; it never receives the OpenAI key.
- `.env`, `node_modules`, and build artifacts are ignored by git.
- Production CORS is controlled with `CLIENT_ORIGIN`.
- Backend validation rejects malformed portfolio requests before model invocation.

## Local Development

### Prerequisites

- Node.js 22 or newer recommended
- npm
- OpenAI API key

### Environment

Create a root `.env` file:

```bash
OPENAI_API_KEY=sk-...
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

`PORT` is preferred. `Port` and `port` are also accepted for compatibility.

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

The Vite dev server proxies `/api` requests to the Express server.

## Available Scripts

```bash
npm run dev
```

Runs the client and server together for local development.

```bash
npm run typecheck
```

Type-checks both workspaces.

```bash
npm run build
```

Builds the React frontend and TypeScript backend.

```bash
npm start
```

Runs the production Express server. In production, the server can serve the compiled frontend from `client/dist`.

## API Contract

### `GET /api/health`

Returns service health.

```json
{ "ok": true }
```

### `POST /api/portfolio`

Request body:

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

Response body:

```json
{
  "summary": {
    "expectedReturnLow": 4.5,
    "expectedReturnHigh": 7.5,
    "riskLevel": "Balanced",
    "diversificationScore": 85,
    "diversificationLabel": "Highly Diversified",
    "overallRiskScore": 5.8,
    "overallRiskLabel": "Balanced growth",
    "regionBreakdown": [
      { "region": "North America", "percentage": 40 }
    ]
  },
  "holdings": [
    {
      "rank": 1,
      "name": "Vanguard Total Stock Market ETF",
      "ticker": "VTI",
      "allocation": 25,
      "amount": 25000,
      "categories": ["Equity", "US Total Market"],
      "riskLabel": "Medium",
      "liquidity": "Daily",
      "returnRange": "6-8% p.a.",
      "riskScore": 6,
      "description": "Rationale tailored to the user's profile.",
      "geographicExposure": [
        { "region": "United States", "percentage": 100 }
      ],
      "color": "#4a8fd4"
    }
  ]
}
```

The exact response schema is enforced by the prompt contract in `server/src/prompt.ts` and normalized on the client before rendering.

## Deployment

### Render Full-Stack Deployment

Render powers the current live demo and serves both the compiled React frontend and the Express API from one origin.

`render.yaml` configures:

```yaml
buildCommand: npm ci && npm run build
startCommand: npm start
```

Required Render environment variables:

```bash
NODE_ENV=production
OPENAI_API_KEY=sk-...
CLIENT_ORIGIN=https://financial-planner-sd6r.onrender.com
```

Render will build both workspaces, start the Express server, and serve the compiled frontend.

## Verification

The current project has been verified with:

```bash
npm run typecheck
npm run build
npm run dev
curl -s http://localhost:3001/api/health
npm start
curl -s http://localhost:3001/api/health
```

## Engineering Decisions

- **Server-side AI calls:** Avoids exposing API credentials and gives one place for validation, rate limiting, and future observability.
- **JSON response mode:** Keeps the AI output parseable and compatible with typed UI rendering.
- **npm workspaces:** Keeps client and server deployable as separate units while maintaining one developer workflow.
- **Custom SVG charts:** Avoids unnecessary chart dependencies and keeps the portfolio visualization lightweight.
- **Render blueprint:** Makes backend/full-stack deployment repeatable from source control.

## Future Improvements

- Add persisted portfolio history with user accounts.
- Add automated unit and integration tests around request validation and response normalization.
- Add rate limiting and request logging on the API.
- Add PDF export and shareable portfolio snapshots.
- Add model output validation with a runtime schema before returning data to the client.

## Disclaimer

Financial Planner is a software engineering project for educational and demonstration purposes. It does not provide financial, tax, or legal advice. Users should consult a licensed financial advisor before making investment decisions.
