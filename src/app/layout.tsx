import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import HeaderWrapper from "@/components/HeadWrapper";
import ReactQueryProvider from "@/utils/providers";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import ClientCartWrapper from "@/components/ClientCartWrapper";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "SAMAA | Luxury Candles & Stories",
  description: "Elegant luxury candles and inspiring stories by SAMAA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <HeaderWrapper />

        <main className="flex-grow">
          <ReactQueryProvider>
            <CurrencyProvider>
              <CustomCursor />
              {children}
              <Toaster position="top-right" />
              <ClientCartWrapper />
            </CurrencyProvider>
          </ReactQueryProvider>
           <SpeedInsights />
            <Analytics />
        </main>

        <Footer />
      </body>
    </html>
  );
}
