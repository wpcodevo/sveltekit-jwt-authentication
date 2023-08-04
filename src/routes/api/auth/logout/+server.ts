import { json } from '@sveltejs/kit';

export async function POST({ cookies, locals }) {
	locals.user = null;

	const cookieOptions = {
		path: '/api',
		secure: process.env.NODE_ENV !== 'development'
	};

	cookies.delete('token', cookieOptions);
	cookies.delete('logged-in', cookieOptions);

	return json({ status: 'success' });
}
