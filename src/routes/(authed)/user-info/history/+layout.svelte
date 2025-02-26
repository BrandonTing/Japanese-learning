<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	let { children } = $props();
</script>

<Tabs.Root value="account" class="w-[400px]">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="password">Password</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account">
		{@render children()}
	</Tabs.Content>
	<Tabs.Content value="password">
		{@render children()}
	</Tabs.Content>
</Tabs.Root>
