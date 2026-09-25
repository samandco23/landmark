import type { Metadata } from "next";
import { haffer, ppformula } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cross-Border E-Commerce Logistics | Landmark Global",
    template: "%s | Landmark Global",
  },
  description:
    "International logistics services for companies - we are experts in parcel transport, customs clearance and delivery of e-commerce products.",
  applicationName: "Landmark Global",
  keywords: [
    "cross-border logistics",
    "ecommerce shipping",
    "international parcel delivery",
    "customs clearance",
    "fulfillment",
    "returns management",
    "global mail",
  ],
  authors: [{ name: "Landmark Global" }],
  creator: "Landmark Global",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/assets/favicon/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Landmark Global",
    locale: "en",
    alternateLocale: ["fr"],
    images: [
      {
        url: "/assets/images/hero-home.jpg",
        width: 1600,
        height: 900,
        alt: "Landmark Global logistics network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross-Border E-Commerce Logistics | Landmark Global",
    description:
      "International logistics services for companies - parcel transport, customs clearance and e-commerce delivery to 220+ destinations.",
    images: ["/assets/images/hero-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
      "x-default": "/en",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${haffer.variable} ${ppformula.variable} font-sans antialiased`}
        style={
          {
            "--font-haffer": haffer.style.fontFamily,
            "--font-ppformula": ppformula.style.fontFamily,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
