import { auth } from '@/auth';
import { db } from '@/db/db';
import { basicTranslation, chat, checkTranslation, compareTranslation, message, patternTranslation, replicacheClient, replicacheServer, vocabulary } from '@/db/schema';
import type { Chat, Compare, Mutators, Pattern, Translation, Vocabulary } from '@/states/db.svelte';
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
        await processMutation(data.clientGroupID, mutation, userId)
      } catch (e) {
        console.error('Caught error from mutation', mutation, e);

        // Handle errors inside mutations by skipping and moving on. This is
        // convenient in development but you may want to reconsider as your app
        // gets close to production:
        // https://doc.replicache.dev/reference/server-push#error-handling
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
  clientGroupID: string,
  mutation: MutationV1,
  userId: string,
) {
  const { clientID } = mutation;

  // Get the previous version and calculate the next one.
  const server = await db.query.replicacheServer.findFirst({
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

  const lastMutationID = await getLastMutationID(clientID);
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
      await createVocabulary(mutation.args as Vocabulary, userId, nextVersion);
      break;
    case "deleteVocabulary":
      await deleteVocabulary(mutation.args as string, nextVersion);
      break;
    case "saveBasic":
      await createBasic(mutation.args as Translation, userId, nextVersion);
      break;
    case "deleteBasic":
      await deleteBasic(mutation.args as string, nextVersion);
      break;
    case "saveCheck":
      await createCheck(mutation.args as Translation, userId, nextVersion);
      break;
    case "deleteCheck":
      await deleteCheck(mutation.args as string, nextVersion);
      break;
    case "saveCompare":
      await createCompare(mutation.args as Compare, userId, nextVersion);
      break;
    case "deleteCompare":
      await deleteCompare(mutation.args as string, nextVersion);
      break;
    case "savePattern":
      await createPattern(mutation.args as Pattern, userId, nextVersion);
      break;
    case "deletePattern":
      await deletePattern(mutation.args as string, nextVersion);
      break;
    case "saveChat":
      await createChat(mutation.args as Chat, userId, nextVersion);
      break;
    case "deleteChat":
      await deleteChat(mutation.args as string, nextVersion);
      break;
    default:
      throw new Error(`Unknown mutation: ${mutation.name}`);
  }
  // Update lastMutationID for requesting cliendb.
  await setLastMutationID(
    clientID,
    clientGroupID,
    nextMutationID,
    nextVersion,
  );

  // Update global version.
  await db.update(replicacheServer).set({
    version: nextVersion,
  }).where(eq(replicacheServer.id, 1));
}

async function getLastMutationID(clientID: string) {
  const clientRow = await db.query.replicacheClient.findFirst(
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

  clientID: string,
  clientGroupID: string,
  mutationID: number,
  version: number,
) {

  const result = await db.update(replicacheClient).set({
    clientGroupID,
    lastMutationID: mutationID,
    clientVersion: version,
  }).where(eq(replicacheClient.id, clientID));
  if (result.rowsAffected === 0) {
    await db.insert(replicacheClient).values({
      id: clientID,
      clientGroupID,
      lastMutationID: mutationID,
      clientVersion: version,
    });
  }
}

async function createVocabulary(

  value: Vocabulary,
  userId: string,
  version: number,
) {
  await db.insert(vocabulary).values({
    id: value.id,
    vocabulary: value.vocabulary,
    explanation: value.explanation,
    userId,
    version,
  });
}
async function deleteVocabulary(

  value: string,
  version: number,
) {
  await db.update(vocabulary).set({
    isDeleted: 1,
    version,
  }).where(eq(vocabulary.id, value));
}

async function createBasic(

  value: Translation,
  userId: string,
  version: number,
) {
  await db.insert(basicTranslation).values({
    id: value.id,
    sentence: value.sentence,
    explanation: value.explanation,
    userId,
    version,
  });
}
async function deleteBasic(

  value: string,
  version: number,
) {
  await db.update(basicTranslation).set({
    isDeleted: 1,
    version,
  }).where(eq(vocabulary.id, value));
}

async function createCheck(

  value: Translation,
  userId: string,
  version: number,
) {
  await db.insert(checkTranslation).values({
    id: value.id,
    sentence: value.sentence,
    explanation: value.explanation,
    userId,
    version,
  });
}
async function deleteCheck(

  value: string,
  version: number,
) {
  await db.update(checkTranslation).set({
    isDeleted: 1,
    version,
  }).where(eq(vocabulary.id, value));
}

async function createCompare(

  value: Compare,
  userId: string,
  version: number,
) {
  await db.insert(compareTranslation).values({
    id: value.id,
    sentence: value.sentence,
    targetSentence: value.targetSentence,
    explanation: value.explanation,
    userId,
    version,
  });
}
async function deleteCompare(

  value: string,
  version: number,
) {
  await db.update(compareTranslation).set({
    isDeleted: 1,
    version,
  }).where(eq(vocabulary.id, value));
}

async function createPattern(

  value: Pattern,
  userId: string,
  version: number,
) {
  await db.insert(patternTranslation).values({
    id: value.id,
    sentence: value.sentence,
    pattern: value.pattern,
    explanation: value.explanation,
    userId,
    version,
  });
}
async function deletePattern(

  value: string,
  version: number,
) {
  await db.update(patternTranslation).set({
    isDeleted: 1,
    version,
  }).where(eq(vocabulary.id, value));
}

async function createChat(

  value: Chat,
  userId: string,
  version: number,
) {
  const exist = await db.query.chat.findFirst({
    where: eq(chat.id, value.id),
    with: {
      messages: true,
    }
  });
  if (exist) {
    const existedMessages = exist.messages
    const newMessages = value.messages.filter(m => !existedMessages.find(em => em.id === m.id))
    await db.insert(message).values(newMessages.map(m => ({
      id: m.id,
      chatId: value.id,
      content: m.content,
      role: m.role,
    })));

    return;
  }
  await db.insert(chat).values({
    id: value.id,
    title: value.title,
    description: value.description,
    userId,
    version,
  });
  await db.insert(message).values(value.messages.map(m => ({
    id: m.id,
    chatId: value.id,
    content: m.content,
    role: m.role,
  })));
};

async function deleteChat(

  value: string,
  version: number,
) {
  await db.update(chat).set({
    isDeleted: 1,
    version,
  }).where(eq(vocabulary.id, value));
}
async function sendPoke() {
  // TODO
}