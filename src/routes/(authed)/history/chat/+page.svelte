<script lang="ts">
	import { Card, CardContent } from '@/components/ui/card';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { db } from '@/states/db.svelte';
	import ChatButton from './chatButton.svelte';

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
	let currentChat = $derived(db.chats.find((chat) => chat.id === currentChatId));
</script>

<div class="flex gap-4 flex-wrap h-[calc(100vh-250px)]">
	<div class="w-64 mr-4">
		<Card class="flex flex-col h-full">
			<CardContent>
				<div class="flex flex-col h-full">
					{#if !db.rep}
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
											currentChatId = id;
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
	{currentChat?.title}
</div>
