<script lang="ts">
	import BasicCard from '@/components/history/basicCard.svelte';
	import { db } from '@/states/db.svelte';
	import { flip } from 'svelte/animate';
	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribeBasic();
		return () => {
			unsubscribe?.();
		};
	});
</script>

<div class="flex gap-4 flex-wrap">
	{#if !db.rep}
		Loading...
	{/if}
	{#if db.basicTranslations.length === 0}
		<p>No Basic Translation history yet.</p>
	{:else}
		{#each db.basicTranslations as { id, sentence, explanation } (id)}
			<div animate:flip={{ duration: 300 }} class="max-w-lg">
				<BasicCard {sentence} {explanation} deleteHandler={() => db.deleteBasic(id)} />
			</div>
		{/each}
	{/if}
</div>
