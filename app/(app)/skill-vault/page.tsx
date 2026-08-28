import type { Metadata } from "next";
import { ComingSoonPanel } from "@/components/ComingSoonPanel";
import { BLUE } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Guides - Matthieu Campione",
  robots: { index: false, follow: false },
};

export default function SkillVaultPage() {
  return (
    <ComingSoonPanel
      icon="🗝️"
      title="Guides"
      accent={BLUE}
      description="Ici, tu retrouveras des guides écrits pour apprendre des skills : des step-by-step, des recommandations de vidéos, des exercices à faire et des breakdowns."
    />
  );
}
