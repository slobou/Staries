import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import AppBootstrap from "@/components/AppBootstrap";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Staries — Publish it. Protect it. Prove it.",
    template: "%s · Staries",
  },
  description:
    "Staries connects authors and readers through fast publishing, immersive reading and curated quality. Every chapter you publish gets a permanent proof of authorship on the Stellar blockchain.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The wallet kit writes --swk-* CSS variables onto <html> before hydration.
      suppressHydrationWarning
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink text-white">
        <AppBootstrap />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
