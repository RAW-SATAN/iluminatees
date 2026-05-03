import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoundrOS — HR & Payroll for Indian Founders",
  description: "All-in-one HR, attendance, payroll, and compliance for Indian startups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
