import type { Metadata, Viewport } from "next";
import * as React from "react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { movieProvider } from "@/lib/providers";
import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0F12",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rubbyfilm.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RubbyFilm - Nền tảng xem phim trực tuyến hiện đại",
    template: "%s | RubbyFilm",
  },
  description: "RubbyFilm mang đến trải nghiệm xem phim điện ảnh đỉnh cao, chất lượng 4K Ultra HD, tốc độ mượt mà và giao diện chuẩn quốc tế.",
  keywords: ["xem phim", "phim moi", "phim hd", "phim chieu rap", "phim bo", "phim le", "rubbyfilm", "phim vietsub"],
  authors: [{ name: "RubbyFilm Team" }],
  creator: "RubbyFilm",
  publisher: "RubbyFilm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    title: "RubbyFilm - Nền tảng xem phim trực tuyến hiện đại",
    description: "Khám phá thế giới phim ảnh chất lượng cao 4K Ultra HD, cập nhật phim mới nhanh nhất với tốc độ mượt mà.",
    siteName: "RubbyFilm",
  },
  twitter: {
    card: "summary_large_image",
    title: "RubbyFilm - Nền tảng xem phim trực tuyến hiện đại",
    description: "Khám phá thế giới phim ảnh chất lượng cao 4K Ultra HD, cập nhật phim mới nhanh nhất với tốc độ mượt mà.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/auth/authContext";
import { SwipeBackNavigation } from "@/components/common/swipe-back-navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [genres, countries] = await Promise.all([
    movieProvider.getGenres(),
    movieProvider.getCountries(),
  ]);

  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect & DNS-prefetch for fastest possible image & API transmission */}
        <link rel="preconnect" href="https://phimimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://phimimg.com" />
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${beVietnamPro.variable} ${spaceGrotesk.variable} ${beVietnamPro.className} font-sans min-h-screen flex flex-col bg-[#0F0F0F] text-[#D1D5DB] antialiased selection:bg-brand selection:text-white`}
      >
        <ToastProvider>
          <AuthProvider>
            <SwipeBackNavigation />
            <React.Suspense fallback={null}>
              <Header genres={genres} countries={countries} />
            </React.Suspense>
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
