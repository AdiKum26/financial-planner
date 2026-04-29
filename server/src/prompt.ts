type FormData = {
  homeCountry: string;
  amount: number;
  duration: string;
  riskCategory: string;
  numRecommendations: number;
  selectedRegions: string[];
};

type Country = { value: string; label: string; currency: string; symbol: string };
type Region = { id: string; label: string };

const HOME_COUNTRIES: Country[] = [
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

const REGIONS: Region[] = [
  { id: 'global', label: 'Global (All)' },
  { id: 'us', label: 'United States' },
  { id: 'canada', label: 'Canada' },
  { id: 'brazil', label: 'Brazil' },
  { id: 'latin_america', label: 'Latin America' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'germany', label: 'Germany' },
  { id: 'france', label: 'France' },
  { id: 'europe', label: 'Europe (Broad)' },
  { id: 'china', label: 'China' },
  { id: 'japan', label: 'Japan' },
  { id: 'india', label: 'India' },
  { id: 'south_korea', label: 'South Korea' },
  { id: 'australia', label: 'Australia' },
  { id: 'southeast_asia', label: 'Southeast Asia' },
  { id: 'south_africa', label: 'South Africa' },
  { id: 'nigeria', label: 'Nigeria' },
  { id: 'africa', label: 'Africa (Broad)' },
  { id: 'middle_east', label: 'Middle East' },
  { id: 'emerging_markets', label: 'Emerging Markets' },
  { id: 'frontier_markets', label: 'Frontier Markets' },
  { id: 'commodities', label: 'Commodities' },
];

export function buildPrompt(formData: FormData): string {
  const country = HOME_COUNTRIES.find(c => c.value === formData.homeCountry) || HOME_COUNTRIES[0];
  const regions = formData.selectedRegions.includes('global')
    ? 'Global (no restriction)'
    : formData.selectedRegions
        .map(id => REGIONS.find(r => r.id === id)?.label)
        .filter(Boolean)
        .join(', ');

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

export type { FormData };
