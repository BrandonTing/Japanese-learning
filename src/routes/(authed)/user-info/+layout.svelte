<script lang="ts">
	import Sidebar from './sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
	<aside class="-mx-4 md:w-1/5">
		<Sidebar />
	</aside>
	<div class="flex-1 md:max-w-2xl">
		{@render children()}
	</div>
</div>
