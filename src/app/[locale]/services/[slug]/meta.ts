import type { Metadata } from "next";

const SERVICE_META: Record<
  string,
  { titleEn: string; titleFr: string; descEn: string; descFr: string }
> = {
  "parcel-delivery": {
    titleEn: "Cross-Border Shipping",
    titleFr: "Expédition transfrontalière",
    descEn: "Reliable international parcel delivery to 220+ destinations with full tracking visibility, from label creation to final delivery.",
    descFr: "Livraison internationale de colis fiable vers plus de 220 destinations, avec suivi complet de l'étiquette à la livraison finale.",
  },
  "us-domestic-shipping": {
    titleEn: "US Domestic Shipping",
    titleFr: "Expédition nationale US",
    descEn: "Nationwide US parcel delivery with flexible options and full visibility across the entire United States network.",
    descFr: "Livraison nationale de colis aux États-Unis avec options flexibles et visibilité totale sur tout le réseau américain.",
  },
  "canada-domestic-shipping": {
    titleEn: "Canada Domestic Shipping",
    titleFr: "Expédition nationale Canada",
    descEn: "Coast-to-coast Canadian parcel delivery, on time everywhere from Vancouver to Halifax.",
    descFr: "Livraison de colis au Canada d'un océan à l'autre, à l'heure partout, de Vancouver à Halifax.",
  },
  "fulfillment-solutions": {
    titleEn: "Fulfillment Solutions",
    titleFr: "Solutions de fulfillment",
    descEn: "Storage, pick & pack and same-day dispatch from fulfillment centres across Europe and North America.",
    descFr: "Stockage, préparation de commandes et expédition le jour même depuis nos centres de fulfillment en Europe et en Amérique du Nord.",
  },
  "customs-clearance": {
    titleEn: "Trade Services & Customs Clearance",
    titleFr: "Services douaniers & dédouanement",
    descEn: "In-house compliance experts and a proprietary clearance platform make global expansion straightforward and hassle-free.",
    descFr: "Nos experts conformité internes et notre plateforme de dédouanement propriétaire rendent l'expansion mondiale simple et sans tracas.",
  },
  "returns-management": {
    titleEn: "Returns Solutions",
    titleFr: "Solutions de retours",
    descEn: "Cross-border returns made easy: label generation, first-mile transport, customs and final-mile back to your warehouse or 3PL.",
    descFr: "Des retours transfrontaliers simplifiés : génération d'étiquettes, premier kilomètre, douane et livraison de retour à votre entrepôt ou 3PL.",
  },
  "ecommerce-delivery": {
    titleEn: "Ecommerce Solutions",
    titleFr: "Solutions e-commerce",
    descEn: "Reliable cross-border logistics for online businesses of all sizes, with delivery to over 220 destinations worldwide.",
    descFr: "Une logistique transfrontalière fiable pour les entreprises en ligne de toutes tailles, vers plus de 220 destinations dans le monde.",
  },
  "international-mail-delivery": {
    titleEn: "International Mail Delivery",
    titleFr: "Solutions postales internationales",
    descEn: "Global mail delivery with daily connections to postal operators worldwide. Global network, proven expertise, reliable speed.",
    descFr: "Distribution postale mondiale avec liaisons quotidiennes vers les opérateurs postaux. Réseau mondial, expertise éprouvée, rapidité fiable.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const meta = SERVICE_META[slug];
  if (!meta) return {};

  const fr = locale === "fr";
  const title = fr ? meta.titleFr : meta.titleEn;
  const description = fr ? meta.descFr : meta.descEn;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: {
        en: `/en/services/${slug}`,
        fr: `/fr/services/${slug}`,
      },
    },
    openGraph: { title, description, url: `/${locale}/services/${slug}` },
  };
}
