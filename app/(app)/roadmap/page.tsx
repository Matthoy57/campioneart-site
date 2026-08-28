import type { Metadata } from "next";
import Link from "next/link";
import { archivo, mono, BG, CREAM, GOLD, GREEN, TEXT_DIM, TEXT_FAINT, GridBackdrop } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Roadmap - Matthieu Campione",
  description: "Le chemin gratuit pour apprendre le gamedev : vidéos YouTube, avec des pointeurs vers les formations quand ça vaut le coup d'aller plus loin.",
};

// Page PUBLIQUE (pas de compte requis, voir proxy.ts) : point d'entrée gratuit façon
// documentation — on la lit dans l'ordre, pas de progression sauvegardée ni de compte. Groupée par
// pilier plutôt qu'une unique séquence linéaire inventée entre des disciplines qui n'ont pas
// d'ordre pédagogique évident entre elles (l'art 3D ne "suit" pas la programmation) — chaque pilier
// garde son propre ordre interne, qui lui a du sens.
type Step = { title: string; body: string; video?: boolean };
type Pillar = { key: string; label: string; tag: string; accent: string; steps: Step[]; note?: string };

const PILLARS: Pillar[] = [
  {
    key: "programming",
    label: "Programmation & Optimisation",
    tag: "GRATUIT · YOUTUBE",
    accent: GREEN,
    note: "Vidéos à venir sur la chaîne YouTube.",
    steps: [
      { title: "Les bases de la programmation de jeu", body: "Boucle de jeu, structure de projet, bonnes pratiques de départ.", video: true },
      { title: "Optimisation, les fondamentaux", body: "Comprendre où va le temps de calcul avant d'optimiser au hasard.", video: true },
    ],
  },
  {
    key: "gamefeel",
    label: "Game Feel",
    tag: "GRATUIT · YOUTUBE",
    accent: GREEN,
    note: "Vidéos à venir sur la chaîne YouTube.",
    steps: [{ title: "Ce qui rend un jeu satisfaisant à jouer", body: "Juice, feedback, réactivité — les principes, en pratique.", video: true }],
  },
  {
    key: "lowpoly",
    label: "Game Art Low Poly",
    tag: "🔒 FORMATION",
    accent: GOLD,
    note: "Formation en paiement unique — ouverture bientôt.",
    steps: [
      { title: "Idéation", body: "Trouve ton concept et ta direction artistique avant de sculpter quoi que ce soit." },
      { title: "Modélisation", body: "Bloque les formes en low poly, sans perdre de temps sur un détail inutile." },
      { title: "UV", body: "Déplie proprement, pour une texture nette sans étirement." },
      { title: "Texturing", body: "Donne vie au modèle avec une texture qui tient la distance." },
      { title: "Rigging", body: "Prépare le squelette pour que le modèle puisse bouger." },
      { title: "Weight Painting", body: "Fais correspondre la déformation du mesh au squelette, proprement." },
      { title: "Animation", body: "Anime le résultat, prêt à être importé dans un moteur." },
    ],
  },
];

const UPCOMING = ["Optimisation Masterclass", "Sound Design", "VFX & Shaders"];

function PillarSection({ pillar }: { pillar: Pillar }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: 14 }}>
        <h2 style={{ ...archivo, fontSize: 22, color: CREAM, letterSpacing: "-0.01em", margin: 0 }}>{pillar.label}</h2>
        <span style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", background: pillar.accent, color: "#111110", borderRadius: 999, padding: "4px 10px" }}>{pillar.tag}</span>
      </div>
      {pillar.note && (
        <p style={{ ...mono, fontSize: 12, color: TEXT_FAINT, margin: "0 0 16px" }}>
          {pillar.note}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {pillar.steps.map((step, i) => (
          <div
            key={step.title}
            style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 14, border: `2px solid rgba(245,242,234,0.12)`, background: "rgba(245,242,234,0.03)" }}
          >
            <span style={{ ...archivo, fontSize: 13, color: TEXT_FAINT, flex: "none", width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p style={{ ...archivo, fontSize: 15, color: CREAM, margin: 0 }}>{step.title}</p>
              <p style={{ fontSize: 13, color: TEXT_DIM, margin: "4px 0 0", lineHeight: 1.5 }}>{step.body}</p>
              {step.video && (
                <span style={{ ...mono, fontSize: 11, color: TEXT_FAINT, display: "inline-block", marginTop: 8 }}>
                  ▶ VIDÉO À VENIR
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-6 py-10" style={{ background: BG }}>
      <GridBackdrop />
      <div className="relative mx-auto flex max-w-2xl flex-col gap-12">
        <div>
          <h1 style={{ ...archivo, fontSize: 32, color: CREAM, letterSpacing: "-0.02em", margin: 0 }}>ROADMAP</h1>
          <p style={{ color: TEXT_DIM, fontSize: 14, marginTop: 8, lineHeight: 1.6, maxWidth: 480 }}>
            Le chemin gratuit pour apprendre le gamedev. Chaque étape a sa vidéo — et là où une formation va plus loin qu&apos;une vidéo, c&apos;est marqué.
          </p>
        </div>

        {PILLARS.map((pillar) => (
          <PillarSection key={pillar.key} pillar={pillar} />
        ))}

        <div>
          <p style={{ ...archivo, fontSize: 11, letterSpacing: "0.06em", color: TEXT_FAINT, margin: "0 0 10px" }}>À VENIR</p>
          <div className="flex flex-wrap gap-2">
            {UPCOMING.map((label) => (
              <span key={label} style={{ ...archivo, fontSize: 13, color: TEXT_DIM, border: "2px solid rgba(245,242,234,0.12)", borderRadius: 999, padding: "8px 14px" }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/checkout"
          style={{ ...archivo, fontSize: 13, alignSelf: "flex-start", background: GOLD, color: "#111110", border: "2px solid #111110", borderRadius: 10, padding: "12px 18px" }}
        >
          VOIR LA FORMATION GAME ART LOW POLY →
        </Link>
      </div>
    </main>
  );
}
