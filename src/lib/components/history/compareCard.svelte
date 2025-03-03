<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import * as Dialog from '@/components/ui/dialog';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Separator } from '@/components/ui/separator';
	import { Info, Trash2 } from 'lucide-svelte';
	import { marked } from 'marked';
	let {
		sentence,
		targetSentence,
		deleteHandler,
		explanation
	}: { sentence: string; targetSentence: string; deleteHandler: () => void; explanation: string } =
		$props();
</script>

<Card>
	<CardHeader>
		<CardTitle></CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-3">
			<div>
				<div class="text-xs font-medium text-muted-foreground mb-1">Target</div>
				<p class="text-sm">{targetSentence}</p>
			</div>
			<Separator />
			<div>
				<div class="text-xs font-medium text-muted-foreground mb-1">Japanese</div>
				<p class="text-sm">{sentence}</p>
			</div>
		</div>
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
						<Dialog.Title>Sentence Comparison Details</Dialog.Title>
						<Dialog.Description>Full sentences and meaning analysis</Dialog.Description>
					</Dialog.Header>

					<div class="space-y-4 py-4">
						<div class="space-y-2">
							<h4 class="text-sm font-medium">Target Sentence:</h4>
							<p class="text-sm">{targetSentence}</p>
						</div>

						<div class="space-y-2">
							<h4 class="text-sm font-medium">Japanese Sentence:</h4>
							<p class="text-sm">{sentence}</p>
						</div>
						<div class="space-y-2">
							<h4 class=" font-bold">Explanation:</h4>
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
