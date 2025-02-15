<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import Header from '@/components/header/header.svelte';
	import { toast } from 'svelte-sonner';
	import AiChatbotDrawer from './AIChatbotDrawer.svelte';
	let { children } = $props();
	const session = authClient.useSession();
	$effect(() => {
		if (!$session.data?.session) {
			toast.warning('Your login session has expired, redirecting to Login page', {
				duration: 500
			});
			goto('/');
		}
	});
</script>

<main class="container mx-auto p-4">
	<Header />
	{@render children()}
	<AiChatbotDrawer />
</main>
