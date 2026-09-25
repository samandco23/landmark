import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Checkmark } from "@/components/icons";

type ServiceKey = "parcel" | "trade" | "returns" | "ecommerce" | "mail";

const SERVICES: Array<{
  key: ServiceKey;
  image: string;
  alt: string;
  reverse: boolean;
  href: string;
}> = [
  { key: "parcel", image: "/assets/images/service-parcel.jpg", alt: "International parcel shipping", reverse: false, href: "/services/parcel-delivery" },
  { key: "trade", image: "/assets/images/service-trade.webp", alt: "Trade services and customs clearance", reverse: true, href: "/services/customs-clearance" },
  { key: "returns", image: "/assets/images/service-returns.jpg", alt: "Flexible returns management", reverse: false, href: "/services/returns-management" },
  { key: "ecommerce", image: "/assets/images/service-ecommerce.jpg", alt: "Ecommerce solutions", reverse: true, href: "/services/ecommerce-delivery" },
  { key: "mail", image: "/assets/images/service-mail.jpg", alt: "International mail delivery", reverse: false, href: "/services/international-mail-delivery" },
];

export async function ServiceCards() {
  const t = await getTranslations("home.services");

  return (
    <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container u-stack u-stack--20">
        {SERVICES.map((s) => {
          const isMail = s.key === "mail";
          const bullets = isMail ? (["b1", "b2", "b3"] as const).map((k) => t(`mail.bullets.${k}`)) : [];

          return (
            <div
              key={s.key}
              className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 xl:gap-24"
            >
              <div
                className={`relative w-full lg:flex-[1_0_55%] ${s.reverse ? "lg:order-2" : ""}`}
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="u-stack u-stack--6 lg:flex-[1_0_calc(45%-4rem)]">
                <h2>
                  <strong>{t(`${s.key}.title`)}</strong>
                </h2>
                <div className="u-prose u-prose--branded text-body">
                  <p>{t(`${s.key}.p1`)}</p>
                  {isMail ? (
                    <ul className="u-stack u-stack--4 pt-2">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <Checkmark className="mt-1 h-5 w-5 shrink-0 text-red" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{t(`${s.key}.p2`)}</p>
                  )}
                </div>
                <div className="pt-2">
                  <Link href={s.href} className="btn btn-outline">
                    {t(`${s.key}.cta`)}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
