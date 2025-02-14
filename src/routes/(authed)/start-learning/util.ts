import { JSONParseError, ParseError } from "@/error";
import { parseError } from "@/schema";
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
    const res = parseError(errorResponse);
    const { success, output, issues } = res;
    if (!success) {
      yield* new ParseError({
        parseErrorMessage:
          issues.map(issue => typeof issue === "string" ? issue : issue.message).join(',') || 'Something went wrong'
      });
      return
    }
    return output.message ?? 'Something went wrong';
  }).pipe(
    Effect.catchTags({
      JSONParseError: (e) => {
        return Effect.succeed(e.parseErrorMessage);
      },
      ParseError: (e) => {
        return Effect.succeed(e.parseErrorMessage);
      }
    }),
    Effect.runSync
  );
  return message;
}
export const levels = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
export type Level = (typeof levels)[number];
