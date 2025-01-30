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
        temperature: 0.5,
        // use structured
        model: openai('gpt-4o-mini'),
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