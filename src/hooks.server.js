import { building } from '$app/environment';
import { createAuth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

/** @type {import('@sveltejs/kit').Handle} */
const handleBetterAuth = async ({ event, resolve }) => {
	if (!event.platform?.env?.DB)
		throw new Error('D1 binding "DB" not found - are you running with wrangler?');

	event.locals.auth = createAuth(event.platform.env.DB);

	const { auth } = event.locals;
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

/** @type {import('@sveltejs/kit').Handle} */
export const handle = handleBetterAuth;
