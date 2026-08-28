import type { NextConfig } from "next";

// CSP volontairement pragmatique (script-src/style-src 'unsafe-inline') plutôt qu'à base de
// nonce : l'app ne rend aucun contenu utilisateur en HTML brut (pas de dangerouslySetInnerHTML,
// pas d'éditeur riche), donc la surface XSS réelle est déjà quasi nulle sans CSP stricte — celle-ci
// sert surtout à verrouiller les origines externes autorisées (Supabase) et bloquer le framing.
// 'unsafe-eval' n'est nécessaire qu'en dev (outils de debug de React) ; jamais en production.
const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devEval}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
