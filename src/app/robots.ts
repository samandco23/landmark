import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/en/tracking", "/fr/tracking"],
      },
      // Crawlers IA / LLM : explicitement autorisés sur le contenu public,
      // mêmes exclusions que les moteurs classiques.
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "Claude-Web", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "CCBot", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
