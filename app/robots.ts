import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/game-jam",
        "/skill-vault",
        "/mechanic-breakdown",
        "/dashboard",
        "/settings",
        "/roadmap",
        "/login",
        "/auth/",
      ],
    },
    sitemap: `${process.env.SITE_URL ?? "https://campionematthieu.com"}/sitemap.xml`,
  };
}
