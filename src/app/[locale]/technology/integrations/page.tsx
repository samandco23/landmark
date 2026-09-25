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
  const title = fr ? "Intégrations" : "Integrations";
  const description = fr
    ? "Connectez votre e-commerce à notre réseau mondial : API, plugins e-commerce et intégrations transporteur."
    : "Connect your e-commerce to our global network: APIs, e-commerce plugins and carrier integrations.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/technology/integrations`,
      languages: { en: "/en/technology/integrations", fr: "/fr/technology/integrations" },
    },
    openGraph: { title, description },
  };
}

const INTEGRATIONS = [
  {
    en: "E-commerce plugins",
    fr: "Plugins e-commerce",
    descEn: "Ready-to-use connectors for the leading e-commerce platforms: orders, labels and tracking synchronised automatically.",
    descFr: "Connecteurs prêts à l'emploi pour les principales plateformes e-commerce : commandes, étiquettes et suivi synchronisés automatiquement.",
  },
  {
    en: "REST API",
    fr: "API REST",
    descEn: "Create shipments, print labels and receive tracking webhooks through a single, well-documented REST API.",
    descFr: "Créez des expéditions, imprimez des étiquettes et recevez des webhooks de suivi via une API REST unique et bien documentée.",
  },
  {
    en: "Carrier network",
    fr: "Réseau transporteurs",
    descEn: "One connection gives you access to our whole carrier-neutral network: postal and parcel operators worldwide.",
    descFr: "Une seule connexion vous donne accès à tout notre réseau carrier neutral : opérateurs postaux et colis du monde entier.",
  },
];

export default async function IntegrationsPage({
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
            src="/assets/images/service-ecommerce.jpg"
            alt={fr ? "Intégrations" : "Integrations"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="container relative pb-14 pt-56 lg:pb-20 lg:pt-72">
          <h1 className="max-w-gateway text-white">{fr ? "Intégrations" : "Integrations"}</h1>
        </div>
      </section>

      <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
        <div className="container max-w-4xl u-stack u-stack--8">
          <p className="text-md u-prose">
            {fr
              ? "Mercury, notre plateforme propriétaire, se connecte à votre stack e-commerce en quelques heures : import de commandes, génération d'étiquettes, webhooks de suivi et retours."
              : "Mercury, our proprietary platform, connects to your e-commerce stack in hours: order import, label generation, tracking webhooks and returns."}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {INTEGRATIONS.map((i) => (
              <div key={i.en} className="u-stack u-stack--3 rounded-card bg-grey-light-03 p-6">
                <span className="font-serif text-xl">{fr ? i.fr : i.en}</span>
                <span className="text-sm text-grey-mid-01">{fr ? i.descFr : i.descEn}</span>
              </div>
            ))}
          </div>
          <div>
            <Link href="/contact" className="btn btn-primary">
              {fr ? "Demander une intégration" : "Request an integration"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
