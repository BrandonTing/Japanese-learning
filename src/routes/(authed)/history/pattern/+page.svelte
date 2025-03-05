<script lang="ts">
	import PatternCard from '@/components/history/patternCard.svelte';
	import { db } from '@/states/db.svelte';
	import { flip } from 'svelte/animate';
	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribePattern();
		return () => {
			unsubscribe?.();
		};
	});
</script>

<div class="flex gap-4 flex-wrap">
	{#if !db.rep}
		Loading...
	{/if}
	{#if db.patternTranslations.length === 0}
		<p>No Pattern history yet.</p>
	{:else}
		{#each db.patternTranslations as { id, pattern, sentence, explanation } (id)}
			<div animate:flip={{ duration: 300 }}>
				<PatternCard
					{sentence}
					{explanation}
					{pattern}
					deleteHandler={() => db.deletePattern(id)}
				/>
			</div>
		{/each}
	{/if}
</div>
