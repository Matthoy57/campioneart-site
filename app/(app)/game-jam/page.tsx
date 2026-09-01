import type { Metadata } from "next";
import { GeneratorSections } from "@/components/GeneratorSections";
import { genres } from "@/content/genres";
import { styleAesthetics, styleContext } from "@/content/styles";
import { themeConcepts } from "@/content/themeConcepts";
import { FloatingEmoji } from "@/components/FloatingEmoji";
import { archivo, CREAM, GOLD, TEXT_DIM } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Générateur - Matthieu Campione",
  robots: { index: false, follow: false },
};

export default function GameJamPage() {
  return (
    <main className="flex flex-col items-center px-6 py-10">
      {/* Plus de background/GridBackdrop propres à cette page : PersonaShell (le layout parent)
          les fournit maintenant pour toute la partie connectée, avoir les deux ici doublait la
          texture de grille. En-tête aligné sur la structure emoji + h1 + sous-titre partagée par
          /dashboard et /settings (c'était jusque-là une carte "bento" isolée, incohérente avec le
          reste de la partie connectée) ; le générateur lui-même (état/logique, appels Supabase)
          reste intact. */}
      <div className="flex items-center gap-3" style={{ width: "100%", maxWidth: 480, marginBottom: 32 }}>
        <FloatingEmoji emoji="🍯" animationName="float-jam" rotate={-8} style={{ fontSize: 34 }} />
        <div>
          <div className="flex items-center gap-2">
            <h1 style={{ ...archivo, fontSize: 28, color: CREAM, letterSpacing: "-0.02em", margin: 0 }}>JAM</h1>
            <span
              style={{
                ...archivo,
                fontSize: 10,
                letterSpacing: "0.06em",
                background: "#111110",
                color: GOLD,
                borderRadius: 999,
                padding: "4px 10px",
                display: "inline-block",
                transform: "rotate(-3deg)",
              }}
            >
              V1
            </span>
          </div>
          <p style={{ color: TEXT_DIM, fontSize: 14, marginTop: 2 }}>Générateur d&apos;idée de jeu trop cool.</p>
        </div>
      </div>
      {/* "relative" ici est nécessaire, pas juste cosmétique : sans ça cet élément est
          non-positionné, et un non-positionné se peint TOUJOURS avant les éléments positionnés
          (dont GridBackdrop) quel que soit l'ordre dans le DOM — la grille passait donc par-dessus
          le générateur malgré son <GridBackdrop/> placé avant dans le code. */}
      <div className="relative w-full flex flex-col items-center">
        <GeneratorSections genres={genres} styleAesthetics={styleAesthetics} styleContext={styleContext} themeConcepts={themeConcepts} />
      </div>
    </main>
  );
}
