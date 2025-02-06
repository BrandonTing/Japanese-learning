<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils.js';
	import { Button } from '@/components/ui/button';
	import { userInfoNavItems } from './utils';
	import { crossfade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});
</script>

<nav class="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
	{#each userInfoNavItems as item}
		{@const isActive = page.url.pathname.includes(item.href)}

		<Button
			href={`/user-info${item.href}`}
			variant="ghost"
			class={cn('relative justify-start hover:bg-transparent', isActive ? '' : 'hover:underline')}
			data-sveltekit-noscroll
		>
			{#if isActive}
				<div
					class="bg-muted absolute inset-0 rounded-md"
					in:send={{ key: 'active-sidebar-tab' }}
					out:receive={{ key: 'active-sidebar-tab' }}
				></div>
			{/if}

			<div class="relative">
				{item.title}
			</div>
		</Button>
	{/each}
</nav>
