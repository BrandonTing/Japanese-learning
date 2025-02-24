import { Replicache, type WriteTransaction } from "replicache";
import { toast } from "svelte-sonner";

type Item = {
  key: string,
  content: string
}

type ReplicacheSpec = {
  saveVocabulary: (tx: WriteTransaction, args: Item) => Promise<void>
  deleteVocabulary: (tx: WriteTransaction, args: Item["key"]) => Promise<void>
}

class DB {
  rep = $state<Replicache<ReplicacheSpec>>();
  list = $state<Array<Item>>([]);
  init(userId: string) {
    const rep = new Replicache<ReplicacheSpec>({
      name: userId,
      licenseKey: import.meta.env.VITE_REPLICACHE_KEY,
      mutators: {
        saveVocabulary: async (tx, {
          key,
          content
        }) => {
          await tx.set(`Vocabulary/${key}`, {
            key,
            content
          });
        },
        deleteVocabulary: async (tx, key) => {
          await tx.del(`Vocabulary/${key}`);
        }
      },
    });
    import.meta.hot?.dispose(() => rep.close());
    this.rep = rep;
    rep.subscribe(
      async tx => (await tx.scan({ prefix: "Vocabulary/" }).values().toArray()) as Array<(Item)>,
      {
        onData: (data) => {
          this.list = data;
        }
      }
    )
  }
  saveVocabulary(item: Item) {
    this.rep?.mutate.saveVocabulary(item).then(() => {
      toast.success(`Explanation of ${item.key} is saved`)
    }).catch(() => {
      toast.error(`Failed to save explanation of ${item.key}`)
    })
  }
  deleteVocabulary(key: string) {
    this.rep?.mutate.deleteVocabulary(key)
  }
}

export const db = new DB();