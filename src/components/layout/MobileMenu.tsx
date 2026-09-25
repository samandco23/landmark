"use client";

import { useState } from "react";
import Link from "next/link";

export type MobileMenuProps = {
  labels: {
    services: string;
    destinations: string;
    allDestinations: string;
    parcelTracking: string;
    ourCompany: string;
    news: string;
    contactUs: string;
    businessEnquiry: string;
    clientLogin: string;
  };
  services: Array<{ label: string; href: string }>;
  destinations: Array<{ label: string; slug: string }>;
};

export function MobileMenu({ labels, services, destinations }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const linkClass =
    "block px-6 py-3 text-body font-medium text-grey-dark-01 hover:bg-grey-light-03 hover:text-red";
  const sectionClass =
    "px-6 pt-6 pb-2 text-xs font-bold uppercase tracking-wide text-grey-mid-02";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-card border-2 border-white/60 text-white transition-colors hover:bg-white/10"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-grey-light-01 bg-white pb-6 shadow-xl"
        >
          <ul>
            <li>
              <Link href="/tracking" className={linkClass} onClick={() => setOpen(false)}>
                {labels.parcelTracking}
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass} onClick={() => setOpen(false)}>
                {labels.ourCompany}
              </Link>
            </li>
            <li>
              <Link href="/news" className={linkClass} onClick={() => setOpen(false)}>
                {labels.news}
              </Link>
            </li>
            <li>
              <Link href="/careers" className={linkClass} onClick={() => setOpen(false)}>
                Careers
              </Link>
            </li>
            <li>
              <Link href="/portal/login" className={linkClass} onClick={() => setOpen(false)}>
                {labels.clientLogin}
              </Link>
            </li>
          </ul>

          <p className={sectionClass}>{labels.services}</p>
          <ul>
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className={`${linkClass} !py-2 text-sm`} onClick={() => setOpen(false)}>
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/technology/integrations" className={`${linkClass} !py-2 text-sm`} onClick={() => setOpen(false)}>
                Integrations
              </Link>
            </li>
            <li>
              <Link href="/technology/mercury" className={`${linkClass} !py-2 text-sm`} onClick={() => setOpen(false)}>
                Mercury
              </Link>
            </li>
          </ul>

          <p className={sectionClass}>{labels.destinations}</p>
          <ul className="flex flex-wrap gap-2 px-6">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/destinations/${d.slug}`}
                  onClick={() => setOpen(false)}
                  className="inline-block rounded-badge bg-grey-light-03 px-3 py-1.5 text-sm text-grey-dark-01 hover:bg-grey-light-01"
                >
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-6 pt-6">
            <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              {labels.businessEnquiry}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
