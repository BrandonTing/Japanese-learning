import { PromptCache } from "@/promptCache";
import { tool } from "ai";
import { z } from "zod";

export const promptCache = new PromptCache<string>()

export const getCacheDataTool = tool({
  description: "以prompt取得cache資料",
  parameters: z.object({
    prompt: z.string().describe("用戶提供的prompt content"),
  }),
  execute: async ({ prompt }) => {
    const cacheData = promptCache.get(prompt);
    if (cacheData === undefined) {
      throw new Error("Cache not found");
    }
    return {
      data: cacheData,
    };
  }
})