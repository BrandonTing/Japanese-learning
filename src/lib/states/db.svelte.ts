import { Replicache, type WriteTransaction } from "replicache";
import { toast } from "svelte-sonner";

export type Vocabulary = {
  vocabulary: string,
  explanation: string
}

const prefixes = {
  vocabulary: "Vocabulary/"
}

type ReplicacheSpec = {
  saveVocabulary: (tx: WriteTransaction, args: Vocabulary) => Promise<void>
  deleteVocabulary: (tx: WriteTransaction, args: Vocabulary["vocabulary"]) => Promise<void>
}

class DB {
  rep = $state<Replicache<ReplicacheSpec>>();
  vocabularies = $state<Array<Vocabulary>>([]);
  init(userId: string) {
    const rep = new Replicache<ReplicacheSpec>({
      name: userId,
      licenseKey: import.meta.env.VITE_REPLICACHE_KEY,
      mutators: {
        saveVocabulary: async (tx, {
          vocabulary,
          explanation
        }) => {
          await tx.set(`${prefixes.vocabulary}${vocabulary}`, {
            vocabulary,
            explanation
          });
        },
        deleteVocabulary: async (tx, key) => {
          await tx.del(`${prefixes.vocabulary}${key}`);
        }
      },
    });
    import.meta.hot?.dispose(() => rep.close());
    this.rep = rep;
  }
  saveVocabulary(vocabulary: Vocabulary) {
    this.rep?.mutate.saveVocabulary(vocabulary).then(() => {
      toast.success(`Explanation of ${vocabulary.vocabulary} is saved`)
    }).catch(() => {
      toast.error(`Failed to save explanation of ${vocabulary.vocabulary}`)
    })
  }
  deleteVocabulary(key: string) {
    this.rep?.mutate.deleteVocabulary(key)
  }
   subscribeVocabularies(userId: string) {
    if (!this.rep) {
      this.init(userId)
    }

    return this.rep?.subscribe(
      async tx => (await tx.scan({ prefix: prefixes.vocabulary }).values().toArray()) as Array<(Vocabulary)>,
      {
        onData: (data) => {
          this.vocabularies = data;
        }
      }
    )
  }
}

export const db = new DB();