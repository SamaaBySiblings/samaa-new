// app/layout.tsx or app/layout.ts
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import HeaderWrapper from "@/components/HeadWrapper";
import ReactQueryProvider from "@/utils/providers";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import ClientCartWrapper from "@/components/ClientCartWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import CustomCursor from "@/components/CustomCursor";

// GTM ID
const GTM_ID = "GTM-5F66PPD9";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

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
