import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Matthieu Campione",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="jam-root flex min-h-screen flex-col items-center justify-center bg-[var(--jam-bg)] px-6 py-24 text-center font-[family-name:var(--font-grotesk)] text-[var(--jam-text)]">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Politique de confidentialité</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--jam-text-dim)]">Cette page sera complétée prochainement.</p>
    </div>
  );
}
