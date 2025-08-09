import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bud",
    short_name: "Bud",
    description: "A simple budget tracker app",
    start_url: "/app",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#10B981",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    lang: "en",
    categories: ["finance", "productivity"],
  };
}
