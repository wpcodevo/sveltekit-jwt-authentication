import { verifyJWT } from '$lib/server/token';
import { error, type Handle } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const handle: Handle = async ({ resolve, event }) => {
	const { url, locals, request, cookies } = event;

	let authToken: string | undefined;

	if (cookies.get('token')) {
		authToken = cookies.get('token');
	} else if (request.headers.get('Authorization')?.startsWith('Bearer ')) {
		authToken = request.headers.get('Authorization')?.substring(7);
	}

	if (
		!authToken &&
		(url.pathname.startsWith('/api/users') || url.pathname.startsWith('/api/auth/logout'))
	) {
		throw error(401, 'You are not logged in. Please provide a token to gain access.');
	}

	try {
		if (authToken) {
			const { sub } = await verifyJWT<{ sub: string }>(authToken);
			const user = await prisma.user.findUnique({ where: { id: sub } });
			if (!user) {
				throw error(401, 'User belonging to this token no longer exists');
			}

			locals.user = user;
		}
	} catch (err: any) {
		if (url.pathname.startsWith('/api')) {
			throw error(401, "Token is invalid or user doesn't exists");
		}
	}

	const response = await resolve(event);

	return response;
};
