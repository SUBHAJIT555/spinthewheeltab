import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spin The Wheel",
  description: "CX Day Surprise — Spin the Wheel",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.ico",
    apple: "/img/Fab-Logo.png",
  },
  appleWebApp: {
    capable: true,
    title: "Spin to Win",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
