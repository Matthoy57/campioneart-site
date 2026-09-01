import type { Metadata } from "next";
import { Space_Grotesk, Poppins } from "next/font/google";
import { AuthErrorToast } from "@/components/AuthErrorToast";
import "./globals.css";

// Deux polices pour tout le site (--font-body / --font-heading dans globals.css) : Space Grotesk
// pour le corps de texte, Poppins pour les titres et le nom de la marque. Remplace l'ancien trio
// Hanken Grotesk / Space Mono / Poppins — Space Grotesk reprend aussi le rôle des petits labels
// mono (uppercase + tracking, plutôt qu'une vraie police à chasse fixe).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

// Police des titres et du nom de la marque (--font-heading dans globals.css). Libre de droits
// (Google Fonts, licence OFL) — réutilisable telle quelle pour les miniatures/sous-titres YouTube.
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matthieu Campione",
  description: "La plateforme n°1 en France pour devenir développeur de jeux indépendant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <AuthErrorToast />
        {children}
      </body>
    </html>
  );
}
