<script lang="ts">
	import GenerateButton from '@/components/ai/generateButton.svelte';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';

	const levels = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
	type Level = (typeof levels)[number];
	let examLevel = $state<{
		value: Level;
		label: Level;
	}>({ value: 'N5', label: 'N5' });

	let learningLevel = $state<{
		value: Level;
		label: Level;
	}>({ value: 'N5', label: 'N5' });
	const learningCategories = ['単語', '文型'] as const;
	type Category = (typeof learningCategories)[number];
	let learningCategory = $state<{
		value: Category;
		label: Category;
	}>({ value: '単語', label: '単語' });
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
			<Select bind:selected={examLevel}>
				<SelectTrigger class="w-32">
					<SelectValue placeholder="Select Level" />
				</SelectTrigger>
				<SelectContent>
					{#each levels as level}
						<SelectItem value={level}>{level}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			<Button
				onclick={() => {
					console.log('generate exam');
				}}>Generate Exam</Button
			>
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
			<Select bind:selected={learningLevel}>
				<SelectTrigger class="w-32">
					<SelectValue placeholder="Select Level" />
				</SelectTrigger>
				<SelectContent>
					{#each levels as level}
						<SelectItem value={level}>{level}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			<Select bind:selected={learningCategory}>
				<SelectTrigger class="w-32">
					<SelectValue placeholder="Select Topic" />
				</SelectTrigger>
				<SelectContent>
					{#each learningCategories as category}
						<SelectItem value={category}>{category}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
      <!-- TODO split 2 buttons? -->
			<GenerateButton level={learningLevel.value} category={learningCategory.value} />
		</CardContent>
	</Card>
</div>
