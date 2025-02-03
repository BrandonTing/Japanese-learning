import { JSONParseError, ZodParseError } from "@/error";
import { errorSchema } from "@/schema";
import { Effect } from "effect";

export function handleGenerateError(e: Error) {
  const errorJson = e.message;
  const message = Effect.gen(function* () {
    const errorResponse = yield* Effect.try({
      try: () => JSON.parse(errorJson),
      catch: () =>
        new JSONParseError({
          parseErrorMessage: e.message
        })
    });
    const { success, data, error: zodError } = errorSchema.safeParse(errorResponse);
    if (!success) {
      yield* new ZodParseError({
        parseErrorMessage:
          zodError.flatten().fieldErrors.message?.join(',') || 'Something went wrong'
      });
    }
    return data?.message ?? 'Something went wrong';
  }).pipe(
    Effect.catchTags({
      JSONParseError: (e) => {
        return Effect.succeed(e.parseErrorMessage);
      },
      ZodParseError: (e) => {
        return Effect.succeed(e.parseErrorMessage);
      }
    }),
    Effect.runSync
  );
  return message;
}
export const levels = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
export type Level = (typeof levels)[number];
