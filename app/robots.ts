import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/settings", "/login", "/auth/"],
    },
    sitemap: `${process.env.SITE_URL ?? "https://campionematthieu.com"}/sitemap.xml`,
  };
}
