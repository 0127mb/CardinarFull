import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001");

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/constructor",
        destination: "/designer",
      },
    ];
  },
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/identicons/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
