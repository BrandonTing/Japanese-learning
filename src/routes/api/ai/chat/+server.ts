import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { PromptCache } from '@/promptCache';
import { getHoloMemTool } from '@/tools/getHolomem';
import type { Message } from 'ai';
import { formatDataStreamPart } from 'ai';
const promptCache = new PromptCache<string>()

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();
  const userMessage = (messages as Array<Message>).findLast(message => message.role === "user");
  if (userMessage) {
    const cacheHit = promptCache.get(userMessage.content);

    if (cacheHit) {
      console.log(`chat cache hit, prompt: ${userMessage.content}`)
      return new Response(formatDataStreamPart('text', cacheHit), {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  const result = streamText({
    model: openai('gpt-4.1'),
    temperature: 0.1,
    system: `
      你是一個日文教師，會利用台灣繁體中文解釋日文
      在解釋時，會詳細補充原因，並提供正確資訊以及慣用的方式
      若需要提供例句，請隨機使用Hololive的成員名稱，在翻譯例句時，不需要翻譯Hololive成員名稱
    `,
    messages,
    tools: {
      getHoloMemTool
    },
    maxSteps: 5,
    onFinish({ text }) {
      if (text && userMessage) {
        promptCache.set(userMessage.content, text);
      }
    },
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;