<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import ClearInput from '@/components/clearInput.svelte';
	import ErrorMessage from '@/components/errorMessage.svelte';
	import { Button } from '@/components/ui/button';
	import { Textarea } from '@/components/ui/textarea';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import { marked } from 'marked';
	let text = '';
	const accordionTypes = {
		CORRECTNESS: 'Check_Correctness',
		EXPLAIN: 'Explain',
		NONE: ''
	} as const;
	let accordionValue: (typeof accordionTypes)[keyof typeof accordionTypes] = '';
	const { messages, append, isLoading, stop, setMessages, error } = useChat({
		api: '/api/ai/translation'
	});
</script>

<div class="flex gap-4 flex-col px-1">
	<p class="text-sm text-muted-foreground">
		Paste a Japanese article for translation and grammar explanation.
	</p>
	<div class="relative">
		<Textarea placeholder="Paste your Japanese text here..." bind:value={text} rows={5} />
		{#if text}
			<ClearInput clear={() => (text = '')} className="top-full -translate-y-6" />
		{/if}
	</div>
	<div class="flex justify-end gap-2">
		<Button
			variant="outline"
			class="block md:hidden"
			disabled={!text.trim()}
			onclick={() => (text = '')}>Clear</Button
		>
		<Button
			onclick={() => {
				accordionValue = accordionTypes.EXPLAIN;
				Sentry.startSpan(
					{
						name: 'Translate and Explain Grammer',
						op: 'Translate'
					},
					() => {
						setMessages([]);
						append({
							role: 'user',
							content: `
                  請協助我翻譯以下句子，並整理其中用到之JLPT N3等級以上的特殊文法，最多三筆：
                  ${text}
                `
						});
					}
				);
			}}
			disabled={!text.trim() || accordionValue === accordionTypes.EXPLAIN}>Submit</Button
		>
		{#if accordionValue !== accordionTypes.NONE}
			<Button
				onclick={() => {
					accordionValue = accordionTypes.NONE;
					stop();
				}}>Close</Button
			>
		{/if}
	</div>
	<Accordion.Root bind:value={accordionValue}>
		<Accordion.Item value={accordionTypes.CORRECTNESS} class="border-0">
			<Accordion.Content class="text-base">
				{#each $messages as message}
					{#if message.role === 'assistant'}
						{@html marked(message.content)}
					{/if}
				{/each}
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value={accordionTypes.EXPLAIN} class="border-0">
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
