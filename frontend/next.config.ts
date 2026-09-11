import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.76.108.155", "localhost", "127.0.0.1"],
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@designcodeio/threeui"],
};

export default nextConfig;
