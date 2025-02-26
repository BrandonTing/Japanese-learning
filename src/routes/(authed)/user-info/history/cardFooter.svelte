<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '@/components/ui/button';
	import { CardContent } from '@/components/ui/card';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { marked } from 'marked';
	import type { Snippet } from 'svelte';

	const {
		title,
		explanation,
		onDelete
	}: { title: Snippet; explanation: string; onDelete: () => void } = $props();
</script>

<CardContent class="flex justify-between gap-2">
	<Dialog.Root portal={null}>
		<Dialog.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline">View</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="pr-4 leading-5">
					{@render title()}
				</Dialog.Title>
			</Dialog.Header>

			<ScrollArea>
				<div class="text-base">
					{@html marked(explanation)}
				</div>
			</ScrollArea>
		</Dialog.Content>
	</Dialog.Root>
	<Button size="sm" variant="outline" onclick={onDelete}>Delete</Button>
</CardContent>
