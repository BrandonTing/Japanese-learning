<script lang="ts">
	import { Card, CardTitle } from '@/components/ui/card';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import { db } from '@/states/db.svelte';
	import { flip } from 'svelte/animate';
	import CardFooter from '../cardFooter.svelte';
	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribeVocabularies();
		return () => {
			unsubscribe?.();
		};
	});
</script>

<div class="flex gap-4 flex-wrap">
	{#if !db.rep}
		Loading...
	{/if}
	{#if db.vocabularies.length === 0}
		<p>No vocabulary history yet.</p>
	{:else}
		{#each db.vocabularies as { id, vocabulary, explanation } (id)}
			<div animate:flip={{ duration: 300 }}>
				<Card>
					<CardHeader>
						<CardTitle>
							{vocabulary}
						</CardTitle>
					</CardHeader>
					<CardFooter {explanation} onDelete={() => db.deleteVocabulary(id)}>
						{#snippet title()}
							{vocabulary}
						{/snippet}
					</CardFooter>
				</Card>
			</div>
		{/each}
	{/if}
</div>
