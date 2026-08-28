"use client";

import { useEffect, useState } from "react";
import type { PoolItem } from "@/content/pool";
import { TwoSlotGenerator } from "./TwoSlotGenerator";
import { OneSlotGenerator } from "./OneSlotGenerator";
import { JamModal } from "./JamModal";
import { BackArrowIcon, InfoIcon } from "./icons";
import { createClient } from "@/lib/supabase/client";
import { archivo, mono, CREAM, LIME, GOLD, TEXT_FAINT } from "./platformTheme";

interface Pair {
  a: PoolItem;
  b: PoolItem;
}

interface ArchivedJam {
  id: string;
  name: string;
  combo: { genre: Pair; style: Pair; theme: PoolItem };
  created_at: string;
}

const MAX_ARCHIVES = 5;
const STEPS = ["genre", "style", "theme", "recap"] as const;
type Step = (typeof STEPS)[number];

function pairText(pair: Pair | null): string {
  return pair ? `${pair.a.emoji} ${pair.a.name} + ${pair.b.emoji} ${pair.b.name}` : "-";
}

function SummaryButton({
  onClick,
  primary,
  disabled,
  children,
}: {
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...archivo,
        fontSize: 13,
        background: primary ? GOLD : "transparent",
        color: "#111110",
        border: "2px solid #111110",
      }}
      className="flex h-9 cursor-pointer items-center justify-center rounded-xl px-4 transition-transform duration-150 hover:scale-[1.03] active:scale-95 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100"
    >
      {children}
    </button>
  );
}

function DetailsButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      style={{ ...archivo, fontSize: 13, background: open ? "#111110" : "transparent", color: open ? GOLD : "#111110", border: "2px solid #111110" }}
      className="flex h-9 cursor-pointer items-center justify-center rounded-xl px-4 transition-colors"
    >
      Détails
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Précédent"
      style={{ background: "transparent", color: "#111110", border: "2px solid #111110" }}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-transform duration-150 hover:scale-[1.05] active:scale-95"
    >
      <BackArrowIcon size={16} />
    </button>
  );
}

// Points de progression en haut de l'assistant : un point par étape, plein pour les étapes
// passées/actuelle, creux pour celles à venir. Affichés sur le fond sombre de la page (au-dessus
// de la carte crème), donc en LIME/crème plutôt qu'en rouge comme avant.
function StepDots({ current }: { current: number }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {STEPS.map((_, i) => (
        <span key={i} className="h-2 w-2 rounded-full transition-colors" style={{ backgroundColor: i <= current ? LIME : "rgba(245,242,234,0.18)" }} />
      ))}
    </div>
  );
}

function StepCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl p-8 text-center"
      style={{ background: CREAM, color: "#111110", border: "3px solid #111110", boxShadow: `6px 6px 0 ${GOLD}` }}
    >
      <p style={{ ...archivo, fontSize: 12, letterSpacing: "0.04em", color: "rgba(17,17,16,0.55)" }}>{label.toUpperCase()}</p>
      {children}
    </div>
  );
}

export function GeneratorSections({
  genres,
  styleAesthetics,
  styleContext,
  themeConcepts,
}: {
  genres: PoolItem[];
  styleAesthetics: PoolItem[];
  styleContext: PoolItem[];
  themeConcepts: PoolItem[];
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const step: Step = STEPS[stepIndex];
  const [resetSignal, setResetSignal] = useState(0);

  const [genreResult, setGenreResult] = useState<Pair | null>(null);
  const [styleResult, setStyleResult] = useState<Pair | null>(null);
  const [themeResult, setThemeResult] = useState<PoolItem | null>(null);
  const [namingOpen, setNamingOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [archives, setArchives] = useState<ArchivedJam[]>([]);
  const [archivesLoading, setArchivesLoading] = useState(true);
  const [detailArchive, setDetailArchive] = useState<ArchivedJam | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [genreDetailsOpen, setGenreDetailsOpen] = useState(false);
  const [styleDetailsOpen, setStyleDetailsOpen] = useState(false);
  const [themeDetailsOpen, setThemeDetailsOpen] = useState(false);

  useEffect(() => {
    loadArchives();
  }, []);

  async function loadArchives() {
    const supabase = createClient();
    const { data } = await supabase.from("jams").select("id, name, combo, created_at").order("created_at", { ascending: false });
    setArchives((data as ArchivedJam[]) ?? []);
    setArchivesLoading(false);
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function resetAll() {
    setStepIndex(0);
    setGenreResult(null);
    setStyleResult(null);
    setThemeResult(null);
    setResetSignal((n) => n + 1); // force le remontage des générateurs pour vider leurs tuiles
  }

  function openNaming() {
    setNameInput("");
    setNamingOpen(true);
  }

  async function confirmSave() {
    // Garde-fou en plus du bouton désactivé : évite un dépassement si confirmSave() est
    // déclenché juste après qu'une autre jam ait déjà été sauvegardée ailleurs (onglet dupliqué...).
    if (!genreResult || !styleResult || !themeResult || archives.length >= MAX_ARCHIVES) return;
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    await supabase.from("jams").insert({
      user_id: user.id,
      name: nameInput.trim() || "Sans titre",
      combo: { genre: genreResult, style: styleResult, theme: themeResult },
      duration_hours: 0,
      locked: false,
    });

    setSaving(false);
    setNamingOpen(false);
    resetAll();
    loadArchives();
  }

  async function handleRemoveArchive(id: string) {
    const supabase = createClient();
    await supabase.from("jams").delete().eq("id", id);
    setArchives((prev) => prev.filter((j) => j.id !== id));
  }

  function startRename(j: ArchivedJam) {
    setRenamingId(j.id);
    setRenameInput(j.name || "");
  }

  async function confirmRename(id: string) {
    const name = renameInput.trim() || "Sans titre";
    setArchives((prev) => prev.map((j) => (j.id === id ? { ...j, name } : j)));
    setRenamingId(null);
    const supabase = createClient();
    await supabase.from("jams").update({ name }).eq("id", id);
  }

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-6">
      <div className="w-full max-w-md">
        <StepDots current={stepIndex} />

        <div className={step === "genre" ? "" : "hidden"}>
          <StepCard label="Genre">
            <TwoSlotGenerator
              key={`genre-${resetSignal}`}
              poolA={genres}
              poolB={genres}
              storageIdA="genre"
              storageIdB="genre"
              onResult={(a, b) => setGenreResult({ a, b })}
              detailsOpen={genreDetailsOpen}
            />
            <div className="flex items-center justify-center gap-2">
              <SummaryButton onClick={goNext} primary disabled={!genreResult}>
                Valider
              </SummaryButton>
              <DetailsButton open={genreDetailsOpen} onClick={() => setGenreDetailsOpen((v) => !v)} />
            </div>
          </StepCard>
        </div>

        <div className={step === "style" ? "" : "hidden"}>
          <StepCard label="Style">
            <TwoSlotGenerator
              key={`style-${resetSignal}`}
              poolA={styleAesthetics}
              poolB={styleContext}
              storageIdA="style-aesthetics"
              storageIdB="style-context"
              onResult={(a, b) => setStyleResult({ a, b })}
              detailsOpen={styleDetailsOpen}
            />
            <div className="flex items-center justify-center gap-2">
              <BackButton onClick={goBack} />
              <SummaryButton onClick={goNext} primary disabled={!styleResult}>
                Valider
              </SummaryButton>
              <DetailsButton open={styleDetailsOpen} onClick={() => setStyleDetailsOpen((v) => !v)} />
            </div>
          </StepCard>
        </div>

        <div className={step === "theme" ? "" : "hidden"}>
          <StepCard label="Thème">
            <OneSlotGenerator
              key={`theme-${resetSignal}`}
              pool={themeConcepts}
              storageId="theme"
              onResult={(item) => setThemeResult(item)}
              detailsOpen={themeDetailsOpen}
            />
            <div className="flex items-center justify-center gap-2">
              <BackButton onClick={goBack} />
              <SummaryButton onClick={goNext} primary disabled={!themeResult}>
                Valider
              </SummaryButton>
              <DetailsButton open={themeDetailsOpen} onClick={() => setThemeDetailsOpen((v) => !v)} />
            </div>
          </StepCard>
        </div>

        <div
          className={`flex w-full flex-col items-center gap-5 rounded-2xl p-6 text-center ${step === "recap" ? "" : "hidden"}`}
          style={{ background: CREAM, color: "#111110", border: "3px solid #111110", boxShadow: `6px 6px 0 ${GOLD}` }}
        >
          <p style={{ ...archivo, fontSize: 12, letterSpacing: "0.04em", color: "rgba(17,17,16,0.55)" }}>IDÉE FINALE</p>
          <div className="flex w-full flex-col gap-2 text-left text-sm">
            <p>
              <span style={{ color: "rgba(17,17,16,0.5)" }}>Genre :</span> {pairText(genreResult)}
            </p>
            <p>
              <span style={{ color: "rgba(17,17,16,0.5)" }}>Style :</span> {pairText(styleResult)}
            </p>
            <p>
              <span style={{ color: "rgba(17,17,16,0.5)" }}>Thème :</span> {themeResult ? `${themeResult.emoji} ${themeResult.name}` : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <SummaryButton onClick={resetAll}>Recommencer</SummaryButton>
              <SummaryButton onClick={openNaming} primary disabled={archives.length >= MAX_ARCHIVES}>
                Sauvegarder
              </SummaryButton>
            </div>
            {archives.length >= MAX_ARCHIVES && (
              <p style={{ fontSize: 12, color: "rgba(17,17,16,0.5)" }}>
                Limite de {MAX_ARCHIVES} idées sauvegardées atteinte. Supprime-en une dans l&apos;historique pour en ajouter une nouvelle.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <p style={{ ...mono, fontSize: 12, letterSpacing: "0.15em", color: TEXT_FAINT }} className="mb-3 text-center font-bold uppercase">
          Idées enregistrées {archives.length}/{MAX_ARCHIVES}
        </p>
        <div className="rounded-2xl p-5 sm:p-6" style={{ background: CREAM, border: "3px solid #111110", boxShadow: `5px 5px 0 rgba(17,17,16,0.2)` }}>
          {archivesLoading ? (
            <p style={{ fontSize: 13, color: "rgba(17,17,16,0.45)" }} className="text-center">
              Chargement…
            </p>
          ) : archives.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {archives.map((j) => (
                <li className="flex flex-col gap-2 text-sm leading-relaxed sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1.5" key={j.id} style={{ color: "rgba(17,17,16,0.75)" }}>
                  <div className="flex min-w-0 items-center gap-3">
                    <span style={{ color: "rgba(17,17,16,0.4)" }}>{new Date(j.created_at).toLocaleDateString("fr-FR")}</span>
                    <span className="flex min-w-0 flex-1 items-center gap-1.5">
                      <span className="flex-none">🕹️</span>
                      {renamingId === j.id ? (
                        <input
                          autoFocus
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          onBlur={() => confirmRename(j.id)}
                          onKeyDown={(e) => e.key === "Enter" && confirmRename(j.id)}
                          className="w-full min-w-0 rounded-lg px-2 py-0.5 text-sm focus:outline-none"
                          style={{ border: "2px solid #111110", background: "#ffffff", color: "#111110" }}
                        />
                      ) : (
                        <span className="truncate font-semibold" style={{ color: "#111110" }}>
                          {j.name || "Sans titre"}
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => setDetailArchive(j)}
                      title="Détails"
                      aria-label="Détails"
                      className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-lg transition-colors"
                      style={{ background: "rgba(17,17,16,0.06)", color: "rgba(17,17,16,0.6)" }}
                    >
                      <InfoIcon size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <button
                      onClick={() => startRename(j)}
                      className="flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-bold whitespace-nowrap transition-colors sm:flex-none"
                      style={{ background: "rgba(17,17,16,0.06)", color: "rgba(17,17,16,0.65)" }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleRemoveArchive(j.id)}
                      className="flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-bold whitespace-nowrap transition-colors hover:bg-red-500/15 hover:text-red-600 sm:flex-none"
                      style={{ background: "rgba(17,17,16,0.06)", color: "rgba(17,17,16,0.65)" }}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 13, color: "rgba(17,17,16,0.45)" }} className="text-center">
              Tes idées sauvegardées apparaîtront ici.
            </p>
          )}
        </div>
      </div>

      {namingOpen && (
        <JamModal onClose={() => setNamingOpen(false)}>
          <p style={{ ...mono, fontSize: 12, letterSpacing: "0.15em", color: "rgba(17,17,16,0.55)" }} className="mb-3 font-bold uppercase">
            Nom du jeu
          </p>
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmSave()}
            placeholder="Ex. Rewind Rampage"
            className="mb-4 w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
            style={{ border: "2px solid #111110", background: "#ffffff", color: "#111110" }}
          />
          <div className="flex justify-end gap-2">
            <SummaryButton onClick={() => setNamingOpen(false)}>Annuler</SummaryButton>
            <SummaryButton onClick={confirmSave} primary disabled={saving}>
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </SummaryButton>
          </div>
        </JamModal>
      )}

      {detailArchive && (
        <JamModal onClose={() => setDetailArchive(null)}>
          <p style={{ ...mono, fontSize: 12, letterSpacing: "0.15em", color: "rgba(17,17,16,0.55)" }} className="mb-3 font-bold uppercase">
            🕹️ {detailArchive.name || "Sans titre"}
          </p>
          <div className="mb-4 flex flex-col gap-3">
            <div>
              <p style={{ ...archivo, fontSize: 11, letterSpacing: "0.04em", color: "rgba(17,17,16,0.45)" }} className="mb-1 uppercase">
                Genre
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#111110" }}>
                {pairText(detailArchive.combo.genre)}
              </p>
            </div>
            <div>
              <p style={{ ...archivo, fontSize: 11, letterSpacing: "0.04em", color: "rgba(17,17,16,0.45)" }} className="mb-1 uppercase">
                Style
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#111110" }}>
                {pairText(detailArchive.combo.style)}
              </p>
            </div>
            <div>
              <p style={{ ...archivo, fontSize: 11, letterSpacing: "0.04em", color: "rgba(17,17,16,0.45)" }} className="mb-1 uppercase">
                Thème
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#111110" }}>
                {detailArchive.combo.theme.emoji} {detailArchive.combo.theme.name}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <SummaryButton onClick={() => setDetailArchive(null)}>Fermer</SummaryButton>
          </div>
        </JamModal>
      )}
    </div>
  );
}
