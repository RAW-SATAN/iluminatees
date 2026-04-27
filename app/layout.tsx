import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ILUMINATEES — Wear the Unseen",
  description: "Secret society streetwear. Exclusive threads for the initiated. Limited drops. Timeless symbols.",
  keywords: ["streetwear", "tshirt", "illuminati", "exclusive", "limited edition"],
  openGraph: {
    title: "ILUMINATEES",
    description: "Wear the Unseen. Speak the Unspoken.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <CartProvider>
          <div className="relative min-h-screen flex flex-col">
            {/* Film grain overlay */}
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "256px",
                animation: "grain 0.5s steps(2) infinite",
              }}
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
