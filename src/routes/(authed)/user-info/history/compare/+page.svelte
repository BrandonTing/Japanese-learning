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
				<Card>
					<CardHeader>
						<CardTitle>
							<div class="flex justify-between gap-4">
								<span class="w-[100px] md:w-[150px] flex-shrink-0">Target:</span>
								<span>{targetSentence}</span>
							</div>
							<div class="flex justify-between gap-4">
								<span class="w-[100px] md:w-[150px] flex-shrink-0">Sentence:</span>
								<span>{sentence}</span>
							</div>
						</CardTitle>
					</CardHeader>
					<CardFooter {explanation} onDelete={() => db.deleteCompare(id)}>
						{#snippet title()}
							<div class="flex justify-between gap-4">
								<span class="w-[100px] flex-shrink-0">Target:</span>
								<span>{targetSentence}</span>
							</div>
							<div class="flex justify-between gap-4">
								<span class="w-[100px] flex-shrink-0">Sentence:</span>
								<span>{sentence}</span>
							</div>
						{/snippet}
					</CardFooter>
				</Card>
			</div>
		{/each}
	{/if}
</div>
