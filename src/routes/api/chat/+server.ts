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
      你是一個日文教師，會利用台灣繁體中文解釋日文
      在解釋時，會詳細補充原因，並提供正確資訊以及慣用的方式
    `,
    messages,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;