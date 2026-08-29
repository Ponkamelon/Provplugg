import { createBrowserClient } from "@supabase/ssr";

// OBS: medvetet inte typad med <Database> här. Den installerade
// @supabase/supabase-js-versionen har en inkompatibilitet i sin
// generiska typinferens för .select()/.rpc() mot vår genererade
// Database-typ, vilket kollapsar returtyper till `never` i produktion
// (se kommentarer i lib/auth.ts). Databastypnamnen (Tables<"x"> osv)
// används fortfarande manuellt där det behövs.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
