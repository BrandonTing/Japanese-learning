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
				<Card>
					<CardHeader>
						<CardTitle>
							<p>{sentence}</p>
							<p>Target: {pattern}</p>
						</CardTitle>
					</CardHeader>
					<CardFooter {explanation} onDelete={() => db.deletePattern(id)}>
						{#snippet title()}
							<p>{sentence}</p>
							<p>Target: {pattern}</p>
						{/snippet}
					</CardFooter>
				</Card>
			</div>
		{/each}
	{/if}
</div>
