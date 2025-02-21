<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import ClearInput from '@/components/clearInput.svelte';
	import ErrorMessage from '@/components/errorMessage.svelte';
	import { Button } from '@/components/ui/button';
	import Input from '@/components/ui/input/input.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import { Bookmark } from 'lucide-svelte';
	import { marked } from 'marked';
	const VOCABULARY_ACCORDION_VALUE = 'VOCABULARY_ACCORDION_VALUE';
	let text = '';
	let accordionValue = '';
	const { messages, append, isLoading, stop, setMessages, error } = useChat({
		api: '/api/ai/vocabulary'
	});
</script>

<div class="flex gap-4 flex-col px-1">
	<p class="text-sm text-muted-foreground">
		Enter a Japanese vocabulary word to get an explanation and examples.
	</p>
	<div class="flex flex-col sm:flex-row md:items-center gap-4">
		<div class="relative">
			<Input
				type="text"
				placeholder="Enter vocabulary (e.g., 漢字)"
				bind:value={text}
				class="w-full sm:w-64"
			/>
			{#if text}
				<ClearInput clear={() => (text = '')} />
			{/if}
		</div>
		<div class="flex gap-1">
			<Button
				variant="outline"
				class="block md:hidden"
				disabled={!text.trim()}
				onclick={() => (text = '')}>Clear</Button
			>
			<Button
				onclick={() => {
					if ($isLoading) {
						stop();
						accordionValue = '';
						return;
					}
					accordionValue = VOCABULARY_ACCORDION_VALUE;
					setMessages([]);
					append({
						role: 'user',
						content: text
					});
				}}
				disabled={!text.trim()}
			>
				{#if $isLoading}
					Stop
				{:else}
					Explain
				{/if}
			</Button>
			<Button variant="outline" size="icon" disabled={accordionValue === ''}>
				<Bookmark class="h-4 w-4" />
			</Button>
		</div>
	</div>
	<Accordion.Root bind:value={accordionValue}>
		<Accordion.Item value={VOCABULARY_ACCORDION_VALUE} class="border-0">
			<Accordion.Content class="text-base">
				{#each $messages as message}
					{#if message.role === 'assistant'}
						{@html marked(message.content)}
					{/if}
				{/each}
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
	{#if $isLoading}
		Loading...
	{:else if $error}
		<ErrorMessage message={$error.message} />
	{/if}
</div>
