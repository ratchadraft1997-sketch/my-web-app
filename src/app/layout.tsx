import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nakhon Nayok Trip | ท่องเที่ยวนครนายก",
  description: "เว็บแอปพลิเคชันแนะนำสถานที่ท่องเที่ยวและวางแผนทริปจังหวัดนครนายก",
  applicationName: "Nakhon Nayok Trip",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nakhon Nayok",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className="flex min-h-full flex-col antialiased bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Header />
        <main className="mx-auto w-full max-w-md flex-1 px-4 pb-24 sm:max-w-lg md:max-w-2xl">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
