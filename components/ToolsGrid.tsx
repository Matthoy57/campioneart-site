import { archivo, mono, CREAM, LIME, WHITE, DARK_CARD, ORANGE, BLUE, GREEN, YELLOW, PINK, PURPLE, RED_PINK, GOLD, MONO_MUTED } from "./platformTheme";

// Grille bento 12 colonnes, reprise de l'exploration "/test-visuel" : 4 tuiles réelles (nos vrais
// outils) + 3 tuiles décoratives, pour un rendu riche façon page de vente plutôt qu'une liste plate
// de features.
export function ToolsGrid() {
  return (
    <section id="outils" style={{ background: CREAM, color: "#111110", padding: "90px 24px 96px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <h2 style={{ ...archivo, fontSize: "clamp(28px, 3.4vw, 40px)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 28px", maxWidth: 640 }}>
          CE QUE TU TROUVES DANS LA PLATEFORME
        </h2>

        <div className="bento" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
          {/* BREAKDOWN */}
          <div style={{ gridColumn: "span 5", background: ORANGE, color: WHITE, borderRadius: 20, padding: 24, minHeight: 268, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <h3 style={{ ...archivo, fontSize: 25, lineHeight: 1.1, margin: 0, maxWidth: 340 }}>Des dizaines de breakdowns de mécaniques complexes</h3>
            <div style={{ marginTop: "auto", position: "relative", height: 120 }}>
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  bottom: 10,
                  width: "76%",
                  background: DARK_CARD,
                  border: "4px solid #FFFFFF",
                  borderRadius: 14,
                  padding: "12px 14px",
                  ...mono,
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: "#E8E6DE",
                  transform: "rotate(-3deg)",
                }}
              >
                <div style={{ color: "#9A968C" }}>{"// dash annulable"}</div>
                <div>
                  <span style={{ color: GOLD }}>if</span> (dashTimer &gt; 0) {"{"}
                </div>
                <div style={{ paddingLeft: 12 }}>vel = dir * DASH;</div>
              </div>
              <div style={{ position: "absolute", right: 0, bottom: 46, background: GOLD, color: DARK_CARD, border: "4px solid #FFFFFF", borderRadius: 12, padding: "7px 12px", ...archivo, fontSize: 13, transform: "rotate(5deg)" }}>
                Wall-jump
              </div>
            </div>
          </div>

          {/* GUIDES */}
          <div style={{ gridColumn: "span 4", background: BLUE, color: WHITE, borderRadius: 20, padding: 24, minHeight: 268, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <h3 style={{ ...archivo, fontSize: 25, lineHeight: 1.1, margin: 0, maxWidth: 280 }}>Des centaines de guides pour apprendre</h3>
            <div style={{ marginTop: "auto", position: "relative", height: 128 }}>
              <div style={{ position: "absolute", left: 24, bottom: 32, width: "76%", height: 70, background: "#CFE4FF", border: "4px solid #FFFFFF", borderRadius: 14, transform: "rotate(-5deg)" }} />
              <div style={{ position: "absolute", left: 8, bottom: 12, width: "78%", background: WHITE, color: DARK_CARD, border: "4px solid #FFFFFF", borderRadius: 14, padding: "12px 14px", transform: "rotate(2deg)" }}>
                <div style={{ ...archivo, fontSize: 15, lineHeight: 1.2 }}>Faire une caméra 2D agréable</div>
                <div style={{ ...mono, fontSize: 10, textTransform: "uppercase", color: MONO_MUTED, marginTop: 5 }}>Guide · 8 min</div>
              </div>
            </div>
          </div>

          {/* ROADMAP */}
          <div style={{ gridColumn: "span 3", background: GREEN, color: WHITE, borderRadius: 20, padding: 24, minHeight: 268, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <h3 style={{ ...archivo, fontSize: 25, lineHeight: 1.1, margin: 0 }}>Une roadmap complète pour commencer de zéro</h3>
            <div style={{ marginTop: "auto", display: "grid", gap: 8 }}>
              <div style={{ borderRadius: 10, padding: "9px 12px", ...archivo, fontSize: 14, background: WHITE, color: DARK_CARD }}>Bases</div>
              <div style={{ borderRadius: 10, padding: "9px 12px", ...archivo, fontSize: 14, background: WHITE, color: DARK_CARD }}>Boucle de jeu</div>
              <div style={{ borderRadius: 10, padding: "9px 12px", ...archivo, fontSize: 14, background: "rgba(255,255,255,0.24)", color: WHITE }}>Level design</div>
              <div style={{ borderRadius: 10, padding: "9px 12px", ...archivo, fontSize: 14, background: "rgba(255,255,255,0.24)", color: WHITE }}>Publier</div>
            </div>
          </div>

          {/* Programmation (déco) */}
          <div style={{ gridColumn: "span 3", background: YELLOW, color: DARK_CARD, borderRadius: 20, padding: 22, minHeight: 196, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <h3 style={{ ...archivo, fontSize: "clamp(18px, 1.7vw, 22px)", margin: 0, lineHeight: 1.1, overflowWrap: "anywhere" }}>Programmation.</h3>
            <span
              aria-hidden
              style={{
                position: "absolute",
                right: 10,
                bottom: 4,
                fontSize: 118,
                lineHeight: 1,
                filter: "drop-shadow(0 0 1px #111110) drop-shadow(0 0 1px #111110) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 12px 0 rgba(0,0,0,0.32))",
              }}
            >
              💻
            </span>
          </div>

          {/* Game Art (déco) */}
          <div style={{ gridColumn: "span 3", background: PINK, color: DARK_CARD, borderRadius: 20, padding: 22, minHeight: 196, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <h3 style={{ ...archivo, fontSize: "clamp(18px, 1.7vw, 22px)", margin: 0, lineHeight: 1.1, overflowWrap: "anywhere" }}>Game Art.</h3>
            <span
              aria-hidden
              style={{
                position: "absolute",
                right: 10,
                bottom: 4,
                fontSize: 118,
                lineHeight: 1,
                filter: "drop-shadow(0 0 1px #111110) drop-shadow(0 0 1px #111110) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 12px 0 rgba(0,0,0,0.32))",
              }}
            >
              🎨
            </span>
          </div>

          {/* Game Design (déco) */}
          <div style={{ gridColumn: "span 3", background: PURPLE, color: WHITE, borderRadius: 20, padding: 22, minHeight: 196, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <h3 style={{ ...archivo, fontSize: "clamp(18px, 1.7vw, 22px)", margin: 0, lineHeight: 1.1, overflowWrap: "anywhere" }}>Game Design.</h3>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <svg viewBox="0 0 220 210" style={{ position: "absolute", right: -14, bottom: -18, width: 196, height: "auto", overflow: "visible", transform: "rotate(-7deg)" }} aria-hidden="true">
              <g transform="translate(9 13)">
                <path
                  d="M62 6 h44 a14 14 0 0 1 14 14 v42 h42 a14 14 0 0 1 14 14 v44 a14 14 0 0 1 -14 14 h-42 v42 a14 14 0 0 1 -14 14 h-44 a14 14 0 0 1 -14 -14 v-42 h-42 a14 14 0 0 1 -14 -14 v-44 a14 14 0 0 1 14 -14 h42 v-42 a14 14 0 0 1 14 -14 z"
                  fill="#101014"
                  opacity="0.34"
                />
                <circle cx="176" cy="150" r="30" fill="#101014" opacity="0.34" />
              </g>
              <g>
                <path
                  d="M62 6 h44 a14 14 0 0 1 14 14 v42 h42 a14 14 0 0 1 14 14 v44 a14 14 0 0 1 -14 14 h-42 v42 a14 14 0 0 1 -14 14 h-44 a14 14 0 0 1 -14 -14 v-42 h-42 a14 14 0 0 1 -14 -14 v-44 a14 14 0 0 1 14 -14 h42 v-42 a14 14 0 0 1 14 -14 z"
                  fill={GOLD}
                  stroke="#FFFFFF"
                  strokeWidth="26"
                  strokeLinejoin="round"
                />
                <path
                  d="M62 6 h44 a14 14 0 0 1 14 14 v42 h42 a14 14 0 0 1 14 14 v44 a14 14 0 0 1 -14 14 h-42 v42 a14 14 0 0 1 -14 14 h-44 a14 14 0 0 1 -14 -14 v-42 h-42 a14 14 0 0 1 -14 -14 v-44 a14 14 0 0 1 14 -14 h42 v-42 a14 14 0 0 1 14 -14 z"
                  fill={GOLD}
                  stroke="#101014"
                  strokeWidth="9"
                  strokeLinejoin="round"
                />
                <circle cx="176" cy="150" r="30" fill={RED_PINK} stroke="#FFFFFF" strokeWidth="24" />
                <circle cx="176" cy="150" r="30" fill={RED_PINK} stroke="#101014" strokeWidth="9" />
              </g>
            </svg>
          </div>

          {/* Sound Design (déco) */}
          <div style={{ gridColumn: "span 3", background: DARK_CARD, color: WHITE, borderRadius: 20, padding: 22, minHeight: 196, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <h3 style={{ ...archivo, fontSize: "clamp(18px, 1.7vw, 22px)", margin: 0, lineHeight: 1.1, overflowWrap: "anywhere" }}>Sound Design.</h3>
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 14,
                right: -18,
                bottom: -20,
                opacity: 0.5,
                display: "flex",
                alignItems: "flex-end",
                gap: 6,
                height: 150,
                maskImage: "linear-gradient(transparent 0%, #000 46%)",
                WebkitMaskImage: "linear-gradient(transparent 0%, #000 46%)",
                pointerEvents: "none",
              }}
            >
              {[48, 88, 128, 75, 136, 101, 62, 119, 84, 132, 66, 106, 53, 97].map((h, i) => (
                <span key={i} style={{ flex: 1, borderRadius: 999, height: h, background: i % 3 === 0 ? LIME : WHITE }} />
              ))}
            </div>
            <span
              aria-hidden
              style={{
                position: "absolute",
                right: 10,
                bottom: 4,
                fontSize: 118,
                lineHeight: 1,
                filter: "drop-shadow(0 0 1px #111110) drop-shadow(0 0 1px #111110) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 12px 0 rgba(0,0,0,0.32))",
              }}
            >
              🎧
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
