import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nakhon Nayok Trip - ท่องเที่ยวนครนายก",
    short_name: "Nakhon Nayok",
    description: "แอปพลิเคชันแนะนำสถานที่ท่องเที่ยวและวางแผนทริปจังหวัดนครนายก",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "192x192 512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
