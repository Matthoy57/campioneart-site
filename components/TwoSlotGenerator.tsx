"use client";

import { useState } from "react";
import type { PoolItem } from "@/content/pool";
import { Confetti } from "./Confetti";
import { DiceIcon } from "./icons";
import { usePoolExclusion } from "@/hooks/usePoolExclusion";
import { archivo, GOLD } from "./platformTheme";

const TICK_MS = 70;
const LAND_A_MS = 900;
const LAND_B_MS = 1500; // délai volontaire après le slot A, pour un effet plus satisfaisant

function pickRandom(pool: PoolItem[]): PoolItem {
  return pool[Math.floor(Math.random() * pool.length)];
}

// poolA et poolB peuvent être la même liste (ex. Genre : deux tirages distincts dans un seul
// pool) ou deux listes différentes (ex. Style : un tirage dans chaque). Dans les deux cas on
// évite que les deux slots affichent le même nom.
function pickPair(poolA: PoolItem[], poolB: PoolItem[]): [PoolItem, PoolItem] {
  const a = pickRandom(poolA);
  let b = pickRandom(poolB);
  while (poolB.length > 1 && b.name === a.name) b = pickRandom(poolB);
  return [a, b];
}

// Chaque résultat est sa propre tuile. Hauteur fixe : sinon un nom qui passe sur 2 lignes (ex.
// "Boomer shooter (old-school FPS)") agrandit sa carte et désaligne Genre/Style qui doivent
// rester à la même hauteur l'une par rapport à l'autre.
function Result({
  item,
  spinning,
  landed,
  burstKey,
}: {
  item: PoolItem | null;
  spinning: boolean;
  landed: boolean;
  burstKey: number;
}) {
  return (
    <div
      className={`relative flex min-h-[128px] flex-1 flex-col items-center justify-center gap-2 rounded-xl px-3 py-4 ${landed ? "slot-bounce" : ""}`}
      style={{
        background: item ? "rgba(255,216,77,0.35)" : "rgba(17,17,16,0.05)",
        border: item ? "2px solid #111110" : "2px dashed rgba(17,17,16,0.18)",
        opacity: spinning ? 0.5 : 1,
        transition: "opacity 0.12s ease, background-color 0.2s ease",
      }}
    >
      <Confetti burstKey={burstKey} />
      {item ? (
        <>
          <span className="text-3xl leading-none">{item.emoji}</span>
          <span className="text-center text-sm leading-snug font-semibold" style={{ color: "#111110" }}>
            {item.name}
          </span>
        </>
      ) : (
        <span className="text-xl" style={{ color: "rgba(17,17,16,0.35)" }}>
          -
        </span>
      )}
    </div>
  );
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

export function TwoSlotGenerator({
  poolA,
  poolB,
  storageIdA,
  storageIdB,
  onResult,
  detailsOpen = false,
}: {
  poolA: PoolItem[];
  poolB: PoolItem[];
  storageIdA: string;
  storageIdB: string;
  onResult?: (a: PoolItem, b: PoolItem) => void;
  detailsOpen?: boolean;
}) {
  const sameId = storageIdA === storageIdB;
  const exclusionA = usePoolExclusion(`jam:excl:${storageIdA}`, poolA);
  const exclusionB = usePoolExclusion(`jam:excl:${storageIdB}`, poolB);

  const [slotA, setSlotA] = useState<PoolItem | null>(null);
  const [slotB, setSlotB] = useState<PoolItem | null>(null);
  const [spinningA, setSpinningA] = useState(false);
  const [spinningB, setSpinningB] = useState(false);
  const [landedA, setLandedA] = useState(false);
  const [landedB, setLandedB] = useState(false);
  const [burstA, setBurstA] = useState(0);
  const [burstB, setBurstB] = useState(0);

  const busy = spinningA || spinningB;

  function generate() {
    if (busy) return;
    const poolAEff = exclusionA.effectivePool;
    const poolBEff = sameId ? poolAEff : exclusionB.effectivePool;
    if (poolAEff.length === 0 || poolBEff.length === 0) return;

    const [finalA, finalB] = pickPair(poolAEff, poolBEff);

    setLandedA(false);
    setLandedB(false);
    setSpinningA(true);
    setSpinningB(true);

    const intervalA = setInterval(() => setSlotA(pickRandom(poolA)), TICK_MS);
    const intervalB = setInterval(() => setSlotB(pickRandom(poolB)), TICK_MS);

    setTimeout(() => {
      clearInterval(intervalA);
      setSlotA(finalA);
      setSpinningA(false);
      setLandedA(true);
      setBurstA((n) => n + 1);
    }, LAND_A_MS);

    setTimeout(() => {
      clearInterval(intervalB);
      setSlotB(finalB);
      setSpinningB(false);
      setLandedB(true);
      setBurstB((n) => n + 1);
      if (sameId) {
        exclusionA.exclude([finalA.name, finalB.name]);
      } else {
        exclusionA.exclude([finalA.name]);
        exclusionB.exclude([finalB.name]);
      }
      onResult?.(finalA, finalB);
    }, LAND_B_MS);
  }

  const excludedDisplay = sameId
    ? exclusionA.excludedItems.map((item) => ({ item, source: "a" as const }))
    : [
        ...exclusionA.excludedItems.map((item) => ({ item, source: "a" as const })),
        ...exclusionB.excludedItems.map((item) => ({ item, source: "b" as const })),
      ];

  function reintegrate(source: "a" | "b", name: string) {
    if (source === "a") exclusionA.reintegrate(name);
    else exclusionB.reintegrate(name);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full items-stretch gap-3">
        <Result item={slotA} spinning={spinningA} landed={landedA} burstKey={burstA} />
        <span className="flex items-center text-xl font-light" style={{ color: "rgba(17,17,16,0.35)" }}>
          +
        </span>
        <Result item={slotB} spinning={spinningB} landed={landedB} burstKey={burstB} />
      </div>

      <button
        onClick={generate}
        disabled={busy}
        style={{ ...archivo, fontSize: 13, background: GOLD, color: "#111110", border: "2px solid #111110" }}
        className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100"
      >
        <DiceIcon size={18} pipColor={GOLD} />
        Générer
      </button>

      {detailsOpen && (
        <div className="flex w-full flex-col items-center gap-2">
          {excludedDisplay.length > 0 ? (
            <>
              <span
                className="text-[10px] font-bold tracking-wide uppercase"
                style={{ color: "rgba(17,17,16,0.45)" }}
                title="Ces éléments viennent d'être tirés : leurs chances de retomber sont fortement réduites tant que tu ne cliques pas dessus pour les réintégrer."
              >
                Chances réduites
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {excludedDisplay.map(({ item, source }) => (
                  <Chip key={`${source}-${item.name}`} item={item} onClick={() => reintegrate(source, item.name)} />
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
