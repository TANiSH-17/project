export function getUserHeaders() {
  if (typeof window === 'undefined') return {} as Record<string, string>;
  const email = localStorage.getItem('email') || '';
  const role = localStorage.getItem('role') || '';
  const headers: Record<string, string> = {};
  if (email) headers['x-user-email'] = email;
  if (role) headers['x-user-role'] = role;
  const admin = process.env.NEXT_PUBLIC_ADMIN_KEY;
  if (admin) headers['x-admin-key'] = admin as string;
  return headers;
}

export async function apiFetch(path: string, init?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_URL as string;
  const headers = { ...(init?.headers || {}), ...getUserHeaders(), 'Content-Type': 'application/json' } as any;
  const res = await fetch(`${base}${path}`, { ...init, headers });
  return res;
}
