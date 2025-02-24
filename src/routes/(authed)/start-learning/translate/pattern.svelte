<script lang="ts">
	import ClearInput from '@/components/clearInput.svelte';
	import ContentBlock from '@/components/contentBlock.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import { useChat } from '@ai-sdk/svelte';
	import * as Sentry from '@sentry/sveltekit';
	import { Bookmark } from 'lucide-svelte';
	let pattern = '';
	let text = '';
	const { messages, append, isLoading, stop, setMessages, error } = useChat({
		api: '/api/ai/translation'
	});
	$: canSubmit = pattern.trim() && text.trim();
	$: prompt = genPrompt(pattern, text);
	$: canBookmark =
		prompt === $messages.findLast((message) => message.role === 'user')?.content && !$isLoading;
	function genPrompt(pattern: string, text: string) {
		return `
      我會提供一個日文句子以及其中有出現的單詞，請協助翻譯這段話，並解釋該單詞或文法的意思：
      單詞：${pattern}
      ${text}
    `;
	}
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
	<Input type="text" placeholder="Pattern" bind:value={pattern} />

	<div class="flex justify-end gap-2">
		<Button
			variant="outline"
			class="block md:hidden"
			disabled={!text.trim()}
			onclick={() => (text = '')}>Clear</Button
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
				disabled={!canSubmit}>Submit</Button
			>
		{/if}
		<Button variant="outline" size="icon" disabled={!canBookmark}>
			<Bookmark class="h-4 w-4" />
		</Button>
	</div>
	<ContentBlock messages={$messages} isLoading={$isLoading} error={$error}></ContentBlock>
</div>
