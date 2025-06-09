import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ProviderSession } from "@/components/ProviderSession";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "senthales",
  description: "Tableau de bord administrateur Senthales pour la gestion de notre boutique en ligne",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased`}
        suppressHydrationWarning
      >
        <ProviderSession>
          {children}
          <Toaster />
        </ProviderSession>
      </body>
    </html>
  );
}
