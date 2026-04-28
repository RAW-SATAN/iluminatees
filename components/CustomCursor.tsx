"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    let mouse = { x: 0, y: 0 };
    let pos   = { x: 0, y: 0 };
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // dot follows immediately
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const loop = () => {
      // ring lags behind — lerp
      pos.x += (mouse.x - pos.x) * 0.12;
      pos.y += (mouse.y - pos.y) * 0.12;
      gsap.set(ring, { x: pos.x, y: pos.y });
      raf = requestAnimationFrame(loop);
    };

    const onEnter = () => ring.classList.add("expanded");
    const onLeave = () => ring.classList.remove("expanded");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cur-dot" />
      <div ref={ringRef} className="cur-ring" />
    </>
  );
}
