"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CloseIcon } from "./icons";

// Notification globale et discrète : n'importe quelle redirection d'auth ratée (lien Discord déjà
// utilisé, callback OAuth en échec...) ajoute juste "?authError=1" à l'URL de destination. Pas
// besoin de distinguer d'où ça vient (JAM, settings...) : ce composant, monté une fois dans le
// layout racine, l'affiche partout puis nettoie l'URL.
//
// Le nettoyage passe par l'API navigateur brute (history.replaceState) et non par router.replace() :
// ça évite tout aller-retour avec le routeur Next (source du bug où revenir sur /settings faisait
// réapparaître la popup, le paramètre n'étant pas toujours retiré à temps).
function AuthErrorToastInner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const shownForRef = useRef<string | null>(null);

  useEffect(() => {
    if (searchParams.get("authError") !== "1") return;
    // Ne montre la popup qu'une seule fois par URL rencontrée, même si l'effet est relancé.
    const key = window.location.pathname + window.location.search;
    if (shownForRef.current === key) return;
    shownForRef.current = key;

    setVisible(true);

    const url = new URL(window.location.href);
    url.searchParams.delete("authError");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (!visible) return null;

  return (
    // Position figée en dur (inline style) pour qu'aucune classe/contexte de la page en dessous
    // (transform, largeur, colonnes...) ne puisse la décaler : toujours en bas à droite du viewport.
    <div
      style={{ position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 100 }}
      className="flex items-center gap-2 rounded-xl border border-red-600/30 bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-lg"
    >
      Connexion échouée
      <button
        onClick={() => setVisible(false)}
        aria-label="Fermer"
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-red-600/70 transition-colors hover:bg-red-600/10 hover:text-red-600"
      >
        <CloseIcon size={12} />
      </button>
    </div>
  );
}

export function AuthErrorToast() {
  return (
    <Suspense fallback={null}>
      <AuthErrorToastInner />
    </Suspense>
  );
}
