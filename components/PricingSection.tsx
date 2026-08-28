import Link from "next/link";
import { TrendUpIcon, CheckIcon } from "./icons";
import { archivo, mono, twoTone, GridBackdrop, BG, CREAM, LIME, GOLD, TEXT_MUTED, MONO_MUTED } from "./platformTheme";

// Reprend la structure des modules de CurriculumGrid, pas les anciens "outils plateforme" — l'offre
// est une formation unique en paiement unique (voir conversation), plus un abonnement à paliers.
const INCLUDES = [
  "Idéation, Modélisation, UV, Texturing, Rigging, Weight Painting, Animation — le pipeline complet",
  "Accès à vie, aucune récurrence",
  "Mises à jour du contenu incluses",
];

export function PricingSection() {
  return (
    <section id="prix" style={{ position: "relative", background: BG, padding: "90px 24px 100px" }}>
      <GridBackdrop />
      <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
        <p style={{ ...mono, fontSize: 12, letterSpacing: "0.15em", color: MONO_MUTED, margin: "0 0 10px" }} className="uppercase">
          LA FORMATION
        </p>
        <p style={{ ...archivo, fontSize: "clamp(28px, 3.4vw, 40px)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 44px", color: CREAM }}>
          UN PRIX, UNE FOIS. PAS D&apos;ABONNEMENT.
        </p>

        <div style={{ position: "relative", borderRadius: 24, border: "2px solid #111110", background: LIME, color: "#111110", padding: 32, boxShadow: `7px 7px 0 ${CREAM}` }}>
          <span
            style={{
              position: "absolute",
              top: -16,
              right: 24,
              transform: "rotate(4deg)",
              background: "#111110",
              color: GOLD,
              border: "2px solid #111110",
              borderRadius: 8,
              padding: "6px 12px",
              ...archivo,
              fontSize: 12,
            }}
          >
            PRIX DE LANCEMENT
          </span>
          <p style={{ ...archivo, fontSize: 20, letterSpacing: "-0.01em", margin: "0 0 6px" }}>Game Art Low Poly</p>
          <p style={{ ...archivo, fontSize: 40, margin: "0 0 4px" }}>
            79€ <span style={{ fontSize: 16, fontWeight: 400 }}>une fois</span>
          </p>
          <p style={{ margin: "0 0 24px", fontSize: 14, color: "#33320f" }}>Tarif réservé aux premières personnes inscrites.</p>

          <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
            {INCLUDES.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  aria-hidden
                  style={{ marginTop: 2, flex: "none", width: 20, height: 20, borderRadius: 999, border: "2px solid #111110", background: "#111110", color: LIME, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <CheckIcon size={10} strokeWidth={3.2} />
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.4 }}>{item}</span>
              </div>
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
            Rejoindre la formation
          </Link>
          <p style={{ margin: "14px 0 0", fontSize: 12, color: "#33320f" }}>Remboursé sous 14 jours si ça ne te convainc pas.</p>
        </div>

        <p style={{ margin: "24px 0 0", fontSize: 13, color: TEXT_MUTED, textAlign: "center" }}>
          Pas encore prêt à te lancer ? Commence par la{" "}
          <Link href="/roadmap" style={{ color: LIME, textDecoration: "underline" }}>
            roadmap gratuite
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
