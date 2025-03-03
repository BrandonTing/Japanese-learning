<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { db } from '@/states/db.svelte';
	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribeChat();
		return () => {
			unsubscribe?.();
		};
	});
</script>

<div class="flex gap-4 flex-wrap">
	{#if !db.rep}
		Loading...
	{/if}
	{#if db.chats.length === 0}
		<p>No Basic Chat history yet.</p>
	{:else}
		{#each db.chats as { id, title, description } (id)}
			<Button
				onclick={() => {
					db.deleteChat(id);
				}}
			>
				{title}
			</Button>
		{/each}
	{/if}
</div>
