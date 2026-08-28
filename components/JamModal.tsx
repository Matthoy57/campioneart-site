"use client";

import type { ReactNode } from "react";
import { CREAM, GOLD } from "./platformTheme";

// Overlay dédié à l'outil JAM : fond flouté cliquable pour fermer, carte crème à bordure noire et
// ombre dorée (même traitement que StepCard/le récap dans GeneratorSections).
export function JamModal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-2xl p-5"
        style={{ background: CREAM, color: "#111110", border: "3px solid #111110", boxShadow: `6px 6px 0 ${GOLD}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
