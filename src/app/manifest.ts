import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Landmark Global — Cross-Border E-Commerce Logistics",
    short_name: "Landmark Global",
    description:
      "International logistics services for companies - parcel transport, customs clearance and delivery of e-commerce products to 220+ destinations.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/assets/favicon/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/assets/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
