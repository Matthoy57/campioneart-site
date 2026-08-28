import type { Metadata } from "next";
import Link from "next/link";
import { archivo, WHITE, CREAM, LIME, GOLD, BLUE, ORANGE, TEXT_DIM, GridBackdrop, EMOJI_HALO } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Accueil - Matthieu Campione",
  robots: { index: false, follow: false },
};

const SHORTCUTS = [
  { href: "/game-jam", label: "JAM", icon: "🍯", bg: GOLD, text: "#111110" },
  { href: "/skill-vault", label: "Guides", icon: "🗝️", bg: BLUE, text: WHITE },
  { href: "/mechanic-breakdown", label: "Breakdown", icon: "🛠️", bg: ORANGE, text: WHITE },
];

export default function DashboardPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-6 py-10">
      <GridBackdrop />
      <div className="relative mx-auto flex max-w-2xl flex-col gap-8">
        <div>
          <span aria-hidden style={{ fontSize: 40 }}>🐦‍🔥</span>
          <h1 style={{ ...archivo, fontSize: 32, color: CREAM, letterSpacing: "-0.02em", margin: "8px 0 0" }}>SALUT !</h1>
          <p style={{ color: TEXT_DIM, fontSize: 14, marginTop: 6 }}>C&apos;est ici que tu retrouveras où tu en es. Pour l&apos;instant, direction la roadmap.</p>
        </div>

        {/* La roadmap est l'outil central de la plateforme : le dashboard renvoie vers elle en
            priorité plutôt que de dupliquer une vue de progression ici. Traitement "tuile bento"
            (aplat plein, étiquette penchée, emoji géant en halo) repris de ToolsGrid sur la
            homepage, plutôt qu'une carte plate — pour garder la même énergie que le reste du site. */}
        <Link href="/roadmap" style={{ position: "relative", display: "block", overflow: "hidden", background: LIME, color: "#111110", borderRadius: 24, padding: "28px 26px", minHeight: 180 }}>
          <span
            style={{
              ...archivo,
              fontSize: 11,
              letterSpacing: "0.06em",
              background: "#111110",
              color: LIME,
              borderRadius: 999,
              padding: "6px 14px",
              display: "inline-block",
              transform: "rotate(-3deg)",
            }}
          >
            🗺️ OUTIL PHARE
          </span>
          <p style={{ ...archivo, fontSize: 26, margin: "14px 0 10px", letterSpacing: "-0.02em", maxWidth: 240 }}>Reprends ta roadmap</p>
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, maxWidth: 230 }}>Continue ton parcours étape par étape, avec les guides et breakdowns qui vont avec.</p>
          {/* Masqué sous lg : en dessous, le texte occupe une part trop large de la carte pour
              laisser un coin dégagé à l'emoji géant (chevauchement mesuré jusqu'à ~900px). */}
          <span aria-hidden className="hidden lg:block" style={{ position: "absolute", right: 0, bottom: -18, fontSize: 130, lineHeight: 1, filter: EMOJI_HALO, pointerEvents: "none" }}>
            🗺️
          </span>
        </Link>

        <div>
          <p style={{ ...archivo, fontSize: 11, letterSpacing: "0.06em", color: TEXT_DIM, margin: "0 0 10px" }}>ACCÈS RAPIDE</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SHORTCUTS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 18,
                  borderRadius: 20,
                  padding: "18px 18px 16px",
                  minHeight: 108,
                  background: item.bg,
                  color: item.text,
                }}
              >
                <span aria-hidden style={{ fontSize: 30, lineHeight: 1 }}>
                  {item.icon}
                </span>
                <span style={{ ...archivo, fontSize: 15 }}>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
