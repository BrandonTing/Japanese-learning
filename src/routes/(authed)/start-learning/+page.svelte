<script lang="ts">
	import Feature from '@/components/start-learning/feature.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
	let level = $state({ value: levels[0], label: levels[0] });
	const learningCategories = ['単語', '文型'];
	let learningCategory = $state({ value: learningCategories[0], label: learningCategories[0] });
</script>

<div class="flex flex-col gap-4">
	<Card class="w-full">
		<CardHeader>
			<CardTitle>Generate New Exam</CardTitle>
			<p class="text-sm text-muted-foreground">
				Create a new JLPT practice exam based on your selected level.
			</p>
		</CardHeader>
		<CardContent class="flex items-center gap-4">
			<Feature
				bind:selected={level}
				options={levels}
				onGenerate={() => {
					console.log('generate exam');
				}}
			/>
		</CardContent>
	</Card>

	<Card class="w-full">
		<CardHeader>
			<CardTitle>Teach me something New</CardTitle>
			<p class="text-sm text-muted-foreground">
				Get a quick lesson on Japanese vocabulary or grammar patterns.
			</p>
		</CardHeader>
		<CardContent class="flex items-center gap-4">
			<Feature
				bind:selected={learningCategory}
				options={learningCategories}
				onGenerate={() => {
					console.log('Generate');
				}}
			/>
		</CardContent>
	</Card>
</div>
