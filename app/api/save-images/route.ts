import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

const REPO   = "RAW-SATAN/iluminatees";
const BRANCH = "main";

async function githubGet(token: string, path: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
  );
  return res;
}

async function githubPut(token: string, path: string, content: string, sha: string | undefined, message: string) {
  const body: Record<string, unknown> = { message, content, branch: BRANCH };
  if (sha) body.sha = sha;
  return fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/vnd.github+json" },
      body: JSON.stringify(body),
    }
  );
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return NextResponse.json({ error: "GITHUB_TOKEN not set" }, { status: 500 });

    const { slug, images }: { slug: string; images: string[] } = await req.json();
    if (!slug || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "slug and images required" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      if (img.startsWith("data:")) {
        /* ── Upload base64 image to GitHub ── */
        const comma = img.indexOf(",");
        const header = img.slice(0, comma);
        const b64 = img.slice(comma + 1);
        const ext = header.includes("png") ? "png" : header.includes("webp") ? "webp" : "jpg";
        const filePath = `public/products/${slug}/${i}.${ext}`;

        /* Check if file already exists to get SHA */
        let sha: string | undefined;
        const checkRes = await githubGet(token, filePath);
        if (checkRes.ok) {
          const existing = await checkRes.json();
          sha = existing.sha;
        }

        const putRes = await githubPut(token, filePath, b64, sha, `chore: add image for ${slug}`);
        if (!putRes.ok) {
          const err = await putRes.json();
          return NextResponse.json({ error: `Image upload failed: ${err.message}` }, { status: 500 });
        }

        uploadedUrls.push(`/products/${slug}/${i}.${ext}`);
      } else {
        /* External URL — keep as-is */
        uploadedUrls.push(img);
      }
    }

    /* ── Update product-images.json ── */
    const jsonPath = "public/product-images.json";
    let currentData: Record<string, string[]> = {};
    let jsonSha: string | undefined;

    const getRes = await githubGet(token, jsonPath);
    if (getRes.ok) {
      const fileData = await getRes.json();
      jsonSha = fileData.sha;
      try {
        currentData = JSON.parse(Buffer.from(fileData.content, "base64").toString("utf-8"));
      } catch {}
    }

    currentData[slug] = uploadedUrls;

    const jsonContent = Buffer.from(JSON.stringify(currentData, null, 2)).toString("base64");
    const putJson = await githubPut(token, jsonPath, jsonContent, jsonSha, `chore: update image map for ${slug}`);
    if (!putJson.ok) {
      const err = await putJson.json();
      return NextResponse.json({ error: `JSON update failed: ${err.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
