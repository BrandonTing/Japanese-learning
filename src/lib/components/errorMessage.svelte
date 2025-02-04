<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { CircleAlert } from 'lucide-svelte';
	let { message }: { message: string } = $props();
</script>

<Alert.Root variant="destructive">
	<CircleAlert class="h-4 w-4" />
	<Alert.Title>Generate Error</Alert.Title>
	<Alert.Description>{message}</Alert.Description>
</Alert.Root>
