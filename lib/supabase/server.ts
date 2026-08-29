import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

/**
 * Skapa en Supabase-klient för Server Components, Server Actions och
 * Route Handlers. Läser/skriver auth-cookies via Next.js cookies().
 *
 * OBS: cookieStore.set() går bara att köra i Server Actions och Route
 * Handlers, inte i rena Server Components — där fångar vi felet, eftersom
 * middleware.ts redan sköter sessionsförnyelse på varje request.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Anropad från en Server Component — ofarligt, se kommentar ovan.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Anropad från en Server Component — ofarligt, se kommentar ovan.
          }
        },
      },
    },
  );
}
