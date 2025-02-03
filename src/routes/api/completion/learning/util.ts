import { z } from 'zod';

export const vocabularySchema = z.object({
  vocabulary: z.string().describe("單字"),
  kana: z.string().describe("若單字中包含漢字，補充單字的假名：用片假名或平假名書寫此單字").optional(),
  type: z.string().describe("這個單字的詞性，ex. 自動詞、他動詞、な形容詞、い形容詞、名詞等"),
  variants: z.array(z.object({
    type: z.string().describe("變化方式的名稱"),
    form: z.string().describe("不同變化方式")
  })).describe("若為動詞，提供ます型、辭書型、て型、意向型、命令型、可能型、否定型等變化，若為形容詞或名詞，提供丁寧體、現在普通體與過去普通體三種變化").min(1),
  explanations: z.array(z.object({
    meaning: z.string().describe("單字的含義"),
    usage: z.string().describe("單字為此含義時，若有經常搭配的文法或語氣上有特殊的強調之處在此補充").optional(),
    example: z.string().describe("單字為此含義時的例句"),
  })).describe("提供單字的含義、使用方式與對應的例句，若單字有多個含義則提供多組，以三組為限。").min(1).max(3)
})
export type VocabularySchema = z.infer<typeof vocabularySchema>

export const grammerSchema = z.object({
  grammer: z.string().describe("文法"),
  kana: z.string().describe("若文法中包含漢字，補充文法的假名：用片假名或平假名書寫此文法").optional(),
  usage: z.string().describe("文法的含義以及使用方式，若此文法前後應該要使用特定詞性變化，ex. 普通體名詞、て型動詞等也在此標明。"),
  examples: z.array(z.object({
    sentence: z.string().describe("例句"),
    kana: z.string().optional().describe("若例句中包含漢字，補充kana假名"),
    meaning: z.string().describe("例句的繁體中文解釋")
  })).describe("此文法的例句").min(1).max(3)
})
export type GrammerSchema = z.infer<typeof grammerSchema>
