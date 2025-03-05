<script lang="ts">
	import BasicCard from '@/components/history/basicCard.svelte';
	import { db } from '@/states/db.svelte';
	import { flip } from 'svelte/animate';
	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribeCheck();
		return () => {
			unsubscribe?.();
		};
	});
</script>

<div class="flex gap-4 flex-wrap">
	{#if !db.rep}
		Loading...
	{/if}
	{#if db.checkTranslations.length === 0}
		<p>No Check Translation history yet.</p>
	{:else}
		{#each db.checkTranslations as { id, sentence, explanation } (id)}
			<div animate:flip={{ duration: 300 }}>
				<BasicCard {sentence} {explanation} deleteHandler={() => db.deleteCheck(id)} />
			</div>
		{/each}
	{/if}
</div>
