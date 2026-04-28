import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { ImmersiveNavbar } from "@/components/ImmersiveNavbar";
import { ImmersiveFooter } from "@/components/home/ImmersiveFooter";
import { LenisProvider } from "@/components/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "ILUMINATEES — Not Made To Fit In.",
  description: "Dark brutalist luxury streetwear. Limited drops. Heavyweight cotton. No compromises.",
  keywords: ["streetwear","illuminati","luxury","oversized tee","limited edition","India"],
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
        <LenisProvider>
          <CartProvider>
            <CustomCursor />
            <ImmersiveNavbar />
            <main>{children}</main>
            <ImmersiveFooter />
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
