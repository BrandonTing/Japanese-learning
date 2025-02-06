<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	let { children } = $props();
</script>

<div class="cursor w-lvw h-lvh">
	<Toaster richColors position="bottom-center" />

	<div class="container mx-auto p-4">
		{@render children()}
	</div>
</div>
