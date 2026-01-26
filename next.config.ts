import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/bunny-image-loader.ts",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year - images are immutable
  },
};

export default withNextIntl(nextConfig);
