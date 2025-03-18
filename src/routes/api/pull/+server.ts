import { db, type Transaction } from "@/db/db";
import { replicacheServer } from "@/db/schema";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PullRequestV1, PullResponse } from "replicache";
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
    // Read all data in a single transaction so it's consistent.
    return await db.transaction(async t => {
      // Get current version.
      const server = await t.query.replicacheServer.findFirst({
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
        t,
        clientGroupID,
        fromVersion,
      );

      // TODO get changed & build patches for each table

      // // Get changed domain objects since requested version.
      // const changed = await t.manyOrNone<{
      //   id: string;
      //   sender: string;
      //   content: string;
      //   ord: number;
      //   version: number;
      //   deleted: boolean;
      // }>(
      //   'select id, sender, content, ord, version, deleted from message where version > $1',
      //   fromVersion,
      // );

      // // Build and return response.
      // const patch: PatchOperation[] = [];
      // for (const row of changed) {
      //   const { id, sender, content, ord, version: rowVersion, deleted } = row;
      //   if (deleted) {
      //     if (rowVersion > fromVersion) {
      //       patch.push({
      //         op: 'del',
      //         key: `message/${id}`,
      //       });
      //     }
      //   } else {
      //     patch.push({
      //       op: 'put',
      //       key: `message/${id}`,
      //       value: {
      //         from: sender,
      //         content,
      //         order: ord,
      //       },
      //     });
      //   }
      // }

      const body: PullResponse = {
        lastMutationIDChanges: lastMutationIDChanges ?? {},
        cookie: currentVersion,
        patch,
      };
      return body
    });
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Processed pull in', Date.now() - t0);
  }
}

async function getLastMutationIDChanges(
  t: Transaction,
  clientGroupID: string,
  fromVersion: number,
) {
  const rows = await t.query.replicacheClient.findMany({
    where: (client, { eq }) => {
      return eq(client.clientGroupID, clientGroupID) && eq(client.clientVersion, fromVersion);
    },
  });
  return Object.fromEntries(rows.map(r => [r.id, r.lastMutationID]));
}


