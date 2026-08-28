import type { Metadata } from "next";
import { GeneratorSections } from "@/components/GeneratorSections";
import { genres } from "@/content/genres";
import { styleAesthetics, styleContext } from "@/content/styles";
import { themeConcepts } from "@/content/themeConcepts";
import { archivo, BG, GOLD, EMOJI_HALO, GridBackdrop } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Générateur - Matthieu Campione",
  robots: { index: false, follow: false },
};

export default function GameJamPage() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-10" style={{ background: BG }}>
      <GridBackdrop />
      {/* En-tête "tuile bento" (même traitement que dashboard/roadmap) au-dessus du générateur, qui
          reprend maintenant lui aussi la nouvelle D.A. (cartes crème + accent doré) au lieu de
          l'ancien thème --jam-* qui n'avait plus de scope depuis la refonte de JamShell — le
          générateur lui-même (état/logique, appels Supabase) reste intact. */}
      <div className="relative" style={{ overflow: "hidden", width: "100%", maxWidth: 480, background: GOLD, color: "#111110", borderRadius: 24, padding: "28px 26px", marginBottom: 32, minHeight: 150 }}>
        <span
          style={{
            ...archivo,
            fontSize: 11,
            letterSpacing: "0.06em",
            background: "#111110",
            color: GOLD,
            borderRadius: 999,
            padding: "6px 14px",
            display: "inline-block",
            transform: "rotate(-3deg)",
          }}
        >
          V1
        </span>
        <h1 style={{ ...archivo, fontSize: 30, margin: "14px 0 8px", letterSpacing: "-0.02em" }}>JAM</h1>
        <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, maxWidth: 220 }}>Générateur d&apos;idée de jeu trop cool.</p>
        <span aria-hidden className="hidden lg:block" style={{ position: "absolute", right: 4, bottom: -20, fontSize: 120, lineHeight: 1, filter: EMOJI_HALO, pointerEvents: "none" }}>
          🍯
        </span>
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
