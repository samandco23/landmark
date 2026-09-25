import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DESTINATIONS, destinationBySlug } from "@/lib/destinations";

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const dest = destinationBySlug(slug);
  if (!dest) return {};
  const fr = locale === "fr";
  const title = fr
    ? `Livraison de colis vers ${dest.fr}`
    : `Parcel delivery to ${dest.en}`;
  const description = fr
    ? `Livraison de colis e-commerce vers ${dest.fr} : délais, dédouanement et suivi en temps réel avec Landmark Global.`
    : `E-commerce parcel delivery to ${dest.en}: transit times, customs clearance and real-time tracking with Landmark Global.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/destinations/${slug}`,
      languages: {
        en: `/en/destinations/${slug}`,
        fr: `/fr/destinations/${slug}`,
      },
    },
    openGraph: { title, description },
  };
}

const LANES: Record<string, { from: string; days: string; hub: string }> = {
  "parcel-delivery-to-united-states": { from: "Europe & Asia", days: "4–6 business days", hub: "New York (US)" },
  "parcel-delivery-to-canada": { from: "Europe", days: "4–6 business days", hub: "Toronto (CA)" },
  "parcel-delivery-to-united-kingdom": { from: "Europe", days: "2–3 business days", hub: "Feltham / Heathrow (UK)" },
  "parcel-delivery-to-belgium": { from: "Worldwide", days: "1–2 business days", hub: "Brucargo (BE)" },
  "parcel-delivery-to-france": { from: "Europe", days: "2–3 business days", hub: "Paris (FR)" },
  "parcel-delivery-to-spain": { from: "Europe", days: "2–4 business days", hub: "Madrid (ES)" },
  "parcel-delivery-to-netherlands": { from: "Europe", days: "1–2 business days", hub: "Rotterdam (NL)" },
  "parcel-delivery-to-italy": { from: "Europe", days: "2–4 business days", hub: "Milan (IT)" },
  "parcel-delivery-to-germany": { from: "Europe", days: "1–2 business days", hub: "Dorsten (DE)" },
  "parcel-delivery-to-japan": { from: "Europe", days: "4–7 business days", hub: "Tokyo (JP)" },
};

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const dest = destinationBySlug(slug);
  if (!dest) notFound();
  const lane = LANES[slug];

  const fr = locale === "fr";
  const name = fr ? dest.fr : dest.en;

  return (
    <>
      <section className="relative flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero-home.jpg"
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="container relative pb-14 pt-56 lg:pb-20 lg:pt-72">
          <h1 className="max-w-gateway text-white">
            {fr ? `Livraison de colis vers ${name}` : `Parcel delivery to ${name}`}
          </h1>
        </div>
      </section>

      <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
        <div className="container max-w-4xl u-stack u-stack--8">
          <p className="text-md u-prose">
            {fr
              ? `Nous livrons chaque jour des colis e-commerce vers ${name}. Grâce à notre modèle carrier neutral, nous combinons réseaux postaux et colis pour offrir le meilleur rapport qualité/délai, avec une visibilité complète de l'étiquette à la livraison.`
              : `We deliver e-commerce parcels to ${name} every day. Our carrier-neutral model combines postal and parcel networks for the best price/transit-time balance, with full visibility from label creation to final delivery.`}
          </p>

          {lane && (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: fr ? "Marché source" : "Origin market", value: lane.from },
                { label: fr ? "Délai type" : "Typical transit", value: lane.days },
                { label: fr ? "Hub principal" : "Main hub", value: lane.hub },
              ].map((s) => (
                <div key={s.label} className="u-stack u-stack--2 rounded-card bg-grey-light-03 p-6">
                  <span className="text-sm uppercase tracking-wide text-grey-mid-02">{s.label}</span>
                  <span className="font-serif text-2xl">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="u-stack u-stack--4">
            <h2 className="font-serif text-2xl">{fr ? "Autres destinations" : "Other destinations"}</h2>
            <ul className="flex flex-wrap gap-2">
              {DESTINATIONS.filter((d) => d.slug !== slug).map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="inline-block rounded-badge bg-grey-light-03 px-4 py-2 text-sm font-medium hover:bg-grey-light-01 hover:text-red"
                  >
                    {fr ? d.fr : d.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/contact" className="btn btn-primary">
              {fr ? "Demander un devis" : "Get more info"}
            </Link>
            <Link href="/tracking" className="btn btn-outline">
              {fr ? "Suivre un colis" : "Track a parcel"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
