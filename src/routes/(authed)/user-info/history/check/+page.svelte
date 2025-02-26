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
				<Card>
					<CardHeader>
						<CardTitle>
							{sentence}
						</CardTitle>
					</CardHeader>
					<CardFooter title={sentence} {explanation} onDelete={() => db.deleteCheck(id)} />
				</Card>
			</div>
		{/each}
	{/if}
</div>
