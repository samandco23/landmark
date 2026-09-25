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
  const title = fr ? "Mercury" : "Mercury";
  const description = fr
    ? "Mercury, la plateforme logistique propriétaire de Landmark Global : gestion d'expéditions de bout en bout."
    : "Mercury, Landmark Global's proprietary logistics platform: end-to-end shipment management.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/technology/mercury`,
      languages: { en: "/en/technology/mercury", fr: "/fr/technology/mercury" },
    },
    openGraph: { title, description },
  };
}

const FEATURES = [
  {
    en: "End-to-end shipment management",
    fr: "Gestion d'expéditions de bout en bout",
    descEn: "From order intake to proof of delivery: rates, labels, manifests, customs documents and exceptions in one place.",
    descFr: "De la prise de commande à la preuve de livraison : tarifs, étiquettes, manifestes, documents douaniers et exceptions au même endroit.",
  },
  {
    en: "Real-time tracking",
    fr: "Suivi en temps réel",
    descEn: "Normalised tracking events from every carrier in the network, exposed in your own branded tracking page and via API.",
    descFr: "Événements de suivi normalisés de chaque transporteur du réseau, exposés sur votre page de suivi à votre marque et via API.",
  },
  {
    en: "Analytics & billing",
    fr: "Analytics & facturation",
    descEn: "Volumes, transit times and costs per lane in self-service dashboards, with consolidated monthly invoicing.",
    descFr: "Volumes, délais et coûts par ligne dans des tableaux de bord en libre-service, avec facturation mensuelle consolidée.",
  },
];

export default async function MercuryPage({
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
            src="/assets/images/service-trade.webp"
            alt="Mercury"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="container relative pb-14 pt-56 lg:pb-20 lg:pt-72">
          <h1 className="max-w-gateway text-white">Mercury</h1>
        </div>
      </section>

      <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
        <div className="container max-w-4xl u-stack u-stack--8">
          <p className="text-md u-prose">
            {fr
              ? "Mercury est un logiciel propriétaire robuste et riche en fonctionnalités, conçu et détenu par Landmark Global, offrant toutes les fonctionnalités nécessaires pour gérer l'expédition de bout en bout."
              : "Mercury is a robust and feature-rich proprietary software, designed and owned by Landmark Global, providing all the functionality needed to manage shipping end-to-end."}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.en} className="u-stack u-stack--3 rounded-card bg-grey-light-03 p-6">
                <span className="font-serif text-xl">{fr ? f.fr : f.en}</span>
                <span className="text-sm text-grey-mid-01">{fr ? f.descFr : f.descEn}</span>
              </div>
            ))}
          </div>
          <div>
            <Link href="/contact" className="btn btn-primary">
              {fr ? "Voir une démo" : "See a demo"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
