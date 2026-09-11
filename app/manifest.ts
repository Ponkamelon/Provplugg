import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProvKlura",
    short_name: "ProvKlura",
    description: "Klura ut provet. Foto, PDF eller anteckningar in. Korta frågor ut.",
    start_url: "/",
    display: "standalone",
    background_color: "#E7D7B2",
    theme_color: "#1D5D7A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
