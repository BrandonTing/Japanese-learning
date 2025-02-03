import { env } from '$env/dynamic/private';
import { AIGenerateError, PromptError, type ErrorResposne } from '@/error';
import { createOpenAI } from '@ai-sdk/openai';
import { error, text } from '@sveltejs/kit';
import { generateText } from 'ai';
import { Effect } from 'effect';
import type { RequestHandler } from './$types';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});


export const POST = (async ({ request }) => {
  const result = await Effect.gen(function* () {
    const prompt = yield* Effect.tryPromise({
      try: async () => {
        return (await request.json()).prompt
      },
      catch: () => new PromptError()
    })
    const result = yield* Effect.tryPromise({
      try: () => generateText({
        temperature: 0.1,
        system: `
          你是一個日文教師，用戶是正在準備JLPT考試的學生，
          用戶會提供一個日文文章以及需求，你會根據需求作出回覆
          需求包含檢查文章文法是否正確或請解釋文章中使用到哪些文法等。
        `,
        model: openai('gpt-4o-mini'),
        prompt,
        maxTokens: 1024
      }),
      catch: (e) => new AIGenerateError({
        failedReason: e instanceof Error ? e.message : "Failed to generate."
      })
    })
    return {
      success: true,
      response: text(result.text)
    } as {
      success: true,
      response: Response
    }
  }).pipe(
    Effect.catchTags({
      "AIGenerateError": (e) => {
        return Effect.succeed({
          success: false,
          message: e.failedReason
        } as ErrorResposne)
      },
      "PromptError": () => {
        return Effect.succeed({
          success: false,
          message: "Invalid Prompt"
        } as ErrorResposne)
      }
    }),
    Effect.runPromise
  )
  if (!result.success) {
    error(500, result.message)
  }
  return result.response
}) satisfies RequestHandler;