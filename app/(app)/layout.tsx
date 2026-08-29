import type { ReactNode } from "react";
import { PersonaShell } from "@/components/PersonaShell";

// Layout partagé par toutes les pages protégées (dashboard, JAM, settings) : un vrai layout reste
// monté d'une page à l'autre en navigation client, contrairement à un shell répété dans chaque
// page. PersonaShell remplace l'ancien JamShell (sidebar) — menu façon Persona, validé sur /test
// avant d'être promu ici (voir la conversation).
export default function AppLayout({ children }: { children: ReactNode }) {
  return <PersonaShell>{children}</PersonaShell>;
}
