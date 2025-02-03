import { env } from '$env/dynamic/private';
import { AIGenerateError, PromptError, type ErrorResposne } from '@/error';
import { createOpenAI } from '@ai-sdk/openai';
import { error } from '@sveltejs/kit';
import { generateObject } from 'ai';
import { Effect } from 'effect';
import { vocabularySchema } from '../util';
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
      try: () => generateObject({
        temperature: 1,
        system: `
          你是一個日文教師，用戶是正在準備JLPT考試的學生，
          你會根據用戶提供的JLPT考試等級，提供用戶一個提供我程度相當的單字，並提供介紹
        `,
        // use structured
        model: openai('gpt-4o'),
        prompt,
        schema: vocabularySchema
      }),
      catch: (e) => new AIGenerateError({
        failedReason: e instanceof Error ? e.message : "Failed to generate."
      })
    })
    return {
      success: true,
      response: result.toJsonResponse()
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