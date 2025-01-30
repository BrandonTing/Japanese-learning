<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';
	import { levels, type Level } from './util';

	let examLevel = $state<{
		value: Level;
		label: Level;
	}>({ value: 'N5', label: 'N5' });
</script>

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
