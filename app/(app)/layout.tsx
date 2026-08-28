import type { ReactNode } from "react";
import { JamShell } from "@/components/JamShell";

// Layout partagé par tous les outils protégés (dashboard, JAM, Skill Vault, Breakdown, YouTube
// Quest, Settings) : contrairement à un <JamShell> répété dans chaque page, un vrai layout reste
// monté d'une page à l'autre en navigation client — plus de "pop" de l'avatar/profil à chaque
// changement de page pendant que sa requête Supabase se refait.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <JamShell>{children}</JamShell>;
}
