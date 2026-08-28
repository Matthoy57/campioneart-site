"use client";

import { useMemo } from "react";

const COLORS = ["#F5E9C8", "#EC2E28", "#5865F2", "#3ED27A", "#FFFFFF"];

interface Particle {
  tx: number;
  ty: number;
  rotate: number;
  size: number;
  color: string;
  delay: number;
}

function makeParticles(count: number, spread: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = spread * 0.45 + Math.random() * spread * 0.55;
    return {
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      rotate: Math.random() * 360,
      size: 4 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 60,
    };
  });
}

// `burstKey` doit changer (compteur incrémenté) à chaque tirage pour que la confetti se
// rejoue : c'est ce qui force React à démonter/remonter les particules avec de nouvelles
// positions aléatoires, ce qu'un simple re-render avec les mêmes valeurs ne ferait pas.
// `count`/`spread` permettent une version plus généreuse pour les grandes célébrations (fin de
// vidéo) que le petit burst utilisé pour les paliers de rang/titre/streak.
export function Confetti({ burstKey, count = 16, spread = 68 }: { burstKey: number; count?: number; spread?: number }) {
  const particles = useMemo(() => makeParticles(count, spread), [burstKey, count, spread]);
  if (burstKey === 0) return null;

  return (
    <div key={burstKey} className="pointer-events-none absolute inset-0 overflow-visible">
      {particles.map((p, i) => (
        <span
          key={i}
          className="confetti-particle absolute top-1/2 left-1/2 rounded-[2px]"
          style={
            {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animationDelay: `${p.delay}ms`,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--rot": `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
