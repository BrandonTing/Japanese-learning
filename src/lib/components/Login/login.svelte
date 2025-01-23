<script lang="ts">
	import { FormState } from '@/components/Login/loginFormState.svelte';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import Checkbox from '@/components/ui/checkbox/checkbox.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { slide } from 'svelte/transition';
	const formState = new FormState();
</script>

<Card class="w-full max-w-md">
	<CardHeader>
		<CardTitle>{formState.isSignUp ? 'Sign Up' : 'Login'}</CardTitle>
	</CardHeader>
	<CardContent>
		<form onsubmit={(e) => formState.handleSubmit(e)} class="space-y-4">
			<div>
				<Input
					type="text"
					placeholder="Email"
					bind:value={formState.user.email}
					oninput={() => (formState.error = '')}
				/>
			</div>
			<div>
				<Input
					type="password"
					placeholder="Password"
					bind:value={formState.user.password}
					oninput={() => (formState.error = '')}
				/>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="remember" bind:checked={formState.user.rememberMe} />
				<label
					for="remember"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Remember me
				</label>
			</div>
			{#if formState.error !== ''}<p class="text-red-600" in:slide={{ duration: 200 }}>{formState.error}</p>{/if}
			<Button type="submit" class="w-full">
				{formState.isSignUp ? 'Sign Up' : 'Log in'}
			</Button>
		</form>
		<div class="mt-4 text-center">
			<Button variant="link" onclick={() => (formState.isSignUp = !formState.isSignUp)}>
				{formState.isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
			</Button>
		</div>
	</CardContent>
</Card>
