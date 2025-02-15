import { createOpenAI } from '@ai-sdk/openai';
import { formatDataStreamPart, streamText, type Message } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { PromptCache } from '@/promptCache';
import { getMockedAiResponse, isUsingMockedAiResponse, sleepMs } from '@/utils';
const promptCache = new PromptCache<string>()
const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
  if (isUsingMockedAiResponse()) {
    await sleepMs(1000);
    return new Response(formatDataStreamPart('text', getMockedAiResponse()), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  const { messages } = await request.json();
  const userMessage = (messages as Array<Message>).find(message => message.role === "user");
  if (userMessage) {
    const cacheHit = promptCache.get(userMessage.content);
    if (cacheHit) {
      console.log(`vocabulary cache hit, prompt: ${userMessage.content}`)
      return new Response(formatDataStreamPart('text', cacheHit), {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 0.1,
    maxTokens: 512,
    system: `
      你是一個日文教師，用戶是正在準備JLPT考試的學生，
      用戶會提供提供你一個日文單字，可能是任何一種活用方式，ex 動詞變化或時態變化
      你會提供我該單字的辭書型、詞性、羅馬拼音、重音標示、含義、動詞變化與例句，變化方式請以table格式呈現
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