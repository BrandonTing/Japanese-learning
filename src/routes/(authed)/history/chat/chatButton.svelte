<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { cn } from '@/utils';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});
	const {
		isActive,
		onSelect,
		title,
		description
	}: { isActive: boolean; onSelect: () => void; title: string; description: string } = $props();
	const displayTitle = $derived(title.length > 10 ? `${title.slice(0, 10)}...` : title);
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			variant="ghost"
			class={cn('relative justify-start hover:bg-transparent w-full', isActive ? '' : 'hover:underline')}
			onclick={onSelect}
		>
			{#if isActive}
				<div
					class="bg-muted absolute inset-0 rounded-md"
					in:send={{ key: 'active-sidebar-tab' }}
					out:receive={{ key: 'active-sidebar-tab' }}
				></div>
			{/if}

			<div class="relative">
				{displayTitle}
			</div>
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content class="flex flex-col gap-1">
		<p class="font-bold">{title}</p>
		<Separator />
		<p>{description}</p>
	</Tooltip.Content>
</Tooltip.Root>
