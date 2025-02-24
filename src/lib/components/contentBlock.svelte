<script lang="ts">
	import ErrorMessage from '@/components/errorMessage.svelte';
	import type { Message } from 'ai';
	import { marked } from 'marked';

	let {
		messages,
		isLoading,
		error
	}: { messages: Array<Message>; isLoading: boolean | undefined; error: Error | undefined } =
		$props();
</script>

<div class="text-base">
	{#each messages as message}
		{#if message.role === 'assistant'}
			{@html marked(message.content)}
		{/if}
	{/each}
	{#if isLoading}
		Loading...
	{:else if error}
		<ErrorMessage message={error.message} />
	{/if}
</div>
