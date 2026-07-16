import { NextRequest, NextResponse } from "next/server";

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

interface SiteAssets {
  heroBanners: Record<string, string>;
  carouselMockups: Record<string, string>;
  cultGallery: Record<string, string>;
  misc: Record<string, string>;
}

const KIND_CONFIG: Record<string, { dir: string; mapKey: keyof SiteAssets }> = {
  hero:   { dir: "public/site/hero",     mapKey: "heroBanners" },
  mockup: { dir: "public/site/mockups",  mapKey: "carouselMockups" },
  cult:   { dir: "public/site/cult",     mapKey: "cultGallery" },
  misc:   { dir: "public/site/misc",     mapKey: "misc" },
};

export async function POST(req: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return NextResponse.json({ error: "GITHUB_TOKEN not set" }, { status: 500 });

    const { kind, key, image }: { kind: string; key: string; image: string | null } = await req.json();
    const cfg = KIND_CONFIG[kind];
    if (!cfg || !key) {
      return NextResponse.json({ error: "kind ('hero'|'mockup'|'cult'|'misc') and key required" }, { status: 400 });
    }
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeKey) return NextResponse.json({ error: "invalid key" }, { status: 400 });

    let url: string | null = null;

    if (image && image.startsWith("data:")) {
      const comma = image.indexOf(",");
      const header = image.slice(0, comma);
      const b64 = image.slice(comma + 1);
      const ext = header.includes("png") ? "png" : header.includes("webp") ? "webp" : "jpg";
      /* keep legacy hero path (hero-<key>.jpg) so existing uploads stay valid */
      const filePath = kind === "hero"
        ? `public/site/hero-${safeKey}.${ext}`
        : `${cfg.dir}/${safeKey}.${ext}`;

      let sha: string | undefined;
      const checkRes = await githubGet(token, filePath);
      if (checkRes.ok) {
        const existing = await checkRes.json();
        sha = existing.sha;
      }

      const putRes = await githubPut(token, filePath, b64, sha, `chore: upload ${kind} asset ${safeKey}`);
      if (!putRes.ok) {
        const err = await putRes.json();
        return NextResponse.json({ error: `Upload failed: ${err.message}` }, { status: 500 });
      }
      /* Cache-bust so the new image shows immediately after replacing an old one */
      url = `/${filePath.replace(/^public\//, "")}?v=${Date.now()}`;
    } else if (image) {
      /* External URL — keep as-is */
      url = image;
    }

    /* ── Update site-assets.json ── */
    const jsonPath = "public/site-assets.json";
    let data: SiteAssets = { heroBanners: {}, carouselMockups: {}, cultGallery: {}, misc: {} };
    let jsonSha: string | undefined;

    const getRes = await githubGet(token, jsonPath);
    if (getRes.ok) {
      const fileData = await getRes.json();
      jsonSha = fileData.sha;
      try {
        const parsed = JSON.parse(Buffer.from(fileData.content, "base64").toString("utf-8"));
        data = {
          heroBanners:     parsed.heroBanners ?? {},
          carouselMockups: parsed.carouselMockups ?? {},
          cultGallery:     parsed.cultGallery ?? {},
          misc:            parsed.misc ?? {},
        };
      } catch {}
    }

    const map = data[cfg.mapKey] as Record<string, string>;
    if (url) map[safeKey] = url;
    else delete map[safeKey];

    const jsonContent = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
    const putJson = await githubPut(token, jsonPath, jsonContent, jsonSha, `chore: update site assets (${kind} ${safeKey})`);
    if (!putJson.ok) {
      const err = await putJson.json();
      return NextResponse.json({ error: `JSON update failed: ${err.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, url });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
