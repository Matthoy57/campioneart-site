import Link from "next/link";

const RED = "#FF0000";

export default function NotFound() {
  return (
    <div className="jam-root flex min-h-screen flex-col items-center justify-center bg-[var(--jam-bg)] px-6 text-center font-[family-name:var(--font-grotesk)] text-[var(--jam-text)]">
      <span
        style={{ backgroundColor: RED, color: "#fff" }}
        className="mb-5 inline-block rounded-full px-3 py-1 font-[family-name:var(--font-grotesk)] text-xs font-bold tracking-[3px] uppercase"
      >
        Game over
      </span>
      <p className="text-[100px] leading-none font-extrabold tracking-tight sm:text-[140px]">404</p>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Cette page s&apos;est perdue en zone inexplorée</h1>
      <p className="mt-3 max-w-md text-base text-[var(--jam-text-dim)]">Le lien est peut-être cassé ou la page a été déplacée.</p>
      <Link
        href="/"
        style={{ backgroundColor: RED, color: "#fff" }}
        className="mt-8 rounded-full px-6 py-3 text-sm font-bold transition-transform duration-150 hover:scale-[1.03] active:scale-95"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
