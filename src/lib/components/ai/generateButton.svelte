<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '@/components/ui/button';
	import { JSONParseError, ZodParseError } from '@/error';
	import { errorSchema } from '@/schema';
	import { useCompletion } from '@ai-sdk/svelte';
	import { Effect } from 'effect';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	let error = '';
	const { completion, complete, isLoading } = useCompletion({
		streamProtocol: 'text',
		onError: (e) => {
			console.log(e.message);
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
	});
	export let level: string;
	export let category: string;
	function makePrompt(level: string, category: string) {
		return `請教我一個${level}等級的${category}`;
	}
	$: prompt = makePrompt(level, category);
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		on:click={async () => {
			error = '';
			await complete(prompt);
		}}
		disabled={$isLoading}
	>
		Generate
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{category}</Dialog.Title>
			<Dialog.Description>
				{#if $isLoading}
					Loading...
				{:else if error}
					<Alert.Root variant="destructive">
						<CircleAlert class="h-4 w-4" />
						<Alert.Title>Generate Error</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{:else}
					<div class="py-4">
						<p class="text-lg whitespace-pre-line">{$completion.split(`"`)[1]}</p>
					</div>
				{/if}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
