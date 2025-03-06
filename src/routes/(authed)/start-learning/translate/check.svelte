<script lang="ts">
	import ClearInput from '@/components/clearInput.svelte';
	import ContentBlock from '@/components/contentBlock.svelte';
	import { Button } from '@/components/ui/button';
	import { Textarea } from '@/components/ui/textarea';
	import { db } from '@/states/db.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import { Bookmark } from 'lucide-svelte';
	let text = $state('');
	const { messages, append, status, stop, setMessages, error } = useChat({
		api: '/api/ai/translation'
	});
	let isLoading = $derived($status === 'streaming' || $status === 'submitted');
	let prompt = $derived(`
      請協助我翻譯以下句子，並判斷其中文法是否正確，若有誤，請詳細解釋錯誤之處：
      ${text.trim()}
    `);
	let canBookmark = $derived(
		prompt === $messages.findLast((message) => message.role === 'user')?.content && !isLoading
	);
	function clear() {
		text = '';
	}
</script>

<div class="flex gap-4 flex-col px-1">
	<p class="text-sm text-muted-foreground">
		Paste a Japanese article for translation and grammar explanation.
	</p>
	<div class="relative">
		<Textarea placeholder="Paste your Japanese text here..." bind:value={text} rows={5} />
		{#if text}
			<ClearInput {clear} className="top-full -translate-y-6" />
		{/if}
	</div>
	<div class="flex justify-end gap-2">
		<Button variant="outline" class="block md:hidden" disabled={!text.trim()} onclick={clear}
			>Clear</Button
		>
		{#if isLoading}
			<Button onclick={stop}>Stop</Button>
		{:else}
			<Button
				onclick={() => {
					Sentry.startSpan(
						{
							name: 'Translate and Check Grammer',
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
				disabled={!text.trim()}
			>
				Submit
			</Button>
		{/if}
		<Button
			variant="outline"
			size="icon"
			disabled={!canBookmark}
			on:click={() => {
				const message = $messages.findLast((message) => message.role === 'assistant')?.content;
				if (!message) return;

				db.saveCheck({
					sentence: text,
					explanation: message
				});
			}}
		>
			<Bookmark class="h-4 w-4" />
		</Button>
	</div>
	<ContentBlock messages={$messages} {isLoading} error={$error}></ContentBlock>
</div>
