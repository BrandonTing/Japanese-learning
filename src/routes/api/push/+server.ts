import { auth } from '@/auth';
import { db, type Transaction } from '@/db/db';
import { replicacheClient, replicacheServer, vocabulary } from '@/db/schema';
import type { Mutators, Vocabulary, WithID } from '@/states/db.svelte';
import { eq } from 'drizzle-orm';
import type { MutationV1, PushRequestV1 } from 'replicache';
import type { RequestHandler } from './$types';

export const POST = (({ request, }) => {
  push(request);
  return new Response('{}')
}) satisfies RequestHandler;

async function push(req: Request) {
  const data: PushRequestV1 = await req.json();
  console.log('Processing push', JSON.stringify(data));
  const userId = (await auth.api.getSession({
    headers: req.headers
  }))?.user.id
  console.log('userId', userId);
  if (!userId) {
    return
  }
  const t0 = Date.now();
  try {
    // Iterate each mutation in the push.
    for (const mutation of data.mutations) {
      const t1 = Date.now();

      try {
        await db.transaction(t => processMutation(t, data.clientGroupID, mutation, userId));
      } catch (e) {
        console.error('Caught error from mutation', mutation, e);

        // Handle errors inside mutations by skipping and moving on. This is
        // convenient in development but you may want to reconsider as your app
        // gets close to production:
        // https://doc.replicache.dev/reference/server-push#error-handling
        // await db.transaction(t =>
        //   processMutation(t, data.clientGroupID, mutation, e as string),
        // );
      }

      console.log('Processed mutation in', Date.now() - t1);
    }

    await sendPoke();
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Processed push in', Date.now() - t0);
  }
}

async function processMutation(
  t: Transaction,
  clientGroupID: string,
  mutation: MutationV1,
  userId: string,
) {
  const { clientID } = mutation;

  // Get the previous version and calculate the next one.
  const server = await t.query.replicacheServer.findFirst({
    where: eq(replicacheServer.id, 1),
  })
  if (!server) {
    throw new Error('No server row found');
  }
  const prevVersion = server.version;
  if (!prevVersion) {
    throw new Error('No version found');
  }
  const nextVersion = prevVersion + 1;

  const lastMutationID = await getLastMutationID(t, clientID);
  const nextMutationID = lastMutationID + 1;

  console.log('nextVersion', nextVersion, 'nextMutationID', nextMutationID);

  // It's common due to connectivity issues for clients to send a
  // mutation which has already been processed. Skip these.
  if (mutation.id < nextMutationID) {
    console.log(
      `Mutation ${mutation.id} has already been processed - skipping`,
    );
    return;
  }

  // If the Replicache client is working correctly, this can never
  // happen. If it does there is nothing to do but return an error to
  // client and report a bug to Replicache.
  if (mutation.id > nextMutationID) {
    throw new Error(
      `Mutation ${mutation.id} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`,
    );
  }

  console.log('Processing mutation:', JSON.stringify(mutation));
  if (!mutation.args) {
    throw new Error('Mutation args can not be null');
  }
  if (!userId) {
    throw new Error('No user id found')
  }
  // For each possible mutation, run the server-side logic to apply the
  // mutation.
  switch (mutation.name as Mutators) {
    case "saveVocabulary":
      await createVocabulary(t, mutation.args as WithID<Vocabulary>, userId, nextVersion);
      break;
    case "deleteVocabulary":
      // TODO
      await deleteVocabulary(t, mutation.args as string, nextVersion);
      break;
    default:
      throw new Error(`Unknown mutation: ${mutation.name}`);
  }

  console.log('setting', clientID, 'last_mutation_id to', nextMutationID);
  // Update lastMutationID for requesting client.
  await setLastMutationID(
    t,
    clientID,
    clientGroupID,
    nextMutationID,
    nextVersion,
  );

  // Update global version.
  await t.update(replicacheServer).set({
    version: nextVersion,
  }).where(eq(replicacheServer.id, 1));
}

async function getLastMutationID(t: Transaction, clientID: string) {
  const clientRow = await t.query.replicacheClient.findFirst(
    {
      where: eq(replicacheClient.id, clientID),
    }
  )
  if (!clientRow) {
    return 0;
  }
  return clientRow.lastMutationID;
}

async function setLastMutationID(
  t: Transaction,
  clientID: string,
  clientGroupID: string,
  mutationID: number,
  version: number,
) {

  const result = await t.update(replicacheClient).set({
    clientGroupID,
    lastMutationID: mutationID,
    clientVersion: version,
  }).where(eq(replicacheClient.id, clientID));
  console.log('setLastMutationID', result);
  console.log('clientID', clientID);
  if (result.rowsAffected === 0) {
    await t.insert(replicacheClient).values({
      id: clientID,
      clientGroupID,
      lastMutationID: mutationID,
      clientVersion: version,
    });
  }
}

async function createVocabulary(
  t: Transaction,
  value: WithID<Vocabulary>,
  userId: string,
  version: number,
) {
  await t.insert(vocabulary).values({
    id: value.id,
    vocabulary: value.vocabulary,
    explanation: value.explanation,
    userId,
    version,
  });
}
async function deleteVocabulary(
  t: Transaction,
  value: string,
  version: number,
) {
  await t.update(vocabulary).set({
    isDeleted: 1,
    version,
  }).where(eq(vocabulary.id, value));
}

async function sendPoke() {
  // TODO
}