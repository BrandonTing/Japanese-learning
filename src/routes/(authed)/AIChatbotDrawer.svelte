<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import type { Message } from 'ai';
	import { MessageSquare, PlusCircle } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	let messages: Array<Message> = [];
	let message: string = '';
</script>

<Drawer.Root>
	<Drawer.Trigger
		class={buttonVariants({
			variant: 'default',
			class: 'fixed bottom-4 right-4 rounded-full w-16 h-16'
		})}
	>
		<MessageSquare class="w-6 h-6" />
		<span class="sr-only">Ask AI</span>
	</Drawer.Trigger>
	<Drawer.Content >
		<Drawer.Header>
			<Drawer.Title>Ask AI</Drawer.Title>
			<Drawer.Description>
				Get help with Japanese learning, translations, and explanations.
			</Drawer.Description>
		</Drawer.Header>
		<div class="p-4 flex flex-col h-[80vh]">
			<ScrollArea class="flex-grow mb-4">
				{#each messages as message}
					<div class={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
						<span
							class={`inline-block p-2 rounded-lg ${
								message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
							}`}
						>
							{message.content}
						</span>
					</div>
				{/each}
			</ScrollArea>
			<div class="flex flex-col space-y-2">
				<p class="text-sm text-muted-foreground">
					Please create a new chat if the conversation topic has changed to preserve token usage.
				</p>
				<div class="flex items-center space-x-2">
					<Input bind:value={message} placeholder="Type your message..." />
					<Button
						onclick={() => {
							console.log(message);
						}}>Send</Button
					>
					<Button
						variant="outline"
						onclick={() => {
							messages = [];
						}}
					>
						<PlusCircle class="w-4 h-4" />
						<span class="sr-only">Create New Chat</span>
					</Button>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
