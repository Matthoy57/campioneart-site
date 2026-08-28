"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_PSEUDO, PSEUDO_UPDATE_EVENT, fallbackPseudoFromUser } from "@/content/profile";

// Éditeur du pseudo affiché dans la sidebar. Vit dans la table "youtube_quest_state" (nom
// historique, RPG Tube a été retiré depuis — elle ne stocke plus que ce pseudo) : pas besoin
// d'une table à part pour un seul champ. Disponible pour tout compte connecté.
export function PseudoSettings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState(DEFAULT_PSEUDO);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) {
        setReady(true);
        return;
      }
      setUserId(user.id);
      const { data: row } = await supabase.from("youtube_quest_state").select("state").eq("user_id", user.id).maybeSingle();
      const state = row?.state as { pseudo?: string } | undefined;
      setPseudo(state?.pseudo ?? fallbackPseudoFromUser(user));
      setReady(true);
    });
  }, []);

  async function save() {
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();

    const { data: row } = await supabase.from("youtube_quest_state").select("state").eq("user_id", userId).maybeSingle();
    const nextState = { ...(row?.state as Record<string, unknown> | undefined), pseudo: pseudo.trim() || DEFAULT_PSEUDO };

    await supabase.from("youtube_quest_state").upsert({ user_id: userId, state: nextState, updated_at: new Date().toISOString() });

    window.dispatchEvent(new CustomEvent(PSEUDO_UPDATE_EVENT, { detail: { pseudo: nextState.pseudo } }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!ready || !userId) return null;

  return (
    <div className="flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-[var(--jam-border)] bg-[var(--jam-surface)] p-6 text-left">
      <span className="text-xs font-bold tracking-wide text-[var(--jam-text-faint)] uppercase">Pseudo</span>
      <input
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        placeholder={DEFAULT_PSEUDO}
        className="rounded-lg border border-[var(--jam-border)] bg-[var(--jam-surface-alt)] px-3 py-2 text-sm font-semibold text-[var(--jam-text)] focus:outline-none"
      />
      <button
        onClick={save}
        disabled={saving}
        className="cursor-pointer self-start rounded-xl px-4 py-2 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-95 disabled:cursor-default disabled:opacity-50"
        style={{ backgroundColor: "#FF0000" }}
      >
        {saving ? "Sauvegarde…" : saved ? "Sauvegardé ✓" : "Sauvegarder"}
      </button>
    </div>
  );
}
