import { z } from 'zod';

export const vocabularySchema = z.object({
  vocabulary: z.string().describe("単語"),
  kana: z.string().describe("単語的假名，用片假名或平假名書寫此單字"),
  type: z.string().describe("這個単語的詞性，ex. 自動詞、他動詞、な形容詞、い形容詞、名詞等"),
  variants: z.array(z.object({
    type: z.string().describe("變化方式的名稱"),
    form: z.string().describe("不同變化方式")
  })).describe("若為動詞，提供ます型、辭書型、て型、意向型、命令型、可能型、否定型等變化，若為形容詞或名詞，提供丁寧體、現在普通體與過去普通體三種變化"),
  explanations: z.array(z.object({
    meaning: z.string().describe("単語的含義"),
    example: z.string().describe("単語為此含義時的例句"),
  })).describe("提供単語的含義與對應的例句，若単語有多個含義則提供多組，以三組為限。")
})
export type VocabularySchema = z.infer<typeof vocabularySchema>

export const grammerSchema = z.object({
  volcabulary: z.string().describe("単語"),
  kana: z.string().describe("単語的假名，用片假名或平假名書寫此單字"),
  type: z.string().describe("這個単語的詞性，ex. 自動詞、他動詞、な形容詞、い形容詞、名詞等"),
  variants: z.array(z.object({
    type: z.string(),
    text: z.string()
  })).describe("若為動詞，提供ます型、辭書型、て型、意向型、命令型、可能型、否定型等變化，若為形容詞或名詞，提供現在式與過去是兩種變化").optional(),
  explanations: z.array(z.object({
    meaning: z.string().describe("単語的含義"),
    example: z.string().describe("単語為此含義時的例句"),
  })).describe("提供単語的含義與對應的例句，若単語有多個含義則提供多組，以三組為限。")
})
export type GrammerSchema = z.infer<typeof grammerSchema>
