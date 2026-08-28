import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { next, mode } = await searchParams;

  // Déjà connecté (session encore valide) : inutile de repasser par le formulaire, sauf si on
  // arrive exprès pour lier un email + mot de passe à ce compte (compte Discord-only) — ce mode
  // a justement besoin de la session existante pour fonctionner.
  if (user && mode !== "link-email") {
    redirect(next || "/dashboard");
  }

  return <LoginForm />;
}
