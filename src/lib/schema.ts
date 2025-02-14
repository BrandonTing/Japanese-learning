import * as v from 'valibot'; // 1.24 kB
import { type InferInput } from "valibot";

export const errorSchema = v.object({
  message: v.string()
})

export type ErrorObj = InferInput<typeof errorSchema>;

export function parseError(input: unknown) {
  return v.safeParse(errorSchema, input);
}
