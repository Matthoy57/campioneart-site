import Link from "next/link";
import { CurriculumGrid } from "@/components/CurriculumGrid";
import { PricingSection } from "@/components/PricingSection";
import { MembersSection } from "@/components/MembersSection";
import { SiteFooter } from "@/components/SiteFooter";
import { RecoveryRedirect } from "@/components/RecoveryRedirect";
import { FloatingEmoji } from "@/components/FloatingEmoji";
import { CircularNavMenu } from "@/components/CircularNavMenu";
import { TrendUpIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { archivoBlack, spaceGrotesk, spaceMono, archivo, BG, CREAM, LIME, TEXT_MUTED, OUTLINE_GRAY, GridBackdrop, CheckerDivider, PlatformStyles, twoTone } from "@/components/platformTheme";

// En haut du site, la banderole est la toute première chose lue : mélange de noms d'outils et de
// promesses courtes plutôt qu'une simple répétition des 4 outils, pour que ça reste intéressant à
// lire pendant qu'elle défile.
const TICKER_ITEMS = ["GAME ART LOW POLY", "PAIEMENT UNIQUE", "IDÉE → JEU", "ROADMAP GRATUITE", "JAM"];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${spaceMono.variable} platform-theme`}
      style={{ backgroundColor: BG, color: CREAM, fontFamily: "var(--font-grotesk)", fontSize: 15, overflowX: "hidden" }}
    >
      <RecoveryRedirect />
      <PlatformStyles />
      <CircularNavMenu isAuthenticated={!!user} />

      {/* ===== Bandeau défilant, tout en haut ===== */}
      <div style={{ overflow: "hidden", borderTop: `2px solid ${LIME}`, borderBottom: `2px solid ${LIME}`, background: BG }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, width: "max-content", padding: "11px 0", animation: "mb-marquee 30s linear infinite" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 26, ...archivo, fontSize: 13, whiteSpace: "nowrap", color: LIME }}>
              {item}
              <span aria-hidden>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== Hero ===== */}
      <section style={{ position: "relative", background: BG, padding: "20px 24px 80px" }}>
        <GridBackdrop />

        <header style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, maxWidth: 1300, margin: "0 auto", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: LIME,
              color: "#111110",
              border: "2px solid #111110",
              boxShadow: `4px 4px 0 ${CREAM}`,
              padding: "8px 13px",
              borderRadius: 10,
            }}
          >
            <div style={{ width: 14, height: 14, background: "#111110", borderRadius: 3 }} />
            <span style={{ ...archivo, fontSize: 14, letterSpacing: "-0.02em" }}>PLATEFORME</span>
          </div>

          <div style={{ flex: 1 }} />

          <Link
            href={user ? "/settings" : "/login"}
            className="two-tone-btn"
            style={{ ...twoTone(CREAM, LIME), color: "#111110", border: "2px solid #111110", borderRadius: 10, padding: "10px 16px", ...archivo, fontSize: 13 }}
          >
            {user ? "MON PROFIL" : "SE CONNECTER"}
          </Link>
        </header>

        <div className="hero-grid" style={{ position: "relative", maxWidth: 1300, margin: "0 auto", paddingTop: 100, paddingBottom: 30 }}>
          {/* Les 3 emojis flottants forment un grand triangle assez large autour du texte. */}
          <div className="hero-float-slot hero-float-controller" style={{ position: "absolute", top: "calc(-6% + 10px)", left: "58%", zIndex: 40 }}>
            <FloatingEmoji emoji="🎮" animationName="float-controller" rotate={10} style={{ fontSize: "clamp(45px, 5vw, 65px)" }} />
          </div>
          <div className="hero-float-slot" style={{ position: "absolute", top: "44%", left: "12%", zIndex: 5 }}>
            <FloatingEmoji emoji="🕹️" animationName="float-joystick" rotate={-14} style={{ fontSize: "clamp(48px, 6vw, 76px)" }} />
          </div>
          <div className="hero-float-slot" style={{ position: "absolute", top: "80%", left: "calc(76% + 5px)", zIndex: 5 }}>
            <FloatingEmoji emoji="🏆" animationName="float-trophy" rotate={14} style={{ fontSize: "clamp(48px, 6vw, 76px)" }} />
          </div>

          <div className="hero-left" style={{ position: "relative", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <h1 style={{ ...archivo, fontSize: "clamp(34px, 4.6vw, 58px)", lineHeight: 1.02, letterSpacing: "-0.03em", margin: 0, color: CREAM }}>
              Apprends à faire de la{" "}
              <span
                style={{
                  display: "inline-block",
                  background: LIME,
                  color: "#111110",
                  border: "2px solid #111110",
                  boxShadow: `5px 5px 0 ${CREAM}`,
                  borderRadius: 10,
                  padding: "0 12px 3px",
                }}
              >
                3D low poly
              </span>{" "}
              pour tes jeux.
            </h1>
            <p style={{ maxWidth: 450, margin: "22px auto 0", lineHeight: 1.55, color: TEXT_MUTED }}>
              De l&apos;idée à un asset animé, prêt pour ton moteur. Une formation complète, en paiement unique.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 26, justifyContent: "center" }}>
              <Link
                href="/checkout"
                className="two-tone-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  ...twoTone(LIME, CREAM),
                  color: "#111110",
                  border: "2px solid #111110",
                  borderRadius: 10,
                  padding: "13px 20px",
                  ...archivo,
                  fontSize: 14,
                }}
              >
                <TrendUpIcon size={16} />
                Découvrir la formation
              </Link>
              <Link href="/roadmap" style={{ color: CREAM, border: `2px solid ${OUTLINE_GRAY}`, borderRadius: 10, padding: "13px 20px", ...archivo, fontSize: 14 }}>
                Suivre la roadmap gratuite
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CheckerDivider />

      <CurriculumGrid />
      <PricingSection />
      <MembersSection />
      <SiteFooter />
    </div>
  );
}
