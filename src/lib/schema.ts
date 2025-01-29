import { z } from "zod";

export const errorSchema = z.object({
  message: z.string()
})

export type ErrorObj = z.infer<typeof errorSchema>