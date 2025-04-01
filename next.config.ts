import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "zmiekbwiadldmspvlrmj.supabase.co",
      },
    ],
  },
};

export default nextConfig;
