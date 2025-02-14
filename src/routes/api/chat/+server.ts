import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { PromptCache } from '@/promptCache';
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
    // const cacheHit = promptCache.get(userMessage.content);
    const cacheHit = `
    This is a mock response for testing cache hit. 
    The purpose of this mock response is to simulate a scenario where the cache contains a precomputed response for the given user input. 
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    This helps in testing the cache hit functionality without actually querying the OpenAI API or relying on the promptCache implementation.
    `;

    if (cacheHit) {
      console.log(`chat cache hit, prompt: ${userMessage.content}`)
      return new Response(formatDataStreamPart('text', cacheHit), {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  const result = streamText({
    model: openai('gpt-4o'),
    temperature: 0.1,
    system: `
      你是一個日文教師，會利用台灣繁體中文解釋日文
      在解釋時，會詳細補充原因，並提供正確資訊以及慣用的方式
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