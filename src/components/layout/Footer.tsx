import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DESTINATIONS } from "@/lib/destinations";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const solutions = [
    { label: "Parcel Delivery", href: "/services/parcel-delivery" },
    { label: "Trade Services", href: "/services/customs-clearance" },
    { label: "Return Solutions", href: "/services/returns-management" },
    { label: "Ecommerce Solutions", href: "/services/ecommerce-delivery" },
    { label: "Mail Solutions", href: "/services/international-mail-delivery" },
  ];

  const policies = [
    { label: t("legal.privacy"), href: "/legal/privacy-policy" },
    { label: t("legal.terms"), href: "/legal/terms-and-conditions" },
    { label: t("legal.cookies"), href: "/legal/cookie-policy" },
    { label: t("legal.accessibility"), href: "/legal/accessibility-statement" },
  ];

  const latestNews = [
    { label: "New EU Regulation Targets Greenwashing: as of September 27", href: "/news" },
    { label: "Which Logistics Provider Should an Enterprise Brand Use for EU Expansion?", href: "/news" },
    { label: "Landmark Global to join EU CBEC Forum 2026, with Olivier Leruth speaking on marketplace panel", href: "/news" },
    { label: "Top 10 Essential Facts About Belgium Ecommerce [2026 Edition]", href: "/news" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container">
        <div className="flex flex-col gap-12 py-16 lg:flex-row lg:justify-between lg:pt-20">
          <div className="flex w-full max-w-prose flex-col items-start gap-4 lg:w-auto lg:max-w-xs">
            <Image
              src="/assets/logos/landmark-logo.svg"
              alt="Landmark Global"
              width={206}
              height={56}
              className="h-16 w-auto"
            />
            <div className="u-prose u-stack gap-4 text-body">
              <p>{t("addresses")}</p>
              <p>{t("addressesUk")}</p>
              <p>{t("tagline")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-16">
            <nav aria-label={t("solutions")}>
              <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-white/60">
                {t("solutions")}
              </h3>
              <ul className="space-y-2.5 text-body">
                {solutions.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="text-white/80 hover:text-white hover:underline">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={t("destinations")}>
              <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-white/60">
                {t("destinations")}
              </h3>
              <ul className="space-y-2.5 text-body">
                {DESTINATIONS.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/destinations/${d.slug}`}
                      className="text-white/80 hover:text-white hover:underline"
                    >
                      {d.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Policies">
              <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-white/60">
                Policies
              </h3>
              <ul className="space-y-2.5 text-body">
                {policies.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="text-white/80 hover:text-white hover:underline">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Latest News">
              <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-white/60">
                Latest News
              </h3>
              <ul className="space-y-2.5 text-sm text-white/80">
                {latestNews.map((n) => (
                  <li key={n.label}>
                    <Link href={n.href} className="line-clamp-3 hover:text-white hover:underline">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-grey-mid-01 py-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-white/70">©{new Date().getFullYear()} Landmark Global</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/70">
            <li><Link href="/contact" className="hover:text-white hover:underline">{nav("contactUs")}</Link></li>
            <li><Link href="/sustainability" className="hover:text-white hover:underline">{nav("sustainability")}</Link></li>
            <li><Link href="/about" className="hover:text-white hover:underline">{nav("ourCompany")}</Link></li>
            <li><Link href="/portal/login" className="hover:text-white hover:underline">{nav("mercury")} Log In</Link></li>
            <li><Link href="/careers" className="hover:text-white hover:underline">Careers</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
