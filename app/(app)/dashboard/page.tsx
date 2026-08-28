import type { Metadata } from "next";
import Link from "next/link";
import { archivo, CREAM, GOLD, TEXT_DIM, GridBackdrop, EMOJI_HALO } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Accueil - Matthieu Campione",
  robots: { index: false, follow: false },
};

// Roadmap/Guides/Breakdown retirés (offre du site en cours de refonte, voir conversation) : ne
// reste que le générateur JAM, donc plus de "carte outil phare" ni de grille d'accès rapide à
// plusieurs outils — juste un point d'entrée simple vers ce qui existe réellement aujourd'hui.
export default function DashboardPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-6 py-10">
      <GridBackdrop />
      <div className="relative mx-auto flex max-w-2xl flex-col gap-8">
        <div>
          <span aria-hidden style={{ fontSize: 40 }}>🐦‍🔥</span>
          <h1 style={{ ...archivo, fontSize: 32, color: CREAM, letterSpacing: "-0.02em", margin: "8px 0 0" }}>SALUT !</h1>
          <p style={{ color: TEXT_DIM, fontSize: 14, marginTop: 6 }}>C&apos;est ici que tu retrouveras tes affaires, une fois qu&apos;il y en aura plus.</p>
        </div>

        <Link href="/game-jam" style={{ position: "relative", display: "block", overflow: "hidden", background: GOLD, color: "#111110", borderRadius: 24, padding: "28px 26px", minHeight: 170 }}>
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
          <p style={{ ...archivo, fontSize: 26, margin: "14px 0 10px", letterSpacing: "-0.02em", maxWidth: 240 }}>Générateur JAM</p>
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, maxWidth: 230 }}>Génère une idée de jeu complète : genre, style, thème.</p>
          <span aria-hidden className="hidden lg:block" style={{ position: "absolute", right: 4, bottom: -20, fontSize: 120, lineHeight: 1, filter: EMOJI_HALO, pointerEvents: "none" }}>
            🍯
          </span>
        </Link>
      </div>
    </main>
  );
}
