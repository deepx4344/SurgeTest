import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, url }) => {
  if (url.pathname.startsWith('/dashboard')) {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) throw redirect(302, '/login');
  }
};