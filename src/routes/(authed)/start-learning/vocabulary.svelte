<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import ClearInput from '@/components/clearInput.svelte';
	import ErrorMessage from '@/components/errorMessage.svelte';
	import { Button } from '@/components/ui/button';
	import Input from '@/components/ui/input/input.svelte';
	import { vocabularyMap } from '@/states/vocabularySearchStore';
	import { useChat } from '@ai-sdk/svelte';
	import { marked } from 'marked';
	const VOCABULARY_ACCORDION_VALUE = 'VOCABULARY_ACCORDION_VALUE';
	let text = '';
	let accordionValue = '';
	let content = '';
	const { messages, append, isLoading, stop, setMessages, error } = useChat({
		api: '/api/vocabulary',
		onFinish(message) {
			$vocabularyMap[text] = message.content;
		}
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
		<Button
			onclick={() => {
				accordionValue = VOCABULARY_ACCORDION_VALUE;
				if ($vocabularyMap[text]) {
					content = $vocabularyMap[text];
					return;
				}
				content = '';
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
					accordionValue = '';
					stop();
				}}>Close</Button
			>
		{/if}
	</div>
	<Accordion.Root bind:value={accordionValue}>
		<Accordion.Item value={VOCABULARY_ACCORDION_VALUE} class="border-0">
			<Accordion.Content class="text-base">
				{#if content}
					{@html marked(content)}
				{:else}
					{#each $messages as message}
						{#if message.role === 'assistant'}
							{@html marked(message.content)}
						{/if}
					{/each}
				{/if}
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
	{#if $isLoading}
		Loading...
	{:else if $error}
		<ErrorMessage message={$error.message} />
	{/if}
</div>
