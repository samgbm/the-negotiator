import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  serverActions: {
    // Inventory PDFs routinely exceed the 1MB default
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;
