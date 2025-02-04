<script lang="ts">
	import { page } from '$app/state';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Button from '@/components/ui/button/button.svelte';
	import { loginState } from '@/states/loginState.svelte';
	import { ChevronDown, Loader, LogOut, Menu } from 'lucide-svelte';

	const mainNavItems = [
		{ title: 'Start Learning!', href: '/start-learning' }
		// TODO not implemented yet
		// { title: 'Exam History', href: '/exam-history' },
		// { title: 'Saved AI Conversations', href: '/saved-conversations' }
	] as const;

	const externalResources = [
		{
			title: 'Todaii Japanese',
			href: 'https://easyjapanese.net/?hl=zh-TW',
			description: '日文新聞彙整網站，有標上漢字讀音並整合字典'
		},
		{
			title: 'Reverso',
			href: 'https://doushi.reverso.net/%E6%B4%BB%E7%94%A8-%E6%97%A5%E6%9C%AC%E8%AA%9E.html',
			description: '適合查詢動詞變化，輸入時需使用辭書型'
		},
		{
			title: '東京外國語大學',
			href: 'https://www.coelang.tufs.ac.jp/ja/zt/',
			description: '東京外國語大學提供的日文教材，方便查詢文法解釋'
		}
	] as const;
</script>

<header class="w-full bg-background border-b mb-8">
	<div class="container mx-auto px-4">
		<nav class="flex items-center justify-between h-16">
			<div class="flex items-center gap-4">
				<h1 class="text-xl font-bold mr-8">Japanese Learning Platform</h1>
				<div class="hidden md:block">
					{#each mainNavItems as nav}
						<a
							href={nav.href}
							class={[
								'hover:text-primary  text-sm font-medium transition-colors',
								page.url.pathname.includes(nav.href) ? 'text-primary' : 'text-muted-foreground'
							]}
						>
							{nav.title}
						</a>
					{/each}
					<!-- ADD external link -->
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							class="text-sm font-medium text-muted-foreground hover:text-primary"
						>
							<div class="flex">
								External Resources <ChevronDown class="size-5" />
							</div>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								{#each externalResources as externalResource}
									<DropdownMenu.Item>
										<Tooltip.Root openDelay={200} closeDelay={50} group="external">
											<Tooltip.Trigger class="h-full w-full">
												<a href={externalResource.href} target="_blank" class="h-full w-full">
													{externalResource.title}
												</a>
											</Tooltip.Trigger>
											<Tooltip.Content side="right" class="w-60">
												<p>{externalResource.description}</p>
											</Tooltip.Content>
										</Tooltip.Root>
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
			<div class="flex items-center">
				<Button
					variant="outline"
					class="hidden md:flex"
					onclick={() => {
						loginState.handleSignout();
					}}
				>
					{#if loginState.isLoading}
						<Loader class="animate-spin" />
					{:else}
						<LogOut class="mr-2 h-4 w-4" />
						Sign Out
					{/if}
				</Button>
				<Sheet.Root>
					<Sheet.Trigger>
						<Button variant="outline" size="icon" class="md:hidden">
							<Menu class="h-4 w-4" />
						</Button>
					</Sheet.Trigger>
					<Sheet.Content side="right">
						<nav class="flex flex-col space-y-4">
							{#each mainNavItems as nav}
								<a
									href={nav.href}
									class={[
										'hover:text-primary text-base font-medium transition-colors',
										page.url.pathname.includes(nav.href) ? 'text-primary' : 'text-muted-foreground'
									]}
								>
									{nav.title}
								</a>
							{/each}
							<div class="pt-4 border-t">
								<h3 class="text-lg font-medium mb-2">External Resources</h3>
								{#each externalResources as externalResource}
									<a href={externalResource.href} target="_blank" class="block py-2 text-base">
										{externalResource.title}
										<span class="py-2 text-sm text-muted-foreground">
											{externalResource.description}</span
										>
									</a>
								{/each}
							</div>
							<Button
								variant="outline"
								onclick={() => {
									loginState.handleSignout();
								}}
								class="mt-4"
							>
								<LogOut class="mr-2 h-4 w-4" />
								Sign Out
							</Button>
						</nav>
					</Sheet.Content>
				</Sheet.Root>
			</div>
		</nav>
	</div>
</header>
