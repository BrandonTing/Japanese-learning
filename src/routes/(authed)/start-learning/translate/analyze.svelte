<script lang="ts">
	import ClearInput from '@/components/clearInput.svelte';
	import ContentBlock from '@/components/contentBlock.svelte';
	import { Button } from '@/components/ui/button';
	import { Textarea } from '@/components/ui/textarea';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	let text = $state('');
	const { messages, append, status, stop, setMessages, error } = useChat({
		api: '/api/ai/translation'
	});
	let isLoading = $derived($status === 'streaming' || $status === 'submitted');
	let canSubmit = $derived(Boolean(text.trim()));
	let prompt = $derived(`
    翻譯這段話，並分析這句話的語法結構，先從整體架構開始說明由哪些子句組成，再對每個子句做解析，對於子句的解析以表格呈現：
    ${text.trim()}
  `);
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
		{#if isLoading}
			<Button onclick={stop}>Stop</Button>
		{:else}
			<Button
				onclick={() => {
					Sentry.startSpan(
						{
							name: 'Translate and Analyze',
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
	</div>
	<ContentBlock messages={$messages} {isLoading} error={$error}></ContentBlock>
</div>
