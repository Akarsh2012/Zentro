import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zentro — Trusted professionals, the moment you need one",
  description:
    "Describe what you need in plain words. Zentro finds verified professionals near you — ranked by rating, distance and price — with an AI assistant to help you compare and a payment held safe until you approve the work.",
  metadataBase: new URL("https://zentro.com"),
  openGraph: {
    title: "Zentro — Trusted professionals, the moment you need one",
    description:
      "Describe what you need. Get verified pros near you, ranked and compared. Pay only when you approve.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E4D45",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
