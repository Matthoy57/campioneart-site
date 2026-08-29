import type { Metadata } from "next";
import Link from "next/link";
import { FloatingEmoji } from "@/components/FloatingEmoji";
import { TrendUpIcon } from "@/components/icons";
import { archivo, mono, CREAM, LIME, TEXT_DIM, twoTone } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Mes formations - Matthieu Campione",
  robots: { index: false, follow: false },
};

// "Dashboard" devenu "Mes formations" (validé sur /test avant d'être promu ici, voir la
// conversation) : le point d'entrée de la partie connectée montre directement ce qu'on a acheté,
// pas un accueil générique. Une seule formation en dur pour l'instant (pas de vrai système
// d'achat/progression côté backend) — à brancher sur de vraies données une fois le paiement en
// place.
export default function DashboardPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex items-center gap-3">
          <FloatingEmoji emoji="🎓" animationName="float-formations" rotate={8} style={{ fontSize: 34 }} />
          <div>
            <h1 style={{ ...archivo, fontSize: 28, color: CREAM, letterSpacing: "-0.02em", margin: 0 }}>MES FORMATIONS</h1>
            <p style={{ color: TEXT_DIM, fontSize: 14, marginTop: 2 }}>Reprends là où tu en étais.</p>
          </div>
        </div>

        {/* Fond pensé pour recevoir une vraie image de couverture (placeholder pour l'instant) —
            dégradé sombre en bas pour garder le texte lisible quelle que soit l'image. */}
        <div style={{ position: "relative", overflow: "hidden", background: "#1c1c19", color: CREAM, border: "3px solid #111110", boxShadow: `6px 6px 0 ${LIME}`, borderRadius: 20, minHeight: 220 }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ color: "rgba(245,242,234,0.25)" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span style={{ ...mono, fontSize: 10, letterSpacing: "0.1em" }} className="uppercase">
              Image / logo à venir
            </span>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(17,17,16,0.85) 85%)" }} />

          <div style={{ position: "relative", padding: 24, paddingTop: 130 }}>
            <p style={{ ...archivo, fontSize: 22, margin: "0 0 12px" }}>Game Art Low Poly</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, maxWidth: 260 }}>
              <div style={{ flex: 1, height: 8, borderRadius: 999, background: "rgba(245,242,234,0.15)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "28%", background: LIME }} />
              </div>
              <span style={{ ...archivo, fontSize: 12 }}>2/7</span>
            </div>
            {/* Même bouton que "Découvrir la formation" sur la homepage (deux-tons LIME/crème). */}
            <Link
              href="/dashboard/game-art-low-poly"
              className="two-tone-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                ...twoTone(LIME, CREAM),
                color: "#111110",
                border: "2px solid #111110",
                borderRadius: 10,
                padding: "12px 18px",
                ...archivo,
                fontSize: 13,
              }}
            >
              <TrendUpIcon size={15} />
              CONTINUER
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
