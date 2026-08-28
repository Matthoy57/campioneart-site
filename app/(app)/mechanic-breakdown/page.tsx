import type { Metadata } from "next";
import { ComingSoonPanel } from "@/components/ComingSoonPanel";
import { ORANGE } from "@/components/platformTheme";

export const metadata: Metadata = {
  title: "Breakdown - Matthieu Campione",
  robots: { index: false, follow: false },
};

export default function MechanicBreakdownPage() {
  return (
    <ComingSoonPanel
      icon="🛠️"
      title="Breakdown"
      accent={ORANGE}
      description="Ici, tu retrouveras des breakdowns écrits sur comment j'ai fait telle ou telle chose : un shader, une mécanique de gameplay, un système... le détail technique derrière le résultat."
    />
  );
}
