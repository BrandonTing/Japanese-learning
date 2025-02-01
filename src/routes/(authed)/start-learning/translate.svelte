<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import { Textarea } from '@/components/ui/textarea';

	let text = $state('');
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle>Translate</CardTitle>
		<p class="text-sm text-muted-foreground">
			Paste a Japanese article for translation and grammar explanation.
		</p>
	</CardHeader>
	<CardContent class="flex items-center gap-4">
		<Textarea placeholder="Paste your Japanese text here..." bind:value={text} rows={5} />
		<Button
			onclick={() => {
				console.log(text);
			}}
			disabled={!text.trim()}>Translate</Button
		>
	</CardContent>
</Card>
