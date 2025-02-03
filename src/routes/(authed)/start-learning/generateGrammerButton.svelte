<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '@/components/ui/button';
	import { JSONParseError } from '@/error';
	import { useCompletion } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import { Effect } from 'effect';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import type { GrammerSchema } from '../../api/completion/learning/util';
	import { handleGenerateError } from './util';

	let error = '';
	export let level: string;
	let grammer: GrammerSchema | null = null;
	const { complete, isLoading } = useCompletion({
		api: '/api/completion/learning/grammer',
		streamProtocol: 'text',
		onError: (e) => {
			const message = handleGenerateError(e);
			error = message;
		},
		async onResponse(response) {
			// using useCompletion with generateObject cause issue when getting completion, ignore it by prioritize handle response
			await Effect.gen(function* () {
				const data = yield* Effect.tryPromise({
					try: () => response.json(),
					catch: (e) =>
						new JSONParseError({
							parseErrorMessage: e instanceof Error ? e.message : 'Failed to parse response'
						})
				});
				grammer = data;
			}).pipe(Effect.runPromise);
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		on:click={() => {
			error = '';
			grammer = null;
			Sentry.startSpan(
				{
					name: 'Generate Grammer',
					op: 'Generate'
				},
				async () => {
					await complete(level);
				}
			);
		}}
		disabled={$isLoading}
	>
		Generate
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>文法</Dialog.Title>
			<Dialog.Description>
				{#if $isLoading}
					Loading...
				{:else if grammer}
					<div class="py-4 space-y-4">
						<div>
							<div class="flex items-center space-x-4">
								<h2 class="text-2xl font-bold">
									{grammer.grammer}
								</h2>
								{#if grammer.romaji}
									<span class="text-xl text-muted-foreground">({grammer.romaji})</span>
								{/if}
							</div>
							<div class="mt-4">
								<h3 class="text-lg font-semibold mb-2">Usage</h3>
								<p>{grammer.usage}</p>
							</div>
							<div class="mt-4">
								<h3 class="text-lg font-semibold mb-2">Examples</h3>
								{#each grammer.examples as example}
									<div class="mb-4">
										<p class="font-medium">{example.sentence}</p>
										{#if example.romaji}
											<p class="text-sm text-muted-foreground">{example.romaji}</p>
										{/if}
										<p class="text-sm text-muted-foreground">{example.meaning}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{:else if error}
					<Alert.Root variant="destructive">
						<CircleAlert class="h-4 w-4" />
						<Alert.Title>Generate Error</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
