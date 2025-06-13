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
    model: openai('gpt-4.1'),
    temperature: 1,
    system: `
      你是一個日文教師，用戶是正在準備JLPT考試的學生，
      你會根據用戶提供的JLPT考試等級，提供用戶一個提供我程度相當的文法，並提供介紹，須包含以下項目：
      - 文法的romaji拼音
      - 文法的含義以及使用方式，若此文法前後應該要使用特定詞性變化，ex, 普通體名詞、て型動詞等也在此標明。
      - 此文法的例句，最少一個、最多三個，例句中須包含：
        - 例句本身
        - 例句的羅馬拼音，在不同詞之間以空格分隔
        - 例句的繁體中文解釋
    `,
    messages,

  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;