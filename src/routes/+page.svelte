<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import Login from '@/components/Login/login.svelte';
	const session = authClient.useSession();
	$effect(() => {
		console.log($session.data?.user);
	});
</script>

<main class="flex min-h-screen flex-col items-center justify-center p-24">
	<h1 class="text-4xl font-bold mb-8">Japanese Learning Platform</h1>
	<Login />
</main>
