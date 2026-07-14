import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyBubble } from "@/components/StickyBubble";

export const metadata: Metadata = {
  title: "ILUMINATEES — Not Made To Fit In.",
  description: "Dark luxury streetwear. Limited drops. Heavyweight cotton. No compromises.",
  keywords: ["streetwear", "illuminati", "luxury", "oversized tee", "limited edition", "India"],
  openGraph: {
    title: "ILUMINATEES — Not Made To Fit In.",
    description: "Wear the Unseen. Speak the Unspoken.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="grain min-h-full antialiased">
        <CartProvider>
          {/* Film grain — from globals.css .grain::after */}
          <Navbar />
          {/*
            Navbar height:
              top bar    62px
              cat tabs   36px
              marquee    28px
              total    ~126px
          */}
          <main style={{ paddingTop: 126 }}>{children}</main>
          <Footer />
          <StickyBubble />
        </CartProvider>
      </body>
    </html>
  );
}
