<script lang="ts">
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';
	import GenerateGrammerButton from './generateGrammerButton.svelte';
	import GenerateVocabularyButton from './generateVocabularyButton.svelte';
	import { levels, type Level } from './util';

	let learningLevel = $state<{
		value: Level;
		label: Level;
	}>({ value: 'N5', label: 'N5' });
	const learningCategories = ['單字', '文法'] as const;
	type Category = (typeof learningCategories)[number];
	let learningCategory = $state<{
		value: Category;
		label: Category;
	}>({ value: '單字', label: '單字' });
</script>

<div class="flex items-center gap-4">
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
	{#if learningCategory.value === '單字'}
		<GenerateVocabularyButton level={learningLevel.value} />
	{:else}
		<GenerateGrammerButton level={learningLevel.value} />
	{/if}
</div>
