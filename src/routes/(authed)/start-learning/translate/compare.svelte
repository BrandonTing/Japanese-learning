<script lang="ts">
	import ClearInput from '@/components/clearInput.svelte';
	import ContentBlock from '@/components/contentBlock.svelte';
	import { Button } from '@/components/ui/button';
	import { Textarea } from '@/components/ui/textarea';
	import { db } from '@/states/db.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import { Bookmark } from 'lucide-svelte';
	let targetMeaning = $state('');
	let text = $state('');
	const { messages, append, status, stop, setMessages, error } = useChat({
		api: '/api/ai/translation'
	});
	let isLoading = $derived($status === 'streaming' || $status === 'submitted');
	let canSubmit = $derived(Boolean(targetMeaning.trim() && text.trim()));
	let prompt = $derived(`
    以下我會附上兩個句子，第一個句子是我期望的意思，第二個句子是我目前的日文造句，
    請協助我確認第二個句子是否符合第一個句子的意思，若不符合，請解釋原因：
    - ${targetMeaning.trim()}
    - ${text.trim()}
  `);
	let canBookmark = $derived(
		prompt === $messages.findLast((message) => message.role === 'user')?.content && !isLoading
	);
</script>

<div class="flex gap-4 flex-col px-1">
	<p class="text-sm text-muted-foreground">
		Paste a Japanese article for translation and grammar explanation.
	</p>
	<div class="relative">
		<Textarea
			placeholder="Paste your target sentence here..."
			bind:value={targetMeaning}
			rows={2}
		/>
		{#if targetMeaning}
			<ClearInput
				clear={() => {
					targetMeaning = '';
				}}
				className="top-full -translate-y-6"
			/>
		{/if}
	</div>
	<div class="relative">
		<Textarea placeholder="Paste your Japanese sentence here..." bind:value={text} rows={2} />
		{#if text}
			<ClearInput
				clear={() => {
					text = '';
				}}
				className="top-full -translate-y-6"
			/>
		{/if}
	</div>
	<div class="flex justify-end gap-2">
		<Button
			variant="outline"
			class="block md:hidden"
			disabled={!text.trim()}
			onclick={() => {
				text = '';
				targetMeaning = '';
			}}>Clear</Button
		>
		{#if isLoading}
			<Button onclick={stop}>Stop</Button>
		{:else}
			<Button
				onclick={() => {
					Sentry.startSpan(
						{
							name: 'Translate and Explain Grammer',
							op: 'Translate'
						},
						() => {
							setMessages([]);
							append({
								role: 'user',
								content: prompt
							});
						}
					);
				}}
				disabled={!canSubmit}>Submit</Button
			>
		{/if}
		<Button
			variant="outline"
			size="icon"
			disabled={!canBookmark}
			on:click={() => {
				const content = $messages.findLast((message) => message.role === 'assistant')?.content;
				if (!content) return;
				db.saveCompare({
					targetSentence: targetMeaning,
					sentence: text,
					explanation: content
				});
			}}
		>
			<Bookmark class="h-4 w-4" />
		</Button>
	</div>
	<ContentBlock messages={$messages} {isLoading} error={$error}></ContentBlock>
</div>
