import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Gateway } from "@/components/sections/Gateway";
import { Usps } from "@/components/sections/Usps";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { GlobalReach } from "@/components/sections/GlobalReach";
import { Partners } from "@/components/sections/Partners";
import { NewsOverview } from "@/components/sections/NewsOverview";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("meta");

  return (
    <>
      <title>{t("title")}</title>
      <Hero />
      <Gateway />
      <Usps />
      <ServiceCards />
      <GlobalReach />
      <Partners />
      <NewsOverview />
    </>
  );
}
