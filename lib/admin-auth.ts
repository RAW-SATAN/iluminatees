// Admin password — change this or set NEXT_PUBLIC_ADMIN_PASSWORD in .env.local
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'iluminatees';
export const AUTH_KEY = 'ilum_admin_auth';
export const ORDERS_KEY = 'ilum_orders';
export const DISCOUNTS_KEY = 'ilum_discounts';
export const SETTINGS_KEY = 'ilum_settings';

export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}
