<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';

	let { children } = $props();
</script>

<Toaster richColors position="bottom-center" />

<div class="container mx-auto p-4">
	{@render children()}
</div>
