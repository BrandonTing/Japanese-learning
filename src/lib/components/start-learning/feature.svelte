<script lang="ts" generics="T extends string">
	import { Button } from '@/components/ui/button';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';

	type SelectedValue<U extends string> = {
		value: U;
		label: U;
	};
	let {
		selected = $bindable(),
		options,
		onGenerate
	}: { selected: SelectedValue<T>; options: Array<T>; onGenerate: () => void } = $props();
</script>

<Select bind:selected>
	<SelectTrigger class="w-32">
		<SelectValue placeholder="Select Level" />
	</SelectTrigger>
	<SelectContent>
		{#each options as option}
			<SelectItem value={option}>{option}</SelectItem>
		{/each}
	</SelectContent>
</Select>
<Button onclick={onGenerate}>Generate Exam</Button>
