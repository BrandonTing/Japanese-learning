<script lang="ts">
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();
	const user = $derived($session.data?.user);
</script>

<div>{user?.id}</div>
