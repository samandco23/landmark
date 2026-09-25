import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export { generateMetadata } from "./meta";

const SERVICE_DETAILS: Record<
  string,
  { en: string; fr: string; image: string; textEn: string; textFr: string }
> = {
  "parcel-delivery": {
    en: "Cross-Border Shipping",
    fr: "Expédition transfrontalière",
    image: "/assets/images/service-parcel.jpg",
    textEn:
      "We make every mile count. From first movement to final delivery, our specialized delivery services ensure reliability and control. Through our domestic and international transport network we deliver every shipment efficiently everywhere, any time and on time.",
    textFr:
      "Nous donnons du sens à chaque kilomètre. Du premier mouvement à la livraison finale, nos services de livraison spécialisés garantissent fiabilité et contrôle. Grâce à notre réseau de transport national et international, nous livrons chaque expédition efficacement, partout, à tout moment et à l'heure.",
  },
  "us-domestic-shipping": {
    en: "US Domestic Shipping",
    fr: "Expédition nationale US",
    image: "/assets/images/service-ecommerce.jpg",
    textEn:
      "Deliver to your US customers with speed and reliability. Our domestic network covers the entire United States with flexible delivery options and full visibility.",
    textFr:
      "Livrez à vos clients américains avec rapidité et fiabilité. Notre réseau national couvre l'ensemble des États-Unis avec des options de livraison flexibles et une visibilité totale.",
  },
  "canada-domestic-shipping": {
    en: "Canada Domestic Shipping",
    fr: "Expédition nationale Canada",
    image: "/assets/images/service-parcel.jpg",
    textEn:
      "From Vancouver to Halifax, our Canadian delivery network ensures your parcels reach customers across the country on time, every time.",
    textFr:
      "De Vancouver à Halifax, notre réseau canadien garantit que vos colis atteignent vos clients partout au pays, à l'heure, à chaque fois.",
  },
  "fulfillment-solutions": {
    en: "Fulfillment Solutions",
    fr: "Solutions de fulfillment",
    image: "/assets/images/service-returns.jpg",
    textEn:
      "Store your products closer to your customers. Our fulfillment centres across Europe and North America handle storage, pick & pack, and same-day dispatch.",
    textFr:
      "Stockez vos produits plus près de vos clients. Nos centres de fulfillment en Europe et en Amérique du Nord gèrent le stockage, le picking/packing et l'expédition le jour même.",
  },
  "customs-clearance": {
    en: "Trade Services",
    fr: "Services douaniers",
    image: "/assets/images/service-trade.webp",
    textEn:
      "Our in-house compliance teams are experts in clearing your products all over the world. By combining our proprietary clearance platform with a team of dedicated trade experts, we make global expansion straightforward and hassle-free.",
    textFr:
      "Nos équipes conformité internes sont des expertes du dédouanement de vos produits partout dans le monde. En combinant notre plateforme de dédouanement propriétaire avec une équipe d'experts dédiés, nous rendons l'expansion mondiale simple et sans tracas.",
  },
  "returns-management": {
    en: "Returns Solutions",
    fr: "Solutions de retours",
    image: "/assets/images/service-returns.jpg",
    textEn:
      "Our cross-border returns solutions make it easy for your customers to send items back hassle-free, while giving you full control and visibility every step of the way.",
    textFr:
      "Nos solutions de retours transfrontaliers permettent à vos clients de renvoyer facilement leurs articles, tout en vous donnant un contrôle et une visibilité totale à chaque étape.",
  },
  "ecommerce-delivery": {
    en: "Ecommerce Solutions",
    fr: "Solutions e-commerce",
    image: "/assets/images/service-ecommerce.jpg",
    textEn:
      "We specialize in providing reliable cross-border logistics services for online businesses of all sizes, with delivery to over 220 destinations worldwide.",
    textFr:
      "Nous sommes spécialisés dans les services logistiques transfrontaliers fiables pour les entreprises en ligne de toutes tailles, avec livraison vers plus de 220 destinations dans le monde.",
  },
  "international-mail-delivery": {
    en: "Mail Solutions",
    fr: "Solutions postales",
    image: "/assets/images/service-mail.jpg",
    textEn:
      "We provide extensive knowledge and experience in mail delivery globally with daily connections to postal operators worldwide. Global network, proven expertise, reliable speed.",
    textFr:
      "Nous mettons à votre disposition une connaissance approfondie de la distribution postale mondiale, avec des liaisons quotidiennes vers les opérateurs postaux du monde entier. Réseau mondial, expertise éprouvée, rapidité fiable.",
  },
};

export function generateStaticParams() {
  return Object.keys(SERVICE_DETAILS).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = SERVICE_DETAILS[slug];
  if (!service) notFound();

  const title = locale === "fr" ? service.fr : service.en;
  const text = locale === "fr" ? service.textFr : service.textEn;

  return (
    <>
      <section className="relative flex items-end">
        <div className="absolute inset-0">
          <Image src={service.image} alt={title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="container relative pb-14 pt-56 lg:pb-20 lg:pt-72">
          <h1 className="max-w-gateway text-white">{title}</h1>
        </div>
      </section>

      <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
        <div className="container max-w-4xl">
          <div className="u-prose text-md">
            <p>{text}</p>
          </div>
          <div className="pt-8">
            <Link href="/tracking" className="btn btn-primary">
              {locale === "fr" ? "Suivre un colis" : "Track a parcel"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
