"use client";

import { useEffect } from "react";

// Le bouton "Envoyer une demande de changement de mot de passe" du dashboard Supabase (par
// opposition au flux normal déclenché depuis /login) redirige vers le Site URL avec un fragment
// `#...&type=recovery` au lieu de passer par /auth/callback. On l'intercepte ici pour renvoyer
// vers la page de réinitialisation, fragment compris (le client Supabase y détectera la session).
export function RecoveryRedirect() {
  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) {
      window.location.replace(`/auth/reset-password${window.location.hash}`);
    }
  }, []);

  return null;
}
