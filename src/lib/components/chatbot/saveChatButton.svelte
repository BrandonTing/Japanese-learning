<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { db } from '@/states/db.svelte';
	import type { Message } from 'ai';
	import { toast } from 'svelte-sonner';
	let {
		disabled,
		messages,
		onSuccess
	}: { disabled: boolean; messages: Array<Message>; onSuccess: () => void } = $props();
	let saveFormData = $state({
		title: '',
		description: ''
	});
	let open = $state(false);
</script>

<Dialog.Root
	portal={null}
	bind:open
	onOpenChange={(open) => {
		open = open;
	}}
>
	<Button
		variant="outline"
		{disabled}
		onclick={() => {
			open = true;
		}}>Save</Button
	>
	<Dialog.Content class="text-base">
		<Dialog.Header>
			<Dialog.Title>Save Conversation</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="title" class="text-right">Title</Label>
				<Input id="title" bind:value={saveFormData.title} class="col-span-3" placeholder="Title" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="description" class="text-right">Description</Label>
				<Textarea
					id="description"
					bind:value={saveFormData.description}
					class="col-span-3"
					placeholder="What's the conversation about?"
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Button
				onclick={() => {
					if (!saveFormData.title) {
						toast.error('Title is required');
						return;
					}
					db.saveChat(
						{
							title: saveFormData.title,
							description: saveFormData.description,
							messages: messages.map((message) => {
								return {
									id: message.id,
									role: message.role,
									content: message.content
								};
							})
						},
						() => {
							onSuccess();
							open = false;
						}
					);
				}}>Save changes</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
