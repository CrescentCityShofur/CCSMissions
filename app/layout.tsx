import type { Metadata, Viewport } from "next";
import { Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CCS Mothership | Command Terminal",
  description: "CCS Missions - Louisiana Corridor Grid Command Interface",
};

export const viewport: Viewport = {
  themeColor: "#0a0118",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-midnight">
      <body className={`${cinzel.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
