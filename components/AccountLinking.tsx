"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DiscordIcon } from "./icons";
import { archivo, mono, CREAM, LIME, TEXT_DIM, TEXT_FAINT, twoTone } from "@/components/platformTheme";

interface Identity {
  id: string;
  provider: string;
  identity_id: string;
  user_id: string;
  identity_data?: Record<string, unknown>;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
}

// Permet à un même compte d'avoir les deux méthodes de connexion : email/mot de passe ET Discord.
// Nécessite que "Manual linking" soit activé côté Supabase (Authentication → Providers → réglage
// général "Allow manual linking" ) : désactivé par défaut, sinon linkIdentity() échoue.
function AccountLinkingInner() {
  const [identities, setIdentities] = useState<Identity[] | null>(null);
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [linkError, setLinkError] = useState("");

  const supabase = createClient();

  function load() {
    supabase.auth.getUserIdentities().then(({ data }) => {
      setIdentities((data?.identities as Identity[] | undefined) ?? []);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (identities === null) return null;

  // Une identité "email" fiable : elle n'existe (email confirmé et mot de passe utilisable) que
  // pour un compte inscrit classiquement, ou un compte Discord-only qui a terminé le flow
  // d'ajout d'email jusqu'à sa dernière étape serveur (voir /api/auth/finish-email-link). Se fier
  // à user.email_confirmed_at seul donnait un faux "Connecté" pour n'importe quel compte OAuth,
  // Discord fournissant lui-même un email déjà vérifié sans qu'aucun mot de passe existe.
  const emailIdentity = identities.some((i) => i.provider === "email");
  const discordIdentity = identities.find((i) => i.provider === "discord");

  async function linkDiscord() {
    setLinking(true);
    setLinkError("");
    const { error } = await supabase.auth.linkIdentity({
      provider: "discord",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/settings")}` },
    });
    if (error) {
      setLinkError("Impossible de connecter Discord pour l'instant.");
      setLinking(false);
    }
    // Sinon : redirection immédiate vers Discord.
  }

  async function unlinkDiscord() {
    if (!discordIdentity) return;
    setUnlinking(true);
    setLinkError("");
    const { error } = await supabase.auth.unlinkIdentity(discordIdentity);
    setUnlinking(false);
    if (error) {
      setLinkError("Impossible de déconnecter Discord pour l'instant.");
      return;
    }
    load();
  }

  return (
    <div
      className="flex w-full max-w-xs flex-col gap-3 text-left"
      style={{ background: "rgba(245,242,234,0.03)", border: "3px solid #111110", borderRadius: 16, padding: 20, boxShadow: `5px 5px 0 rgba(245,242,234,0.12)` }}
    >
      <span style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", color: TEXT_FAINT }} className="uppercase">
        Méthodes de connexion
      </span>

      <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#111110" }}>
        <span style={{ ...archivo, fontSize: 13, color: CREAM }}>Email / mot de passe</span>
        <span style={{ ...archivo, fontSize: 11, color: emailIdentity ? "#22c55e" : TEXT_FAINT }}>{emailIdentity ? "Connecté" : "Non connecté"}</span>
      </div>

      <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#111110" }}>
        <span className="flex items-center gap-2" style={{ ...archivo, fontSize: 13, color: CREAM }}>
          <DiscordIcon size={14} />
          Discord
        </span>
        <span style={{ ...archivo, fontSize: 11, color: discordIdentity ? "#22c55e" : TEXT_FAINT }}>{discordIdentity ? "Connecté" : "Non connecté"}</span>
      </div>

      {!discordIdentity && (
        <button
          onClick={linkDiscord}
          disabled={linking}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:cursor-default disabled:opacity-60"
          style={{ backgroundColor: "#5865F2" }}
        >
          <DiscordIcon size={16} />
          {linking ? "Redirection…" : "Connecter Discord"}
        </button>
      )}

      {discordIdentity && emailIdentity && (
        <button
          onClick={unlinkDiscord}
          disabled={unlinking}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl transition-colors disabled:cursor-default disabled:opacity-60"
          style={{ background: "rgba(245,242,234,0.08)", color: TEXT_DIM, ...archivo, fontSize: 13 }}
        >
          {unlinking ? "Déconnexion…" : "Déconnecter Discord"}
        </button>
      )}
      {discordIdentity && !emailIdentity && (
        <p style={{ fontSize: 12, color: TEXT_FAINT }}>
          Ajoute d&apos;abord un email + mot de passe ci-dessous pour pouvoir déconnecter Discord sans te retrouver bloqué hors de ton compte.
        </p>
      )}

      {linkError && (
        <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B6B" }}>{linkError}</span>
      )}

      {!emailIdentity && (
        <Link
          href="/login?mode=link-email"
          className="two-tone-btn flex h-10 cursor-pointer items-center justify-center rounded-xl"
          style={{ ...twoTone(LIME, CREAM), color: "#111110", border: "2px solid #111110", ...archivo, fontSize: 13 }}
        >
          Ajouter un email + mot de passe
        </Link>
      )}
    </div>
  );
}

export function AccountLinking() {
  return (
    <Suspense fallback={null}>
      <AccountLinkingInner />
    </Suspense>
  );
}
