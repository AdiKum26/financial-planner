import { SLICE_COLORS } from './constants';
import type { FormData, PortfolioData } from '../types';

type ApiErrorBody = {
  error?: string;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function fetchPortfolio(formData: FormData): Promise<PortfolioData> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as PortfolioData;
  return normalizePortfolio(data, formData);
}

function normalizePortfolio(data: PortfolioData, formData: FormData): PortfolioData {
  const holdings = Array.isArray(data.holdings) ? data.holdings : [];
  return {
    ...data,
    holdings: holdings.map((holding, index) => ({
      ...holding,
      rank: holding.rank || index + 1,
      categories: holding.categories?.length ? holding.categories : ['Investment fund'],
      color: holding.color || SLICE_COLORS[index % SLICE_COLORS.length],
      amount: holding.amount || Math.round((formData.amount * holding.allocation) / 100),
      geographicExposure: holding.geographicExposure || [],
    })),
  };
}
