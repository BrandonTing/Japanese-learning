<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import Find from './basic.svelte';
	import Check from './check.svelte';
	import Compare from './compare.svelte';
	import { hubState, tabs } from './hubState.svelte';
	import Pattern from './pattern.svelte';
</script>

<Tabs.Root
	value={hubState.tab}
	onValueChange={(value) => {
		if (value) {
			hubState.setTab(value);
		}
	}}
>
	<Tabs.List>
		{#each tabs as tab}
			<Tabs.Trigger value={tab}>{tab}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	<Tabs.Content value="Basic"><Check /></Tabs.Content>
	<Tabs.Content value="Check"><Find /></Tabs.Content>
	<Tabs.Content value="Compare"><Compare /></Tabs.Content>
	<Tabs.Content value="Pattern"><Pattern /></Tabs.Content>
</Tabs.Root>
