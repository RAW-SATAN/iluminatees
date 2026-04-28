'use client';
import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lblRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current)  { dotRef.current.style.left  = mx + 'px'; dotRef.current.style.top  = my + 'px'; }
      if (lblRef.current)  { lblRef.current.style.left  = mx + 'px'; lblRef.current.style.top  = my + 'px'; }
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('button,a,.ds-prod,.bi,.bi-bot,.h-fcard')) document.body.classList.add('cx');
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('button,a,.ds-prod,.bi,.bi-bot,.h-fcard')) document.body.classList.remove('cx');
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover',  onOver, { passive: true });
    document.addEventListener('mouseout',   onOut,  { passive: true });

    let raf: number;
    const loop = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      if (ringRef.current) {
        ringRef.current.style.left = Math.round(rx * 10) / 10 + 'px';
        ringRef.current.style.top  = Math.round(ry * 10) / 10 + 'px';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cur-dot" />
      <div ref={ringRef} className="cur-ring" />
      <div ref={lblRef}  className="cur-label">EXPLORE</div>
    </>
  );
}
