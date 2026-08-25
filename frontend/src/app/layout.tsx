import type { Metadata } from "next";
import { Viewport } from "next";
import "@designcodeio/threeui/style.css";
import "./globals.css";
import CustomCursor from "@/components/fx/CustomCursor";

export const metadata: Metadata = {
  title: "SafeZone - Gamified Disaster Preparedness | SIH 2026",
  description:
    "Train today, survive tomorrow. A unified AI-powered platform combining gamified disaster education, immersive 3D simulation, and real-time multi-agency emergency command for Indian schools and colleges.",
  keywords: [
    "disaster preparedness",
    "SIH 2026",
    "school safety",
    "NDMA",
    "gamified education",
    "emergency simulation",
  ],
  openGraph: {
    title: "SafeZone - Disaster Preparedness Education Platform",
    description:
      "AI-powered gamified disaster training for schools. Real simulations. Real safety.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0F1E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
