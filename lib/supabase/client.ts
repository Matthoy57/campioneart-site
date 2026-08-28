import { createBrowserClient } from "@supabase/ssr";

// Client Supabase côté navigateur (composants "use client"). Utilise la clé publishable, sûre
// à exposer : la sécurité réelle vient des policies Row Level Security côté base de données.
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}
