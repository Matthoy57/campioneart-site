// Emoji natif flottant, avec contour "sticker" (liseré noir fin, collé au glyphe, ENGLOBÉ par une
// bordure blanche plus large — -webkit-text-stroke ne marche pas sur les emojis, glyphes couleur,
// pas des tracés, donc on simule avec des text-shadow décalés tout autour).
//
// Deux éléments imbriqués plutôt qu'un seul : le survol/clic doit AGRANDIR l'emoji sans arrêter
// son flottement. Comme le flottement anime déjà `transform` (rotate + translateY) sur l'élément,
// mettre aussi le scale au hover sur ce même élément écraserait l'animation (une seule valeur de
// transform à la fois). Le scale est donc porté par un span extérieur (dont le transform ne touche
// jamais à rotate/translateY), le flottement continue sur le span intérieur — les deux transforms
// se composent normalement puisque ce sont deux éléments distincts.
function ringShadow(radius: number, color: string, steps: number) {
  const parts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const x = (Math.cos(angle) * radius).toFixed(2);
    const y = (Math.sin(angle) * radius).toFixed(2);
    parts.push(`${x}px ${y}px 0 ${color}`);
  }
  return parts.join(", ");
}

// Rayon du blanc > rayon du noir (il l'englobe), et le noir est listé EN PREMIER — sinon le blanc,
// plus grand, recouvrirait tout le noir et le ferait disparaître.
const STICKER_OUTLINE = [ringShadow(6, "#000", 20), ringShadow(11, "#fff", 24)].join(", ");

export function FloatingEmoji({
  emoji,
  style,
  animationName,
  rotate = 10,
}: {
  emoji: string;
  style?: React.CSSProperties;
  animationName: string;
  rotate?: number;
}) {
  const peak = rotate - 3;
  const innerClass = `${animationName}-inner`;
  return (
    <span className={animationName} aria-hidden style={{ ...style, display: "inline-block", userSelect: "none" }}>
      <style>{`
        .${animationName} {
          display: inline-block;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .${animationName}:hover { transform: scale(1.2); }
        .${animationName}:active { transform: scale(0.92); transition-duration: 0.1s; }
        .${innerClass} {
          display: inline-block;
          animation: ${animationName}-float 3.4s ease-in-out infinite;
          filter: drop-shadow(4px 6px 0 rgba(0, 0, 0, 0.35));
          line-height: 1;
          text-shadow: ${STICKER_OUTLINE};
        }
        @keyframes ${animationName}-float {
          0%, 100% { transform: rotate(${rotate}deg) translateY(0); }
          50% { transform: rotate(${peak}deg) translateY(-5px); }
        }
      `}</style>
      <span className={innerClass}>{emoji}</span>
    </span>
  );
}
