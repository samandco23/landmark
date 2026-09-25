"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { locales } from "@/i18n";

const LABELS: Record<string, { region: string; lang: string }> = {
  en: { region: "Europe & Asia", lang: "EN" },
  fr: { region: "Europe & Asie", lang: "FR" },
};

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.6 2.6 3.9 5.7 3.9 9S14.6 18.4 12 21M12 3c-2.6 2.6-3.9 5.7-3.9 9s1.3 6.4 3.9 9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LABELS[locale] ?? LABELS.en;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Remplace le préfixe de locale courant par l'autre (garde le reste du chemin).
  function hrefFor(target: string): string {
    return pathname.replace(new RegExp(`^/${locale}(/|$)`), `/${target}$1`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
      >
        <GlobeIcon />
        <span>
          {current.region} - {current.lang}
        </span>
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 rounded-card bg-white py-2 text-grey-dark-01 shadow-xl"
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={hrefFor(l)}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-5 py-2.5 text-sm hover:bg-grey-light-03 hover:text-red ${
                l === locale ? "font-semibold" : ""
              }`}
            >
              <span>{l === "fr" ? "Europe & Asie" : "Europe & Asia"}</span>
              <span className="text-grey-mid-02">{l.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
