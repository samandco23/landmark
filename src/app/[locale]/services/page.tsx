import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale === "fr";
  return {
    title: fr ? "Nos services" : "Our services",
    description: fr
      ? "Une logistique transfrontalière pensée pour votre activité — colis, dédouanement, retours, fulfillment et solutions postales."
      : "Cross-border logistics built around your business — parcels, customs clearance, returns, fulfillment and postal solutions.",
    alternates: {
      canonical: `/${locale}/services`,
      languages: { en: "/en/services", fr: "/fr/services" },
    },
  };
}

const SERVICES = [
  { slug: "parcel-delivery", en: "Cross-Border Shipping", fr: "Expédition transfrontalière" },
  { slug: "us-domestic-shipping", en: "US Domestic Shipping", fr: "Expédition nationale US" },
  { slug: "canada-domestic-shipping", en: "Canada Domestic Shipping", fr: "Expédition nationale Canada" },
  { slug: "fulfillment-solutions", en: "Fulfillment Solutions", fr: "Solutions de fulfillment" },
  { slug: "customs-clearance", en: "Trade Services", fr: "Services douaniers" },
  { slug: "returns-management", en: "Returns Solutions", fr: "Solutions de retours" },
  { slug: "ecommerce-delivery", en: "Ecommerce Solutions", fr: "Solutions e-commerce" },
  { slug: "international-mail-delivery", en: "Mail Solutions", fr: "Solutions postales" },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");

  return (
    <section className="bg-grey-light-03" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container u-stack u-stack--12">
        <div className="u-stack u-stack--6 max-w-gateway">
          <h1>{t("title")}</h1>
          <p className="text-md">{t("subtitle")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="u-stack u-stack--4 rounded-card bg-white p-8 transition-colors hover:bg-red hover:text-white"
            >
              <span className="font-serif text-xl">{locale === "fr" ? s.fr : s.en}</span>
              <span className="text-sm font-semibold underline underline-offset-4">
                {locale === "fr" ? "Découvrir" : "Learn more"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
