<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { Card, CardContent, CardTitle } from '@/components/ui/card';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import * as Dialog from '@/components/ui/dialog';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { db } from '@/states/db.svelte';
	import { Info, Trash2 } from 'lucide-svelte';
	import { marked } from 'marked';
	import { flip } from 'svelte/animate';

	$effect(() => {
		if (!db.rep) {
			return;
		}
		const unsubscribe = db.subscribeVocabulary();
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
					<CardContent class="flex justify-between gap-2">
						<Button
							size="sm"
							variant="outline"
							class="text-destructive hover:text-destructive hover:bg-destructive/10"
							onclick={() => db.deleteVocabulary(id)}
						>
							<Trash2 class="size-4 mr-2" />Delete</Button
						>
						<Dialog.Root portal={null}>
							<Dialog.Trigger asChild let:builder>
								<Button builders={[builder]} variant="outline" size="sm">
									<Info class="size-4 mr-2" />
									Details
								</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title class="pr-4 leading-5">
										{vocabulary}
									</Dialog.Title>
								</Dialog.Header>
								<ScrollArea>
									<div class="text-base">
										{@html marked(explanation)}
									</div>
								</ScrollArea>
							</Dialog.Content>
						</Dialog.Root>
					</CardContent>
				</Card>
			</div>
		{/each}
	{/if}
</div>
