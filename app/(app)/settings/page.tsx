import type { Metadata } from "next";
import { PseudoSettings } from "@/components/PseudoSettings";
import { AccountLinking } from "@/components/AccountLinking";

export const metadata: Metadata = {
  title: "Paramètres - Matthieu Campione",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  // "jam-root" restaure le thème clair d'origine (variables --jam-*) dont PseudoSettings et
  // AccountLinking dépendent encore : la refonte de JamShell a retiré cette classe de la coquille
  // commune (elle posait le nouveau thème sombre à la place), ce qui les laissait sans variables du
  // tout. Cette page reste volontairement hors du périmètre de la refonte visuelle pour l'instant.
  return (
    <main className="jam-root flex flex-1 flex-col items-center justify-center gap-6 bg-[var(--jam-bg)] px-6 py-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <span className="text-5xl">⚙️</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--jam-text)] sm:text-4xl">Paramètres</h1>
        <p className="text-sm leading-relaxed text-[var(--jam-text-dim)]">Ici, tu pourras gérer ton compte et tes préférences.</p>
      </div>

      <PseudoSettings />
      <AccountLinking />
    </main>
  );
}
