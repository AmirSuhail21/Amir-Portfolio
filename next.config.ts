
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

  async redirects() {
    return [
      {
        source: "/:path*",
        destination:
          "https://amir-suhail-portfolio.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
