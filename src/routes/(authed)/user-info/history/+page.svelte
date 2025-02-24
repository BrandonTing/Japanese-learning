<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { db } from '@/states/db.svelte';
	import { Delete } from 'lucide-svelte';
</script>

{#each db.list as item}
	{item.key}: {item.content}
	<Button size="icon" variant="outline" onclick={() => db.deleteVocabulary(item.key)}
		><Delete size={16} /></Button
	>
{/each}
