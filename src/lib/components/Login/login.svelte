<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import Checkbox from '@/components/ui/checkbox/checkbox.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { loginState } from '@/states/loginState.svelte';
	import { Loader } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
</script>

<Card class="w-full max-w-md">
	<CardHeader>
		<CardTitle>{loginState.isSignUp ? 'Sign Up' : 'Login'}</CardTitle>
	</CardHeader>
	<CardContent>
		<form onsubmit={(e) => loginState.handleSubmit(e)} class="space-y-4">
			<div>
				<Input
					autocomplete="email"
					type="text"
					placeholder="Email"
					bind:value={loginState.user.email}
					oninput={() => (loginState.error = '')}
				/>
			</div>
			<div>
				<Input
					autocomplete={loginState.isSignUp ? 'new-password' : 'current-password'}
					type="password"
					placeholder="Password"
					bind:value={loginState.user.password}
					oninput={() => (loginState.error = '')}
				/>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="remember" bind:checked={loginState.user.rememberMe} />
				<label
					for="remember"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Remember me
				</label>
			</div>
			{#if loginState.error !== ''}<p class="text-red-600" in:slide={{ duration: 200 }}>
					{loginState.error}
				</p>{/if}
			<Button type="submit" class="w-full">
				{#if loginState.isLoading}
					<Loader class="animate-spin" />
				{:else if loginState.isSignUp}
					Sign Up
				{/if}
				Log in
			</Button>
		</form>
		<div class="mt-4 text-center">
			<Button variant="link" onclick={() => (loginState.isSignUp = !loginState.isSignUp)}>
				{loginState.isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
			</Button>
		</div>
	</CardContent>
</Card>
