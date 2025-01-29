<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '@/components/ui/button';
	import { JSONParseError, ZodParseError } from '@/error';
	import { errorSchema } from '@/schema';
	import { useCompletion } from '@ai-sdk/svelte';
	import { Effect } from 'effect';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import type { VocabularySchema } from '../../../routes/api/completion/learning/util';

	let error = '';
	export let level: string;
	export let category: string;
	$: prompt = `請隨機教我一個${level}等級的${category}`;
	function onGenerateError(e: Error) {
		const errorJson = e.message;
		const message = Effect.gen(function* () {
			const errorResponse = yield* Effect.try({
				try: () => JSON.parse(errorJson),
				catch: () =>
					new JSONParseError({
						parseErrorMessage: e.message
					})
			});
			const { success, data, error: zodError } = errorSchema.safeParse(errorResponse);
			if (!success) {
				yield* new ZodParseError({
					parseErrorMessage:
						zodError.flatten().fieldErrors.message?.join(',') || 'Something went wrong'
				});
			}
			return data?.message ?? 'Something went wrong';
		}).pipe(
			Effect.catchTags({
				JSONParseError: (e) => {
					return Effect.succeed(e.parseErrorMessage);
				},
				ZodParseError: (e) => {
					return Effect.succeed(e.parseErrorMessage);
				}
			}),
			Effect.runSync
		);
		error = message;
	}
	let vocabulary: VocabularySchema | null = null;
	const { complete: generatinVocaComplete, isLoading: isGeneratingVocaLoading } = useCompletion({
		api: '/api/completion/learning/vocabulary',
		streamProtocol: 'text',
		onError: onGenerateError,
		async onResponse(response) {
			const data = await response.json();
			vocabulary = data;
		}
	});
	const {
		completion: generatinGrammerCompletion,
		complete: generatinGrammerComplete,
		isLoading: isGeneratingGrammerLoading
	} = useCompletion({
		api: '/api/completion/learning/grammer',
		streamProtocol: 'text',
		onError: onGenerateError
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		on:click={async () => {
			error = '';
			vocabulary = null;
			if (category === '文型') {
				await generatinGrammerComplete(prompt);
			} else {
				await generatinVocaComplete(prompt);
			}
		}}
		disabled={$isGeneratingVocaLoading || $isGeneratingGrammerLoading}
	>
		Generate
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{category}</Dialog.Title>
			<Dialog.Description>
				{#if $isGeneratingVocaLoading || $isGeneratingGrammerLoading}
					Loading...
				{:else if error}
					<Alert.Root variant="destructive">
						<CircleAlert class="h-4 w-4" />
						<Alert.Title>Generate Error</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{:else if vocabulary}
					<div class="py-4">
						<p class="text-lg whitespace-pre-line">{vocabulary.vocabulary}</p>
					</div>
				{/if}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
