import { z } from 'zod';

export const vocabularySchema = z.object({
  vocabulary: z.string().describe("單字"),
  romaji: z.string().describe("單字的羅馬拼音"),
  type: z.string().describe("這個單字的詞性，ex. 自動詞、他動詞、な形容詞、い形容詞、名詞等"),
  variants: z.array(z.object({
    type: z.string().describe("變化方式的名稱"),
    form: z.string().describe("不同變化方式")
  })).describe("若為動詞，提供ます型、辭書型、て型、意向型、命令型、可能型、否定型等變化，若為其他詞性則回覆空array"),
  explanations: z.array(z.object({
    meaning: z.string().describe("單字的含義"),
    usage: z.string().describe("單字為此含義時，若有經常搭配的文法或語氣上有特殊的強調之處在此補充").optional(),
    example: z.object({
      sentence: z.string().describe("例句"),
      romaji: z.string().describe("例句的羅馬拼音，在不同詞之間以空格分隔"),
      meaning: z.string().describe("例句的繁體中文解釋")
    }),
  })).describe("提供單字的含義、使用方式與對應的例句，若單字有多個含義則提供多組，以三組為限。").min(1).max(3)
})
export type VocabularySchema = z.infer<typeof vocabularySchema>

export const grammerSchema = z.object({
  grammer: z.string().describe("文法"),
  romaji: z.string().describe("單字的羅馬拼音，在不同詞之間以空格分隔"),
  usage: z.string().describe("文法的含義以及使用方式，若此文法前後應該要使用特定詞性變化，ex. 普通體名詞、て型動詞等也在此標明。"),
  examples: z.array(z.object({
    sentence: z.string().describe("例句"),
    romaji: z.string().describe("例句的羅馬拼音，在不同詞之間以空格分隔"),
    meaning: z.string().describe("例句的繁體中文解釋")
  })).describe("此文法的例句").min(1).max(3)
})
export type GrammerSchema = z.infer<typeof grammerSchema>
