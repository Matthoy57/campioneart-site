import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase côté serveur (Server Components, API routes). Lit/écrit les cookies de
// session via le store Next.js — nécessaire pour que la session survive entre les requêtes.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Appelé depuis un Server Component (pas une Server Action / Route Handler) : on ne
          // peut pas écrire de cookies ici. Sans conséquence tant que le proxy rafraîchit la
          // session (voir proxy.ts).
        }
      },
    },
  });
}
