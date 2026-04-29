# Handoff: Financial Planner

## Overview
A three-screen web app that lets users define their investment goals and preferences, then generates a personalised, AI-powered portfolio recommendation via the OpenAI API. The app covers a form screen, an animated loading screen, and a detailed results screen.

## About the Design Files
The files bundled in this package are **design references created in HTML/JSX** — interactive prototypes showing the intended look, layout, and behaviour. They are **not** production code to copy verbatim. The task for Claude Code is to **recreate these designs in your target codebase** using its existing framework, component library, and patterns. If no codebase exists yet, React + TypeScript + Tailwind CSS is recommended.

## Fidelity
**High-fidelity.** The prototypes use final colours, typography, spacing, and interactions. Recreate the UI as close to pixel-perfect as practical, adapting only where your codebase's design system differs.

---

## Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `bg` | `#060606` | Page background |
| `surface` | `#0f0f0f` | Card background |
| `surface2` | `#171717` | Input background |
| `surface3` | `#1f1f1f` | Tag/chip background |
| `border` | `#272727` | Dividers, card borders |
| `borderGold` | `#3a2e10` | Gold-tinted borders |
| `gold` | `#c9a435` | Primary accent — buttons, highlights |
| `goldLight` | `#e8c96f` | Lighter gold for gradients |
| `goldDim` | `#6a5418` | Muted gold |
| `goldGlow` | `rgba(201,164,53,0.12)` | Selected state background |
| `text` | `#f0f0f0` | Primary text |
| `textSub` | `#aaaaaa` | Secondary text |
| `textMuted` | `#555555` | Placeholder / captions |
| `red` | `#e05555` | Error states |
| `green` | `#4caf72` | Positive indicators |

### Typography
| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / Headings | `DM Serif Display` | 400 | Elegant editorial serif |
| Body / UI | `Inter` | 300–700 | All labels, buttons, captions |

### Spacing & Layout
- Max content width: `680px` (form), `860px` (results)
- Card padding: `40px`
- Section gap: `28px` between form fields
- Card border-radius: `4px`
- Button border-radius: `2px`
- Input border-radius: `2px`

### Slice Colors (pie chart, fund rank badges)
```
#c9a435, #4a8fd4, #9b59b6, #2ecc71, #e74c3c,
#1abc9c, #f39c12, #3498db, #e91e63, #00bcd4,
#ff5722, #8bc34a, #673ab7, #ff9800, #009688, #607d8b
```

---

## Screens

---

### Screen 1 — Form

**Purpose:** Collect user preferences before generating a portfolio.

**Layout:** Centered single-column. `max-width: 680px`, `margin: 0 auto`, `padding: 48px 24px 80px`. A centred header (logo + title + subtitle) sits above a single dark card containing all form fields.

**Header:**
- Gold square logo badge (`36×36px`, `border-radius: 2px`, `background: #c9a435`) with bold "FP" text in black
- `h1` — "Financial Planner" — `DM Serif Display`, `32px`, `font-weight: 400`
- Subtitle — "Get a personalized, globally-diversified portfolio tailored to your goals." — `Inter 15px`, `color: #aaaaaa`

**Card:** `background: #0f0f0f`, `border: 1px solid #272727`, `border-radius: 4px`, `padding: 40px`

**Form fields (top to bottom):**

1. **Home country & currency** — `<select>` full-width. Options include US (USD), UK (GBP), EU (EUR), South Africa (ZAR), etc.
2. **Investment amount** — Currency symbol prefix box (`background: #1f1f1f`, gold symbol text) + text input. Validation: minimum 1,000 in chosen currency.
3. **Investment duration** — `<select>`. Options: 1 yr, 2–3 yrs, 5 yrs, 10 yrs, 10+ yrs, Indefinitely.
4. **Number of top options** — `<input type="range" min=1 max=20>` with a live gold number readout on the right. Custom thumb: `18×18px` gold circle with glow shadow.
5. **Risk category** — 3-column grid of clickable cards: Conservative / Balanced / Aggressive. Selected state: gold top border (2px), `background: rgba(201,164,53,0.12)`, gold title text. Unselected: dark border.
6. **Geographic focus** — Multi-select chip grid grouped by region:
   - Global, Americas (US, Canada, Brazil, Latin America), Europe (UK, Germany, France, Europe Broad), Asia-Pacific (China, Japan, India, South Korea, Australia, Southeast Asia), Africa & Middle East (South Africa, Nigeria, Africa Broad, Middle East), Thematic (Emerging Markets, Frontier Markets, Commodities)
   - Chip: `padding: 6px 14px`, `border-radius: 2px`, selected = gold border + gold text + gold-glow background
   - Selecting "Global (All)" deselects all others. Selecting any specific region deselects "Global".

7. **Generate button** — Full width, `background: #c9a435`, black text, `font-weight: 700`, `font-size: 15px`, `padding: 16px`, `border-radius: 2px`.

**Footer:** Small disclaimer text centred below the card.

**Settings button (fixed):** Bottom-right corner, gear icon + "API Key" label, opens the API key modal.

---

### Screen 2 — Loading

**Purpose:** Show progress while the OpenAI API generates the portfolio.

**Layout:** Full viewport, centred vertically and horizontally. Logo header at top, then a card with spinner, then summary chips.

**Spinner:** `72×72px` SVG with:
- Background circle: `stroke: #272727`, `strokeWidth: 4`
- Animated arc: `stroke: #c9a435`, `strokeDasharray: 60 130`, CSS `animation: spin 1.2s linear infinite`
- Gold dot centre: `10×10px`, gold background, glow shadow

**Status text:** Cycles through messages every 1.8s with a `fadeUp` animation:
- "Analysing your risk profile…", "Scanning global markets…", "Filtering by selected regions…", "Ranking investment instruments…", "Calculating diversification score…", "Projecting portfolio outcomes…", "Finalising your portfolio…"

**Progress dots:** Row of dots below the status text. Active dot: `width: 20px`, gold. Inactive: `width: 6px`, dark border colour. All `height: 6px`, `border-radius: 3px`, smooth width transition.

**Summary chips:** Below the card, the user's chosen parameters shown as small bordered chips (amount, duration, risk, "Top N").

---

### Screen 3 — Results

**Purpose:** Display the generated portfolio in full detail.

**Layout:** Single column, `max-width: 860px`, centred, `padding: 40px 24px 80px`. Sections stack vertically with `16px` gap between cards.

#### 3a — Header Row
Logo + "Your Portfolio" title on left. Action buttons on right: "Export PDF", "Share", "Save portfolio" (outlined), "Start over" (gold filled).

#### 3b — Summary Stats Card
Grid of 6 stat boxes (auto-fit, min 160px each), separated by right borders:
- Total Invested, Expected Return (X–Y% p.a.), Risk Level, Horizon, Home Country, Recommendations

Each box: `padding: 20px 24px`, label in `10px` uppercase muted text, value in `20px bold` white.

#### 3c — Diversification Score Card
Horizontal flex row: circular gauge on left + text on right.
- **Gauge:** SVG arc from 135° to 405° (270° sweep). Track = dark border. Fill = gold arc proportional to score (0–100). Score number centred in `22px bold gold`.
- Right side: "Global Diversification Score" label, descriptive label (e.g. "Highly diversified across regions"), then region breakdown chips (region name · percentage%).

#### 3d — Holdings + Donut Chart Card
Two-column grid: `220px` donut chart on left, holdings list on right.
- **Donut chart:** SVG arc segments using `stroke` technique. `thickness: 42px`, `size: 220px`. Hover dims non-hovered segments. Centre label shows risk level + holdings count.
- **Holdings list:** Each row: colour swatch (12×12, radius 2px) + fund name + gold percentage. `border-bottom: 1px solid #272727`.

#### 3e — Projected Outcome Card
- "You invest" → arrow → "Projected value" layout
- Projected value in `28px bold gold`
- Inflation-adjusted "today's money" subtitle
- **Projected bar:** Horizontal bar split into principal (dark) and gain (gold gradient). `height: 8px`, `border-radius: 4px`.
- Legend below bar. Disclaimer text at bottom.
- Calculation: midpoint of return range, compounded over duration years. Today's money assumes 3% inflation.

#### 3f — Risk Breakdown Card
- Overall risk score shown as labelled gradient bar (green→orange→red), with a gold marker dot at the score position.
- Per-holding rows: fund name | gradient bar with coloured marker | score/10
- Disclaimer text at bottom.

#### 3g — Individual Fund Cards
One card per holding, stacked. Each card:
- **Colour accent bar** at top: `3px` tall, full width, in the holding's assigned colour
- **Header row (always visible, clickable to expand):**
  - Rank badge: `36×36px` square in holding colour, "#N" in bold black
  - Fund name (`16px bold`) + ticker (small bordered badge)
  - Tag chips: category, subcategory, `Risk: High/Medium/Low` (tinted red/orange/green), `Liquidity: Daily`, return range (gold-tinted)
  - Allocation % in `22px bold gold` + dollar amount below, right-aligned
- **Expanded section:**
  - Description paragraph (`14px`, `line-height: 1.75`, muted text)
  - "Geographic Exposure" label + segmented bar (coloured segments proportional to %) + legend dots

First 3 cards default to expanded; rest collapsed.

---

## Interactions & Behaviour

| Interaction | Detail |
|---|---|
| Risk category select | Click to toggle; only one active at a time |
| Geographic region toggle | Multi-select chips; "Global" clears all others; selecting specific regions removes "Global" |
| Slider | Live number update; custom gold thumb |
| Form validation | Fires on submit; highlights errors inline; does not advance to loading |
| Loading → Results | Triggered once API response is parsed successfully |
| Fund card expand/collapse | Click anywhere on header row; first 3 start expanded |
| Donut segment hover | Non-hovered segments dim to 40% opacity |
| Start over | Resets all state back to the form screen |
| API Key modal | Shown on first load if no key in localStorage; also accessible via fixed settings button |

### Animations
- `spin`: `1.2s linear infinite` — loading spinner arc
- `fadeUp`: `opacity 0 + translateY(6px)` → `opacity 1 + translateY(0)`, `0.4s ease-out` — status message change
- `fadeIn`: `opacity 0 → 1`, `0.3s ease-out` — screen transitions
- Donut segment opacity: `transition: opacity 0.2s`
- Progress dot width: `transition: all 0.3s`

---

## State Management

```
screen: 'form' | 'loading' | 'results' | 'error'
apiKey: string (from localStorage key 'fp_openai_key')
formData: {
  homeCountry: string,       // e.g. 'us', 'za'
  amount: number,            // e.g. 100000
  duration: string,          // e.g. '10+'
  numRecommendations: number,// 1–20
  riskCategory: string,      // 'Conservative' | 'Balanced' | 'Aggressive'
  selectedRegions: string[], // e.g. ['us', 'south_africa']
}
portfolioData: {
  summary: { expectedReturnLow, expectedReturnHigh, riskLevel, diversificationScore,
             diversificationLabel, overallRiskScore, overallRiskLabel, regionBreakdown[] }
  holdings: [{rank, name, ticker, allocation, amount, categories[], riskLabel,
              liquidity, returnRange, riskScore, description, geographicExposure[], color}]
}
errorMsg: string
```

---

## OpenAI API Integration

- **Endpoint:** `POST https://api.openai.com/v1/chat/completions`
- **Model:** `gpt-4o-mini`
- **Response format:** `{ type: 'json_object' }`
- **Max tokens:** 4096
- **Temperature:** 0.7
- **Auth:** Bearer token from user-supplied key stored in `localStorage`

The prompt instructs the model to return a JSON object with `summary` and `holdings` arrays. Allocations must sum to 100. See `planner/constants.js` → `buildPrompt()` for the full prompt template.

---

## Files in This Package

| File | Description |
|---|---|
| `Financial Planner.html` | Main entry point. Loads all components, manages app state, handles API call. |
| `planner/constants.js` | Design tokens (C, FONT), data arrays (REGIONS, HOME_COUNTRIES, DURATIONS, SLICE_COLORS, GEO_COLORS), `buildPrompt()` function. |
| `planner/Charts.jsx` | Reusable chart components: `DonutChart`, `DiversificationGauge`, `RiskBar`, `GeoBar`, `ProjectedBar`. |
| `planner/FormScreen.jsx` | Form screen component with all inputs and geographic region selector. |
| `planner/LoadingScreen.jsx` | Animated loading screen component. |
| `planner/ResultsScreen.jsx` | Full results screen: `ResultsScreen` + `FundCard` sub-component. |
| `.env` | Placeholder for OpenAI API key (not read by the browser app — key is entered via in-app modal). |

---

## Assets
No external images or icon fonts. All icons are inline SVG. Charts are SVG drawn in React components. No third-party UI libraries beyond React 18 + Babel standalone.

---

## Notes for Claude Code

1. **API key security:** The HTML prototype stores the key in `localStorage` for convenience. In production, route the OpenAI call through a server-side function (Next.js API route, Edge Function, etc.) and never expose the key to the browser.
2. **JSON parsing:** OpenAI's `json_object` response format reliably returns parseable JSON, but add a try/catch and show the error screen on parse failure.
3. **Allocation rounding:** The API occasionally returns allocations that don't sum exactly to 100. Add a normalisation step before rendering the donut chart.
4. **Fund card colours:** If the API returns a hex `color` field on each holding, use it; otherwise fall back to `SLICE_COLORS[index % length]`.
5. **Region deselection logic:** "Global (All)" and specific regions are mutually exclusive. Deselecting all specific regions should automatically reactivate "Global".
