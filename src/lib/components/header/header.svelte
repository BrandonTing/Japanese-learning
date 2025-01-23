<script lang="ts">
	import { page } from '$app/stores';
	import Button from '@/components/ui/button/button.svelte';
	import { loginState } from '@/states/loginState.svelte';
	import { Loader, LogOut } from 'lucide-svelte';
	console.log($page.url.pathname);
	const mainNavItems = [
		{ title: 'Start Learning!', href: '/start-learning' },
		{ title: 'Exam History', href: '/exam-history' },
		{ title: 'Saved AI Conversations', href: '/saved-conversations' }
	] as const;

	const externalResources = [
		{
			title: 'JLPT Official Site',
			href: 'https://www.jlpt.jp/e/',
			description: 'Official website for the Japanese Language Proficiency Test'
		},
		{
			title: 'Tofugu',
			href: 'https://www.tofugu.com/',
			description: 'Japanese language and culture blog with learning resources'
		},
		{
			title: 'NHK World Japan',
			href: 'https://www3.nhk.or.jp/nhkworld/en/learnjapanese/',
			description: "Free Japanese lessons from Japan's national broadcaster"
		},
		{
			title: 'Genki Study Resources',
			href: 'https://sethclydesdale.github.io/genki-study-resources/',
			description: 'Online self-study quizzes for the Genki textbooks'
		}
	] as const;
</script>

<header class="w-full bg-background border-b mb-8">
	<div class="container mx-auto px-4">
		<nav class="flex items-center justify-between h-16">
			<div class="flex items-center gap-4">
				<h1 class="text-xl font-bold mr-8">Japanese Learning Platform</h1>
				{#each mainNavItems as nav}
					<a
						href={nav.href}
						class={[
							'hover:text-primary  text-sm font-medium transition-colors',
							$page.url.pathname.includes(nav.href) ? 'text-primary' : 'text-muted-foreground'
						]}
					>
						{nav.title}
					</a>
				{/each}
				<!-- ADD external link -->
			</div>
			<Button
				variant="outline"
				onclick={() => {
					loginState.handleSignout();
				}}
			>
				{#if loginState.isLoading}
					<Loader class="animate-spin" />
				{:else}
					<LogOut className="mr-2 h-4 w-4" />
					Sign Out
				{/if}
			</Button>
		</nav>
	</div>
</header>
