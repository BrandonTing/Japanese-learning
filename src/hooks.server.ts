import { auth } from '$lib/auth'; // path to your auth file
import { getMockedAiResponse, isUsingMockedAiResponse, sleepMs } from '@/utils';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { formatDataStreamPart } from 'ai';
import { svelteKitHandler } from 'better-auth/svelte-kit';
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://7f4cb7b24d53cb22d87daa989cbed5f4@o4508754109530113.ingest.de.sentry.io/4508754157240400',
    tracesSampleRate: 1
  });
}

export const handleError = Sentry.handleErrorWithSentry();

export const handle = sequence(Sentry.sentryHandle(), async function _handle({ event, resolve }) {
  if (event.url.pathname.startsWith('/api/ai')) {
    if (isUsingMockedAiResponse()) {
      await sleepMs(1000);
      return new Response(formatDataStreamPart('text', getMockedAiResponse()), {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  return svelteKitHandler({ event, resolve, auth });
});
