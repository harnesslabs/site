import type { Metadata } from "next";
import { Red_Hat_Mono, Red_Hat_Text } from "next/font/google";

import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

const redHatText = Red_Hat_Text({
  subsets: ["latin"],
  variable: "--font-red-hat-text",
});

const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  variable: "--font-red-hat-mono",
});

export const metadata: Metadata = {
  title: "Harness Labs",
  description: "biological abstractions",
  openGraph: {
    title: "Harness Labs",
    description: "biological abstractions",
    images: [
      {
        url: "/tag.png",
        width: 1200,
        height: 630,
        alt: "Harness Labs",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harness Labs",
    description: "biological abstractions",
    images: ["/tag.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${redHatText.variable} ${redHatMono.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-dvh">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
