// ── DESIGN TOKENS ─────────────────────────────────────────────
const C = {
  bg:         '#060606',
  surface:    '#0f0f0f',
  surface2:   '#171717',
  surface3:   '#1f1f1f',
  border:     '#272727',
  borderGold: '#3a2e10',
  gold:       '#c9a435',
  goldLight:  '#e8c96f',
  goldDim:    '#6a5418',
  goldGlow:   'rgba(201,164,53,0.12)',
  text:       '#f0f0f0',
  textSub:    '#aaaaaa',
  textMuted:  '#555555',
  white:      '#ffffff',
  red:        '#e05555',
  green:      '#4caf72',
};

const FONT = {
  serif: "'DM Serif Display', serif",
  sans:  "'Inter', sans-serif",
};

const SLICE_COLORS = [
  '#c9a435','#4a8fd4','#9b59b6','#2ecc71','#e74c3c',
  '#1abc9c','#f39c12','#3498db','#e91e63','#00bcd4',
  '#ff5722','#8bc34a','#673ab7','#ff9800','#009688','#607d8b',
];

const GEO_COLORS = {
  'United States':     '#4a8fd4',
  'China':             '#e74c3c',
  'India':             '#f39c12',
  'Europe':            '#2ecc71',
  'Japan':             '#e91e63',
  'United Kingdom':    '#9b59b6',
  'Emerging Markets':  '#1abc9c',
  'Global':            '#c9a435',
  'Asia-Pacific':      '#ff9800',
  'Taiwan':            '#00bcd4',
  'South Africa':      '#8bc34a',
  'Brazil':            '#ff5722',
  'Canada':            '#607d8b',
  'Middle East':       '#673ab7',
  'Southeast Asia':    '#3498db',
  'Australia':         '#27ae60',
};

const REGIONS = [
  { id: 'global',          label: 'Global (All)',       group: 'Global' },
  { id: 'us',              label: 'United States',      group: 'Americas' },
  { id: 'canada',          label: 'Canada',             group: 'Americas' },
  { id: 'brazil',          label: 'Brazil',             group: 'Americas' },
  { id: 'latin_america',   label: 'Latin America',      group: 'Americas' },
  { id: 'uk',              label: 'United Kingdom',     group: 'Europe' },
  { id: 'germany',         label: 'Germany',            group: 'Europe' },
  { id: 'france',          label: 'France',             group: 'Europe' },
  { id: 'europe',          label: 'Europe (Broad)',     group: 'Europe' },
  { id: 'china',           label: 'China',              group: 'Asia-Pacific' },
  { id: 'japan',           label: 'Japan',              group: 'Asia-Pacific' },
  { id: 'india',           label: 'India',              group: 'Asia-Pacific' },
  { id: 'south_korea',     label: 'South Korea',        group: 'Asia-Pacific' },
  { id: 'australia',       label: 'Australia',          group: 'Asia-Pacific' },
  { id: 'southeast_asia',  label: 'Southeast Asia',     group: 'Asia-Pacific' },
  { id: 'south_africa',    label: 'South Africa',       group: 'Africa & Middle East' },
  { id: 'nigeria',         label: 'Nigeria',            group: 'Africa & Middle East' },
  { id: 'africa',          label: 'Africa (Broad)',     group: 'Africa & Middle East' },
  { id: 'middle_east',     label: 'Middle East',        group: 'Africa & Middle East' },
  { id: 'emerging_markets',label: 'Emerging Markets',   group: 'Thematic' },
  { id: 'frontier_markets',label: 'Frontier Markets',   group: 'Thematic' },
  { id: 'commodities',     label: 'Commodities',        group: 'Thematic' },
];

const HOME_COUNTRIES = [
  { value: 'us', label: 'United States (USD)', currency: 'USD', symbol: '$' },
  { value: 'uk', label: 'United Kingdom (GBP)', currency: 'GBP', symbol: '£' },
  { value: 'eu', label: 'European Union (EUR)', currency: 'EUR', symbol: '€' },
  { value: 'za', label: 'South Africa (ZAR)', currency: 'ZAR', symbol: 'R' },
  { value: 'au', label: 'Australia (AUD)', currency: 'AUD', symbol: 'A$' },
  { value: 'ca', label: 'Canada (CAD)', currency: 'CAD', symbol: 'C$' },
  { value: 'jp', label: 'Japan (JPY)', currency: 'JPY', symbol: '¥' },
  { value: 'in', label: 'India (INR)', currency: 'INR', symbol: '₹' },
  { value: 'cn', label: 'China (CNY)', currency: 'CNY', symbol: '¥' },
  { value: 'br', label: 'Brazil (BRL)', currency: 'BRL', symbol: 'R$' },
  { value: 'ng', label: 'Nigeria (NGN)', currency: 'NGN', symbol: '₦' },
  { value: 'other', label: 'Other', currency: 'USD', symbol: '$' },
];

const DURATIONS = [
  { value: '1',         label: '1 year' },
  { value: '2-3',       label: '2–3 years' },
  { value: '5',         label: '5 years' },
  { value: '10',        label: '10 years' },
  { value: '10+',       label: 'More than 10 years' },
  { value: 'indefinite',label: 'Indefinitely' },
];

// Build OpenAI prompt
function buildPrompt(formData) {
  const country = HOME_COUNTRIES.find(c => c.value === formData.homeCountry) || HOME_COUNTRIES[0];
  const regions  = formData.selectedRegions.includes('global')
    ? 'Global (no restriction)'
    : formData.selectedRegions.map(id => REGIONS.find(r => r.id === id)?.label).filter(Boolean).join(', ');

  return `You are an expert financial portfolio advisor. Create a detailed, realistic investment portfolio recommendation.

Parameters:
- Investment Amount: ${country.symbol}${Number(formData.amount).toLocaleString()} ${country.currency}
- Investment Duration: ${formData.duration}
- Risk Profile: ${formData.riskCategory}
- Number of Recommendations: ${formData.numRecommendations}
- Home Country: ${country.label}
- Target Regions/Countries: ${regions}

Return ONLY a JSON object (no markdown code fences, no extra text) matching exactly this structure:
{
  "summary": {
    "expectedReturnLow": <number, annual %>,
    "expectedReturnHigh": <number, annual %>,
    "riskLevel": "<Conservative|Balanced|Aggressive>",
    "diversificationScore": <integer 0-100>,
    "diversificationLabel": "<short descriptive label>",
    "overallRiskScore": <number 1.0-10.0>,
    "overallRiskLabel": "<e.g. Growth-oriented>",
    "regionBreakdown": [{"region":"<name>","percentage":<integer>}]
  },
  "holdings": [
    {
      "rank": <integer>,
      "name": "<full ETF or fund name>",
      "ticker": "<ticker symbol>",
      "allocation": <integer, % of portfolio>,
      "amount": <integer, currency amount>,
      "categories": ["<category>","<subcategory>"],
      "riskLabel": "<Low|Medium|High>",
      "liquidity": "<Daily|Weekly|Monthly>",
      "returnRange": "<X-Y% p.a.>",
      "riskScore": <integer 1-10>,
      "description": "<3-4 sentence professional rationale tailored to the user parameters>",
      "geographicExposure": [{"region":"<name>","percentage":<integer>}],
      "color": "<hex color string>"
    }
  ]
}

Rules:
- Allocations must sum exactly to 100.
- Use real, well-known ETFs or funds where possible.
- Tailor holdings toward the selected regions/countries.
- Provide compelling, specific descriptions referencing the user's risk profile and duration.
- Colors for holdings should be visually distinct.
- regionBreakdown percentages must sum to 100.
- geographicExposure percentages per holding must sum to 100.`;
}
