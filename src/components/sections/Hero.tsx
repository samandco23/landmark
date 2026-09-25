import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative flex min-h-[520px] items-end sm:min-h-[560px]">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/hero-home.jpg"
          alt="Landmark Global logistics network"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="hero-lines" />
      </div>

      <div className="container relative pb-12 pt-40 sm:pt-56 lg:min-h-[44vw] lg:pb-20 lg:pt-96">
        <div className="u-stack u-stack--6 max-w-gateway text-white">
          <h1>{t("title")}</h1>
          <p className="text-md lg:text-xl">{t("subtitle")}</p>
          <div className="pt-2">
            <Link href="/contact" className="btn btn-primary">
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
