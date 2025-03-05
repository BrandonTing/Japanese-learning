<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ClearInput from '@/components/clearInput.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Textarea } from '@/components/ui/textarea';
	import { db } from '@/states/db.svelte';
	import { useChat } from '@ai-sdk/svelte';
	import { Info, Trash2 } from 'lucide-svelte';
	import { marked } from 'marked';
	import ChatButton from './chatButton.svelte';

	const inputId = 'history-chat-input';
	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribeChat();
		return () => {
			unsubscribe?.();
		};
	});
	let currentChatId = $state('');
	const urlId = $derived(page.url.searchParams.get('id'));
	$effect(() => {
		if (urlId) {
			currentChatId = urlId;
			const inputElement = document.getElementById(inputId);
			inputElement?.focus();
		}
	});
	$effect(() => {
		const firstChat = db.chats[0];
		if (!urlId && firstChat) {
			changeUrl(firstChat.id);
		}
	});
	function changeUrl(id: string) {
		goto('?id=' + id);
	}
	let currentChat = $derived(db.chats.find((chat) => chat.id === currentChatId));
	let isLoading = $derived(!db.rep);

	const { input, handleSubmit, messages, setMessages } = useChat({
		api: '/api/ai/chat',
		onFinish: () => {
			if (currentChat) {
				db.updateChat({
					...currentChat,
					messages: $messages
				});
			}
		}
	});
	$effect(() => {
		const lastMessage = $messages.findLast((message) => message.role === 'user');
		// find element by id
		if (lastMessage) {
			const lastMessageElement = document.getElementById(lastMessage.id);
			// if element exist, scroll to top
			lastMessageElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
	$effect(() => {
		if (!currentChat) {
			return;
		}
		setMessages(currentChat.messages);
	});
</script>

<div class="flex gap-4 flex-wrap h-[calc(100vh-250px)]">
	<div class="w-64 mr-4">
		<Card class="flex flex-col h-full">
			<CardContent>
				<div class="flex flex-col h-full">
					{#if isLoading}
						Loading...
					{/if}
					{#if db.chats.length === 0}
						<p>No Basic Chat history yet.</p>
					{:else}
						<ScrollArea class="flex-grow pr-4">
							<ul class="flex flex-col gap-2">
								{#each db.chats as { id, title, description } (id)}
									<ChatButton
										isActive={currentChatId === id}
										onSelect={() => {
											changeUrl(id);
										}}
										{title}
										{description}
									/>
								{/each}
							</ul>
						</ScrollArea>
					{/if}
				</div>
			</CardContent>
		</Card>
	</div>
	<div class="flex-1">
		<Card class="h-full">
			<CardHeader>
				<CardTitle class="flex gap-2 items-center">
					{currentChat?.title}
					{#if currentChat}
						<div>
							{#if currentChat?.description}
								<Popover.Root portal={null}>
									<Popover.Trigger asChild let:builder>
										<Button builders={[builder]} size="icon" variant="ghost">
											<Info class="size-4" />
										</Button>
									</Popover.Trigger>
									<Popover.Content class="w-80 text-muted-foreground leading-relaxed">
										{#each currentChat?.description.split('\n') ?? [] as line}
											{line}<br />
										{/each}
									</Popover.Content>
								</Popover.Root>
							{/if}
							<Button
								size="icon"
								variant="ghost"
								class="text-destructive hover:text-destructive hover:bg-destructive/10"
								onclick={async () => {
									await db.deleteChat(currentChatId);
									const firstChat = db.chats[0];
									changeUrl(firstChat ? firstChat.id : '');
								}}
							>
								<Trash2 class="size-4" />
							</Button>
						</div>
					{/if}
				</CardTitle>
			</CardHeader>
			{#if currentChat}
				<CardContent>
					<div class="flex flex-col h-[calc(100vh-350px)]">
						<ScrollArea class="flex-grow mb-4 pr-4">
							{#each $messages as message}
								<div
									class={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
									id={message.id}
								>
									<span
										class={`inline-block p-2 rounded-lg ${
											message.role === 'user'
												? 'bg-primary text-primary-foreground'
												: 'bg-muted text-muted-foreground'
										}`}
									>
										{@html marked(message.content, {
											breaks: true
										})}
									</span>
								</div>
							{/each}
						</ScrollArea>
						<div class="w-full">
							<form
								onsubmit={(e) => {
									handleSubmit(e);
								}}
								id="history-chat-bot"
							>
								<div class="flex gap-1 flex-col md:flex-row md:gap-2 md:items-end">
									<div class="flex-1 relative">
										<Textarea
											autofocus
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
												if ($input.trim() === '') {
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
									</div>
								</div>
							</form>
						</div>
					</div>
				</CardContent>
			{/if}
		</Card>
	</div>
</div>
