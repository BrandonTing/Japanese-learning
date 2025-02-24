<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardTitle } from '@/components/ui/card';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { db } from '@/states/db.svelte';
	import { marked } from 'marked';
	import { flip } from 'svelte/animate';
</script>

<div class="flex gap-4 flex-wrap">
	{#each db.list as item (item.key)}
		<div animate:flip={{ duration: 300 }}>
			<Card>
				<CardHeader>
					<CardTitle>
						{item.key}
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
									{@html marked(item.content)}
								</div>
							</ScrollArea>
						</Popover.Content>
					</Popover.Root>
					<Button size="sm" variant="outline" onclick={() => db.deleteVocabulary(item.key)}>
						Delete
					</Button>
				</CardContent>
			</Card>
		</div>
	{/each}
</div>
