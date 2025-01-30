<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { handleGenerateError } from '@/components/ai/util';
	import { buttonVariants } from '@/components/ui/button';
	import {
		Cell,
		Row,
		Table,
		TableBody,
		TableHead,
		TableHeader,
		TableRow
	} from '@/components/ui/table';
	import { JSONParseError } from '@/error';
	import { useCompletion } from '@ai-sdk/svelte';
	import { Effect } from 'effect';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import type { VocabularySchema } from '../../../routes/api/completion/learning/util';

	let error = '';
	export let level: string;
	$: prompt = `請用繁體中文，提供我程度相當於JLPT ${level}程度的日文單字，並提供介紹`;
	let vocabulary: VocabularySchema | null = null;
	const { complete, isLoading } = useCompletion({
		api: '/api/completion/learning/vocabulary',
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
				vocabulary = data;
			}).pipe(Effect.runPromise);
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		on:click={async () => {
			error = '';
			vocabulary = null;
			await complete(prompt);
		}}
		disabled={$isLoading}
	>
		Generate
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>単語</Dialog.Title>
			<Dialog.Description>
				{#if $isLoading}
					Loading...
				{:else if vocabulary}
					<div class="py-4 space-y-4">
						<div class="flex items-center space-x-4">
							<h2 class="text-2xl font-bold">{vocabulary.vocabulary}</h2>
							{#if vocabulary.kana}
								<span class="text-xl text-muted-foreground">({vocabulary.kana})</span>
							{/if}
							<span class="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
								{vocabulary.type}
							</span>
						</div>
						<div>
							<h3 class="text-lg font-semibold mb-2">Variants</h3>
							<ScrollArea class="h-40 w-full rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>活用</TableHead>
											<TableHead>變化</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{#each vocabulary.variants ?? [] as variant}
											<Row>
												<Cell>{variant.type}</Cell>
												<Cell>{variant.form}</Cell>
											</Row>
										{/each}
									</TableBody>
								</Table>
							</ScrollArea>
						</div>
						<div>
							<h3 class="text-lg font-semibold mb-2">Meanings and Examples</h3>
							{#each vocabulary.explanations as explanation, index}
								<div class="mb-4">
									<h4 class="font-medium">
										{index + 1}. {explanation.meaning}
									</h4>
									{#if explanation.usage}
										<p>{explanation.usage}</p>
									{/if}
									<p class="text-sm text-muted-foreground">
										{explanation.example}
									</p>
								</div>
							{/each}
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
