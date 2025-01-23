<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Button } from '@/components/ui/button';
	const session = authClient.useSession();
	const user = $derived($session.data?.user);
</script>

<div>{user?.id}</div>
<Button
	onclick={async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/');
				}
			}
		});
	}}>Sign out</Button
>
