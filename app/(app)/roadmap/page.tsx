import type { Metadata } from "next";
import Link from "next/link";
import { archivo, BG, CREAM, LIME, GREEN, TEXT_DIM, TEXT_FAINT, GridBackdrop, EMOJI_HALO } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Roadmap - Matthieu Campione",
  robots: { index: false, follow: false },
};

// Contenu de repère (pas encore branché sur une vraie progression par compte) : la structure —
// phases, étapes, statut, lien guide — est ce qui compte pour l'instant. 12 étapes au total, pour
// rester cohérent avec la promesse du pricing sur le site public ("12 étapes, en entier").
const STEPS = [
  { phase: "BASES", title: "Choisir son moteur", status: "done" as const },
  { phase: "BASES", title: "Notions de programmation", status: "done" as const },
  { phase: "BASES", title: "Sortir un premier prototype", status: "done" as const },
  { phase: "BOUCLE DE JEU", title: "Définir le game feel", status: "current" as const, guide: "Le game feel, en pratique" },
  { phase: "BOUCLE DE JEU", title: "Implémenter les contrôles", status: "locked" as const },
  { phase: "BOUCLE DE JEU", title: "Boucler le gameplay", status: "locked" as const },
  { phase: "LEVEL DESIGN", title: "Bases du level design", status: "locked" as const },
  { phase: "LEVEL DESIGN", title: "Premier niveau jouable", status: "locked" as const },
  { phase: "POLISH", title: "Juice & feedback", status: "locked" as const },
  { phase: "POLISH", title: "Audio & ambiance", status: "locked" as const },
  { phase: "PUBLIER", title: "Préparer sa page Steam/itch", status: "locked" as const },
  { phase: "PUBLIER", title: "Sortir son jeu", status: "locked" as const },
];

const DONE_COUNT = STEPS.filter((s) => s.status === "done").length;
const CURRENT = STEPS.find((s) => s.status === "current");

function StatusBadge({ status }: { status: "done" | "current" | "locked" }) {
  if (status === "done") {
    return (
      <span
        aria-hidden
        style={{ width: 28, height: 28, flex: "none", borderRadius: 999, background: GREEN, border: "2px solid #111110", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#111110" }}
      >
        ✓
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        aria-hidden
        style={{ width: 28, height: 28, flex: "none", borderRadius: 999, background: CREAM, border: "2px solid #111110", boxShadow: `0 0 0 3px ${BG}, 0 0 0 5px ${LIME}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, ...archivo, color: "#111110" }}
      >
        •
      </span>
    );
  }
  return (
    <span
      aria-hidden
      style={{ width: 28, height: 28, flex: "none", borderRadius: 999, background: "transparent", border: "2px solid rgba(245,242,234,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: TEXT_FAINT }}
    >
      🔒
    </span>
  );
}

export default function RoadmapPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-6 py-10" style={{ background: BG }}>
      <GridBackdrop />
      <div className="relative mx-auto flex max-w-2xl flex-col gap-8">
        {/* En-tête : titre + progression */}
        <div>
          <h1 style={{ ...archivo, fontSize: 32, color: CREAM, letterSpacing: "-0.02em", margin: 0 }}>ROADMAP</h1>
          <p style={{ color: TEXT_DIM, fontSize: 14, marginTop: 6 }}>Ton parcours pour apprendre le gamedev, dans l&apos;ordre.</p>
          <div className="mt-4 flex items-center gap-3">
            <div style={{ flex: 1, height: 10, borderRadius: 999, background: "rgba(245,242,234,0.1)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round((DONE_COUNT / STEPS.length) * 100)}%`, background: LIME, borderRadius: 999 }} />
            </div>
            <span style={{ ...archivo, fontSize: 13, color: CREAM, whiteSpace: "nowrap" }}>
              {DONE_COUNT} / {STEPS.length}
            </span>
          </div>
        </div>

        {/* Étape en cours, mise en avant — même traitement "tuile bento" que le dashboard : aplat
            plein, étiquette penchée, emoji géant en halo dans le coin, plutôt qu'une carte plate. */}
        {CURRENT && (
          <div style={{ position: "relative", overflow: "hidden", background: LIME, color: "#111110", borderRadius: 24, padding: "28px 26px", minHeight: 176 }}>
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
              ÉTAPE EN COURS · {CURRENT.phase}
            </span>
            <p style={{ ...archivo, fontSize: 26, margin: "14px 0 16px", letterSpacing: "-0.02em", maxWidth: 280 }}>{CURRENT.title}</p>
            {/* maxWidth garde le bouton + le tag guide à gauche, hors de la zone de l'emoji décoratif
                (sinon ça se chevauche quand ça passe à la ligne sur mobile). */}
            <div className="flex flex-wrap items-center gap-3" style={{ maxWidth: 220 }}>
              <Link
                href="/skill-vault"
                style={{ ...archivo, fontSize: 13, background: "#111110", color: LIME, borderRadius: 10, padding: "10px 16px" }}
              >
                CONTINUER →
              </Link>
              {CURRENT.guide && (
                <span style={{ ...archivo, fontSize: 11, background: CREAM, color: "#111110", border: "2px solid #111110", borderRadius: 999, padding: "6px 12px" }}>
                  🗝️ GUIDE : {CURRENT.guide}
                </span>
              )}
            </div>
            {/* Masqué sous lg : en dessous, le bouton + le tag guide occupent une part trop large
                de la carte pour laisser un coin dégagé à l'emoji géant. */}
            <span aria-hidden className="hidden lg:block" style={{ position: "absolute", right: 0, bottom: -20, fontSize: 130, lineHeight: 1, filter: EMOJI_HALO, pointerEvents: "none" }}>
              🎮
            </span>
          </div>
        )}

        {/* Liste complète, groupée par phase */}
        <div className="flex flex-col gap-2">
          {STEPS.map((step, i) => {
            const prevPhase = i > 0 ? STEPS[i - 1].phase : null;
            const isNewPhase = step.phase !== prevPhase;
            return (
              <div key={step.title}>
                {isNewPhase && (
                  <p style={{ ...archivo, fontSize: 11, letterSpacing: "0.06em", color: TEXT_FAINT, margin: "18px 0 8px" }}>{step.phase}</p>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: step.status === "current" ? "rgba(198,247,2,0.08)" : step.status === "done" ? "rgba(22,196,106,0.06)" : "transparent",
                    border: step.status === "current" ? `2px solid ${LIME}` : "2px solid transparent",
                  }}
                >
                  <StatusBadge status={step.status} />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: step.status === "current" ? 700 : 500,
                      color: step.status === "locked" ? TEXT_FAINT : CREAM,
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
