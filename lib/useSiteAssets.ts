"use client";
import { useState, useEffect } from "react";

export interface SiteAssets {
  /* hero slide index ("0","1","2") → banner image URL */
  heroBanners: Record<string, string>;
  /* product slug → 3D mockup image URL (used by the drops carousel) */
  carouselMockups: Record<string, string>;
}

const EMPTY: SiteAssets = { heroBanners: {}, carouselMockups: {} };

export function useSiteAssets(): SiteAssets {
  const [assets, setAssets] = useState<SiteAssets>(EMPTY);

  useEffect(() => {
    fetch("/site-assets.json", { cache: "no-store" })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d) setAssets({ heroBanners: d.heroBanners ?? {}, carouselMockups: d.carouselMockups ?? {} });
      })
      .catch(() => {});
  }, []);

  return assets;
}
