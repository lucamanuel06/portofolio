import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Prefers SUPABASE_SERVICE_ROLE_KEY if available (for admin/server actions).
 * Falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY (works only if RLS/policies allow).
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  if (!anon && !service) {
    throw new Error(
      "Either NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is required"
    );
  }

  return createClient(url, service ?? anon!, {
    auth: { persistSession: false },
  });
}
