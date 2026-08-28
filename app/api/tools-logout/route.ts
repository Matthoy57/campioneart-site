import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  // 303 (pas 307, par défaut sur NextResponse.redirect) : force un GET sur la redirection,
  // sinon le navigateur repart avec un POST vers "/" (qui n'accepte que GET) → 405.
  const response = NextResponse.redirect(new URL("/", request.url), 303);

  // Cookies écrits directement sur la réponse retournée (voir auth/callback/route.ts pour le
  // détail du pourquoi) : nécessaire pour que la suppression de session soit bien appliquée.
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

  await supabase.auth.signOut();
  return response;
}
