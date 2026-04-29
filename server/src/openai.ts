import { env } from './env';

export class OpenAIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export async function callOpenAI(prompt: string): Promise<unknown> {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => ({}));
    const message = (errBody as { error?: { message?: string } })?.error?.message
      || `OpenAI API error ${resp.status}`;
    throw new OpenAIError(resp.status, message);
  }

  const json = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new OpenAIError(502, 'Empty response from OpenAI');
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new OpenAIError(502, 'OpenAI returned malformed JSON');
  }
}
