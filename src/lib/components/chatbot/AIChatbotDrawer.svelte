<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Sheet from '$lib/components/ui/sheet';
	import SaveConversationButton from '@/components/chatbot/saveChatButton.svelte';
	import ClearInput from '@/components/clearInput.svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import { MessageSquare } from 'lucide-svelte';
	import { marked } from 'marked';
	const { input, handleSubmit, messages, setMessages, status, stop } = useChat({
		api: '/api/ai/chat',
		onFinish: () => {
			const lastMessage = $messages.findLast((message) => message.role === 'user');
			// find element by id
			if (lastMessage) {
				const lastMessageElement = document.getElementById(lastMessage.id);
				// if element exist, scroll to top
				lastMessageElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	});
	const isLoading = $derived($status === 'streaming');
	const openChat = $derived(page.url.searchParams.get('chat') === 'true');
	let abortController = $state(new AbortController());
	const inputId = 'chat-input';
	$effect(() => {
		if (openChat) {
			const inputElement = document.getElementById(inputId);
			inputElement?.focus();
		}
	});
</script>

<Sheet.Root
	open={openChat}
	onOpenChange={(open) => {
		if (open) {
			const params = new URLSearchParams(page.url.search);
			params.set('chat', 'true');
			goto(`?${params.toString()}`);
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
			const params = new URLSearchParams(page.url.search);
			params.delete('chat');
			goto(`?${params.toString()}`);
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
			<ScrollArea class="flex-grow mb-4" contentClasses="!block max-w-full">
				{#each $messages as message}
					<div
						class={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
						id={message.id}
					>
						<span
							class={`inline-block p-2 rounded-lg max-w-[90%]  ${
								message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
							}`}
						>
							{@html marked(message.content)}
						</span>
					</div>
				{/each}
				{#if isLoading}
					<div class="mb-4 text-left">
						<span class="inline-block p-2 text-black"> loading... </span>
					</div>
					<div class="h-[80vh]"></div>
				{/if}
				<!-- TODO auto scroll bottom -->
			</ScrollArea>
			<div class="flex flex-col space-y-2">
				<p class="text-sm text-muted-foreground hidden md:block">
					Please create a new chat if the conversation topic has changed to preserve token usage.
				</p>
				<form
					onsubmit={(e) => {
						handleSubmit(e);
					}}
					id="chat-bot"
				>
					<div class="flex gap-1 flex-col md:flex-row md:gap-2 md:items-end">
						<div class="flex-1 relative">
							<Textarea
								bind:value={$input}
								placeholder="Type your message..."
								id={inputId}
								on:keydown={(e) => {
									if (e.isComposing || e.code !== 'Enter' || e.shiftKey) {
										return;
									}
									if (window.innerWidth < 768) {
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

						<div class="flex gap-1 justify-end">
							<Button
								variant="outline"
								class="block md:hidden"
								disabled={!$input.trim()}
								onclick={() => ($input = '')}>Clear</Button
							>
							{#if isLoading}
								<Button
									on:click={() => {
										stop();
									}}
								>
									<span>Cancel</span>
								</Button>
							{:else}
								<Button type="submit">Send</Button>
							{/if}

							<Button
								variant="outline"
								onclick={() => {
									stop();
									setMessages([]);
								}}
								disabled={$messages.length === 0}
							>
								New
							</Button>
							<SaveConversationButton
								disabled={$messages.length === 0}
								messages={$messages}
								onSuccess={() => setMessages([])}
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
