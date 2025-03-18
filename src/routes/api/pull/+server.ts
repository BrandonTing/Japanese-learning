import { auth } from "@/auth";
import { db } from "@/db/db";
import { replicacheServer } from "@/db/schema";
import { prefixes } from "@/states/db.svelte";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PatchOperation, PullRequestV1, PullResponse } from "replicache";
import type { RequestHandler } from "./$types";

export const POST = (async ({
  request,
}) => {
  const response = await pull(request);
  return json(response)
}) satisfies RequestHandler;

async function pull(req: Request) {
  const pull: PullRequestV1 = await req.json();
  console.log(`Processing pull`, JSON.stringify(pull));
  const { clientGroupID } = pull;
  const fromVersion = (pull.cookie as number) ?? 0;
  const t0 = Date.now();
  try {
    const userId = (await auth.api.getSession({
      headers: req.headers
    }))?.user.id
    if (!userId) {
      return
    }
    // Read all data in a single transaction so it's consistent.
    // Get current version.
    const server = await db.query.replicacheServer.findFirst({
      where: eq(replicacheServer.id, 1),
    });
    if (!server) {
      throw new Error(`No server found`);
    }

    const { version: currentVersion } = server

    if (fromVersion > currentVersion) {
      throw new Error(
        `fromVersion ${fromVersion} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`,
      );
    }

    // Get lmids for requesting client groups.
    const lastMutationIDChanges = await getLastMutationIDChanges(
      clientGroupID,
      fromVersion,
    );
    const patches = (await Promise.all([
      pullVocabularies(fromVersion, userId),
      pullBasic(fromVersion, userId),
      pullCheck(fromVersion, userId),
      pullCompare(fromVersion, userId),
      pullPattern(fromVersion, userId),
      pullChat(fromVersion, userId),
    ])).flatMap(x => x);
    const body: PullResponse = {
      lastMutationIDChanges: lastMutationIDChanges ?? {},
      cookie: currentVersion,
      patch: patches,
    };
    return body
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Processed pull in', Date.now() - t0);
  }
}

async function getLastMutationIDChanges(
  clientGroupID: string,
  fromVersion: number,
) {
  const rows = await db.query.replicacheClient.findMany({
    where: (client, { eq, gt }) => {
      return eq(client.clientGroupID, clientGroupID) && gt(client.clientVersion, fromVersion);
    },
  });
  return Object.fromEntries(rows.map(r => [r.id, r.lastMutationID]));
}

async function pullVocabularies(fromVersion: number, userId: string) {
  const changed = await db.query.vocabulary.findMany({
    where: (v, { gt, eq }) => gt(v.version, fromVersion) && eq(v.userId, userId),
  });
  const patch: PatchOperation[] = [];
  for (const row of changed) {
    const { id, vocabulary, explanation, version: rowVersion, isDeleted } = row;
    if (isDeleted) {
      if (rowVersion > fromVersion) {
        patch.push({
          op: 'del',
          key: `${prefixes.vocabulary}${id}`,
        });
      }
    } else {
      patch.push({
        op: 'put',
        key: `${prefixes.vocabulary}${id}`,
        value: {
          id, vocabulary, explanation,
        },
      });
    }
  }
  return patch
}


async function pullBasic(fromVersion: number, userId: string) {
  const changed = await db.query.basicTranslation.findMany({
    where: (v, { gt, eq }) => gt(v.version, fromVersion) && eq(v.userId, userId),
  });
  const patch: PatchOperation[] = [];
  for (const row of changed) {
    const { id, sentence, explanation, version: rowVersion, isDeleted } = row;
    if (isDeleted) {
      if (rowVersion > fromVersion) {
        patch.push({
          op: 'del',
          key: `${prefixes.basic}${id}`,
        });
      }
    } else {

      patch.push({
        op: 'put',
        key: `${prefixes.basic}${id}`,
        value: {
          id, sentence, explanation,
        },
      });
    }
  }
  return patch
}

async function pullCheck(fromVersion: number, userId: string) {
  const changed = await db.query.checkTranslation.findMany({
    where: (v, { gt, eq }) => gt(v.version, fromVersion) && eq(v.userId, userId),
  });
  const patch: PatchOperation[] = [];
  for (const row of changed) {
    const { id, sentence, explanation, version: rowVersion, isDeleted } = row;
    if (isDeleted) {
      if (rowVersion > fromVersion) {
        patch.push({
          op: 'del',
          key: `${prefixes.check}${id}`,
        });
      }
    } else {
      patch.push({
        op: 'put',
        key: `${prefixes.check}${id}`,
        value: {
          id, sentence, explanation,
        },
      });
    }
  }
  return patch
}

async function pullCompare(fromVersion: number, userId: string) {
  const changed = await db.query.compareTranslation.findMany({
    where: (v, { gt, eq }) => gt(v.version, fromVersion) && eq(v.userId, userId),
  });
  const patch: PatchOperation[] = [];
  for (const row of changed) {
    const { id, sentence, targetSentence, explanation, version: rowVersion, isDeleted } = row;
    if (isDeleted) {
      if (rowVersion > fromVersion) {
        patch.push({
          op: 'del',
          key: `${prefixes.compare}${id}`,
        });
      }
    } else {
      patch.push({
        op: 'put',
        key: `${prefixes.compare}${id}`,
        value: {
          id, sentence, targetSentence, explanation,
        },
      });
    }
  }
  return patch
}

async function pullPattern(fromVersion: number, userId: string) {
  const changed = await db.query.patternTranslation.findMany({
    where: (v, { gt, eq }) => gt(v.version, fromVersion) && eq(v.userId, userId),
  });
  const patch: PatchOperation[] = [];
  for (const row of changed) {
    const { id, sentence, pattern, explanation, version: rowVersion, isDeleted } = row;
    if (isDeleted) {
      if (rowVersion > fromVersion) {
        patch.push({
          op: 'del',
          key: `${prefixes.pattern}${id}`,
        });
      }
    } else {
      patch.push({
        op: 'put',
        key: `${prefixes.pattern}${id}`,
        value: {
          id, sentence, pattern, explanation,
        },
      });
    }
  }
  return patch
}

async function pullChat(fromVersion: number, userId: string) {
  const changed = await db.query.chat.findMany({
    where: (v, { gt, eq }) => gt(v.version, fromVersion) && eq(v.userId, userId),
    with: {
      messages: true,
    }
  });
  const patch: PatchOperation[] = [];
  for (const row of changed) {
    const { id, title, description, messages, version: rowVersion, isDeleted } = row;
    if (isDeleted) {
      if (rowVersion > fromVersion) {
        patch.push({
          op: 'del',
          key: `${prefixes.chat}${id}`,
        });
      }
    } else {
      patch.push({
        op: 'put',
        key: `${prefixes.chat}${id}`,
        value: {
          id, title, description, messages,
        },
      });
    }
  }
  return patch
}
