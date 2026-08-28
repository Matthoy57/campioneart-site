// Pseudo affiché dans la sidebar / réglable dans /settings. Vivait avant dans
// content/youtubeQuestData.ts (RPG Tube, retiré depuis) — extrait ici parce que c'est une donnée
// de profil générique, sans rapport avec un outil en particulier.

// Diffusé sur `window` quand le pseudo est sauvegardé dans /settings, pour que la sidebar
// (JamShell, montée en parallèle de la page) se mette à jour en direct sans reload.
export const PSEUDO_UPDATE_EVENT = "profile:pseudo-update";

export const DEFAULT_PSEUDO = "Toi";

// Déduit un pseudo par défaut depuis les métadonnées du provider OAuth (Discord notamment :
// pseudo global, sinon le nom d'utilisateur, sinon le préfixe de l'email). N'est utilisé que
// tant que l'utilisateur n'a pas encore choisi/sauvegardé un pseudo dans /settings.
export function fallbackPseudoFromUser(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null | undefined): string {
  const meta = user?.user_metadata ?? {};
  const fromMeta =
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    (meta.preferred_username as string | undefined) ||
    (meta.user_name as string | undefined);
  if (fromMeta && fromMeta.trim()) return fromMeta.trim();
  if (user?.email) return user.email.split("@")[0];
  return DEFAULT_PSEUDO;
}
