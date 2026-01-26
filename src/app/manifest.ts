import { MetadataRoute } from "next";
import { CDN_URL } from "@/config/cdn";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VanVentures | Stories from life on the road",
    short_name: "VanVentures",
    description:
      "Road trip stories, van build lessons, and practical guides for embracing life on four wheels.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2b2b2b",
    orientation: "portrait-primary",
    icons: [
      {
        src: `${CDN_URL}/vanventures-logo-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${CDN_URL}/vanventures-logo-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${CDN_URL}/vanventures-logo-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["travel", "lifestyle", "blog"],
    lang: "en-GB",
  };
}
