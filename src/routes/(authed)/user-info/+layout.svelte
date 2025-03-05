<script lang="ts">
	import Sidebar from './sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col md:flex-row gap-4">
	<aside class="md:w-1/5">
		<Sidebar />
	</aside>
	<div class="flex-1">
		{@render children()}
	</div>
</div>
