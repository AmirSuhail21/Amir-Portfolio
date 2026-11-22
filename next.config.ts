import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "czmcmhftqghfhcwlsvaw.supabase.co",
        pathname: "/storage/v1/object/public/portfolio/**",
      },
    ],
  },
};

export default nextConfig;