<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import Basic from './basic.svelte';
	import Check from './check.svelte';
	import Compare from './compare.svelte';
	import Pattern from './pattern.svelte';
	const tabs = ['Basic', 'Check', 'Compare', 'Pattern'];
</script>

<Tabs.Root>
	<Tabs.List>
		{#each tabs as tab}
			<Tabs.Trigger value={tab}>{tab}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	<Tabs.Content value="Basic"><Basic /></Tabs.Content>
	<Tabs.Content value="Check"><Check /></Tabs.Content>
	<Tabs.Content value="Compare"><Compare /></Tabs.Content>
	<Tabs.Content value="Pattern"><Pattern /></Tabs.Content>
</Tabs.Root>
