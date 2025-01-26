<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { useCompletion } from '@ai-sdk/svelte';
	const { completion, complete } = useCompletion();
	type $$Props = {
		prompt: string;
	};
	export let prompt: $$Props['prompt'];
	$: () => {
		console.log(prompt);
	};
</script>

<Button
	onclick={async () => {
		await complete(prompt);
	}}
	>Generate
</Button>
