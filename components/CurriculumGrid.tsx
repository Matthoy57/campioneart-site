import { archivo, mono, CREAM, WHITE, DARK_CARD, ORANGE, BLUE, GREEN, YELLOW, PINK, PURPLE, MONO_MUTED, EMOJI_HALO } from "./platformTheme";

// Grille bento reprise de l'ancienne ToolsGrid (même gabarit 12 colonnes, même langage visuel
// aplat de couleur + halo emoji), mais le contenu affiché est maintenant le programme réel de LA
// formation (Game Art Low Poly) plutôt qu'une liste d'outils de plateforme — l'offre a changé
// (voir conversation), pas juste le nom de la section.
const MODULES = [
  { key: "ideation", title: "Idéation", body: "Trouve ton concept et ta direction artistique avant de sculpter quoi que ce soit.", icon: "💡", accent: GREEN, span: 5 },
  { key: "modelisation", title: "Modélisation", body: "Bloque les formes en low poly, sans perdre de temps sur un détail inutile.", icon: "🔺", accent: ORANGE, span: 4 },
  { key: "uv", title: "UV", body: "Déplie proprement, pour une texture nette sans étirement.", icon: "🗺️", accent: BLUE, span: 3 },
  { key: "texturing", title: "Texturing.", icon: "🎨", accent: PINK, span: 3 },
  { key: "rigging", title: "Rigging.", icon: "🦴", accent: PURPLE, span: 3 },
  { key: "weight", title: "Weight Painting.", icon: "🖌️", accent: YELLOW, span: 3 },
  { key: "animation", title: "Animation.", icon: "🎬", accent: DARK_CARD, span: 3 },
] as const;

export function CurriculumGrid() {
  return (
    <section id="programme" style={{ background: CREAM, color: "#111110", padding: "90px 24px 96px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <p style={{ ...mono, fontSize: 12, letterSpacing: "0.15em", color: MONO_MUTED, margin: "0 0 10px" }} className="uppercase">
          LE PROGRAMME
        </p>
        <h2 style={{ ...archivo, fontSize: "clamp(28px, 3.4vw, 40px)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 28px", maxWidth: 640 }}>
          UN ASSET LOW POLY, DE L&apos;IDÉE AU JEU
        </h2>

        <div className="bento" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
          {MODULES.map((m) => (
            <div
              key={m.key}
              style={{
                gridColumn: `span ${m.span}`,
                background: m.accent,
                color: m.accent === YELLOW || m.accent === PINK ? "#111110" : WHITE,
                borderRadius: 20,
                padding: 24,
                minHeight: m.span >= 4 ? 268 : 196,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <h3 style={{ ...archivo, fontSize: m.span >= 4 ? 25 : "clamp(18px, 1.7vw, 22px)", lineHeight: 1.1, margin: 0, maxWidth: m.span >= 4 ? 340 : undefined, overflowWrap: "anywhere" }}>
                {m.title}
              </h3>
              {"body" in m && <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.5, maxWidth: 300 }}>{m.body}</p>}
              <span aria-hidden style={{ position: "absolute", right: 10, bottom: 4, fontSize: m.span >= 4 ? 90 : 118, lineHeight: 1, filter: EMOJI_HALO, pointerEvents: "none" }}>
                {m.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
