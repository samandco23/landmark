import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Gateway() {
  const t = await getTranslations("home.gateway");
  const f = await getTranslations("home.features");

  const features = [
    { key: "f1", icon: "/assets/icons/icon-global.svg" },
    { key: "f2", icon: "/assets/icons/icon-plane.svg" },
    { key: "f3", icon: "/assets/icons/icon-post-office.svg" },
    { key: "f4", icon: "/assets/icons/icon-onboarding.svg" },
  ] as const;

  return (
    <section className="bg-grey-light-03" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="u-stack u-stack--8">
            <h2 className="max-w-content">{t("title")}</h2>
            <p className="text-md">{t("intro")}</p>
          </div>
          <div className="u-stack u-stack--8 pt-0 lg:pt-12">
            <p className="text-md">{t("body")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((item) => (
                <div
                  key={item.key}
                  className="u-stack u-stack--4 rounded-card bg-white p-8"
                >
                  <Image src={item.icon} alt="" width={56} height={56} className="h-14 w-14" />
                  <h3 className="font-sans">{f(`${item.key}.title`)}</h3>
                  <p className="text-body">{f(`${item.key}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
