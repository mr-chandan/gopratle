import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoPratle Requirement Posting",
  description: "Post event hiring requirements for planners, performers, or crew.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="app-background">
          <div className="bg-noise" />
          <div className="bg-grid" />
          <div className="ambient-blob blob-primary" />
          <div className="ambient-blob blob-left" />
          <div className="ambient-blob blob-right" />
          <div className="ambient-blob blob-bottom" />
          {children}
        </div>
      </body>
    </html>
  );
}
