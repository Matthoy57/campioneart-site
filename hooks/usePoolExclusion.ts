"use client";

import { useEffect, useState } from "react";
import type { PoolItem } from "@/content/pool";
import { safeGetJSON, safeSetJSON } from "@/lib/jamStorage";

// Garde en mémoire (localStorage) les éléments récemment tirés pour un pool donné, pour éviter
// de retomber dessus tout de suite. Réintégrable manuellement à tout moment.
export function usePoolExclusion(storageKey: string, fullPool: PoolItem[]) {
  const [excludedNames, setExcludedNames] = useState<string[]>([]);

  useEffect(() => {
    // localStorage n'existe pas côté serveur : lecture uniquement possible après montage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExcludedNames(safeGetJSON<string[]>(storageKey, []));
  }, [storageKey]);

  function exclude(names: string[]) {
    setExcludedNames((prev) => {
      const next = Array.from(new Set([...prev, ...names]));
      safeSetJSON(storageKey, next);
      return next;
    });
  }

  function reintegrate(name: string) {
    setExcludedNames((prev) => {
      const next = prev.filter((n) => n !== name);
      safeSetJSON(storageKey, next);
      return next;
    });
  }

  const excludedItems = fullPool.filter((p) => excludedNames.includes(p.name));
  const available = fullPool.filter((p) => !excludedNames.includes(p.name));
  // Sécurité : si trop d'exclusions vident le pool, on retombe sur le pool complet pour ce
  // tirage plutôt que de bloquer ou toujours retomber sur le même élément restant.
  const effectivePool = available.length >= Math.min(2, fullPool.length) ? available : fullPool;

  return { excludedItems, effectivePool, exclude, reintegrate };
}
