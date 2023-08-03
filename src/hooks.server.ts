import { verifyJWT } from '$lib/server/token';
import { error, type Handle } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const handle: Handle = async ({ resolve, event }) => {
	let token: string | undefined;

	if (event.cookies.get('token')) {
		token = event.cookies.get('token');
	} else if (event.request.headers.get('Authorization')?.startsWith('Bearer ')) {
		token = event.request.headers.get('Authorization')?.substring(7);
	}

	if (
		!token &&
		(event.url.pathname.startsWith('/api/users') ||
			event.url.pathname.startsWith('/api/auth/logout'))
	) {
		throw error(401, 'You are not logged in. Please provide a token to gain access.');
	}

	try {
		if (token) {
			const { sub } = await verifyJWT<{ sub: string }>(token);
			const user = await prisma.user.findUnique({ where: { id: sub } });
			if (!user) {
				throw error(401, 'User belonging to this token no longer exists');
			}

			event.locals.user = user;
		}
	} catch (err: any) {
		if (event.url.pathname.startsWith('/api')) {
			throw error(401, "Token is invalid or user doesn't exists");
		}
	}

	const response = await resolve(event);

	return response;
};
