import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale === "fr";
  const title = fr ? "Carrières" : "Careers";
  const description = fr
    ? "Rejoignez les équipes Landmark Global : logistique, technologie, service client et conformité douanière."
    : "Join the Landmark Global teams: logistics, technology, customer service and customs compliance.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/careers`,
      languages: { en: "/en/careers", fr: "/fr/careers" },
    },
    openGraph: { title, description },
  };
}

const OPENINGS = [
  { en: "Customs Compliance Specialist", fr: "Spécialiste conformité douanière", loc: "Brussels (BE)" },
  { en: "Data Engineer — Mercury Platform", fr: "Ingénieur données — plateforme Mercury", loc: "Feltham (UK)" },
  { en: "E-commerce Account Manager", fr: "Responsable de comptes e-commerce", loc: "Brussels (BE)" },
  { en: "Operations Team Lead", fr: "Team Lead opérations", loc: "Machelen (BE)" },
];

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale === "fr";

  return (
    <>
      <section className="relative flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero-home.jpg"
            alt={fr ? "Carrières" : "Careers"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="container relative pb-14 pt-56 lg:pb-20 lg:pt-72">
          <h1 className="max-w-gateway text-white">
            {fr ? "Construisez la logistique de demain" : "Build the future of logistics"}
          </h1>
        </div>
      </section>

      <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
        <div className="container max-w-4xl u-stack u-stack--8">
          <p className="text-md u-prose">
            {fr
              ? "Nous recrutons en permanence des talents dans 27 implantations sur 4 continents. Postulez via la page contact en précisant l'intitulé du poste."
              : "We are continuously hiring talent across 27 facilities on 4 continents. Apply via the contact page, quoting the role title."}
          </p>
          <ul className="u-stack u-stack--3">
            {OPENINGS.map((o) => (
              <li
                key={o.en}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-grey-light-01 pb-3"
              >
                <span className="font-serif text-xl">{fr ? o.fr : o.en}</span>
                <span className="text-sm font-semibold text-grey-mid-01">{o.loc}</span>
              </li>
            ))}
          </ul>
          <div>
            <Link href="/contact" className="btn btn-primary">
              {fr ? "Postuler" : "Apply now"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
