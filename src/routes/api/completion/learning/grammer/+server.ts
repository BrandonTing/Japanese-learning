import { env } from '$env/dynamic/private';
import { AIGenerateError, PromptError, type ErrorResposne } from '@/error';
import { createOpenAI } from '@ai-sdk/openai';
import { error, json } from '@sveltejs/kit';
import { generateObject } from 'ai';
import { Effect } from 'effect';
import { grammerSchema, type GrammerSchema } from '../util';
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
        model: openai('gpt-4o'),
        prompt,
        schema: grammerSchema
      }),
      catch: (e) => new AIGenerateError({
        failedReason: e instanceof Error ? e.message : "Failed to generate."
      })
    })
    return {
      success: true,
      object: result.object
    } as {
      success: true,
      object: GrammerSchema
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
  return json(result.object)
}) satisfies RequestHandler;