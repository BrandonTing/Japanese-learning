import { DuplicatedError } from "@/error";
import { Replicache, type WriteTransaction } from "replicache";
import { toast } from "svelte-sonner";
import { v4 as uuidv4 } from "uuid";
export type Vocabulary = {
  vocabulary: string,
  explanation: string
}

export type Translation = {
  sentence: string,
  explanation: string
}

type WithID<T extends Record<string, string>> = T & { id: string }

const prefixes = {
  vocabulary: "Vocabulary/",
  basic: "Basic/",
  check: "Check/",
  // compare: "Compare/",
  // pattern: "Pattern/"
} as const

const mutators = {
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
  }
} satisfies Record<`${"save" | "delete"}${Capitalize<keyof typeof prefixes>}`, (tx: WriteTransaction, ...args: any[]) => Promise<void>>

type ReplicacheSpec = typeof mutators

class DB {
  rep = $state<Replicache<ReplicacheSpec>>();
  vocabularies = $state<Array<WithID<Vocabulary>>>([]);
  basicTranslations = $state<Array<WithID<Translation>>>([]);
  checkTranslations = $state<Array<WithID<Translation>>>([]);
  init(userId: string) {
    const rep = new Replicache<ReplicacheSpec>({
      name: import.meta.env.DEV ? "Local Dev" : userId,
      licenseKey: import.meta.env.VITE_REPLICACHE_KEY,
      mutators,
    });
    import.meta.hot?.dispose(() => rep.close());
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
  subscribeVocabularies() {
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

  // util
  #truncateSentence(sentence: string) {
    const threshold = 10;
    return sentence.length > threshold ? sentence.slice(0, threshold) + "..." : sentence
  }
}

export const db = new DB();