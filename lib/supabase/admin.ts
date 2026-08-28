import { createClient } from "@supabase/supabase-js";

// Client Supabase avec la clé service-role : accès admin complet, contourne les policies RLS.
// STRICTEMENT réservé au code serveur (Route Handlers) — ne jamais importer depuis un composant
// "use client" ni exposer cette clé au navigateur.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
