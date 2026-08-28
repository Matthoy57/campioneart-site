import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL ?? "https://campionematthieu.com";

  return [{ url: siteUrl }, { url: `${siteUrl}/roadmap` }, { url: `${siteUrl}/game-jam` }];
}
