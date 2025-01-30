<script lang="ts">
	import GenerateGrammerButton from '@/components/ai/generateGrammerButton.svelte';
	import GenerateVocabularyButton from '@/components/ai/generateVocabularyButton.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';
	import { levels, type Level } from './util';

	let learningLevel = $state<{
		value: Level;
		label: Level;
	}>({ value: 'N5', label: 'N5' });
	const learningCategories = ['単語', '文法'] as const;
	type Category = (typeof learningCategories)[number];
	let learningCategory = $state<{
		value: Category;
		label: Category;
	}>({ value: '単語', label: '単語' });
</script>

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
		{#if learningCategory.value === '単語'}
			<GenerateVocabularyButton level={learningLevel.value} />
		{:else}
			<GenerateGrammerButton level={learningLevel.value} />
		{/if}
	</CardContent>
</Card>
