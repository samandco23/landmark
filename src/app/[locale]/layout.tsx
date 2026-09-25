import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { locales } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const other = locale === "fr" ? "en" : "fr";

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale,
      alternateLocale: other,
      url: `/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  const messages = await getMessages();

  const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Landmark Global",
    url: siteUrl,
    logo: `${siteUrl}/assets/logos/landmark-logo.svg`,
    description:
      "Cross-border e-commerce logistics provider: international parcel delivery, customs clearance, returns management, fulfillment and global mail solutions to 220+ destinations.",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Brucargo Building 829 C",
        addressLocality: "Machelen",
        postalCode: "1830",
        addressCountry: "BE",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Unit 3, Heathrow Logistics Park, Bedfont Rd",
        addressLocality: "Feltham",
        postalCode: "TW14 8EE",
        addressCountry: "GB",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["English", "French"],
    },
    sameAs: [] as string[],
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div lang={locale} className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
