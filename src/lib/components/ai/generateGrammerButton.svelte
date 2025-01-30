<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { handleGenerateError } from '@/components/ai/util';
	import { buttonVariants } from '@/components/ui/button';
	import { JSONParseError } from '@/error';
	import { useCompletion } from '@ai-sdk/svelte';
	import { Effect } from 'effect';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import type { GrammerSchema } from '../../../routes/api/completion/learning/util';

	let error = '';
	export let level: string;
	$: prompt = `請用繁體中文，提供我程度相當於JLPT ${level}程度的日文文法，並提供介紹`;
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
		on:click={async () => {
			error = '';
			grammer = null;
			await complete(prompt);
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
								{#if grammer.kana}
									<span class="text-xl text-muted-foreground">({grammer.kana})</span>
								{/if}
							</div>
							<div class="mt-4">
								<h3 class="text-lg font-semibold mb-2">Usage</h3>
								<p>{grammer.usage}</p>
							</div>
							<div class="mt-4">
								<h3 class="text-lg font-semibold mb-2">Examples</h3>
								{#each grammer.examples as example, index}
									<div class="mb-4">
										<p class="font-medium">{example.sentence}</p>
										{#if example.kana}
											<p class="text-sm text-muted-foreground">{example.kana}</p>
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
