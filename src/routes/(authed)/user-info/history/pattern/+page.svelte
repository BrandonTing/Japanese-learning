<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardTitle } from '@/components/ui/card';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { db } from '@/states/db.svelte';
	import { marked } from 'marked';
	import { flip } from 'svelte/animate';
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
	{#each db.vocabularies as { vocabulary, explanation } (vocabulary)}
		<div animate:flip={{ duration: 300 }}>
			<Card>
				<CardHeader>
					<CardTitle>
						{vocabulary}
					</CardTitle>
				</CardHeader>
				<CardContent class="flex justify-between gap-2">
					<Popover.Root portal={null}>
						<Popover.Trigger asChild let:builder>
							<Button builders={[builder]} variant="outline">View</Button>
						</Popover.Trigger>
						<Popover.Content class="md:w-96">
							<ScrollArea class="h-[60vh]">
								<div class="text-base">
									{@html marked(explanation)}
								</div>
							</ScrollArea>
						</Popover.Content>
					</Popover.Root>
					<Button size="sm" variant="outline" onclick={() => db.deleteVocabulary(vocabulary)}>
						Delete
					</Button>
				</CardContent>
			</Card>
		</div>
	{/each}
</div>
