// Stub — Supabase removed; use @/auth + @/lib/db instead
export async function createClient() {
  throw new Error("Supabase removed. Use auth() from @/auth and db from @/lib/db");
}
export async function createServiceClient() {
  throw new Error("Supabase removed. Use db from @/lib/db");
}
