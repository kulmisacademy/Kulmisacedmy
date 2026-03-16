import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NeonBackground } from "@/components/NeonBackground";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { WhatsAppChatButton } from "@/components/WhatsAppChatButton";

export const metadata: Metadata = {
  title: "Kulmis Academy – Learn Future Skills",
  description:
    "High quality online courses designed to help you master technology, coding, and digital skills. From AI to Web3, start your career today.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/kulmis-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/kulmis-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/kulmis-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body className="min-h-screen w-full overflow-x-hidden bg-white/80 text-gray-800 antialiased transition-colors duration-300">
        <NeonBackground />
        <div className="relative min-h-screen w-full min-w-0">{children}</div>
        <PwaInstallPrompt />
        <WhatsAppChatButton />
      </body>
    </html>
  );
}
