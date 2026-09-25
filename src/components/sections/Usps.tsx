import { getTranslations } from "next-intl/server";

export async function Usps() {
  const t = await getTranslations("home.usps");

  const stats = [
    { value: "500", suffix: "+", label: t("stats.customers") },
    { value: "75", suffix: "", label: t("stats.partners") },
    { value: "25", suffix: "", label: t("stats.facilities") },
  ];

  return (
    <section className="bg-grey-dark text-white" style={{ paddingBlockStart: "var(--block-padding)" }}>
      <div className="container u-stack u-stack--12 pb-12 sm:pb-16 lg:pb-24">
        <div className="mx-auto max-w-usps u-stack u-stack--8 text-center">
          <h2>
            <strong>{t("title")}</strong>
          </h2>
          <p className="text-lg">{t("text")}</p>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 text-center">
              <span className="block font-serif text-3xl font-black lg:text-6xl">
                {s.value}
                {s.suffix && <span>{s.suffix}</span>}
              </span>
              <span className="block pt-2 font-sans text-lg font-bold lg:pt-6 lg:text-xl">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
