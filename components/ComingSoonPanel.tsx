import { archivo, WHITE, TEXT_MUTED, EMOJI_HALO } from "./platformTheme";

// Reprend le langage visuel des tuiles décoratives de ToolsGrid sur la homepage (aplat de couleur
// pleine, emoji géant en halo, étiquette penchée) plutôt qu'un simple icône + texte centré — pour
// que "bientôt" ait la même énergie que le reste du site au lieu de sembler à part.
export function ComingSoonPanel({
  icon,
  title,
  description,
  accent,
  badge = "BIENTÔT",
}: {
  icon: string;
  title: string;
  description: string;
  accent: string;
  badge?: string;
}) {
  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div style={{ position: "relative", background: accent, color: WHITE, borderRadius: 24, padding: "36px 30px", minHeight: 260, overflow: "hidden" }}>
          <span
            style={{
              ...archivo,
              fontSize: 11,
              letterSpacing: "0.06em",
              background: WHITE,
              color: "#111110",
              borderRadius: 999,
              padding: "6px 14px",
              display: "inline-block",
              transform: "rotate(-3deg)",
            }}
          >
            {badge}
          </span>
          <h1 style={{ ...archivo, fontSize: 36, margin: "16px 0 0", letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: 300 }}>{title}</h1>
          <span aria-hidden style={{ position: "absolute", right: 4, bottom: -16, fontSize: 150, lineHeight: 1, filter: EMOJI_HALO, pointerEvents: "none" }}>
            {icon}
          </span>
        </div>
        <p style={{ color: TEXT_MUTED, fontSize: 14, lineHeight: 1.7, padding: "0 4px" }}>{description}</p>
      </div>
    </main>
  );
}
