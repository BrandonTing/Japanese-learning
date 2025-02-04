<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '@/components/ui/button';
	import Input from '@/components/ui/input/input.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import { CircleAlert } from 'lucide-svelte';
	import { marked } from 'marked';
	const VOCABULARY_ACCORDION_VALUE = 'VOCABULARY_ACCORDION_VALUE';
	let text = '';
	let error = '';
	let lastVocabulary = '';
	let accordionValue = '';
	const { messages, append, isLoading, stop, setMessages } = useChat({
		api: '/api/vocabulary'
	});
</script>

<div class="flex gap-4 flex-col px-1">
	<p class="text-sm text-muted-foreground">
		Enter a Japanese vocabulary word to get an explanation and examples.
	</p>
	<div class="flex flex-col sm:flex-row md:items-center gap-4">
		<Input
			type="text"
			placeholder="Enter vocabulary (e.g., 漢字)"
			bind:value={text}
			class="w-full sm:w-64"
		/>
		<Button
			onclick={() => {
				accordionValue = VOCABULARY_ACCORDION_VALUE;
				if (text === lastVocabulary) {
					return;
				}
				lastVocabulary = text;
				setMessages([]);
				append({
					role: 'user',
					content: text
				});
			}}
			disabled={!text.trim()}
			class="w-full sm:w-auto"
		>
			Explain
		</Button>
		{#if accordionValue !== ''}
			<Button
				onclick={() => {
					error = '';
					accordionValue = '';
					stop();
				}}>Close</Button
			>
		{/if}
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
	{:else if error}
		<Alert.Root variant="destructive">
			<CircleAlert class="h-4 w-4" />
			<Alert.Title>Generate Error</Alert.Title>
			<Alert.Description>{error}</Alert.Description>
		</Alert.Root>
	{/if}
</div>
