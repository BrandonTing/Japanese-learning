import { createOpenAI } from '@ai-sdk/openai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { generateText } from 'ai';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
  const {prompt} = await request.json();
  const result = await generateText({
    // FIXME exceed quota
    model: openai('gpt-4o-mini'),
    prompt,
    system: `
      你會負責用台灣中文解釋日文含義
      你會根據用戶提供的JLPT考試等級與目標類別：単語或文型
      隨機提供用戶一個単語或文型，並附上下列資訊：
      1. 例句
      2. 若為単語，補充時態變化
      3. 若為文型，補充由哪些単語組成
    `
  });
  return json(result.text)
}) satisfies RequestHandler;