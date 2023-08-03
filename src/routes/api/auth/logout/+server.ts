import { json } from '@sveltejs/kit';

export async function POST({ cookies, locals }) {
	locals.user = null;

	cookies.delete('token', {
		httpOnly: true,
		path: '/',
		secure: process.env.NODE_ENV !== 'development'
	});
	cookies.delete('logged-in');

	return json({ status: 'success' });
}
