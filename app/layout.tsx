import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Amir Suhail | Full-Stack Web Developer",
    template: "%s | Amir Suhail",
  },

  description:
    "Amir Suhail is a Full-Stack Web Developer building modern, responsive and scalable web applications with React, Next.js, TypeScript and backend technologies.",

  keywords: [
    "Amir Suhail",
    "Full-Stack Web Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Node.js Developer",
    "Portfolio",
    "Freelance Web Developer",
  ],

  authors: [
    {
      name: "Amir Suhail",
    },
  ],

  creator: "Amir Suhail",
  publisher: "Amir Suhail",

  verification: {
    google: "n-1_L4YTTQZo0ihXyD5P4rgdpsVgPGwLpe_9kiUO95w",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Amir Suhail | Full-Stack Web Developer",
    description:
      "Portfolio of Amir Suhail, a Full-Stack Web Developer building modern and scalable web applications.",
    siteName: "Amir Suhail Portfolio",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}