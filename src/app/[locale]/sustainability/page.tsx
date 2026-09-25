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
  const title = fr ? "Développement durable" : "Sustainability";
  const description = fr
    ? "Notre engagement pour une logistique e-commerce transfrontalière plus durable : consolidation, optimisation et CO₂e mesuré."
    : "Our commitment to more sustainable cross-border e-commerce logistics: consolidation, optimisation and measured CO₂e.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/sustainability`,
      languages: { en: "/en/sustainability", fr: "/fr/sustainability" },
    },
    openGraph: { title, description },
  };
}

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sustainability");

  return (
    <>
      <section className="relative flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/service-parcel.jpg"
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
              { value: "100%", label: t("pill1") },
              { value: "CO₂e", label: t("pill2") },
              { value: "220+", label: t("pill3") },
            ].map((s) => (
              <div key={s.label} className="u-stack u-stack--2 rounded-card bg-grey-light-03 p-8">
                <span className="font-serif text-4xl font-black">{s.value}</span>
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
