<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import Login from '@/components/Login/login.svelte';
	import { toast } from 'svelte-sonner';
	const session = authClient.useSession();
	$effect(() => {
		if ($session.data?.session) {
			toast.info('Redirecting...', {
				duration: 500
			});
			goto('./start-learning');
		}
	});
</script>

<main class="flex min-h-screen flex-col items-center justify-center p-4 xl:p-24">
	<h1 class="text-4xl font-bold mb-8">Japanese Learning Platform</h1>
	<Login />
</main>
