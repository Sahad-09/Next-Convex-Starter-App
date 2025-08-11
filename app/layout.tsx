import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/convex-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Jelly Forge — AI 3D Icon & App Icon Generator",
    template: "%s — Jelly Forge",
  },
  description:
    "Jelly Forge turns your logos into stunning 3D, glassmorphism app icons. Upload a logo and get a high‑quality, transparent PNG ready for iOS, Android, and web.",
  keywords: [
    "3D icon generator",
    "AI icon generator",
    "logo to 3D",
    "app icon generator",
    "glassmorphism icon",
    "transparent background icon",
    "SVG to icon",
    "iOS app icon",
    "Android adaptive icon",
    "brand logo 3D",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jelly Forge — AI 3D Icon & App Icon Generator",
    description:
      "Convert logos into beautiful 3D jelly icons with glass and glow effects. Download transparent PNGs for apps and websites.",
    url: appUrl,
    siteName: "Jelly Forge",
    images: [
      {
        url: "/window.svg",
        width: 1200,
        height: 630,
        alt: "Jelly Forge — 3D Icon Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jelly Forge — AI 3D Icon & App Icon Generator",
    description:
      "Upload your logo and get a studio‑quality 3D jelly icon. Perfect for app icons and branding.",
    images: ["/window.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
