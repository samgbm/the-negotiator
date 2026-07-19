import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    // Inventory PDFs routinely exceed the 1MB default
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
