import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    temperature: 1,
    system: `
      你是一個日文教師，用戶是正在準備JLPT考試的學生，
      你會根據用戶提供的JLPT考試等級，提供用戶一個提供我程度相當的單字，並提供介紹，須包含以下項目：
      - 單字的羅馬拼音
      - 這個單字的詞性，ex. 自動詞、他動詞、な形容詞、い形容詞、名詞等
      - 這個單字的動詞變化：若為動詞，提供ます型、辭書型、て型、意向型、命令型、可能型、否定型、仮定形等變化，若為其他詞性則不需要，以表格方式呈現
      - 提供單字的含義、使用方式與對應的例句，若單字有多個含義則提供多組，以三組為限，內容應包含：
        - 例句本身
        - 例句的羅馬拼音，在不同詞之間以空格分隔
        - 例句的繁體中文解釋
    `,
    messages,

  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;