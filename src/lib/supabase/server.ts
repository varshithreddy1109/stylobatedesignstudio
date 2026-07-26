import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Server-side Supabase client for use in Server Components and Route
 * Handlers. Reads/writes the auth cookie set by src/middleware.ts so
 * server-rendered pages see the same session as the browser.
 *
 * Falls back to a placeholder URL/key when env vars are not yet configured
 * so the app doesn't crash — queries will simply fail gracefully (see the
 * try/catch handling in src/lib/supabase/projects.ts) and public pages will
 * show their empty state instead of throwing.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component, which can't set cookies
          // directly — safe to ignore since middleware refreshes sessions.
        }
      },
    },
  });
}
