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
				<Card class="h-full flex flex-col justify-between">
					<CardHeader>
						<CardTitle>
							{sentence}
						</CardTitle>
					</CardHeader>
					<CardFooter {explanation} onDelete={() => db.deleteBasic(id)} />
				</Card>
			</div>
		{/each}
	{/if}
</div>
