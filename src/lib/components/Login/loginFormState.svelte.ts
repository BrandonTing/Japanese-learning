import { goto } from '$app/navigation';
import { AuthError } from '@/auth';
import { authClient } from '@/auth-client';
import { Effect, Match } from 'effect';

export class FormState {
	isSignUp = $state(false);
	user = $state({
		email: '',
		password: '',
		rememberMe: false
	});
  error = $state('');
  constructor() {}
  async handleSubmit(e: SubmitEvent) {
		e.preventDefault();
    const {isSignUp, user} = this
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
				this.error = e.failedReason;
				return Effect.succeed(null);
			}),
			Effect.runPromise
		);
	}
}