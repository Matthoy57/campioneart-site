"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DiscordIcon } from "./icons";

const RED = "#FF0000";

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
    <div className="flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-[var(--jam-border)] bg-[var(--jam-surface)] p-6 text-left">
      <span className="text-xs font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">Méthodes de connexion</span>

      <div className="flex items-center justify-between rounded-lg bg-[var(--jam-surface-alt)] px-3 py-2.5">
        <span className="text-sm font-semibold text-[var(--jam-text)]">Email / mot de passe</span>
        <span className="text-xs font-bold" style={{ color: emailIdentity ? "#22c55e" : "var(--jam-text-faint)" }}>
          {emailIdentity ? "Connecté" : "Non connecté"}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-[var(--jam-surface-alt)] px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--jam-text)]">
          <DiscordIcon size={14} />
          Discord
        </span>
        <span className="text-xs font-bold" style={{ color: discordIdentity ? "#22c55e" : "var(--jam-text-faint)" }}>
          {discordIdentity ? "Connecté" : "Non connecté"}
        </span>
      </div>

      {!discordIdentity && (
        <button
          onClick={linkDiscord}
          disabled={linking}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5865F2] text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:cursor-default disabled:opacity-60"
        >
          <DiscordIcon size={16} />
          {linking ? "Redirection…" : "Connecter Discord"}
        </button>
      )}

      {discordIdentity && emailIdentity && (
        <button
          onClick={unlinkDiscord}
          disabled={unlinking}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--jam-btn-bg-soft)] text-sm font-bold text-[var(--jam-text-dim)] transition-colors hover:bg-[var(--jam-btn-bg-soft-hover)] disabled:cursor-default disabled:opacity-60"
        >
          {unlinking ? "Déconnexion…" : "Déconnecter Discord"}
        </button>
      )}
      {discordIdentity && !emailIdentity && (
        <p className="text-xs text-[var(--jam-text-faint)]">
          Ajoute d&apos;abord un email + mot de passe ci-dessous pour pouvoir déconnecter Discord sans te retrouver bloqué hors de ton compte.
        </p>
      )}

      {linkError && <span className="text-[13px] font-bold text-red-600">{linkError}</span>}

      {!emailIdentity && (
        <Link
          href="/login?mode=link-email"
          style={{ backgroundColor: RED, color: "#fff" }}
          className="flex h-10 cursor-pointer items-center justify-center rounded-xl text-sm font-bold transition-transform duration-150 hover:scale-[1.02] active:scale-95"
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
