<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import * as Dialog from '@/components/ui/dialog';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Info, Trash2 } from 'lucide-svelte';
	import { marked } from 'marked';
	let {
		sentence,
		deleteHandler,
		explanation
	}: { sentence: string; deleteHandler: () => void; explanation: string } = $props();
	function truncateText(text: string) {
		return text.length > 20 ? `${text.slice(0, 20)}...` : text;
	}
	let truncateSentence = $derived(truncateText(sentence));
</script>

<Card>
	<CardHeader>
		<CardTitle class="space-y-3">
			{truncateSentence}
		</CardTitle>
	</CardHeader>
	<CardContent class="flex justify-between gap-2">
		<Button
			size="sm"
			variant="outline"
			class="text-destructive hover:text-destructive hover:bg-destructive/10"
			onclick={deleteHandler}
		>
			<Trash2 class="size-4 mr-2" />
			Delete</Button
		>
		<div>
			<Dialog.Root portal={null}>
				<Dialog.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="sm">
						<Info class="size-4 mr-2" />
						Details
					</Button>
				</Dialog.Trigger>
				<Dialog.Content class="text-base">
					<Dialog.Header>
						<Dialog.Title>Sentence Details</Dialog.Title>
						<Dialog.Description>Full sentences and meaning analysis</Dialog.Description>
					</Dialog.Header>

					<div class="space-y-4 py-4">
						<div class="space-y-2">
							<h4 class="text-sm font-medium text-muted-foreground">Sentence:</h4>
							<p class="text-base">{sentence}</p>
						</div>
						<div class="space-y-2">
							<h4 class="text-sm font-medium text-muted-foreground">Explanation:</h4>
							<ScrollArea>
								<div>
									{@html marked(explanation)}
								</div>
							</ScrollArea>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</CardContent>
</Card>
