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
  description:
    "Tableau de bord administrateur Senthales pour la gestion de notre boutique en ligne",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  authors: [{ name: "Senthales" }],
  creator: "Senthales",
  publisher: "Senthales",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://manage.senthales.com",
    siteName: "Senthales",
    title: "Senthales - Tableau de bord administrateur",
    description:
      "Tableau de bord administrateur Senthales pour la gestion de notre boutique en ligne",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Senthales - Tableau de bord administrateur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senthales - Tableau de bord administrateur",
    description:
      "Tableau de bord administrateur Senthales pour la gestion de notre boutique en ligne",
    images: ["/favicon.png"],
    creator: "Senthales",
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
