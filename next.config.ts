import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.144",
    "192.168.1.144:3000",
    "192.168.1.144:3001",
    "192.168.1.*",
    "192.168.*.*",
    "172.*.*.*",
    "localhost",
    "localhost:3000",
    "localhost:3001",
    "127.0.0.1",
    "127.0.0.1:3000",
    "127.0.0.1:3001",
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
