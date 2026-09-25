import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const PARTNERS = [
  { src: "/assets/logos/partner-notino.svg", alt: "Notino" },
  { src: "/assets/logos/partner-promod.webp", alt: "Promod" },
  { src: "/assets/logos/partner-kurasi.webp", alt: "Kurasi" },
  { src: "/assets/logos/partner-alensa.webp", alt: "Alensa" },
  { src: "/assets/logos/partner-fuxi.webp", alt: "Fuxi" },
  { src: "/assets/logos/partner-kaffee.webp", alt: "Kaffee" },
  { src: "/assets/logos/partner-mijnhoesjes.webp", alt: "Mijn Hoesjes" },
  { src: "/assets/logos/partner-niceshops.webp", alt: "Nice Shops" },
  { src: "/assets/logos/partner-shoppartners.webp", alt: "Shoppartners" },
  { src: "/assets/logos/partner-teemill.webp", alt: "Teemill" },
];

export async function Partners() {
  const t = await getTranslations("home.partners");
  const cta = await getTranslations("home.cta");

  return (
    <section className="bg-grey-light-03" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container u-stack u-stack--12">
        <h3 className="text-center font-sans text-xl font-normal text-grey-mid-01">
          {t("title")}
        </h3>
        <div className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {PARTNERS.map((p) => (
            <div key={p.alt} className="flex h-24 items-center justify-center">
              <Image
                src={p.src}
                alt={p.alt}
                width={160}
                height={80}
                className="max-h-24 w-auto object-contain px-6 grayscale"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-10">
          <Link href="/contact" className="btn btn-primary">
            {cta("contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
