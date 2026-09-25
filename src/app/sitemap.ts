import type { MetadataRoute } from "next";
import { DESTINATIONS } from "@/lib/destinations";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

const STATIC_PATHS = [
  "", // home
  "/about",
  "/sustainability",
  "/news",
  "/careers",
  "/services",
  "/contact",
  "/technology/integrations",
  "/technology/mercury",
];

const SERVICE_SLUGS = [
  "parcel-delivery",
  "us-domestic-shipping",
  "canada-domestic-shipping",
  "fulfillment-solutions",
  "customs-clearance",
  "returns-management",
  "ecommerce-delivery",
  "international-mail-delivery",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["en", "fr"]) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: {
            en: `${siteUrl}/en${path}`,
            fr: `${siteUrl}/fr${path}`,
          },
        },
      });
    }
    for (const slug of SERVICE_SLUGS) {
      entries.push({
        url: `${siteUrl}/${locale}/services/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            en: `${siteUrl}/en/services/${slug}`,
            fr: `${siteUrl}/fr/services/${slug}`,
          },
        },
      });
    }
    for (const dest of DESTINATIONS) {
      entries.push({
        url: `${siteUrl}/${locale}/destinations/${dest.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            en: `${siteUrl}/en/destinations/${dest.slug}`,
            fr: `${siteUrl}/fr/destinations/${dest.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
