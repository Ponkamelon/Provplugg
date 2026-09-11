import type { Metadata } from "next";
import { Anton, Inter, IBM_Plex_Mono, Caveat } from "next/font/google";
import "./globals.css";

// Display: Anton — tjock, komprimerad "impact"-stil för rubriker.
// Närmaste gratis motsvarighet till moodboardens "Anchor Impact".
const anton = Anton({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

// Body/UI: Inter — ren, modern, hög läsbarhet i app och webb.
const inter = Inter({
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

// Accent/handstil: Caveat — för highlights och pepp ("Klura mer!").
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "ProvKlura",
  description: "Klura ut provet. Foto, PDF eller anteckningar in. Korta frågor ut.",
};

export const viewport = {
  themeColor: "#1D5D7A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sv"
      className={`${anton.variable} ${inter.variable} ${plexMono.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
