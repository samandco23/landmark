import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <section
      className="flex min-h-[70vh] items-center bg-grey-warm"
      style={{ paddingBlock: "var(--block-padding)" }}
    >
      <div className="container u-stack u-stack--8 max-w-4xl text-center">
        <p className="font-serif text-8xl font-black text-red lg:text-9xl">404</p>
        <h1 className="font-serif text-3xl lg:text-4xl">{t("title")}</h1>
        <p className="text-md text-grey-mid-01">{t("subtitle")}</p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/" className="btn btn-primary">
            {t("backHome")}
          </Link>
          <Link href="/tracking" className="btn btn-outline">
            {t("trackParcel")}
          </Link>
        </div>
      </div>
    </section>
  );
}
