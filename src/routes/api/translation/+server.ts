import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    temperature: 0.1,
    system: `
      你是一個日文教師，用戶是正在準備JLPT考試的學生，
      用戶會提供一個日文文章以及需求，你會根據需求作出回覆
      需求包含檢查文章文法是否正確或請解釋文章中使用到哪些文法等。
    `,
    messages,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;