<script lang="ts">
	import ClearInput from '@/components/clearInput.svelte';
	import ContentBlock from '@/components/contentBlock.svelte';
	import { Button } from '@/components/ui/button';
	import { Textarea } from '@/components/ui/textarea';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	let text = '';
	let canBookmark = false;
	const { messages, append, isLoading, stop, setMessages, error } = useChat({
		api: '/api/ai/translation'
	});
	$: prompt = genPrompt(text);
	$: canBookmark =
		prompt === $messages.findLast((message) => message.role === 'user')?.content && !$isLoading;
	function genPrompt(raw: string) {
		return `
      請協助我翻譯以下句子，並整理其中用到之JLPT N3等級以上的特殊文法，最多三筆：
      ${text}
    `;
	}

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
		{#if $isLoading}
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
				disabled={!text.trim()}
			>
				Submit
			</Button>
		{/if}
		<!-- <Button variant="outline" size="icon" disabled={!canBookmark}>
			<Bookmark class="h-4 w-4" />
		</Button> -->
	</div>
	<ContentBlock messages={$messages} isLoading={$isLoading} error={$error}></ContentBlock>
</div>
