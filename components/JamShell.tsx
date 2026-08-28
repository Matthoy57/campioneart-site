"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorIcon, GearIcon, BurgerIcon, CloseIcon } from "./icons";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_PSEUDO, PSEUDO_UPDATE_EVENT, fallbackPseudoFromUser } from "@/content/profile";
import { archivoBlack, spaceGrotesk, spaceMono, archivo, BG, CREAM, LIME, GOLD, TEXT_DIM, TEXT_FAINT, PlatformStyles } from "./platformTheme";

// Roadmap/Guides/Breakdown retirés (offre du site en cours de refonte, voir conversation) : ne
// reste que l'outil gratuit existant. Liste à plat, plus de groupement "parcours + outils" — ce
// découpage n'a plus de sens avec un seul outil.
const NAV_ITEMS = [
  { href: "/dashboard", label: "Accueil", icon: "🐦‍🔥", accent: CREAM },
  { href: "/game-jam", label: "JAM", icon: "🍯", accent: GOLD },
];

function NavRow({ href, label, icon, accent, active }: { href: string; label: string; icon: string; accent: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderRadius: 12,
        padding: "10px 12px",
        border: active ? "2px solid #111110" : "2px solid transparent",
        background: active ? CREAM : "transparent",
        boxShadow: active ? "4px 4px 0 #111110" : "none",
        color: active ? "#111110" : CREAM,
      }}
      className="jamshell-nav-row"
    >
      <span
        aria-hidden
        style={{
          flex: "none",
          width: 34,
          height: 34,
          borderRadius: 10,
          border: "2px solid #111110",
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}
      >
        {icon}
      </span>
      <span style={{ ...archivo, fontSize: 14, letterSpacing: "0.01em" }}>{label}</span>
    </Link>
  );
}

// Enveloppe les outils : sidebar de navigation (liste tous les outils, met en avant celui actif)
// + colonne de contenu. La déconnexion est en bas de sidebar.
export function JamShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [pseudo, setPseudo] = useState(DEFAULT_PSEUDO);

  useEffect(() => {
    const supabase = createClient();
    // getSession lit la session mise en cache localement (pas d'appel réseau) : évite le petit
    // "pop" de l'avatar le temps qu'un getUser() aille vérifier côté serveur.
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        setLoggedIn(true);
        // Table encore nommée "youtube_quest_state" pour des raisons historiques (RPG Tube, retiré
        // depuis) : elle ne sert plus qu'à stocker le pseudo choisi dans les paramètres.
        supabase
          .from("youtube_quest_state")
          .select("state")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data: row }) => {
            const state = row?.state as { pseudo?: string } | undefined;
            setPseudo(state?.pseudo ?? fallbackPseudoFromUser(user));
            setAuthChecked(true);
          });
      } else {
        setAuthChecked(true);
      }
    });
  }, []);

  // /settings (monté à côté, dans la même page) diffuse cet événement à chaque changement de
  // pseudo : ça permet à la sidebar de se mettre à jour en direct sans reload.
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ pseudo?: string }>).detail;
      if (detail?.pseudo) setPseudo(detail.pseudo);
    }
    window.addEventListener(PSEUDO_UPDATE_EVENT, handler);
    return () => window.removeEventListener(PSEUDO_UPDATE_EVENT, handler);
  }, []);

  // Referme le tiroir mobile à chaque navigation, sinon il reste ouvert par-dessus la page
  // suivante. Ajusté pendant le rendu plutôt que dans un effect (pattern React recommandé pour
  // réinitialiser un state au changement d'une prop) : évite le rendu en cascade d'un setState
  // synchrone dans un effect.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const settingsActive = pathname.startsWith("/settings");

  return (
    <div
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${spaceMono.variable} platform-theme flex min-h-screen`}
      style={{ background: BG, color: CREAM, fontFamily: "var(--font-grotesk)" }}
    >
      <PlatformStyles />
      {/* Le survol ne s'applique qu'aux lignes inactives (fond transparent) — une ligne déjà active
          est en fond crème plein, elle n'a pas besoin d'un état de survol distinct. */}
      <style>{`
        .jamshell-nav-row:hover { background: rgba(245, 242, 234, 0.08); }
      `}</style>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/50 sm:hidden" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex-col overflow-y-auto px-4 py-6 transition-transform duration-200 sm:sticky sm:top-0 sm:z-auto sm:flex sm:h-screen sm:w-72 sm:translate-x-0 ${
          mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full sm:flex"
        }`}
        style={{ background: BG, borderRight: `3px solid ${LIME}` }}
      >
        <div className="mb-8 flex items-center justify-between sm:justify-start">
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: LIME,
              color: "#111110",
              border: "2px solid #111110",
              boxShadow: `3px 3px 0 ${CREAM}`,
              padding: "7px 12px",
              borderRadius: 10,
              ...archivo,
              fontSize: 13,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ width: 11, height: 11, background: "#111110", borderRadius: 3, display: "inline-block" }} />
            PLATEFORME
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg sm:hidden"
            style={{ color: TEXT_DIM }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavRow key={item.href} {...item} active={pathname.startsWith(item.href)} />
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <Link
            href="/settings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 12,
              padding: "8px 10px",
              border: settingsActive ? "2px solid #111110" : "2px solid transparent",
              background: settingsActive ? CREAM : "transparent",
              boxShadow: settingsActive ? "3px 3px 0 #111110" : "none",
              color: settingsActive ? "#111110" : TEXT_DIM,
            }}
            className="jamshell-nav-row"
          >
            {!authChecked ? (
              // Squelette (plutôt qu'un vide) tant qu'on ne sait pas encore si c'est mon compte :
              // évite d'afficher brièvement l'engrenage puis de le remplacer par l'avatar (le "pop").
              <>
                <div className="h-9 w-9 flex-none animate-pulse rounded-full" style={{ background: "rgba(245,242,234,0.12)" }} />
                <div className="h-3 w-20 flex-1 animate-pulse rounded-full" style={{ background: "rgba(245,242,234,0.12)" }} />
              </>
            ) : loggedIn ? (
              <>
                <div
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 text-sm font-bold"
                  style={{ borderColor: "#111110", background: LIME, color: "#111110" }}
                >
                  {pseudo.slice(0, 1).toUpperCase()}
                </div>
                <span className="truncate" style={{ fontSize: 13 }}>
                  {pseudo}
                </span>
              </>
            ) : (
              <>
                <GearIcon size={14} />
                <span style={{ fontSize: 13 }}>Paramètres</span>
              </>
            )}
          </Link>

          <form action="/api/tools-logout" method="POST">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm"
              style={{ color: TEXT_FAINT, ...archivo, fontSize: 12 }}
            >
              <DoorIcon size={16} />
              SE DÉCONNECTER
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Barre du haut, mobile uniquement : nom de la plateforme + bouton burger qui ouvre le
            tiroir de nav (la sidebar est masquée en dessous de sm). */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 sm:hidden" style={{ background: BG, borderBottom: `2px solid ${LIME}` }}>
          <Link href="/" style={{ ...archivo, fontSize: 14, color: CREAM }}>
            PLATEFORME
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg"
            style={{ color: CREAM }}
          >
            <BurgerIcon size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
