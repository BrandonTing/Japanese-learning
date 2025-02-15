import * as v from "valibot"

export const envSchema = v.object({
  VITE_TURSO_DATABASE_URL: v.pipe(v.string(), v.nonEmpty(), v.startsWith("libsql://")),
  VITE_TURSO_AUTH_TOKEN: v.string(),
  BETTER_AUTH_SECRET: v.string(),
  OPENAI_API_KEY: v.string(),
  VITE_MOCK_AI_RESPONSE: v.pipe(v.optional(v.string()), v.transform(input => input === "true")),
})