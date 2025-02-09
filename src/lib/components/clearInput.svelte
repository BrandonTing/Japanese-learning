<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { CircleX } from 'lucide-svelte';
	import type { ClassValue } from 'svelte/elements';
	let { clear, className }: { clear: () => void; className?: ClassValue } = $props();
</script>

<CircleX
	class={cn('size-4 absolute top-1/2 -translate-y-1/2 right-2 hidden md:inline-block', className)}
	onclick={clear}
/>
