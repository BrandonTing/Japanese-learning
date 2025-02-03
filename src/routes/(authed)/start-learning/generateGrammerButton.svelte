<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '@/components/ui/button';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import { marked } from 'marked';

	let error = '';
	export let level: string;
	const { append, messages, isLoading, setMessages } = useChat({
		api: '/api/generateGrammer'
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		on:click={() => {
			error = '';
			Sentry.startSpan(
				{
					name: 'Generate Grammer',
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
			<Dialog.Title>文法</Dialog.Title>
		</Dialog.Header>
		{#if error}
			<Alert.Root variant="destructive">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>Generate Error</Alert.Title>
				<Alert.Description>{error}</Alert.Description>
			</Alert.Root>
		{:else if $messages.length > 1}
			<ScrollArea class="h-[60vh]">
				{#each $messages as message}
					{#if message.role === 'assistant'}
						{@html marked(message.content)}
					{/if}
				{/each}
			</ScrollArea>
		{/if}
		{#if $isLoading}
			Loading...
		{/if}
	</Dialog.Content>
</Dialog.Root>
