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
    model: openai('gpt-4o-mini'),
    temperature: 0.1,
    system: `
      你是一個日文教師，用戶是正在準備JLPT考試的學生，
      用戶會提供提供你一個日文單字，可能是任何一種活用方式，ex 動詞變化或時態變化
      你會提供我該單字的辭書型、詞性、羅馬拼音、含義、動詞變化、常見活用與例句，變化與活用方式請以table格式呈現
    `,
    messages,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;