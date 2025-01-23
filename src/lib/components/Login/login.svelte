<script lang="ts">
	import { goto } from '$app/navigation';
	import { AuthError } from '@/auth';
	import { authClient } from '@/auth-client';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import Checkbox from '@/components/ui/checkbox/checkbox.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { Effect, Match } from 'effect';
	import { toast } from 'svelte-sonner';

	let isSignUp = $state(false);
	let user = $state({
		email: '',
		password: '',
		rememberMe: false
	});
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		await Effect.gen(function* () {
			const { data, error } = yield* Effect.tryPromise({
				try: () => {
					return Match.value(isSignUp).pipe(
						Match.when(true, () =>
							authClient.signUp.email({
								email: user.email,
								password: user.password,
								name: user.email
							})
						),
						Match.orElse(() =>
							authClient.signIn.email({
								email: user.email,
								password: user.password,
								rememberMe: user.rememberMe
							})
						)
					);
				},
				catch: () =>
					new AuthError({
						failedReason: 'Failed to signUp'
					})
			});
			if (error) {
				yield* new AuthError({
					failedReason: error.message ?? error.statusText
				});
			}
			goto('./start-learning');
			return data;
		}).pipe(
			Effect.catchTag('AuthError', (e) => {
				toast.error(e.failedReason);
				return Effect.succeed(null);
			}),
			Effect.runPromise
		);
	}
</script>

<Card class="w-full max-w-md">
	<CardHeader>
		<CardTitle>{isSignUp ? 'Sign Up' : 'Login'}</CardTitle>
	</CardHeader>
	<CardContent>
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<Input type="text" placeholder="Email" bind:value={user.email} />
			</div>
			<div>
				<Input type="password" placeholder="Password" bind:value={user.password} />
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="remember" bind:checked={user.rememberMe} />
				<label
					for="remember"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Remember me
				</label>
			</div>
			<Button type="submit" class="w-full">
				{isSignUp ? 'Sign Up' : 'Log in'}
			</Button>
		</form>
		<div class="mt-4 text-center">
			<Button variant="link" onclick={() => (isSignUp = !isSignUp)}>
				{isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
			</Button>
		</div>
	</CardContent>
</Card>
