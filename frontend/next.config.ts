import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@designcodeio/threeui"],
};

export default nextConfig;
