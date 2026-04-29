import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './env';
import { buildPrompt, FormData } from './prompt';
import { callOpenAI, OpenAIError } from './openai';

const app = express();

app.use(express.json({ limit: '64kb' }));
app.use(cors({ origin: env.clientOrigins }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/portfolio', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as Partial<FormData>;
    const validation = validateFormData(body);
    if (validation) {
      return res.status(400).json({ error: validation });
    }
    const prompt = buildPrompt(body as FormData);
    const data = await callOpenAI(prompt);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

if (env.isProduction) {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof OpenAIError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error('[server] unhandled error:', err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ error: message });
});

app.listen(env.port, () => {
  console.log(`[server] listening on http://localhost:${env.port}`);
});

function validateFormData(body: Partial<FormData>): string | null {
  if (typeof body.homeCountry !== 'string' || !body.homeCountry) return 'homeCountry is required';
  if (typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount < 1000) {
    return 'amount must be a number ≥ 1000';
  }
  if (typeof body.duration !== 'string' || !body.duration) return 'duration is required';
  if (typeof body.riskCategory !== 'string' || !body.riskCategory) return 'riskCategory is required';
  if (typeof body.numRecommendations !== 'number' || body.numRecommendations < 1 || body.numRecommendations > 20) {
    return 'numRecommendations must be between 1 and 20';
  }
  if (!Array.isArray(body.selectedRegions) || body.selectedRegions.length === 0) {
    return 'selectedRegions must be a non-empty array';
  }
  return null;
}
