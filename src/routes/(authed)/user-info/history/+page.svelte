<script lang="ts">
	import { db } from '@/states/db.svelte';
</script>

{#each db.list as item}
	{item.key}: {item.content}
{/each}
