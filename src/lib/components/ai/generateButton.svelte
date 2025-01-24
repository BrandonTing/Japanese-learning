<svelte:options runes={false} />

<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { useCompletion } from '@ai-sdk/svelte';
	const { completion, complete } = useCompletion();
  $:() => {
    console.log(completion)
  }
</script>

<Button
	onclick={async () => {
		await complete(`請教我一個N5等級的単語`);
	}}
	>Generate
</Button>
