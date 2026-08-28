import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Point de retour après une connexion OAuth (Discord, Google...) : Supabase redirige ici avec un
// "code" à échanger contre une session, avant de renvoyer l'utilisateur vers sa destination.
// Important : les cookies de session doivent être écrits directement sur l'objet réponse retourné
// (comme dans proxy.ts) — les écrire via next/headers ne se propage pas de façon fiable quand on
// retourne un NextResponse construit séparément, ce qui faisait perdre la session après ce hop.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
  }

  // linkIdentity() vers une identité Discord déjà liée à un autre compte échoue ici — souvent
  // *sans* code du tout (Supabase renvoie directement une erreur, rien à échanger). Peu importe
  // d'où venait la tentative (JAM, settings...) : on revient sur "next" avec juste "authError=1",
  // et la notification globale (AuthErrorToast, montée dans le layout racine) l'affiche partout.
  return NextResponse.redirect(`${origin}${next}${next.includes("?") ? "&" : "?"}authError=1`);
}
