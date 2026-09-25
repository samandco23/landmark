export interface Destination {
  /** Slug réel du site original (ex. parcel-delivery-to-united-states). */
  slug: string;
  en: string;
  fr: string;
  region: "Europe" | "Americas" | "Asia" | "Oceania";
}

export const DESTINATIONS: Destination[] = [
  { slug: "parcel-delivery-to-united-states", en: "United States", fr: "États-Unis", region: "Americas" },
  { slug: "parcel-delivery-to-canada", en: "Canada", fr: "Canada", region: "Americas" },
  { slug: "parcel-delivery-to-united-kingdom", en: "United Kingdom", fr: "Royaume-Uni", region: "Europe" },
  { slug: "parcel-delivery-to-belgium", en: "Belgium", fr: "Belgique", region: "Europe" },
  { slug: "parcel-delivery-to-france", en: "France", fr: "France", region: "Europe" },
  { slug: "parcel-delivery-to-spain", en: "Spain", fr: "Espagne", region: "Europe" },
  { slug: "parcel-delivery-to-netherlands", en: "Netherlands", fr: "Pays-Bas", region: "Europe" },
  { slug: "parcel-delivery-to-italy", en: "Italy", fr: "Italie", region: "Europe" },
  { slug: "parcel-delivery-to-germany", en: "Germany", fr: "Allemagne", region: "Europe" },
  { slug: "parcel-delivery-to-japan", en: "Japan", fr: "Japon", region: "Asia" },
];

export function destinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
