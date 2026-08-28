"use client";

import { useState } from "react";
import Link from "next/link";
import { archivo, BG, LIME, CREAM } from "./platformTheme";

// Bouton circulaire fixe, à droite, centré verticalement — clic pour ouvrir un accordéon de
// bannières façon menu Persona, disposées EN ARC AUTOUR du cercle (pas empilées au-dessus).
//
// Le survol des bannières ne fait QUE changer la couleur (vert → crème) : pas de scale au survol
// ici, sinon ce changement de transform écraserait le transform inline qui gère leur position sur
// l'arc et leur rotation "cut" façon comics — même piège que le flottement des emojis plus haut
// dans le fichier, donc une règle de survol dédiée (couleur uniquement) plutôt que .two-tone-btn.
const ITEMS = [
  { label: "OUTILS", href: "#outils", x: -112, y: -92, rotate: -6 },
  { label: "TARIFS", href: "#prix", x: -152, y: 0, rotate: 3 },
] as const;

export function CircularNavMenu({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);

  const items = [...ITEMS, { label: isAuthenticated ? "MON PROFIL" : "SE CONNECTER", href: isAuthenticated ? "/settings" : "/login", x: -112, y: 92, rotate: -3 }];

  // Coins opposés coupés en biseau : effet "tag/ticket comics" plutôt qu'un simple rectangle.
  const cutClip = "polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)";

  return (
    <div className="circular-nav-wrap" style={{ position: "fixed", top: "50%", right: 24, transform: "translateY(-50%)", zIndex: 100 }}>
      <style>{`
        .circular-nav-trigger { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .circular-nav-trigger:hover { transform: scale(1.15); }
        .circular-nav-item { background: ${LIME}; transition: background 0.2s ease, box-shadow 0.2s ease; }
        .circular-nav-item:hover { background: ${CREAM}; }
        /* Sur téléphone, le centrage vertical sur tout le viewport place le cercle n'importe où
           par rapport au header — repositionné juste sous le bouton "Se connecter" à la place. */
        @media (max-width: 900px) {
          .circular-nav-wrap { top: 130px !important; transform: none !important; }
        }
      `}</style>

      {/* Bannières en arc autour du cercle (offsets x/y calculés depuis son centre), pas empilées.
          Le "contour" n'est pas un `border` CSS : combiné à clip-path, la bordure d'un angle
          coupé se rendait mal (jointure d'angle droit tronquée par la découpe — le rendu "étrange"
          signalé). À la place : deux couches empilées de la même forme découpée, la noire pleine
          en dessous, le contenu inséré de 3px au-dessus — ça dessine un contour uniforme qui suit
          vraiment la découpe. */}
      {items.map((item, i) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            display: "block",
            minWidth: 190,
            filter: "drop-shadow(5px 5px 0 #111110)",
            pointerEvents: open ? "auto" : "none",
            transform: open
              ? `translate(${item.x}px, calc(-50% + ${item.y}px)) rotate(${item.rotate}deg) scale(1)`
              : `translate(0px, -50%) rotate(${item.rotate}deg) scale(0.3)`,
            opacity: open ? 1 : 0,
            transition: `transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s, opacity 0.25s ease ${i * 0.05}s`,
          }}
        >
          <span aria-hidden style={{ position: "absolute", inset: 0, background: "#111110", clipPath: cutClip }} />
          <span
            className="circular-nav-item"
            style={{
              position: "relative",
              display: "block",
              margin: 3,
              ...archivo,
              fontSize: 16,
              letterSpacing: "0.02em",
              textAlign: "center",
              padding: "15px 17px",
              color: "#111110",
              clipPath: cutClip,
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
        </Link>
      ))}

      {/* La rotation d'ouverture est portée par l'icône intérieure, pas par le bouton lui-même :
          le bouton ne gère QUE le scale au survol (CSS) — même raison que ci-dessus. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        className="circular-nav-trigger"
        style={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: LIME,
          border: "3px solid #111110",
          boxShadow: "4px 4px 0 #111110",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            ...archivo,
            fontSize: 24,
            color: BG,
            lineHeight: 1,
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          {open ? "✕" : "☰"}
        </span>
      </button>
    </div>
  );
}
