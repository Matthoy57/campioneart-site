"use client";

import { useRef, useState } from "react";
import type { PoolItem } from "@/content/pool";
import { Confetti } from "./Confetti";
import { DiceIcon } from "./icons";
import { usePoolExclusion } from "@/hooks/usePoolExclusion";
import { archivo, GOLD } from "./platformTheme";

const TICK_MS = 70;
const LAND_MS = 900;

function pickRandom(pool: PoolItem[]): PoolItem {
  return pool[Math.floor(Math.random() * pool.length)];
}

function Chip({ item, onClick }: { item: PoolItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] transition-colors"
      style={{ background: "rgba(17,17,16,0.06)", color: "rgba(17,17,16,0.65)" }}
      title="Cliquer pour réintégrer"
    >
      <span>{item.emoji}</span>
      <span className="max-w-[110px] truncate">{item.name}</span>
      <span style={{ color: "rgba(17,17,16,0.4)" }}>×</span>
    </button>
  );
}

// Même structure visuelle qu'un TwoSlotGenerator, mais avec un seul emplacement de résultat :
// tuile + bouton Générer en dessous, pour rester cohérent avec Genre/Style.
export function OneSlotGenerator({
  pool,
  storageId,
  onResult,
  detailsOpen = false,
}: {
  pool: PoolItem[];
  storageId: string;
  onResult?: (item: PoolItem) => void;
  detailsOpen?: boolean;
}) {
  const exclusion = usePoolExclusion(`jam:excl:${storageId}`, pool);

  const [current, setCurrent] = useState<PoolItem | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const [burst, setBurst] = useState(0);
  // Suit le dernier résultat en dehors du state (qui change à chaque tick pendant l'animation)
  // pour pouvoir éviter de retomber deux fois de suite sur le même tirage.
  const lastFinalRef = useRef<PoolItem | null>(null);

  function generate() {
    if (spinning) return;
    const effective = exclusion.effectivePool;
    if (effective.length === 0) return;
    setLanded(false);
    setSpinning(true);

    const interval = setInterval(() => setCurrent(pickRandom(pool)), TICK_MS);

    setTimeout(() => {
      clearInterval(interval);
      let final = pickRandom(effective);
      while (effective.length > 1 && final.name === lastFinalRef.current?.name) final = pickRandom(effective);
      lastFinalRef.current = final;
      setCurrent(final);
      setSpinning(false);
      setLanded(true);
      setBurst((n) => n + 1);
      exclusion.exclude([final.name]);
      onResult?.(final);
    }, LAND_MS);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className={`relative flex min-h-[108px] w-full flex-col items-center justify-center gap-2 rounded-xl px-3 py-4 ${landed ? "slot-bounce" : ""}`}
        style={{
          background: current ? "rgba(255,216,77,0.35)" : "rgba(17,17,16,0.05)",
          border: current ? "2px solid #111110" : "2px dashed rgba(17,17,16,0.18)",
          opacity: spinning ? 0.5 : 1,
          transition: "opacity 0.12s ease, background-color 0.2s ease",
        }}
      >
        <Confetti burstKey={burst} />
        {current ? (
          <>
            <span className="text-3xl leading-none">{current.emoji}</span>
            <span className="text-center text-sm leading-snug font-semibold" style={{ color: "#111110" }}>
              {current.name}
            </span>
          </>
        ) : (
          <span className="text-xl" style={{ color: "rgba(17,17,16,0.35)" }}>
            -
          </span>
        )}
      </div>

      <button
        onClick={generate}
        disabled={spinning}
        style={{ ...archivo, fontSize: 13, background: GOLD, color: "#111110", border: "2px solid #111110" }}
        className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100"
      >
        <DiceIcon size={18} pipColor={GOLD} />
        Générer
      </button>

      {detailsOpen && (
        <div className="flex w-full flex-col items-center gap-2">
          {exclusion.excludedItems.length > 0 ? (
            <>
              <span
                className="text-[10px] font-bold tracking-wide uppercase"
                style={{ color: "rgba(17,17,16,0.45)" }}
                title="Ces éléments viennent d'être tirés : leurs chances de retomber sont fortement réduites tant que tu ne cliques pas dessus pour les réintégrer."
              >
                Chances réduites
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {exclusion.excludedItems.map((item) => (
                  <Chip key={item.name} item={item} onClick={() => exclusion.reintegrate(item.name)} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-[11px]" style={{ color: "rgba(17,17,16,0.45)" }}>
              Aucun élément à réduire pour l&apos;instant.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
