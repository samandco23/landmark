import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale === "fr";
  const title = fr ? "Notre entreprise" : "Our Company";
  const description = fr
    ? "Landmark Global, le spécialiste de la logistique internationale de Bnode : 500+ clients, 75 partenaires, 27 implantations sur 4 continents."
    : "Landmark Global, the international logistics specialist of Bnode: 500+ customers, 75 partners, 27 facilities across 4 continents.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", fr: "/fr/about" },
    },
    openGraph: { title, description },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <section className="relative flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero-home.jpg"
            alt={t("title")}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="container relative pb-14 pt-56 lg:pb-20 lg:pt-72">
          <h1 className="max-w-gateway text-white">{t("title")}</h1>
        </div>
      </section>

      <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
        <div className="container max-w-4xl u-stack u-stack--6">
          <p className="text-md u-prose">{t("intro")}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "500+", label: t("statCustomers") },
              { value: "75", label: t("statPartners") },
              { value: "27", label: t("statFacilities") },
            ].map((s) => (
              <div key={s.label} className="u-stack u-stack--2 rounded-card bg-grey-light-03 p-8">
                <span className="font-serif text-5xl font-black">{s.value}</span>
                <span className="text-sm font-semibold text-grey-mid-01">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="u-prose u-stack u-stack--4 pt-4 text-md">
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
          </div>
          <div className="pt-4">
            <a href="/contact" className="btn btn-primary">
              {t("cta")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
