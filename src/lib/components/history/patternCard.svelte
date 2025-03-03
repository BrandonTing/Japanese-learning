<script lang="ts">
	import { Badge } from '@/components/ui/badge';
	import Button from '@/components/ui/button/button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import * as Dialog from '@/components/ui/dialog';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Info, Trash2 } from 'lucide-svelte';
	import { marked } from 'marked';
	let {
		sentence,
		pattern,
		deleteHandler,
		explanation
	}: { sentence: string; pattern: string; deleteHandler: () => void; explanation: string } =
		$props();
	const { prevPart, nextPart } = $derived.by(() => {
		const parts = sentence.split(pattern);
		const prevPart = parts[0].length > 10 ? `...${parts[0].slice(-10)}` : parts[0];
		const nextPart = parts[1].length > 10 ? `${parts[1].slice(10)}...` : parts[1];
		return {
			prevPart,
			nextPart
		};
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>
			{prevPart}
			<Badge variant="secondary" class="text-lg text-primary mx-0.5">
				{pattern}
			</Badge>
			{nextPart}
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
						<Dialog.Title>Sentence Pattern Details</Dialog.Title>
						<Dialog.Description>Full sentences and meaning analysis</Dialog.Description>
					</Dialog.Header>

					<div class="space-y-4 py-4">
						<div class="space-y-2">
							<h4 class="text-sm font-medium text-muted-foreground">Full Sentence:</h4>
							<p>{sentence}</p>
						</div>
						<div class="space-y-2">
							<h4 class="text-sm font-medium text-muted-foreground">Pattern:</h4>
							<Badge variant="secondary" class="font-normal text-base">
								{pattern}
							</Badge>
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
