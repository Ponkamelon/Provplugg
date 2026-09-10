import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Display: Fraunces — varm, lätt äventyrlig serif för rubriker.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

// Body/UI: Plus Jakarta Sans — hög läsbarhet på mobil, snäll mot elever
// med lässvårigheter.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

// Utility: IBM Plex Mono — för procent, timers och statistik.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ProvPlugget",
  description: "Foto, PDF eller anteckningar in. Korta frågor ut. Vi fixar det.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sv"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
