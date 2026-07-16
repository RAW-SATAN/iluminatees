import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

const REPO   = "RAW-SATAN/iluminatees";
const FILE   = "lib/products.ts";
const BRANCH = "main";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function buildProductEntry(p: {
  id: string; slug: string; name: string; category: string;
  price: number; originalPrice?: number; sizes: string[];
  inStock: boolean; limited: boolean; description?: string;
}) {
  const lines = [
    `  {`,
    `    id: "${p.id}",`,
    `    slug: "${p.slug}",`,
    `    name: "${p.name.replace(/"/g, '\\"')}",`,
    `    codename: "DOSSIER-${p.id.replace("custom-", "").toUpperCase()}",`,
    `    category: "${p.category}",`,
    `    price: ${p.price},`,
    p.originalPrice ? `    originalPrice: ${p.originalPrice},` : null,
    `    description: "${(p.description ?? "").replace(/"/g, '\\"').replace(/\n/g, "\\n")}",`,
    `    lore: "",`,
    `    symbol: "eye",`,
    `    shirtColor: "#111111",`,
    `    accentColor: "#c9a84c",`,
    `    sizes: [${p.sizes.map((s) => `"${s}"`).join(", ")}],`,
    `    inStock: ${p.inStock},`,
    `    limited: ${p.limited},`,
    `    tags: [],`,
    `  },`,
  ].filter(Boolean).join("\n");
  return lines;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return NextResponse.json({ error: "GITHUB_TOKEN not set in environment" }, { status: 500 });

    const body = await req.json();

    const id   = body.id   ?? `custom-${Date.now()}`;
    const slug = body.slug ?? slugify(body.name ?? id);

    const sizesArr: string[] = Array.isArray(body.sizes)
      ? body.sizes
      : (body.sizes ?? "S,M,L,XL").split(",").map((s: string) => s.trim());

    const product = {
      id,
      slug,
      name:          body.name ?? "Untitled",
      category:      body.category ?? "APEX",
      price:         Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      sizes:         sizesArr,
      inStock:       body.inStock !== false,
      limited:       !!body.limited,
      description:   body.description ?? "",
    };

    /* ── 1. Read current file from GitHub ── */
    const getRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
    );
    if (!getRes.ok) {
      const err = await getRes.json();
      return NextResponse.json({ error: `GitHub read failed: ${err.message}` }, { status: 500 });
    }
    const fileData = await getRes.json();
    const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
    const sha = fileData.sha;

    /* ── 2. Check product ID not already present ── */
    if (currentContent.includes(`id: "${product.id}"`)) {
      return NextResponse.json({ error: "Product with this ID already exists" }, { status: 409 });
    }

    /* ── 3. Insert new product before closing ]; ── */
    const newEntry = buildProductEntry(product);
    const updated  = currentContent.replace(
      /(\];\n\nexport function)/,
      `${newEntry}\n$1`
    );
    if (updated === currentContent) {
      return NextResponse.json({ error: "Could not locate insertion point in products.ts" }, { status: 500 });
    }

    /* ── 4. Commit back to GitHub ── */
    const putRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: `feat: add product "${product.name}" via admin`,
          content: Buffer.from(updated).toString("base64"),
          sha,
          branch: BRANCH,
        }),
      }
    );
    if (!putRes.ok) {
      const err = await putRes.json();
      return NextResponse.json({ error: `GitHub commit failed: ${err.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug: product.slug });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
