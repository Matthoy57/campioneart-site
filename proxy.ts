import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Chemins des outils privés, à plat (pas de préfixe /outils) : ajouter une entrée ici à chaque
// nouvel outil pour qu'il soit protégé par la connexion.
const PROTECTED_PATHS = ["/game-jam", "/dashboard", "/settings"];

// Un cookie de session corrompu (ex. après un rafraîchissement interrompu par un déploiement) peut
// faire tourner getUser() dans le vide au lieu d'échouer proprement — vu en prod : la fonction
// bloquait 300s (le hard timeout Vercel) sur CHAQUE page passant par le middleware (/, /login, tous
// les outils), le site entier était inaccessible pendant 5 minutes à chaque requête concernée. Ce
// timeout borne l'attente : au pire, une session valide est traitée comme "pas connecté" une fois
// (redemande de connexion), largement préférable à bloquer tout le monde.
const AUTH_CHECK_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([promise, new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))]);
}

// Tourne sur les outils, /login et / : rafraîchit la session Supabase à chaque requête (les
// Server Components seuls ne peuvent pas persister un cookie rafraîchi, d'où la session qui
// semblait "oubliée" après un moment sur les pages hors outils). Ne redirige vers /login que
// pour les chemins protégés — les autres pages restent publiques. Pas encore de vérification
// d'abonnement Stripe ici : être connecté suffit pour l'instant (voir conversation).
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const result = await withTimeout(supabase.auth.getUser(), AUTH_CHECK_TIMEOUT_MS);
  const user = result?.data?.user ?? null;

  const isProtected = PROTECTED_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));

  if (!user && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/game-jam/:path*", "/dashboard/:path*", "/settings/:path*", "/login", "/"],
};
