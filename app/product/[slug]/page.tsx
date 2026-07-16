import type { Metadata } from "next";
import { getProductBySlug, products } from "@/lib/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "ILUMINATEES — Not Made To Fit In." };

  const description = (p.description.split("\n")[0] || "Limited drop heavyweight streetwear tee.").slice(0, 160);
  const title = `${p.name} — ILUMINATEES`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: `/products/${p.slug}/0.jpg`, width: 900, height: 900, alt: p.name }],
    },
  };
}

export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
