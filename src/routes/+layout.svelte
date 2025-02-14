<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '$lib/states/userSetting.svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import '../app.css';

	injectSpeedInsights();

	let { children } = $props();
</script>

<div class="cursor w-lvw h-lvh">
	<Toaster richColors position="bottom-center" />

	<div class="container mx-auto p-4">
		{@render children()}
	</div>
</div>
