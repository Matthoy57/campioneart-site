"use client";

import { useState } from "react";
import { archivo, mono, CREAM, LIME, TEXT_DIM, TEXT_FAINT } from "@/components/platformTheme";

// Page de formation, promue depuis /test (voir la conversation) — contenu de modules toujours en
// dur : pas encore de vrai système de progression/contenu côté backend, la formation n'étant pas
// encore ouverte à l'achat. À brancher sur de vraies données une fois le paiement en place.
const MODULES = [
  { key: "ideation", title: "Idéation", icon: "💡", status: "done" as const },
  { key: "modelisation", title: "Modélisation", icon: "🔺", status: "done" as const },
  { key: "uv", title: "UV", icon: "🗺️", status: "current" as const },
  { key: "texturing", title: "Texturing", icon: "🎨", status: "locked" as const },
  { key: "rigging", title: "Rigging", icon: "🦴", status: "locked" as const },
  { key: "weight", title: "Weight Painting", icon: "🖌️", status: "locked" as const },
  { key: "animation", title: "Animation", icon: "🎬", status: "locked" as const },
];

export default function GameArtLowPolyPage() {
  const [selected, setSelected] = useState("uv");
  const current = MODULES.find((m) => m.key === selected) ?? MODULES[0];

  return (
    <main className="px-6 py-8">
      {/* Passée de max-w-3xl à max-w-5xl : la page se voulait "plus haute", et comme le lecteur
          vidéo garde un ratio 16/9 fixe, l'élargir est ce qui le fait grandir le plus — la
          sidebar des modules et le texte de description, eux, ne gagnent presque rien en largeur
          utile au-delà de md:w-56, donc c'est bien la vidéo qui absorbe l'essentiel du gain. */}
      <div className="mx-auto max-w-5xl">
        <div style={{ marginBottom: 24 }}>
          <p style={{ ...archivo, fontSize: 22, color: CREAM, margin: 0 }}>Game Art Low Poly</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, maxWidth: 300 }}>
            <div style={{ flex: 1, height: 8, borderRadius: 999, background: "rgba(245,242,234,0.1)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "28%", background: LIME }} />
            </div>
            <span style={{ ...archivo, fontSize: 12, color: TEXT_DIM }}>2/7</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div
            className="flex flex-col gap-1.5 md:w-56"
            style={{ flex: "none", background: "rgba(245,242,234,0.03)", border: "3px solid #111110", borderRadius: 16, padding: 10, boxShadow: "5px 5px 0 rgba(245,242,234,0.12)" }}
          >
            {MODULES.map((m) => (
              <button
                key={m.key}
                onClick={() => m.status !== "locked" && setSelected(m.key)}
                disabled={m.status === "locked"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  ...archivo,
                  fontSize: 13,
                  padding: "10px 12px",
                  borderRadius: 10,
                  textAlign: "left",
                  cursor: m.status === "locked" ? "default" : "pointer",
                  border: selected === m.key ? "2px solid #111110" : "2px solid transparent",
                  background: selected === m.key ? CREAM : "transparent",
                  color: m.status === "locked" ? TEXT_FAINT : selected === m.key ? "#111110" : CREAM,
                }}
              >
                <span aria-hidden style={{ width: 20, textAlign: "center" }}>
                  {m.status === "done" ? "✓" : m.status === "locked" ? "🔒" : m.icon}
                </span>
                {m.title}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 0, background: "rgba(245,242,234,0.03)", border: "3px solid #111110", borderRadius: 16, padding: 20, boxShadow: `6px 6px 0 ${LIME}` }}>
            <p style={{ ...archivo, fontSize: 20, color: CREAM, margin: "0 0 12px" }}>{current.title}</p>
            <div style={{ aspectRatio: "16/9", background: "#111110", border: "2px solid rgba(245,242,234,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span aria-hidden style={{ fontSize: 40 }}>
                ▶
              </span>
            </div>
            <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.6, marginBottom: 16 }}>Description du module — ce qu&apos;on y fait, ce qu&apos;on en ressort.</p>
            <span style={{ ...mono, fontSize: 11, color: "#111110", background: CREAM, border: "2px solid #111110", borderRadius: 999, padding: "6px 12px" }}>📎 FICHIER SOURCE (.BLEND)</span>
          </div>
        </div>
      </div>
    </main>
  );
}
