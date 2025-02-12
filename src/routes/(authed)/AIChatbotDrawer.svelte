<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import ClearInput from '@/components/clearInput.svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import { MessageSquare } from 'lucide-svelte';
	import { marked } from 'marked';
	const { input, handleSubmit, messages, setMessages, isLoading, stop } = useChat();
	let abortController = new AbortController();
</script>

<Sheet.Root
	onOpenChange={(open) => {
		if (open) {
			if (abortController.signal.aborted) {
				abortController = new AbortController();
			}
			window.addEventListener(
				'keydown',
				(e) => {
					if (e.code === 'Space' && isLoading) {
						stop();
					}
				},
				{
					signal: abortController.signal
				}
			);
		} else {
			abortController.abort();
		}
	}}
>
	<Sheet.Trigger
		class={buttonVariants({
			variant: 'default',
			class: 'fixed bottom-4 right-4 rounded-full w-16 h-16'
		})}
	>
		<MessageSquare class="w-6 h-6" />
		<span class="sr-only">Ask AI</span>
	</Sheet.Trigger>
	<Sheet.Content class="cursor pb-0" side="bottom">
		<Sheet.Header>
			<Sheet.Title>Ask AI</Sheet.Title>
		</Sheet.Header>
		<div class="p-4 flex flex-col h-[80dvh]">
			<ScrollArea class="flex-grow mb-4">
				{#each $messages as message}
					<div class={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
						<span
							class={`inline-block p-2 rounded-lg ${
								message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
							}`}
						>
							{@html marked(message.content)}
						</span>
					</div>
				{/each}
				{#if $isLoading}
					<div class="mb-4 text-left">
						<span class="inline-block p-2 text-black"> loading... </span>
					</div>
				{/if}
				<!-- TODO auto scroll bottom -->
			</ScrollArea>
			<div class="flex flex-col space-y-2">
				<p class="text-sm text-muted-foreground hidden md:block">
					Please create a new chat if the conversation topic has changed to preserve token usage.
				</p>
				<form on:submit={handleSubmit} id="chat-bot">
					<div class="flex gap-1 flex-col md:flex-row md:gap-2 md:items-end">
						{#if $isLoading}
							<Button
								class="flex-1"
								variant="outline"
								on:click={() => {
									stop();
								}}
							>
								<span>Cancel Generation</span>
							</Button>
						{:else}
							<div class="relative flex-1">
								<Textarea
									bind:value={$input}
									placeholder="Type your message..."
									on:keydown={(e) => {
										if (e.isComposing || e.code !== 'Enter' || e.shiftKey) {
											return;
										}
										e.stopPropagation();
										handleSubmit();
										return;
									}}
								/>
								{#if $input}
									<ClearInput clear={() => ($input = '')} className="top-full -translate-y-6" />
								{/if}
							</div>
						{/if}
						<div class="flex gap-1 justify-end">
							<Button
								variant="outline"
								class="block md:hidden"
								disabled={!$input.trim()}
								onclick={() => ($input = '')}>Clear</Button
							>

							<Button type="submit">Send</Button>

							<Button
								variant="outline"
								onclick={() => {
									stop();
									setMessages([]);
								}}
							>
								New
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
