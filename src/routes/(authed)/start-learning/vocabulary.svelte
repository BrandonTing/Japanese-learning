<script lang="ts">
	import ClearInput from '@/components/clearInput.svelte';
	import ContentBlock from '@/components/contentBlock.svelte';
	import { Button } from '@/components/ui/button';
	import Input from '@/components/ui/input/input.svelte';
	import { db } from '@/states/db.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import { Bookmark } from 'lucide-svelte';
	let text = $state('');
	const { messages, append, status, stop, setMessages, error } = useChat({
		api: '/api/ai/vocabulary'
	});
	const isLoading = $derived($status === 'streaming');
	let canBookmark = $derived(
		text === $messages.findLast((message) => message.role === 'user')?.content && !isLoading
	);

	function clear() {
		text = '';
	}
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
				<ClearInput {clear} />
			{/if}
		</div>
		<div class="flex gap-1">
			<Button variant="outline" class="block md:hidden" disabled={!text.trim()} onclick={clear}
				>Clear</Button
			>
			{#if isLoading}
				<Button onclick={stop}>Stop</Button>
			{:else}
				<Button
					onclick={() => {
						setMessages([]);
						append({
							role: 'user',
							content: text
						});
					}}
					disabled={!text.trim()}
				>
					Explain
				</Button>
			{/if}
			<Button
				variant="outline"
				size="icon"
				disabled={!canBookmark}
				on:click={() => {
					const content = $messages.findLast((message) => message.role === 'assistant')?.content;
					if (!content) {
						return;
					}
					db.saveVocabulary({
						vocabulary: text,
						explanation: content
					});
				}}
			>
				<Bookmark class="h-4 w-4" />
			</Button>
		</div>
	</div>
	<ContentBlock messages={$messages} {isLoading} error={$error}></ContentBlock>
</div>
