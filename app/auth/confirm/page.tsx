"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const RED = "#FF0000";

// Cible des confirmations qui n'utilisent pas forcément le flux "?code=" géré par la route
// serveur /auth/callback (confirmation d'inscription, changement d'email...) : ces liens peuvent
// arriver avec des jetons dans le fragment #... de l'URL, que seul le navigateur peut lire — un
// Route Handler serveur ne le voit jamais. Le client Supabase (detectSessionInUrl: true par
// défaut) traite ça tout seul dès qu'il est instancié ici ; il suffit d'attendre puis de vérifier.
function ConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [status, setStatus] = useState<"checking" | "ok" | "fail">("checking");

  useEffect(() => {
    // À capturer *avant* que le client Supabase ne consomme et nettoie le fragment de l'URL.
    const hashType = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type");
    const type = searchParams.get("type") || hashType;

    const supabase = createClient();

    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setStatus("fail");
        return;
      }

      // Cas particulier : ajout/changement d'email sur un compte déjà connecté (ex. compte
      // Discord-only). Une session existe déjà de toute façon (celle de Discord) que le lien ait
      // fonctionné ou non — "il y a une session" ne prouve donc rien ici. On vérifie en plus que
      // l'email est bien confirmé sur le compte, sinon on affichait "Confirmé" à tort alors que
      // rien n'avait été lié (lien expiré, déjà utilisé, etc.).
      // Note : updateUser({email, password}) ne crée pas forcément d'entrée "identities" pour le
      // provider "email" côté Supabase (contrairement à un signUp classique) — se fier à
      // getUserIdentities() ici donnait un faux échec en permanence. Le signal fiable :
      // user.email_confirmed_at, posé uniquement une fois le lien de confirmation effectivement
      // consommé.
      if (type === "email_change" || type === "email") {
        let confirmed = false;
        for (let attempt = 0; attempt < 2 && !confirmed; attempt++) {
          if (attempt > 0) await new Promise((r) => setTimeout(r, 800));
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) break;
          confirmed = Boolean(userData.user.email && userData.user.email_confirmed_at);
        }
        if (!confirmed) {
          setStatus("fail");
          return;
        }

        // Termine côté serveur ce que le SDK client ne fait pas tout seul : créer l'entrée
        // "identities" pour le provider email (sans ça, la connexion par mot de passe échoue
        // ensuite avec "Invalid login credentials" malgré un email confirmé). Non bloquant : si
        // cet appel échoue, l'email reste confirmé, seule la connexion par mot de passe ne
        // marchera pas tant que ce n'est pas retenté.
        await fetch("/api/auth/finish-email-link", { method: "POST" }).catch(() => {});
      }

      setStatus("ok");
      setTimeout(() => router.push(next), 1200);
    }

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="jam-root flex min-h-screen flex-col items-center justify-center bg-[var(--jam-bg)] px-6 text-center font-[family-name:var(--font-grotesk)] text-[var(--jam-text)]">
      <Link href="/" className="brand-font mb-8 text-[15px] font-extrabold tracking-tight">
        Nom de la plateforme
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-[var(--jam-border)] bg-[var(--jam-surface)] p-6" style={{ boxShadow: "var(--jam-shadow)" }}>
        {status === "checking" && <p className="text-sm text-[var(--jam-text-dim)]">Vérification…</p>}
        {status === "ok" && <p className="text-sm font-bold text-green-600">Confirmé. Redirection…</p>}
        {status === "fail" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-red-600">Ce lien n&apos;est plus valide ou a déjà été utilisé.</p>
            <Link
              href="/login"
              style={{ backgroundColor: RED, color: "#fff" }}
              className="flex h-10 items-center justify-center rounded-xl text-sm font-bold transition-transform duration-150 hover:scale-[1.02] active:scale-95"
            >
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  );
}
