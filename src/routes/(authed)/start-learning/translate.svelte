<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import { Textarea } from '@/components/ui/textarea';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import { CircleAlert } from 'lucide-svelte';
	import { marked } from 'marked';
	let text = '';
	const accordionTypes = {
		CORRECTNESS: 'Check_Correctness',
		EXPLAIN: 'Explain',
		NONE: ''
	} as const;
	let accordionValue: (typeof accordionTypes)[keyof typeof accordionTypes] = '';
	let error = '';
	let history = {
		CORRECTNESS: '',
		EXPLAIN: ''
	} satisfies Omit<Record<keyof typeof accordionTypes, string>, 'NONE'>;
	const { messages, append, isLoading, stop, setMessages } = useChat({
		api: '/api/translation'
	});
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle>Translate</CardTitle>
		<p class="text-sm text-muted-foreground">
			Paste a Japanese article for translation and grammar explanation.
		</p>
	</CardHeader>
	<CardContent class="flex gap-4 flex-col">
		<Textarea placeholder="Paste your Japanese text here..." bind:value={text} rows={5} />
		<div class="flex justify-end gap-2 flex-col md:flex-row">
			{#if accordionValue !== accordionTypes.NONE}
				<Button
					onclick={() => {
						error = '';
						accordionValue = accordionTypes.NONE;
						stop();
					}}>Close</Button
				>
			{/if}

			<Button
				onclick={() => {
					accordionValue = accordionTypes.CORRECTNESS;
					if (history.CORRECTNESS === text) {
						return;
					}
					history.CORRECTNESS = text;
					history.EXPLAIN = '';
					Sentry.startSpan(
						{
							name: 'Translate and Check Grammer',
							op: 'Translate'
						},
						() => {
							setMessages([]);
							append({
								role: 'user',
								content: `
                    請協助我翻譯以下句子，並判斷其中文法是否正確：
                    ${text}
                  `
							});
						}
					);
				}}
				disabled={!text.trim() || accordionValue === accordionTypes.CORRECTNESS}
				>Translate and Check Grammer</Button
			>
			<Button
				onclick={() => {
					accordionValue = accordionTypes.EXPLAIN;
					if (history.EXPLAIN === text) {
						return;
					}
					history.EXPLAIN = text;
					history.CORRECTNESS = '';
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
				disabled={!text.trim() || accordionValue === accordionTypes.EXPLAIN}
				>Translate and Explain Grammer</Button
			>
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
		{:else if error}
			<Alert.Root variant="destructive">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>Generate Error</Alert.Title>
				<Alert.Description>{error}</Alert.Description>
			</Alert.Root>
		{/if}
	</CardContent>
</Card>
