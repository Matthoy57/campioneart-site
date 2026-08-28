"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EyeIcon, EyeOffIcon, DiscordIcon } from "@/components/icons";

const RED = "#FF0000";

function PasswordInput({ value, onChange, autoFocus }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--jam-border)] bg-[var(--jam-surface-alt)] px-3.5 py-2.5 pr-10 text-sm text-[var(--jam-text)] focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center text-[var(--jam-text-faint)] transition-colors hover:text-[var(--jam-text-dim)]"
      >
        {visible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  // Arrivée depuis /settings → "Ajouter un email + mot de passe" sur un compte Discord-only : même
  // formulaire que "Créer un compte", mais on attache les identifiants au compte déjà connecté
  // (updateUser) plutôt que d'en créer un nouveau (signUp).
  const linkAccount = searchParams.get("mode") === "link-email";

  const [mode, setMode] = useState<"signin" | "signup">(linkAccount ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(searchParams.get("reset") === "success" ? "Mot de passe changé. Connecte-toi avec ton nouveau mot de passe." : "");
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  function switchMode(newMode: "signin" | "signup") {
    setMode(newMode);
    setError("");
    setPassword("");
    setPasswordConfirm("");
  }

  async function onDiscordLogin() {
    setOauthLoading(true);
    setError("");
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (oauthError) {
      setError("Connexion Discord impossible. Réessaie plus tard.");
      setOauthLoading(false);
    }
    // Sinon : redirection immédiate vers Discord, pas besoin de setOauthLoading(false) ici.
  }

  async function onForgotPassword() {
    if (!email) {
      setError("Renseigne ton email d'abord, puis clique sur \"Mot de passe oublié ?\".");
      return;
    }
    setForgotSubmitting(true);
    setError("");
    setInfo("");
    const supabase = createClient();
    // Repasse par /auth/callback (même mécanisme que le login Discord) pour que la session de
    // réinitialisation soit posée correctement en cookie avant d'arriver sur /auth/reset-password.
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`,
    });
    setForgotSubmitting(false);
    if (resetError) {
      // Le message Supabase exact aide à diagnostiquer (rate limit, redirect non autorisée…)
      // plutôt qu'un message générique qui masque la vraie cause.
      setError(`Impossible d'envoyer le lien : ${resetError.message}`);
      return;
    }
    setInfo("Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "signup" && password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    setError("");
    setInfo("");
    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          // "Invalid login credentials" reste traduit simplement ; tout autre cas (compte
          // désactivé, etc.) affiche le message Supabase exact plutôt qu'un générique qui
          // masquerait la vraie cause.
          setError(
            signInError.message.toLowerCase().includes("invalid login credentials")
              ? "Email ou mot de passe incorrect."
              : `Connexion refusée : ${signInError.message}`
          );
          return;
        }
        router.push(next);
        router.refresh();
      } else if (linkAccount) {
        const redirectOptions = { emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent("/settings")}` };
        const { error: linkError } = await supabase.auth.updateUser({ email, password }, redirectOptions);
        if (linkError) {
          // Supabase applique le mot de passe tout de suite mais garde l'email "en attente" de
          // confirmation : un essai précédent avec ce même mot de passe (même si le lien de
          // confirmation reçu à ce moment-là ne fonctionnait pas encore, ou si l'écran affichait une
          // erreur, ex. rate limit sur l'email) l'a déjà enregistré sur le compte. Retenter avec le
          // même mot de passe échoue alors ici — mais le mot de passe est déjà bon, il ne manque que
          // l'email confirmé : on redemande juste l'envoi du lien, sans repasser par le mot de passe.
          if (linkError.message.toLowerCase().includes("different from the old password")) {
            const { error: resendError } = await supabase.auth.updateUser({ email }, redirectOptions);
            if (resendError) {
              setError(resendError.message);
              return;
            }
            setInfo("Ce mot de passe était déjà enregistré : un nouveau lien de confirmation vient d'être envoyé à cette adresse.");
            return;
          }
          setError(linkError.message);
          return;
        }
        setInfo("Vérifie ta boîte mail pour confirmer cette adresse, tu pourras ensuite te connecter avec cet email en plus de Discord.");
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent("/login")}` },
        });
        if (signUpError) {
          setError(
            signUpError.message.toLowerCase().includes("already registered")
              ? "Impossible de créer un compte avec ces identifiants."
              : signUpError.message
          );
          return;
        }
        // Astuce Supabase : pour ne pas révéler qu'un email existe déjà (anti-énumération), un
        // signUp sur un email déjà confirmé renvoie un succès avec un user "identities" vide, sans
        // envoyer de nouvel email. Sans cette détection, on affichait "va voir ta boîte mail" alors
        // que rien n'arrive jamais.
        if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
          setError("Impossible de créer un compte avec ces identifiants.");
          return;
        }
        setInfo("Compte créé. Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.");
        switchMode("signin");
      }
    } catch {
      setError("Erreur réseau. Réessaie plus tard.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="jam-root flex min-h-screen flex-col items-center justify-center bg-[var(--jam-bg)] px-6 font-[family-name:var(--font-hanken-grotesk)] text-[var(--jam-text)]">
      <Link href="/" className="brand-font mb-8 text-[15px] font-extrabold tracking-tight">
        Nom de la plateforme
      </Link>

      <div
        className="w-full max-w-sm rounded-2xl border border-[var(--jam-border)] bg-[var(--jam-surface)] p-6"
        style={{ boxShadow: "var(--jam-shadow)" }}
      >
        {linkAccount ? (
          <p className="mb-5 text-center text-sm font-bold text-[var(--jam-text)]">Ajouter un email à ton compte</p>
        ) : (
          <div className="mb-5 flex justify-center gap-1 rounded-2xl bg-[var(--jam-btn-bg-soft)] p-1">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 cursor-pointer rounded-xl py-2 text-sm font-bold transition-colors ${
                mode === "signin" ? "bg-[var(--jam-surface)] text-[var(--jam-text)] shadow-sm" : "text-[var(--jam-text-faint)]"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 cursor-pointer rounded-xl py-2 text-sm font-bold transition-colors ${
                mode === "signup" ? "bg-[var(--jam-surface)] text-[var(--jam-text)] shadow-sm" : "text-[var(--jam-text-faint)]"
              }`}
            >
              Créer un compte
            </button>
          </div>
        )}

        <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-[11px] font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">Email</label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-[var(--jam-border)] bg-[var(--jam-surface-alt)] px-3.5 py-2.5 text-sm text-[var(--jam-text)] focus:outline-none"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-[11px] font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">Mot de passe</label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  disabled={forgotSubmitting}
                  className="cursor-pointer text-[11px] font-semibold text-[var(--jam-text-faint)] hover:text-[var(--jam-text-dim)] disabled:cursor-default"
                >
                  {forgotSubmitting ? "Envoi…" : "Mot de passe oublié ?"}
                </button>
              )}
            </div>
            <PasswordInput
              value={password}
              onChange={(v) => {
                setPassword(v);
                setError("");
              }}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-[11px] font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">
                Confirmer le mot de passe
              </label>
              <PasswordInput
                value={passwordConfirm}
                onChange={(v) => {
                  setPasswordConfirm(v);
                  setError("");
                }}
              />
            </div>
          )}

          {error && <span className="block text-[13px] font-bold text-red-600">{error}</span>}
          {info && <span className="block text-[13px] font-bold text-green-600">{info}</span>}

          <button
            type="submit"
            style={{ backgroundColor: RED, color: "#fff" }}
            className="mt-1 flex h-10 cursor-pointer items-center justify-center rounded-xl text-sm font-bold transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100"
            disabled={submitting || !email || !password || (mode === "signup" && !passwordConfirm)}
          >
            {submitting ? "Vérification…" : linkAccount ? "Ajouter" : mode === "signin" ? "Entrer" : "Créer mon compte"}
          </button>
        </form>

        {linkAccount ? (
          <Link href="/settings" className="mt-4 block text-center text-[13px] font-semibold text-[var(--jam-text-faint)] hover:text-[var(--jam-text-dim)]">
            ← Retour aux paramètres
          </Link>
        ) : (
          <>
            <div className="my-4 flex items-center gap-3 text-[11px] font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">
              <span className="h-px flex-1 bg-[var(--jam-border)]" />
              ou
              <span className="h-px flex-1 bg-[var(--jam-border)]" />
            </div>

            <button
              type="button"
              onClick={onDiscordLogin}
              disabled={oauthLoading}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5865F2] text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:cursor-default disabled:opacity-60 disabled:hover:scale-100"
            >
              <DiscordIcon size={17} />
              Continuer avec Discord
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
