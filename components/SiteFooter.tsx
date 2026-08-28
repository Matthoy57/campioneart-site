import Link from "next/link";
import { YouTubeIcon, DiscordIcon } from "./icons";
import { archivo, BG, CREAM, LIME, WHITE } from "./platformTheme";

// Footer compact : réseaux à gauche, copyright au centre, liens légaux à droite, dans une carte
// arrondie assortie au reste de la page.
export function SiteFooter() {
  return (
    <footer style={{ background: BG, padding: "0 24px 40px" }}>
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: CREAM,
          color: "#111110",
          border: "2px solid #111110",
          borderRadius: 16,
          padding: "16px 24px",
          boxShadow: `5px 5px 0 ${LIME}`,
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

        <span style={{ fontSize: 13, color: "#6E6B62" }}>© {new Date().getFullYear()} Plateforme. Tous droits réservés.</span>

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
