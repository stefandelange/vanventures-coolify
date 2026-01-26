// This is the ROOT layout - it MUST have html/body tags per Next.js requirements
// The locale-specific layout with header/footer is in [locale]/layout.tsx

import { Roboto } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2b2b2b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vanventures.blog"),
  title: {
    default: "VanVentures | Stories from life on the road",
    template: "%s | VanVentures",
  },
  description:
    "Road trip stories, van build lessons, and practical guides for embracing life on four wheels.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VanVentures",
  },
  icons: {
    icon: [
      { url: "/vanventures-logo-192.png", sizes: "192x192" },
      { url: "vanventures-logo-512.png", sizes: "512x512" },
    ],
    shortcut: "/vanventures-logo-192.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "192x192" },
      { url: "/vanventures-logo-512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "VanVentures | Stories from life on the road",
    description:
      "Road trip stories and practical guides for embracing life on four wheels.",
    url: "https://vanventures.blog",
    siteName: "VanVentures",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
