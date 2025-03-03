<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { historyTabs } from './utils';

	onMount(() => {
		goto(`/history/${historyTabs[0].path}`, {
			replaceState: true
		});
	});
</script>
