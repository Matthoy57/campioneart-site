import Link from "next/link";
import { YouTubeIcon, DiscordIcon } from "./icons";
import { archivo, CREAM, WHITE } from "./platformTheme";

// Footer compact : réseaux à gauche, copyright au centre, liens légaux à droite. Fond crème plein
// sur toute la largeur — avant, le footer restait sombre (fond BG) autour d'une carte crème
// flottante à l'intérieur, ce qui donnait l'impression que le footer était "toujours noir" malgré
// la carte.
export function SiteFooter() {
  return (
    <footer style={{ background: CREAM, padding: "20px 24px" }}>
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          color: "#111110",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { icon: YouTubeIcon, label: "YouTube" },
            { icon: DiscordIcon, label: "Discord" },
          ].map(({ icon: Icon, label }) => (
            <Link
              key={label}
              href="#"
              aria-label={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "2px solid #111110",
                background: WHITE,
                color: "#111110",
              }}
            >
              <Icon size={16} />
            </Link>
          ))}
        </div>

        <span style={{ fontSize: 13, color: "#111110" }}>© {new Date().getFullYear()} Plateforme. Tous droits réservés.</span>

        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href="/terms"
            style={{ fontSize: 12, ...archivo, padding: "8px 12px", borderRadius: 8, border: "2px solid #111110", background: WHITE, color: "#111110" }}
          >
            Mentions légales
          </Link>
          <Link
            href="/privacy"
            style={{ fontSize: 12, ...archivo, padding: "8px 12px", borderRadius: 8, border: "2px solid #111110", background: WHITE, color: "#111110" }}
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}
