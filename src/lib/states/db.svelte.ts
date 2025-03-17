import { DuplicatedError } from "@/error";
import type { Message } from "ai";
import { Replicache, type WriteTransaction } from "replicache";
import { toast } from "svelte-sonner";
import { v4 as uuidv4 } from "uuid";
type Vocabulary = {
  vocabulary: string,
  explanation: string
}

type Translation = {
  sentence: string,
  explanation: string
}

type Compare = {
  targetSentence: string,
  sentence: string,
  explanation: string
}

type Pattern = {
  pattern: string,
  sentence: string,
  explanation: string
}


type Chat = {
  title: string,
  description: string,
  messages: Array<Pick<Message, "role" | "content" | "id">>
}

type WithID<T extends Record<string, unknown>> = T & { id: string }

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
    explanation
  }: Vocabulary) => {
    const existed = (await tx.scan({ prefix: prefixes.vocabulary }).values().toArray() as Array<WithID<Vocabulary>>).find(v => v.vocabulary === vocabulary);
    if (existed) {
      throw new DuplicatedError()
    }
    const uuid = uuidv4();
    await tx.set(`${prefixes.vocabulary}${uuid}`, {
      id: uuid,
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
    explanation
  }: Translation) => {
    const existed = (await tx.scan({ prefix: prefixes.basic }).values().toArray() as Array<WithID<Translation>>).find(v => v.sentence === sentence);
    if (existed) {
      throw new DuplicatedError()
    }
    const uuid = uuidv4();
    await tx.set(`${prefixes.basic}${uuid}`, {
      id: uuid,
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
    explanation
  }: Translation) => {
    const existed = (await tx.scan({ prefix: prefixes.check }).values().toArray() as Array<WithID<Translation>>).find(v => v.sentence === sentence);
    if (existed) {
      throw new DuplicatedError()
    }
    const uuid = uuidv4();
    await tx.set(`${prefixes.check}${uuid}`, {
      id: uuid,
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
    explanation
  }: Compare) => {
    const existed = (await tx.scan({ prefix: prefixes.check }).values().toArray() as Array<WithID<Compare>>)
      .find(v => v.sentence === sentence && v.targetSentence === targetSentence);
    if (existed) {
      throw new DuplicatedError()
    }
    const uuid = uuidv4();
    await tx.set(`${prefixes.compare}${uuid}`, {
      id: uuid,
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
    explanation
  }: Pattern) => {
    const existed = (await tx.scan({ prefix: prefixes.pattern }).values().toArray() as Array<WithID<Pattern>>)
      .find(v => v.sentence === sentence && v.pattern === pattern);
    if (existed) {
      throw new DuplicatedError()
    }
    const uuid = uuidv4();
    await tx.set(`${prefixes.pattern}${uuid}`, {
      id: uuid,
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
  saveVocabulary(vocabulary: Vocabulary) {
    this.rep?.mutate.saveVocabulary(vocabulary).then(() => {
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
  saveBasic(translation: Translation) {
    this.rep?.mutate.saveBasic(translation).then(() => {
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
  saveCheck(translation: Translation) {
    this.rep?.mutate.saveCheck(translation).then(() => {
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
  saveCompare(compare: Compare) {
    this.rep?.mutate.saveCompare(compare).then(() => {
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
  savePattern(pattern: Pattern) {
    this.rep?.mutate.savePattern(pattern).then(() => {
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
  async saveChat(chat: Chat, onSuccess: () => void) {
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