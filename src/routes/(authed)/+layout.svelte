<script lang="ts">
	import Header from '@/components/header/header.svelte';
	import AiChatbotDrawer from './AIChatbotDrawer.svelte';

	let { children } = $props();
</script>

<main class="container mx-auto p-4">
	<Header />
	{@render children()}
	<AiChatbotDrawer />
</main>
