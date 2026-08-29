"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { archivoBlack, spaceGrotesk, spaceMono, archivo, BG, CREAM, LIME, GridBackdrop, ThinChecker, PlatformStyles } from "./platformTheme";

// Coquille de toute la partie connectée — remplace l'ancien JamShell (sidebar). Validée par
// itération sur /test avant d'être promue ici : menu façon Persona (bouton "Menu" qui ouvre un
// éventail de bannières coin-coupé), damier fin en haut et avant le footer, footer discret sur
// fond crème. Voir /test dans l'historique de la conversation pour le détail des choix.

const CUT_CLIP = "polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)";

const NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: "🐦‍🔥" },
  { href: "/dashboard", label: "Mes Formations", icon: "🎓" },
  { href: "/game-jam", label: "JAM", icon: "🍯" },
  { href: "/settings", label: "Paramètres", icon: "⚙️" },
];

function PersonaMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 flex justify-center px-6" style={{ height: 76, alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: LIME,
            color: "#111110",
            border: "3px solid #111110",
            boxShadow: "4px 4px 0 #111110",
            borderRadius: 10,
            padding: "10px 18px",
            cursor: "pointer",
            ...archivo,
            fontSize: 14,
          }}
        >
          <span aria-hidden style={{ fontSize: 16, display: "inline-block", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }}>
            {open ? "✕" : "☰"}
          </span>
          MENU
        </button>

        {NAV_ITEMS.map((item, i) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const y = 55 + i * 70;
          const rotate = i % 2 === 0 ? -4 : 4;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                display: "block",
                minWidth: 228,
                filter: "drop-shadow(4px 4px 0 #111110)",
                pointerEvents: open ? "auto" : "none",
                transform: open
                  ? `translate(-50%, calc(-50% + ${y}px)) rotate(${rotate}deg) scale(1)`
                  : `translate(-50%, -50%) rotate(${rotate}deg) scale(0.3)`,
                opacity: open ? 1 : 0,
                transition: `transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.04}s, opacity 0.22s ease ${i * 0.04}s`,
              }}
            >
              <span aria-hidden style={{ position: "absolute", inset: 0, background: "#111110", clipPath: CUT_CLIP }} />
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: 3,
                  ...archivo,
                  fontSize: 17,
                  padding: "16px 19px",
                  color: "#111110",
                  clipPath: CUT_CLIP,
                  background: item.href !== "/" && active ? CREAM : LIME,
                  whiteSpace: "nowrap",
                }}
              >
                <span aria-hidden style={{ fontSize: 19 }}>
                  {item.icon}
                </span>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function QuietFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-center gap-3" style={{ background: CREAM, padding: "24px", textAlign: "center" }}>
      <span style={{ ...archivo, fontSize: 12, color: "#111110" }}>© {new Date().getFullYear()} Plateforme</span>
      <Link href="/terms" style={{ ...archivo, fontSize: 11, color: "#111110", border: "2px solid #111110", borderRadius: 8, padding: "6px 12px" }}>
        Mentions légales
      </Link>
      <Link href="/privacy" style={{ ...archivo, fontSize: 11, color: "#111110", border: "2px solid #111110", borderRadius: 8, padding: "6px 12px" }}>
        Confidentialité
      </Link>
    </footer>
  );
}

export function PersonaShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${spaceMono.variable} platform-theme`}
      style={{ position: "relative", background: BG, color: CREAM, fontFamily: "var(--font-grotesk)", minHeight: "100vh" }}
    >
      <PlatformStyles />
      <GridBackdrop />
      <div className="relative flex flex-col" style={{ minHeight: "100vh" }}>
        <ThinChecker />
        <PersonaMenu />
        <div style={{ flex: 1 }}>{children}</div>
        <ThinChecker />
        <QuietFooter />
      </div>
    </div>
  );
}
