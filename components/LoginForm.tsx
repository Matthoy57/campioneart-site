"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EyeIcon, EyeOffIcon, DiscordIcon } from "@/components/icons";
import { archivo, mono, BG, CREAM, LIME, TEXT_DIM, TEXT_FAINT, GridBackdrop, PlatformStyles, twoTone } from "@/components/platformTheme";

function PasswordInput({ value, onChange, autoFocus }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={visible ? "text" : "password"}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          borderRadius: 10,
          border: "2px solid #111110",
          background: "rgba(245,242,234,0.06)",
          padding: "10px 40px 10px 14px",
          fontSize: 14,
          color: CREAM,
          outline: "none",
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          display: "flex",
          height: 24,
          width: 24,
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          color: TEXT_FAINT,
          background: "none",
          border: "none",
        }}
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

  const labelStyle: React.CSSProperties = { ...mono, fontSize: 11, letterSpacing: "0.08em", color: TEXT_FAINT, marginBottom: 4, display: "block" };

  return (
    <div
      className="platform-theme"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: BG,
        color: CREAM,
        fontFamily: "var(--font-grotesk)",
        padding: "24px",
      }}
    >
      <PlatformStyles />
      <GridBackdrop />

      <Link href="/" style={{ position: "relative", ...archivo, fontSize: 15, color: CREAM, marginBottom: 28 }}>
        Nom de la plateforme
      </Link>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 380,
          borderRadius: 20,
          background: "#1c1c19",
          border: "3px solid #111110",
          boxShadow: `6px 6px 0 ${LIME}`,
          padding: 24,
        }}
      >
        {linkAccount ? (
          <p style={{ ...archivo, fontSize: 15, color: CREAM, textAlign: "center", marginBottom: 20 }}>Ajouter un email à ton compte</p>
        ) : (
          <div style={{ display: "flex", gap: 4, marginBottom: 20, borderRadius: 12, background: "rgba(245,242,234,0.06)", padding: 4 }}>
            <button
              type="button"
              onClick={() => switchMode("signin")}
              style={{
                flex: 1,
                cursor: "pointer",
                borderRadius: 9,
                padding: "9px 0",
                fontSize: 13,
                border: "none",
                ...archivo,
                background: mode === "signin" ? LIME : "transparent",
                color: mode === "signin" ? "#111110" : TEXT_FAINT,
              }}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              style={{
                flex: 1,
                cursor: "pointer",
                borderRadius: 9,
                padding: "9px 0",
                fontSize: 13,
                border: "none",
                ...archivo,
                background: mode === "signup" ? LIME : "transparent",
                color: mode === "signup" ? "#111110" : TEXT_FAINT,
              }}
            >
              Créer un compte
            </button>
          </div>
        )}

        <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
          <div>
            <label style={labelStyle} className="uppercase">
              Email
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                borderRadius: 10,
                border: "2px solid #111110",
                background: "rgba(245,242,234,0.06)",
                padding: "10px 14px",
                fontSize: 14,
                color: CREAM,
                outline: "none",
              }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }} className="uppercase">
                Mot de passe
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  disabled={forgotSubmitting}
                  style={{ cursor: "pointer", fontSize: 11, fontWeight: 700, color: TEXT_FAINT, background: "none", border: "none" }}
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
              <label style={labelStyle} className="uppercase">
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

          {error && <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#FF6B6B" }}>{error}</span>}
          {info && <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#22c55e" }}>{info}</span>}

          <button
            type="submit"
            className="two-tone-btn"
            style={{
              marginTop: 4,
              display: "flex",
              height: 42,
              cursor: submitting || !email || !password || (mode === "signup" && !passwordConfirm) ? "default" : "pointer",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "2px solid #111110",
              fontSize: 14,
              ...archivo,
              opacity: submitting || !email || !password || (mode === "signup" && !passwordConfirm) ? 0.4 : 1,
              ...twoTone(LIME, CREAM),
              color: "#111110",
            }}
            disabled={submitting || !email || !password || (mode === "signup" && !passwordConfirm)}
          >
            {submitting ? "Vérification…" : linkAccount ? "Ajouter" : mode === "signin" ? "Entrer" : "Créer mon compte"}
          </button>
        </form>

        {linkAccount ? (
          <Link href="/settings" style={{ marginTop: 16, display: "block", textAlign: "center", fontSize: 13, fontWeight: 600, color: TEXT_FAINT }}>
            ← Retour aux paramètres
          </Link>
        ) : (
          <>
            <div style={{ margin: "16px 0", display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: TEXT_FAINT }} className="uppercase">
              <span style={{ height: 1, flex: 1, background: "rgba(245,242,234,0.15)" }} />
              ou
              <span style={{ height: 1, flex: 1, background: "rgba(245,242,234,0.15)" }} />
            </div>

            <button
              type="button"
              onClick={onDiscordLogin}
              disabled={oauthLoading}
              style={{
                display: "flex",
                height: 42,
                width: "100%",
                cursor: oauthLoading ? "default" : "pointer",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 10,
                border: "none",
                background: "#5865F2",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                opacity: oauthLoading ? 0.6 : 1,
              }}
            >
              <DiscordIcon size={17} />
              Continuer avec Discord
            </button>
          </>
        )}
      </div>

      <p style={{ position: "relative", marginTop: 20, fontSize: 12, color: TEXT_DIM, textAlign: "center" }}>
        <span style={mono}>Aucun compte requis pour parcourir le site.</span>
      </p>
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
