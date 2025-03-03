<script lang="ts">
	import CompareCard from '@/components/history/compareCard.svelte';
	import { db } from '@/states/db.svelte';
	import { flip } from 'svelte/animate';

	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribeCompare();
		return () => {
			unsubscribe?.();
		};
	});
</script>

<div class="flex gap-4 flex-wrap">
	{#if !db.rep}
		Loading...
	{/if}
	{#if db.compareTranslations.length === 0}
		<p>No Compare history yet.</p>
	{:else}
		{#each db.compareTranslations as { id, targetSentence, sentence, explanation } (id)}
			<div animate:flip={{ duration: 300 }}>
				<CompareCard
					{sentence}
					{targetSentence}
					{explanation}
					deleteHandler={() => db.deleteCompare(id)}
				/>
			</div>
		{/each}
	{/if}
</div>
