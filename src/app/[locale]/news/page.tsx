import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale === "fr";
  const title = fr ? "Actualités & Analyses" : "News & Insights";
  const description = fr
    ? "Analyses sectorielles, actualités de l'entreprise et décryptages logistique e-commerce par nos experts."
    : "Industry analysis, company updates and e-commerce logistics insights from our experts.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/news`,
      languages: { en: "/en/news", fr: "/fr/news" },
    },
    openGraph: { title, description },
  };
}

const ARTICLES = [
  {
    image: "/assets/images/news-greenwashing.webp",
    tag: "News",
    minutes: "Less than 1 minute read",
    slug: "eu-greenwashing-regulation",
    en: "New EU Regulation Targets Greenwashing: as of September 27",
    fr: "Nouvelle réglementation européenne contre l'écoblanchiment : à partir du 27 septembre",
  },
  {
    image: "/assets/images/news-netherlands.jpg",
    tag: "Articles",
    minutes: "5 minutes read",
    slug: "eu-expansion-logistics-provider",
    en: "Which Logistics Provider Should an Enterprise Brand Use for EU Expansion?",
    fr: "Quel prestataire logistique pour l'expansion européenne d'une grande marque ?",
  },
  {
    image: "/assets/images/news-cbec.jpg",
    tag: "News",
    minutes: "Less than 1 minute read",
    slug: "eu-cbec-forum-2026",
    en: "Landmark Global to join EU CBEC Forum 2026, with Olivier Leruth speaking on marketplace panel",
    fr: "Landmark Global participera à l'EU CBEC Forum 2026, avec Olivier Leruth à la table ronde marketplaces",
  },
];

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  return (
    <section className="bg-grey-light-03" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container u-stack u-stack--12">
        <div className="u-stack u-stack--6 max-w-gateway">
          <h1>{t("title")}</h1>
          <p className="text-md">{t("subtitle")}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {ARTICLES.map((a) => (
            <article key={a.slug} className="u-stack u-stack--3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-card">
                <Image
                  src={a.image}
                  alt={locale === "fr" ? a.fr : a.en}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p className="text-sm text-grey-mid-01">
                {a.tag} — {a.minutes}
              </p>
              <h2 className="font-serif text-xl leading-snug">
                <Link href="/#news" className="hover:text-red">
                  {locale === "fr" ? a.fr : a.en}
                </Link>
              </h2>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
