import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "fr", "ru"] as const;
export type Locale = (typeof locales)[number];

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import ru from "../messages/ru.json";

const MESSAGES: Record<Locale, typeof en> = { en, fr, ru };

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: MESSAGES[locale as Locale],
  };
});
