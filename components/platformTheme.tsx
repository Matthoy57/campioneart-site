import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";

// Thème visuel partagé de la homepage — extrait de l'exploration "/test-visuel" une fois le style
// validé, pour que app/page.tsx, ToolsGrid, PricingSection, MembersSection et SiteFooter partagent
// les mêmes couleurs/polices/helpers plutôt que de les dupliquer dans chaque fichier. Les polices ne
// sont chargées qu'ici (pas dans app/layout.tsx) : seule la homepage applique leur `.variable` sur
// sa racine, donc elles n'affectent aucune autre page du site.
export const archivoBlack = Archivo_Black({ variable: "--font-archivo", weight: "400", subsets: ["latin"] });
export const spaceGrotesk = Space_Grotesk({ variable: "--font-grotesk", weight: ["400", "500", "700"], subsets: ["latin"] });
export const spaceMono = Space_Mono({ variable: "--font-mono", weight: ["400", "700"], subsets: ["latin"] });

export const BG = "#111110";
export const CREAM = "#F5F2EA";
export const LIME = "#C6F702";
export const GRID_LINE = "#1E1E1B";
export const TEXT_MUTED = "#B3B0A6";
export const TEXT_DIM = "rgba(245, 242, 234, 0.75)";
export const TEXT_FAINT = "rgba(245, 242, 234, 0.45)";
export const GOLD = "#FFD84D";
export const PURPLE = "#7C5CFF";
export const WHITE = "#FFFFFF";
export const DARK_CARD = "#101014";
export const ORANGE = "#FF4A1C";
export const BLUE = "#0A7CFF";
export const GREEN = "#16C46A";
export const YELLOW = "#F5D64E";
export const PINK = "#FFC3DC";
export const RED_PINK = "#FF3D6E";
export const MONO_MUTED = "#6E6B62";
export const OUTLINE_GRAY = "#4A4A45";

export const archivo = { fontFamily: "var(--font-archivo)" };
export const mono = { fontFamily: "var(--font-mono)" };

// Halo blanc+noir derrière un emoji géant en illustration (repris tel quel de ToolsGrid) : le rend
// lisible sur n'importe quel fond coloré plein, façon sticker, plutôt qu'un emoji "posé à plat".
export const EMOJI_HALO =
  "drop-shadow(0 0 1px #111110) drop-shadow(0 0 1px #111110) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 12px 0 rgba(0,0,0,0.32))";

// Boutons "deux tons" (fond + ombre portée décalée d'une autre couleur) : au survol, agrandit de
// 10% ET intervertit les deux couleurs, via des custom properties CSS (cf. la règle .two-tone-btn
// injectée par <PlatformStyles/> dans page.tsx) plutôt que deux jeux de couleurs figés.
// `text`/`textHover` sont facultatifs : seuls les boutons dont le fond swappé casserait le
// contraste du texte (ex. fond blanc → noir) en ont besoin.
export function twoTone(bg: string, shadow: string, offset = "4px 4px 0", text?: string, textHover?: string): React.CSSProperties {
  const vars: Record<string, string> = { "--tt-bg": bg, "--tt-shadow": shadow, "--tt-offset": offset };
  if (text) vars["--tt-text"] = text;
  if (textHover) vars["--tt-text-hover"] = textHover;
  return vars as React.CSSProperties;
}

// Motif de grille en fond, repris sur toutes les sections à fond foncé.
export function GridBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: "46px 46px",
        maskImage: "linear-gradient(#000 25%, transparent 95%)",
        WebkitMaskImage: "linear-gradient(#000 25%, transparent 95%)",
      }}
    />
  );
}

// Damier CSS pur (repeating-conic-gradient) : se répète nativement sur toute la largeur, aucun
// risque de trou sur grand écran contrairement à un nombre fixe de tuiles DOM.
export function CheckerDivider() {
  return <div style={{ height: 100, backgroundColor: CREAM, backgroundImage: `repeating-conic-gradient(#111110 0% 25%, ${CREAM} 0% 50%)`, backgroundSize: "40px 40px" }} />;
}

// Version fine du damier (2 carrés de haut), utilisée par PersonaShell juste avant le footer discret
// de la partie connectée — repris tel quel ici pour que la homepage puisse reproduire exactement le
// même damier au même endroit. Un tile de taille N rend en réalité un sous-damier 2×2, donc la
// taille VISIBLE d'un carré est N/2 : `tile` est calculé en conséquence plutôt que fixé à l'oeil.
export function ThinChecker() {
  const visibleSquare = 10;
  const tile = visibleSquare * 2;
  return <div style={{ height: 20, backgroundColor: CREAM, backgroundImage: `repeating-conic-gradient(#111110 0% 25%, ${CREAM} 0% 50%)`, backgroundSize: `${tile}px ${tile}px` }} />;
}

// Styles globaux du thème (hover des boutons deux-tons, marquee, responsive) — un seul <style> à
// poser une fois dans page.tsx, sous la classe "platform-theme" qui doit englober toute la page.
export function PlatformStyles() {
  return (
    <style>{`
      .platform-theme a:hover:not(.two-tone-btn) { opacity: 0.7; }
      .platform-theme .two-tone-btn {
        background: var(--tt-bg);
        box-shadow: var(--tt-offset) var(--tt-shadow);
        color: var(--tt-text, inherit);
        transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
      }
      .platform-theme .two-tone-btn:hover {
        background: var(--tt-shadow);
        box-shadow: var(--tt-offset) var(--tt-bg);
        color: var(--tt-text-hover, var(--tt-text, inherit));
        transform: scale(1.1);
      }
      @keyframes mb-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @media (max-width: 900px) {
        .platform-theme .hero-float-slot { display: none !important; }
        .platform-theme .hero-float-controller {
          display: block !important;
          top: 8px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        .platform-theme .hero-grid { padding-top: 150px !important; }
        .platform-theme .bento > div { grid-column: span 12 !important; }
        .platform-theme .pricing-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}
