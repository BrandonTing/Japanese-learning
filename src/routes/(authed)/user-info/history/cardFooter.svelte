<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '@/components/ui/button';
	import { CardContent } from '@/components/ui/card';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { marked } from 'marked';

	const { explanation, onDelete }: { explanation: string; onDelete: () => void } = $props();
</script>

<CardContent class="flex justify-between gap-2">
	<Dialog.Root portal={null}>
		<Dialog.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline">View</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<ScrollArea>
				<div class="text-base">
					{@html marked(explanation)}
				</div>
			</ScrollArea>
		</Dialog.Content>
	</Dialog.Root>
	<Button size="sm" variant="outline" onclick={onDelete}>Delete</Button>
</CardContent>
