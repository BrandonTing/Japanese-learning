<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { getImgsVariable } from '@/cursorUtil';
	import { userSetting } from '@/states/userSetting.svelte';
	import '../app.css';
	let { children } = $props();
	const cursorStyle = $derived(getImgsVariable(userSetting.cursorType));
</script>

<Toaster richColors position="bottom-center" />

<div class="container mx-auto p-4" style={cursorStyle}>
	{@render children()}
</div>
