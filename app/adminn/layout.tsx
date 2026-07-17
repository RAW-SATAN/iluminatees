import type { Metadata } from "next";

/*
 * Keep the admin panel out of search engines without advertising its
 * path in robots.txt (a disallow line there would reveal the URL).
 */
export const metadata: Metadata = {
  title: "ILUMINATEES",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
