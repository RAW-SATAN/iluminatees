"use client";
import { useState, useEffect } from "react";

export interface SiteAssets {
  /* hero slide index ("0","1","2","3") → banner image URL */
  heroBanners: Record<string, string>;
  /* product slug → 3D mockup image URL (used by the drops carousel) */
  carouselMockups: Record<string, string>;
  /* cult slider photo slot ("0".."5") → image URL */
  cultGallery: Record<string, string>;
  /* misc one-off assets, e.g. "sizechart" → image URL */
  misc: Record<string, string>;
  /* false until the JSON has been fetched — lets components avoid flashing defaults */
  loaded: boolean;
}

const EMPTY: SiteAssets = { heroBanners: {}, carouselMockups: {}, cultGallery: {}, misc: {}, loaded: false };

export function useSiteAssets(): SiteAssets {
  const [assets, setAssets] = useState<SiteAssets>(EMPTY);

  useEffect(() => {
    fetch("/site-assets.json", { cache: "no-store" })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        setAssets({
          heroBanners:     d?.heroBanners ?? {},
          carouselMockups: d?.carouselMockups ?? {},
          cultGallery:     d?.cultGallery ?? {},
          misc:            d?.misc ?? {},
          loaded: true,
        });
      })
      .catch(() => setAssets(a => ({ ...a, loaded: true })));
  }, []);

  return assets;
}
