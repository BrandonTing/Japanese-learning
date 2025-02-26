<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { historyTabs } from './utils';
	let { children } = $props();
	let value = $derived(page.url.pathname.split('/').pop() ?? historyTabs[0].path);
</script>

<Tabs.Root class="mb-2" {value} onValueChange={(value) => goto(`/user-info/history/${value}`)}>
	<Tabs.List class="flex">
		{#each historyTabs as tab}
			<Tabs.Trigger value={tab.path}>{tab.label}</Tabs.Trigger>
		{/each}
	</Tabs.List>
</Tabs.Root>

{@render children()}
