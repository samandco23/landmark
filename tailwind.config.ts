import type { Config } from "tailwindcss";

/**
 * Design tokens extraits du CSS compilé du site source (variables --color-* en HSL,
 * échelle typographique --font-size-*, container 92rem, block-padding clamp).
 * Les couleurs sont pré-calculées en hex : la syntaxe hsl(var(--x) / α) n'est pas
 * supportée par tous les moteurs embarqués (Electron/Chromium 130 inclus).
 */
const config: Config = {
  // "media" = suit automatiquement la préférence système (prefers-color-scheme).
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "4rem",
      },
      screens: {
        "2xl": "92rem",
      },
    },
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        body: "#333333",
        "grey-dark": "#1e1c1b",
        "grey-dark-01": "#333333",
        "grey-dark-02": "#4d4d4d",
        "grey-mid": "#757575",
        "grey-mid-01": "#5a544f",
        "grey-mid-02": "#968f89",
        "grey-light": "#f3ece7",
        "grey-light-01": "#e1e1e1",
        "grey-light-02": "#eaeaea",
        "grey-light-03": "#f3f3f3",
        "grey-warm": "#e8e0da",
        red: {
          DEFAULT: "#f4414e",
          dark: "#b90d3a",
          wcag: "#d31f3d",
        },
        orange: {
          DEFAULT: "#f5a342",
          dark: "#e96a35",
        },
        yellow: "#fcde58",
        pink: {
          DEFAULT: "#ffc0ea",
          dark: "#e2337e",
        },
        "blue-light": "#8fb4f9",
      },
      fontFamily: {
        sans: ["var(--font-haffer)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-ppformula)", "var(--font-haffer)", "ui-sans-serif", "sans-serif"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.45" }],
        sm: ["13px", { lineHeight: "1.5" }],
        body: ["18px", { lineHeight: "1.6" }],
        md: ["19px", { lineHeight: "1.6" }],
        lg: ["20px", { lineHeight: "1.5" }],
        xl: ["22px", { lineHeight: "1.4" }],
        "2xl": ["24px", { lineHeight: "1.25" }],
        "3xl": ["36px", { lineHeight: "1.15" }],
      },
      maxWidth: {
        content: "40rem",
        gateway: "48rem",
        prose: "34rem",
        usps: "50rem",
      },
      borderRadius: {
        card: "12px",
        badge: "4px",
      },
      backgroundImage: {
        "hero-overlay": "linear-gradient(225deg, #0000 23.57%, #00000080 58.33%)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.5, 1, .89, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
