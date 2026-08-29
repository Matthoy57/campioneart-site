import type { Metadata } from "next";
import { AccountLinking } from "@/components/AccountLinking";
import { FloatingEmoji } from "@/components/FloatingEmoji";
import { archivo, CREAM, TEXT_DIM } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Paramètres - Matthieu Campione",
  robots: { index: false, follow: false },
};

// Reprend la structure de /dashboard (titre + emoji flottant, cartes neo-brutalistes) : la page
// utilisait encore l'ancien thème clair "jam-root" hérité de JamShell, complètement déconnecté de
// la D.A sombre du reste de la partie connectée.
export default function SettingsPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex items-center gap-3">
          <FloatingEmoji emoji="⚙️" animationName="float-settings" rotate={-8} style={{ fontSize: 34 }} />
          <div>
            <h1 style={{ ...archivo, fontSize: 28, color: CREAM, letterSpacing: "-0.02em", margin: 0 }}>PARAMÈTRES</h1>
            <p style={{ color: TEXT_DIM, fontSize: 14, marginTop: 2 }}>Gère ton compte et tes préférences.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <AccountLinking />
        </div>
      </div>
    </main>
  );
}
