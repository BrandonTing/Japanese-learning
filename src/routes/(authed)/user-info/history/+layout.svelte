<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';

	import { historyTabs } from './utils';
	let { children } = $props();
	let value = $derived(page.url.pathname.split('/').pop() ?? historyTabs[0].path);
	let selectionVal = $derived.by(() => {
		const tab = page.url.pathname.split('/').pop() ?? historyTabs[0].path;
		const label = historyTabs.find((t) => t.path === tab)?.label ?? historyTabs[0].label;
		return {
			value: tab,
			label
		};
	});
</script>

<div class="flex flex-col gap-4">
	<Tabs.Root
		class="mb-2 hidden md:block"
		{value}
		onValueChange={(value) => goto(`/user-info/history/${value}`)}
	>
		<Tabs.List class="flex">
			{#each historyTabs as tab}
				<Tabs.Trigger value={tab.path}>{tab.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>
	</Tabs.Root>

	<Select
		selected={selectionVal}
		onSelectedChange={(val) => {
			if (!val) return;
			goto(`/user-info/history/${val.value}`);
		}}
	>
		<SelectTrigger class="w-32 md:hidden">
			<SelectValue placeholder="Select Level" />
		</SelectTrigger>
		<SelectContent>
			{#each historyTabs as tab}
				<SelectItem value={tab.path}>{tab.label}</SelectItem>
			{/each}
		</SelectContent>
	</Select>

	{@render children()}
</div>
