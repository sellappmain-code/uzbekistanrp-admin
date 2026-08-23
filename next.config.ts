import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "uzbekistanrp.uz" },
      { protocol: "http", hostname: "169.58.38.68" },
    ],
  },
};

export default nextConfig;
