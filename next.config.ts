import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Disable Next.js image optimization to avoid issues on some mobile/prod setups
    // We serve images directly from the public folder
    unoptimized: true,
  },
};

export default nextConfig;
