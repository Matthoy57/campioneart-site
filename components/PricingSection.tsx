import Link from "next/link";
import { TrendUpIcon } from "./icons";
import { archivo, twoTone, GridBackdrop, BG, CREAM, LIME, WHITE, GREEN, BLUE, ORANGE, TEXT_MUTED, OUTLINE_GRAY } from "./platformTheme";

// Un même outil affiché sur les deux plans, avec sa limite gratuite vs sans-limite payante — plus
// parlant qu'une liste de coches génériques, et ça relie visuellement le pricing à la grille
// d'outils au-dessus (mêmes pictos, mêmes couleurs).
const PRICING_FEATURES = [
  { icon: "🍯", tool: "JAM", accent: LIME, free: "2 générations / semaine", paid: "Illimité" },
  { icon: "🗺️", tool: "ROADMAP", accent: GREEN, free: "3 premières étapes", paid: "12 étapes, en entier" },
  { icon: "🗝️", tool: "GUIDES", accent: BLUE, free: "Ceux liés aux étapes débloquées", paid: "40+ guides, tous débloqués" },
  { icon: "🛠️", tool: "BREAKDOWN", accent: ORANGE, free: "1 analyse complète", paid: "Toutes les analyses" },
];

function PriceFeatureRow({ icon, tool, detail, accent, muted }: { icon: string; tool: string; detail: string; accent: string; muted?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        aria-hidden
        style={{
          flex: "none",
          width: 36,
          height: 36,
          borderRadius: 10,
          border: "2px solid #111110",
          background: muted ? "#DAD6C6" : accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}
      >
        {icon}
      </span>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
        <span style={{ ...archivo, fontSize: 12, letterSpacing: "0.02em" }}>{tool}</span>
        <span style={{ fontSize: 13, color: muted ? "#6E6B62" : "#111110" }}>{detail}</span>
      </div>
    </div>
  );
}

// Pricing : gratuit "teaser" (toute la plateforme, tout limité) vs illimité — pas de paliers à
// deviner, pas de fonctionnalités verrouillées en dur derrière le gratuit.
export function PricingSection() {
  return (
    <section id="prix" style={{ position: "relative", background: BG, padding: "90px 24px 100px" }}>
      <GridBackdrop />
      <div style={{ position: "relative", maxWidth: 1300, margin: "0 auto" }}>
        <p style={{ ...archivo, fontSize: "clamp(28px, 3.4vw, 40px)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 12px", color: CREAM }}>
          UN PRIX, PAS DE PALIERS À DEVINER
        </p>
        <p style={{ maxWidth: 560, margin: "0 0 44px", lineHeight: 1.55, color: TEXT_MUTED }}>
          Le gratuit donne accès à toute la plateforme, en aperçu — pas à une moitié d&apos;outils verrouillés.
        </p>

        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 24 }}>
          {/* Gratuit */}
          <div style={{ borderRadius: 24, border: "2px solid #111110", background: CREAM, color: "#111110", padding: 32, boxShadow: `7px 7px 0 ${OUTLINE_GRAY}` }}>
            <p style={{ ...archivo, fontSize: 13, letterSpacing: "0.02em", margin: "0 0 6px", color: "#6E6B62" }}>GRATUIT</p>
            <p style={{ ...archivo, fontSize: 40, margin: "0 0 4px" }}>0€</p>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6E6B62" }}>Toute la plateforme, en aperçu</p>
            <div style={{ display: "grid", gap: 16, marginBottom: 28 }}>
              {PRICING_FEATURES.map((f) => (
                <PriceFeatureRow key={f.tool} icon={f.icon} tool={f.tool} detail={f.free} accent={f.accent} muted />
              ))}
            </div>
            <Link
              href="/login"
              className="two-tone-btn"
              style={{
                display: "inline-block",
                ...twoTone(WHITE, "#111110", "4px 4px 0", "#111110", WHITE),
                border: "2px solid #111110",
                borderRadius: 10,
                padding: "13px 20px",
                ...archivo,
                fontSize: 14,
              }}
            >
              COMMENCER GRATUITEMENT
            </Link>
          </div>

          {/* Illimité */}
          <div style={{ position: "relative", borderRadius: 24, border: "2px solid #111110", background: LIME, color: "#111110", padding: 32, boxShadow: `7px 7px 0 ${CREAM}` }}>
            <span
              style={{
                position: "absolute",
                top: -16,
                right: 24,
                transform: "rotate(4deg)",
                background: "#111110",
                color: LIME,
                border: "2px solid #111110",
                borderRadius: 8,
                padding: "6px 12px",
                ...archivo,
                fontSize: 12,
              }}
            >
              RECOMMANDÉ
            </span>
            <p style={{ ...archivo, fontSize: 13, letterSpacing: "0.02em", margin: "0 0 6px" }}>ILLIMITÉ</p>
            <p style={{ ...archivo, fontSize: 40, margin: "0 0 4px" }}>
              20€<span style={{ fontSize: 16 }}>/mois</span>
            </p>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#33320f" }}>Tout, sans limite</p>
            <div style={{ display: "grid", gap: 16, marginBottom: 28 }}>
              {PRICING_FEATURES.map((f) => (
                <PriceFeatureRow key={f.tool} icon={f.icon} tool={f.tool} detail={f.paid} accent={f.accent} />
              ))}
            </div>
            <Link
              href="/checkout"
              className="two-tone-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                ...twoTone("#111110", CREAM, "4px 4px 0", LIME, "#111110"),
                border: "2px solid #111110",
                borderRadius: 10,
                padding: "13px 20px",
                ...archivo,
                fontSize: 14,
              }}
            >
              <TrendUpIcon size={16} />
              Rejoins pour 20€/mois
            </Link>
            <p style={{ margin: "14px 0 0", fontSize: 12, color: "#33320f" }}>Sans engagement. Remboursé sous 14 jours si ça ne te convainc pas.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
