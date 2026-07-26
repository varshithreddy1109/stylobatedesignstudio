import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase browser client.
 *
 * Uses @supabase/ssr so the auth session is persisted in cookies (not just
 * localStorage) — this is what lets src/middleware.ts read the session on
 * the server and protect /admin/* routes before a page ever renders.
 *
 * Only the public URL and anon (publishable) key are used here — never the
 * service_role key, and never hardcoded credentials.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  // Expected until real Supabase credentials are added to .env.local.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Add them to .env.local — authentication will not work until they are set."
  );
}

export const supabase = createBrowserClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
