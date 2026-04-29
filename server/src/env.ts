import path from 'path';
import dotenv from 'dotenv';

for (const candidate of [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(__dirname, '../../.env'),
]) {
  dotenv.config({ path: candidate, override: false });
}

const apiKey = process.env.OPENAI_API_KEY?.trim();
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is missing. Add it to the .env file at the repo root.');
}
if (!apiKey.startsWith('sk-')) {
  throw new Error('OPENAI_API_KEY does not look valid (must start with "sk-").');
}

const port = Number(process.env.PORT || process.env.Port || process.env.port) || 3001;
const clientOrigins = (process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export const env = {
  openaiApiKey: apiKey,
  port,
  clientOrigins,
  isProduction: process.env.NODE_ENV === 'production',
};
