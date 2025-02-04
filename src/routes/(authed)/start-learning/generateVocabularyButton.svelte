<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import ErrorMessage from '@/components/errorMessage.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import { marked } from 'marked';
	export let level: string;
	const { append, isLoading, messages, setMessages, error } = useChat({
		api: '/api/generateVocabulary'
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		on:click={() => {
			Sentry.startSpan(
				{
					name: 'Generate Vocabulary',
					op: 'Generate'
				},
				() => {
					setMessages([]);
					append({
						role: 'user',
						content: level
					});
				}
			);
		}}
		disabled={$isLoading}
	>
		Generate
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>單字</Dialog.Title>
		</Dialog.Header>
		{#if $messages.length > 1}
			<ScrollArea class="h-[60vh]">
				{#each $messages as message}
					{#if message.role === 'assistant'}
						{@html marked(message.content)}
					{/if}
				{/each}
			</ScrollArea>
		{/if}
		{#if $error}
			<ErrorMessage message={$error.message} />
		{/if}
		{#if $isLoading}
			Loading...
		{/if}
	</Dialog.Content>
</Dialog.Root>
