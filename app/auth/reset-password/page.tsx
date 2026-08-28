"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

const RED = "#FF0000";

// Arrivée après un clic sur le lien "réinitialiser ton mot de passe" reçu par email : à ce stade
// /auth/callback a déjà échangé le code contre une session de récupération, donc updateUser()
// avec juste un nouveau mot de passe suffit (pas besoin de redemander l'ancien). On repart vers
// /login (pas vers un outil protégé) : cette session de récupération n'est pas forcément visible
// du middleware serveur au même instant, autant laisser l'utilisateur se reconnecter proprement
// avec son nouveau mot de passe plutôt que de risquer un aller-retour silencieux vers /login.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setSessionChecked(true);
    });
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError("Ce lien de réinitialisation n'est plus valide. Redemande-en un depuis la page de connexion.");
      return;
    }
    setDone(true);
    await supabase.auth.signOut();
    setTimeout(() => router.push("/login?reset=success"), 1500);
  }

  return (
    <div className="jam-root flex min-h-screen flex-col items-center justify-center bg-[var(--jam-bg)] px-6 font-[family-name:var(--font-hanken-grotesk)] text-[var(--jam-text)]">
      <Link href="/" className="brand-font mb-8 text-[15px] font-extrabold tracking-tight">
        Nom de la plateforme
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-[var(--jam-border)] bg-[var(--jam-surface)] p-6" style={{ boxShadow: "var(--jam-shadow)" }}>
        <h1 className="mb-4 text-lg font-bold">Nouveau mot de passe</h1>

        {!sessionChecked ? (
          <p className="text-sm text-[var(--jam-text-dim)]">Vérification du lien…</p>
        ) : !hasSession ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-red-600">
              Ce lien de réinitialisation n&apos;est plus valide ou a déjà été utilisé.
            </p>
            <Link
              href="/login"
              style={{ backgroundColor: RED, color: "#fff" }}
              className="flex h-10 items-center justify-center rounded-xl text-sm font-bold transition-transform duration-150 hover:scale-[1.02] active:scale-95"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : done ? (
          <p className="text-sm font-bold text-green-600">Mot de passe mis à jour. Redirection vers la connexion…</p>
        ) : (
          <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-[11px] font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
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
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">Confirmer</label>
              <input
                type={visible ? "text" : "password"}
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-[var(--jam-border)] bg-[var(--jam-surface-alt)] px-3.5 py-2.5 text-sm text-[var(--jam-text)] focus:outline-none"
              />
            </div>

            {error && <span className="block text-[13px] font-bold text-red-600">{error}</span>}

            <button
              type="submit"
              style={{ backgroundColor: RED, color: "#fff" }}
              className="mt-1 flex h-10 cursor-pointer items-center justify-center rounded-xl text-sm font-bold transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100"
              disabled={submitting || !password || !passwordConfirm}
            >
              {submitting ? "Mise à jour…" : "Changer le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
