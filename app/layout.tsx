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
    "Amir Suhail is a Full-Stack Web Developer specializing in React, Next.js, TypeScript, JavaScript, Node.js and modern web applications.",

  keywords: [
    "Amir Suhail",
    "Amir Suhail Developer",
    "Full-Stack Web Developer",
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Node.js Developer",
    "Frontend Developer",
    "Backend Developer",
    "Freelance Web Developer",
    "Web Development Portfolio",
  ],

  authors: [
    {
      name: "Amir Suhail",
    },
  ],

  creator: "Amir Suhail",
  publisher: "Amir Suhail",

  category: "technology",

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "n-1_L4YTTQZo0ihXyD5P4rgdpsVgPGwLpe_9kiUO95w",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Amir Suhail | Full-Stack Web Developer",
    description:
      "Portfolio of Amir Suhail, a Full-Stack Web Developer specializing in React, Next.js, TypeScript, JavaScript and Node.js.",
    siteName: "Amir Suhail Portfolio",
  },

  twitter: {
    card: "summary_large_image",
    title: "Amir Suhail | Full-Stack Web Developer",
    description:
      "Portfolio of Amir Suhail, a Full-Stack Web Developer building modern web applications.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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