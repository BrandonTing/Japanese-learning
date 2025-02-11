import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { PromptCache } from '@/promptCache';
import type { Message } from 'ai';
import { formatDataStreamPart } from 'ai';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});
const promptCache = new PromptCache<string>()

export const POST = (async ({ request }) => {
  const { messages } = await request.json();
  const userMessage = (messages as Array<Message>).find(message => message.role === "user");
  if (userMessage) {
    const cacheHit = promptCache.get(userMessage.content);
    if (cacheHit) {
      console.log(`translate cache hit, prompt: ${userMessage.content}`)
      return new Response(formatDataStreamPart('text', cacheHit), {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 0.1,
    system: `
      你是一個日文教師，用戶是正在準備JLPT考試的學生，
      用戶會提供一個日文文章以及需求，你會根據需求作出回覆
      需求包含檢查文章文法是否正確或請解釋文章中使用到哪些文法等。
    `,
    messages,
    onFinish({ text }) {
      if (text && userMessage) {
        promptCache.set(userMessage.content, text);
      }
    },
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;