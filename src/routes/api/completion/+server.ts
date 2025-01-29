import { createOpenAI } from '@ai-sdk/openai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { AIGenerateError, PromptError, type ErrorResposne } from '@/error';
import { error, json } from '@sveltejs/kit';
import { generateText } from 'ai';
import { Effect } from 'effect';

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
        // FIXME exceed quota
        model: openai('gpt-4o-mini'),
        prompt,
        system: `
          你會負責用台灣中文解釋日文含義
          你會根據用戶提供的JLPT考試等級與目標類別：単語或文型
          隨機提供用戶一個単語或文型，並附上下列資訊：
          1. 例句
          2. 若為単語，遵守以下規則
            - 若為動詞，提供丁寧體與辭書體、自動詞或他動詞
            - 若為形容詞，請補充屬於な型或い型
          3. 若為文型，補充由哪些単語組成
        `
      }),
      catch: (e) => new AIGenerateError({
        failedReason: e instanceof Error ? e.message : "Failed to generate."
      })
    })
    return {
      success: true,
      text: result.text
    } as {
      success: true,
      text: string
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
  return json(result.text)
}) satisfies RequestHandler;