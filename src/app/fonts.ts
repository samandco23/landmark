import localFont from "next/font/local";

export const haffer = localFont({
  src: [
    { path: "./fonts/haffer-light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/haffer-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/haffer-semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/haffer-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-haffer",
  display: "swap",
});

export const ppformula = localFont({
  src: [{ path: "./fonts/ppformula-semiextendedblack.woff2", weight: "900", style: "normal" }],
  variable: "--font-ppformula",
  display: "swap",
});
