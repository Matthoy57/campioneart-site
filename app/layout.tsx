import type { Metadata } from "next";
import { Hanken_Grotesk, Space_Mono, Poppins } from "next/font/google";
import { AuthErrorToast } from "@/components/AuthErrorToast";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Police des titres et du nom de la marque (--font-heading dans globals.css) : Poppins, pour un
// duo distinct du corps de texte (Hanken Grotesk). Libre de droits (Google Fonts, licence OFL) —
// réutilisable telle quelle pour les miniatures/sous-titres YouTube.
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
      className={`${hankenGrotesk.variable} ${spaceMono.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <AuthErrorToast />
        {children}
      </body>
    </html>
  );
}
