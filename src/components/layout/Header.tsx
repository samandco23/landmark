import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChevronDown } from "@/components/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { DESTINATIONS } from "@/lib/destinations";

const SERVICE_LINKS = [
  { label: "Cross-Border Shipping", href: "/services/parcel-delivery" },
  { label: "US Domestic Shipping", href: "/services/us-domestic-shipping" },
  { label: "Canada Domestic Shipping", href: "/services/canada-domestic-shipping" },
  { label: "Fulfillment Solutions", href: "/services/fulfillment-solutions" },
  { label: "Trade Services", href: "/services/customs-clearance" },
  { label: "Returns Solutions", href: "/services/returns-management" },
];

export async function Header() {
  const t = await getTranslations("nav");

  const destinations = DESTINATIONS.map((d) => ({ label: d.en, slug: d.slug }));

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white">
      <div className="container">
        {/* ── Utility bar (top right) ─────────────────────────────────── */}
        <div className="hidden items-center justify-end gap-6 pt-3 text-[13px] text-white/85 lg:flex">
          <Link href="/contact" className="hover:text-white hover:underline underline-offset-4">
            {t("contactUs")}
          </Link>
          <Link href="/tracking" className="hover:text-white hover:underline underline-offset-4">
            {t("parcelTracking")}
          </Link>
          <div className="group relative">
            <button className="flex items-center gap-1.5 hover:text-white">
              {t("ourCompany")}
              <ChevronDown />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-64 bg-white py-3 text-grey-dark-01 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <ul>
                <li>
                  <Link href="/about" className="block px-5 py-2.5 hover:bg-grey-light-03 hover:text-red">
                    {t("ourCompany")}
                  </Link>
                </li>
                <li>
                  <Link href="/sustainability" className="block px-5 py-2.5 hover:bg-grey-light-03 hover:text-red">
                    {t("sustainability")}
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="block px-5 py-2.5 hover:bg-grey-light-03 hover:text-red">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link href="/portal/login" className="hover:text-white hover:underline underline-offset-4">
            {t("clientLogin")}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* ── Main nav row ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-6 pb-3 pt-3 lg:pt-1">
          <Link href="/" className="block h-9 lg:h-12" aria-label="Landmark Global">
            <Image
              src="/assets/logos/landmark-logo.svg"
              alt="Landmark Global"
              width={206}
              height={56}
              className="h-full w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 text-[15px] lg:flex" aria-label="Main">
            {/* Ecommerce Solutions */}
            <div className="group relative">
              <Link href="/services/ecommerce-delivery" className="flex items-center gap-1.5 py-2">
                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:group-hover:w-full">
                  Ecommerce Solutions
                </span>
                <ChevronDown />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-72 bg-white py-4 text-grey-dark-01 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <ul>
                  {SERVICE_LINKS.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="block px-6 py-2.5 hover:bg-grey-light-03 hover:text-red">
                        {s.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/services"
                      className="block px-6 py-2.5 font-semibold text-red hover:bg-grey-light-03"
                    >
                      All services →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/services/international-mail-delivery" className="py-2 hover:underline underline-offset-4">
              Mail Solutions
            </Link>

            {/* Destinations */}
            <div className="group relative">
              <Link href="/#global-reach" className="flex items-center gap-1.5 py-2">
                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:group-hover:w-full">
                  {t("destinations")}
                </span>
                <ChevronDown />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-64 bg-white py-4 text-grey-dark-01 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <ul>
                  {destinations.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/destinations/${d.slug}`}
                        className="block px-6 py-2.5 hover:bg-grey-light-03 hover:text-red"
                      >
                        {d.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/#global-reach"
                      className="block px-6 py-2.5 font-semibold text-red hover:bg-grey-light-03"
                    >
                      {t("allDestinations")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Technology */}
            <div className="group relative">
              <button className="flex items-center gap-1.5 py-2">
                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:group-hover:w-full">
                  Technology
                </span>
                <ChevronDown />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-56 bg-white py-4 text-grey-dark-01 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <ul>
                  <li>
                    <Link href="/technology/integrations" className="block px-6 py-2.5 hover:bg-grey-light-03 hover:text-red">
                      Integrations
                    </Link>
                  </li>
                  <li>
                    <Link href="/technology/mercury" className="block px-6 py-2.5 hover:bg-grey-light-03 hover:text-red">
                      Mercury
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/news" className="py-2 hover:underline underline-offset-4">
              {t("news")}
            </Link>

            <Link href="/contact" className="btn btn-primary btn-sm ml-2">
              {t("businessEnquiry")}
            </Link>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="lg:hidden">
              <LanguageSwitcher />
            </div>
            <MobileMenu
              labels={{
                services: t("services"),
                destinations: t("destinations"),
                allDestinations: t("allDestinations"),
                parcelTracking: t("parcelTracking"),
                ourCompany: t("ourCompany"),
                news: t("news"),
                contactUs: t("contactUs"),
                businessEnquiry: t("businessEnquiry"),
                clientLogin: t("clientLogin"),
              }}
              services={[...SERVICE_LINKS, { label: "Ecommerce Solutions", href: "/services/ecommerce-delivery" }, { label: "Mail Solutions", href: "/services/international-mail-delivery" }]}
              destinations={destinations}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
