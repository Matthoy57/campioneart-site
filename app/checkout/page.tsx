import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paiement - Matthieu Campione",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="jam-root flex min-h-screen flex-col items-center justify-center bg-[var(--jam-bg)] px-6 py-24 text-center font-[family-name:var(--font-grotesk)] text-[var(--jam-text)]">
      <span className="mb-5 text-5xl">💳</span>
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--jam-text)] sm:text-4xl">Paiement</h1>
        <span className="rounded-full bg-[var(--jam-btn-bg-soft)] px-2.5 py-1 text-xs font-bold leading-none text-[var(--jam-text-dim)]">Bientôt</span>
      </div>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--jam-text-dim)]">
        La formation n&apos;est pas encore ouverte à l&apos;achat. Reviens bientôt !
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full px-6 py-3 text-sm font-bold transition-transform duration-150 hover:scale-[1.03] active:scale-95"
        style={{ backgroundColor: "#FF0000", color: "#fff" }}
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
