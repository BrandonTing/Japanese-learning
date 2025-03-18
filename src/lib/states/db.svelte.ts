import { DuplicatedError } from "@/error";
import type { Message } from "ai";
import { Replicache, type WriteTransaction } from "replicache";
import { toast } from "svelte-sonner";
import { v4 as uuidv4 } from "uuid";
export type Vocabulary = WithID<{
  vocabulary: string,
  explanation: string
}>

export type Translation = WithID<{
  sentence: string,
  explanation: string
}>

export type Compare = WithID<{
  targetSentence: string,
  sentence: string,
  explanation: string
}>

export type Pattern = WithID<{
  pattern: string,
  sentence: string,
  explanation: string
}>

export type Chat = WithID<{
  title: string,
  description: string,
  messages: Array<Pick<Message, "role" | "content" | "id">>
}>

type WithID<T extends Record<string, unknown>> = T & { id: string }
type ExcludeID<T> = Omit<T, "id">

const prefixes = {
  vocabulary: "Vocabulary/",
  basic: "Basic/",
  check: "Check/",
  compare: "Compare/",
  pattern: "Pattern/",
  chat: "Chat/"
} as const

const mutators = {
  // Vocabulary
  saveVocabulary: async (tx, {
    vocabulary,
    explanation,
    id
  }: Vocabulary) => {
    const existed = (await tx.scan({ prefix: prefixes.vocabulary }).values().toArray() as Array<Vocabulary>).find(v => v.vocabulary === vocabulary);
    if (existed) {
      throw new DuplicatedError()
    }
    await tx.set(`${prefixes.vocabulary}${id}`, {
      id,
      vocabulary,
      explanation
    });
  },
  deleteVocabulary: async (tx, key: string) => {
    await tx.del(`${prefixes.vocabulary}${key}`);
  },
  // Basic
  saveBasic: async (tx, {
    sentence,
    explanation,
    id
  }: Translation) => {
    const existed = (await tx.scan({ prefix: prefixes.basic }).values().toArray() as Array<Translation>).find(v => v.sentence === sentence);
    if (existed) {
      throw new DuplicatedError()
    }
    await tx.set(`${prefixes.basic}${id}`, {
      id,
      sentence,
      explanation
    });
  },
  deleteBasic: async (tx, key: string) => {
    await tx.del(`${prefixes.basic}${key}`);
  },
  // Check
  saveCheck: async (tx, {
    sentence,
    explanation,
    id
  }: Translation) => {
    const existed = (await tx.scan({ prefix: prefixes.check }).values().toArray() as Array<WithID<Translation>>).find(v => v.sentence === sentence);
    if (existed) {
      throw new DuplicatedError()
    }
    await tx.set(`${prefixes.check}${id}`, {
      id,
      sentence,
      explanation
    });
  },
  deleteCheck: async (tx, key: string) => {
    await tx.del(`${prefixes.check}${key}`);
  },
  // Compare
  saveCompare: async (tx, {
    sentence,
    targetSentence,
    explanation,
    id
  }: Compare) => {
    const existed = (await tx.scan({ prefix: prefixes.check }).values().toArray() as Array<WithID<Compare>>)
      .find(v => v.sentence === sentence && v.targetSentence === targetSentence);
    if (existed) {
      throw new DuplicatedError()
    }
    await tx.set(`${prefixes.compare}${id}`, {
      id,
      sentence,
      targetSentence,
      explanation
    });
  },
  deleteCompare: async (tx, key: string) => {
    await tx.del(`${prefixes.compare}${key}`);
  },
  // Pattern
  savePattern: async (tx, {
    sentence,
    pattern,
    explanation,
    id
  }: Pattern) => {
    const existed = (await tx.scan({ prefix: prefixes.pattern }).values().toArray() as Array<WithID<Pattern>>)
      .find(v => v.sentence === sentence && v.pattern === pattern);
    if (existed) {
      throw new DuplicatedError()
    }
    await tx.set(`${prefixes.pattern}${id}`, {
      id,
      sentence,
      pattern,
      explanation
    });
  },
  deletePattern: async (tx, key: string) => {
    await tx.del(`${prefixes.pattern}${key}`);
  },
  saveChat: async (tx, chat: WithID<Chat>) => {
    await tx.set(`${prefixes.chat}${chat.id}`, chat);
  },
  deleteChat: async (tx, key: string) => {
    await tx.del(`${prefixes.chat}${key}`);
  },

} satisfies Record<`${"save" | "delete"}${Capitalize<keyof typeof prefixes>}`, (tx: WriteTransaction, ...args: any[]) => Promise<void>>

export type Mutators = keyof typeof mutators

type ReplicacheSpec = typeof mutators

type IDB = {
  [K in `${"save" | "delete" | "subscribe"}${Capitalize<keyof typeof prefixes>}`]: (...args: any[]) => void
}

class DB implements IDB {
  rep = $state<Replicache<ReplicacheSpec>>();
  vocabularies = $state<Array<WithID<Vocabulary>>>([]);
  basicTranslations = $state<Array<WithID<Translation>>>([]);
  checkTranslations = $state<Array<WithID<Translation>>>([]);
  compareTranslations = $state<Array<WithID<Compare>>>([]);
  patternTranslations = $state<Array<WithID<Pattern>>>([]);
  chats = $state<Array<WithID<Chat>>>([]);
  init(userId: string) {
    const rep = new Replicache<ReplicacheSpec>({
      name: import.meta.env.DEV ? "Local Dev" : userId,
      licenseKey: import.meta.env.VITE_REPLICACHE_KEY,
      mutators,
      pushURL: '/api/push',
    });
    import.meta.hot?.dispose(() => rep.close())
    this.rep = rep;
  }
  // Vocabulary
  saveVocabulary(vocabulary: ExcludeID<Vocabulary>) {
    const uuid = uuidv4();
    this.rep?.mutate.saveVocabulary({
      ...vocabulary,
      id: uuid
    }).then(() => {
      toast.success(`Explanation of ${vocabulary.vocabulary} is saved`)
    }).catch((e) => {
      if (e instanceof DuplicatedError) {
        toast.error(`Explanation of ${vocabulary.vocabulary} is already existed`)
        return
      }
      toast.error(`Failed to save explanation of ${vocabulary.vocabulary}`)
    })
  }
  deleteVocabulary(key: string) {
    this.rep?.mutate.deleteVocabulary(key)
  }
  subscribeVocabulary() {
    return this.rep?.subscribe(
      async tx => (await tx.scan({ prefix: prefixes.vocabulary }).values().toArray()) as Array<WithID<Vocabulary>>,
      {
        onData: (data) => {
          this.vocabularies = data;
        }
      }
    )
  }
  // Basic
  saveBasic(translation: ExcludeID<Translation>) {
    const uuid = uuidv4();
    this.rep?.mutate.saveBasic({
      ...translation,
      id: uuid
    }).then(() => {
      toast.success(`Explanation of ${this.#truncateSentence(translation.sentence)} is saved`)
    }).catch((e) => {
      if (e instanceof DuplicatedError) {
        toast.error(`Explanation of ${this.#truncateSentence(translation.sentence)} is already existed`)
        return
      }
      toast.error(`Failed to save explanation of ${this.#truncateSentence(translation.sentence)}`)
    })
  }
  deleteBasic(key: string) {
    this.rep?.mutate.deleteBasic(key)
  }
  subscribeBasic() {
    return this.rep?.subscribe(
      async tx => (await tx.scan({ prefix: prefixes.basic }).values().toArray()) as Array<WithID<Translation>>,
      {
        onData: (data) => {
          this.basicTranslations = data;
        }
      }
    )
  }
  // Check
  saveCheck(translation: ExcludeID<Translation>) {
    const id = uuidv4();
    this.rep?.mutate.saveCheck({ ...translation, id }).then(() => {
      toast.success(`Explanation of ${this.#truncateSentence(translation.sentence)} is saved`)
    }).catch((e) => {
      if (e instanceof DuplicatedError) {
        toast.error(`Explanation of ${this.#truncateSentence(translation.sentence)} is already existed`)
        return
      }
      toast.error(`Failed to save explanation of ${this.#truncateSentence(translation.sentence)}`)
    })
  }
  deleteCheck(key: string) {
    this.rep?.mutate.deleteCheck(key)
  }
  subscribeCheck() {
    return this.rep?.subscribe(
      async tx => (await tx.scan({ prefix: prefixes.check }).values().toArray()) as Array<WithID<Translation>>,
      {
        onData: (data) => {
          this.checkTranslations = data;
        }
      }
    )
  }

  // Compare
  saveCompare(compare: ExcludeID<Compare>) {
    const id = uuidv4();
    this.rep?.mutate.saveCompare({
      ...compare,
      id
    }).then(() => {
      toast.success(`Explanation of ${this.#truncateSentence(compare.sentence)} is saved`)
    }).catch((e) => {
      if (e instanceof DuplicatedError) {
        toast.error(`Explanation of ${this.#truncateSentence(compare.sentence)} is already existed`)
        return
      }
      toast.error(`Failed to save explanation of ${this.#truncateSentence(compare.sentence)}`)
    })
  }
  deleteCompare(key: string) {
    this.rep?.mutate.deleteCompare(key)
  }
  subscribeCompare() {
    return this.rep?.subscribe(
      async tx => (await tx.scan({ prefix: prefixes.compare }).values().toArray()) as Array<WithID<Compare>>,
      {
        onData: (data) => {
          this.compareTranslations = data;
        }
      }
    )
  }

  // Pattern
  savePattern(pattern: ExcludeID<Pattern>) {
    const id = uuidv4();
    this.rep?.mutate.savePattern({ ...pattern, id }).then(() => {
      toast.success(`Explanation of ${this.#truncateSentence(pattern.sentence)} is saved`)
    }).catch((e) => {
      if (e instanceof DuplicatedError) {
        toast.error(`Explanation of ${this.#truncateSentence(pattern.sentence)} is already existed`)
        return
      }
      toast.error(`Failed to save explanation of ${this.#truncateSentence(pattern.sentence)}`)
    })
  }
  deletePattern(key: string) {
    this.rep?.mutate.deletePattern(key)
  }
  subscribePattern() {
    return this.rep?.subscribe(
      async tx => (await tx.scan({ prefix: prefixes.pattern }).values().toArray()) as Array<WithID<Pattern>>,
      {
        onData: (data) => {
          this.patternTranslations = data;
        }
      }
    )
  }
  // Chat
  async saveChat(chat: ExcludeID<Chat>, onSuccess: () => void) {
    const id = uuidv4()
    this.rep?.mutate.saveChat({
      ...chat,
      id
    }).then(() => {
      toast.success(`Chat is saved`)
      onSuccess()
    }).catch(() => {
      toast.error(`Failed to save chat`)
    })
  }
  updateChat(chat: WithID<Chat>) {
    this.rep?.mutate.saveChat(chat)
  }
  deleteChat(key: string) {
    return this.rep?.mutate.deleteChat(key)
  }
  subscribeChat() {
    return this.rep?.subscribe(
      async tx => (await tx.scan({ prefix: prefixes.chat }).values().toArray()) as Array<WithID<Chat>>,
      {
        onData: (data) => {
          this.chats = data;
        }
      }
    )
  }

  // util
  #truncateSentence(sentence: string) {
    const threshold = 10;
    return sentence.length > threshold ? sentence.slice(0, threshold) + "..." : sentence
  }
}

export const db = new DB();