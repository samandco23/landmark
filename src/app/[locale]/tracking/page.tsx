import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrackingForm } from "@/components/tracking/TrackingForm";

// useSearchParams (dans TrackingForm) exige un boundary Suspense pour le prerender statique.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale === "fr";
  const title = fr ? "Suivi de colis" : "Parcel tracking";
  const description = fr
    ? "Saisissez votre numéro de suivi pour suivre votre expédition à chaque étape de son parcours."
    : "Enter your tracking number to follow your shipment at every step of its journey.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/tracking`,
      languages: { en: "/en/tracking", fr: "/fr/tracking" },
    },
    robots: { index: false }, // pages utilitaires avec paramètres : pas d'indexation
    openGraph: { title, description },
  };
}

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("tracking");

  return (
    <section className="bg-grey-warm" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container max-w-4xl u-stack u-stack--8">
        <h1>{t("title")}</h1>
        <p className="text-md">{t("subtitle")}</p>
        <Suspense fallback={null}>
          <TrackingForm />
        </Suspense>
      </div>
    </section>
  );
}
