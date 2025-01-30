<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { useChat } from '@ai-sdk/svelte';
	import { MessageSquare, PlusCircle } from 'lucide-svelte';
	const { input, handleSubmit, messages, setMessages, isLoading, stop } = useChat();
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
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Ask AI</Drawer.Title>
			<Drawer.Description>
				Get help with Japanese learning, translations, and explanations.
			</Drawer.Description>
		</Drawer.Header>
		<div class="p-4 flex flex-col h-[80vh]">
			<ScrollArea class="flex-grow mb-4">
				{#each $messages as message}
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
				{#if $isLoading}
					<div class="mb-4 text-left">
						<span class="inline-block p-2 text-black"> loading... </span>
					</div>
				{/if}
			</ScrollArea>
			<div class="flex flex-col space-y-2">
				<p class="text-sm text-muted-foreground">
					Please create a new chat if the conversation topic has changed to preserve token usage.
				</p>
				<form on:submit={handleSubmit}>
					<div class="flex items-center space-x-2">
						{#if $isLoading}
							<Button
								class="flex-1"
								variant="outline"
								on:click={() => {
									stop();
								}}
							>
								<span>Cancel Generation</span>
							</Button>
						{:else}
							<Input bind:value={$input} placeholder="Type your message..." />
							<Button type="submit">Send</Button>
						{/if}
						<Button
							variant="outline"
							onclick={() => {
								stop();
								setMessages([]);
							}}
						>
							<PlusCircle class="w-4 h-4" />
							<span class="sr-only">Create New Chat</span>
						</Button>
					</div>
				</form>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
