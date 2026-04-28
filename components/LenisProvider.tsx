"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let lenis: InstanceType<typeof import("lenis").default> | null = null;

    const init = async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on("scroll", ScrollTrigger.update);

      const ticker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      return ticker;
    };

    let ticker: ((time: number) => void) | null = null;
    init().then((t) => { ticker = t; });

    return () => {
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
