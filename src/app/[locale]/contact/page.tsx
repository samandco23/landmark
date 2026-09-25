import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "./ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale === "fr";
  const title = fr ? "Nous contacter" : "Contact Us";
  const description = fr
    ? "Parlez-nous de vos besoins d'expédition et nos experts vous répondront."
    : "Tell us about your shipping needs and our experts will get back to you.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", fr: "/fr/contact" },
    },
    openGraph: { title, description },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <section className="bg-grey-warm" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container max-w-4xl u-stack u-stack--8">
        <div className="u-stack u-stack--4">
          <h1>{t("title")}</h1>
          <p className="text-md">{t("subtitle")}</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
