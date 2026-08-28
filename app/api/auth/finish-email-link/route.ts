import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Étape finale après confirmation d'un ajout d'email + mot de passe sur un compte OAuth-only
// (Discord). Le client Supabase self-serve (updateUser({email, password})) applique bien le
// changement d'email et le mot de passe, mais ne crée jamais l'entrée correspondante dans
// auth.identities pour le provider "email" — résultat : signInWithPassword() échoue ensuite avec
// "Invalid login credentials" même une fois l'email confirmé. Ré-appliquer le même email via
// l'API Admin (service-role) crée cette identité manquante, sans toucher au mot de passe déjà en
// place. Cette route est appelée juste après confirmation, depuis /auth/confirm.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email || !user.email_confirmed_at) {
    return NextResponse.json({ error: "Aucun email confirmé sur ce compte." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    email: user.email,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
