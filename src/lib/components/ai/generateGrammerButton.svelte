<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { handleGenerateError } from '@/components/ai/util';
	import { buttonVariants } from '@/components/ui/button';
	import { useCompletion } from '@ai-sdk/svelte';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import type { GrammerSchema } from '../../../routes/api/completion/learning/util';

	let error = '';
	export let level: string;
	export let category: string;
	$: prompt = `請隨機教我一個${level}等級的文型`;
	let grammer: GrammerSchema | null = null;
	const { complete, isLoading } = useCompletion({
		api: '/api/completion/learning/grammer',
		streamProtocol: 'text',
		onError: (e) => {
			const message = handleGenerateError(e);
			error = message;
		},
		async onResponse(response) {
			const data = await response.json();
			grammer = data;
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		on:click={async () => {
			error = '';
			grammer = null;
			await complete(prompt);
		}}
		disabled={$isLoading}
	>
		Generate
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{category}</Dialog.Title>
			<Dialog.Description>
				{#if $isLoading}
					Loading...
				{:else if error}
					<Alert.Root variant="destructive">
						<CircleAlert class="h-4 w-4" />
						<Alert.Title>Generate Error</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{:else if grammer}
					<div class="py-4">
						<p class="text-lg whitespace-pre-line">{grammer.type}</p>
					</div>
				{/if}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
