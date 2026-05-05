'use client';
import { useState } from 'react';

const PANELS = [
  {
    tag: 'POLO ESSENTIALS',
    sub: 'EXPLORE FITS',
    bg: 'linear-gradient(160deg,#0d0d0d 0%,#1a1010 100%)',
    img: '/hero-model.jpg',
  },
  {
    tag: 'BAGS IN FOCUS',
    sub: 'DISCOVER STYLES',
    bg: 'linear-gradient(160deg,#0d0d0d 0%,#10101a 100%)',
    img: '/editorial-portrait.jpg',
  },
];

export function HeroBanner() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ width: '100%' }}>
      {/* announcement strip */}
      <div style={{
        width: '100%', background: '#cc0000', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#f0ece8', fontWeight: 600 }}>
          ✦ DROP ALERT: EXPLORE ILUMINATEES PICKS FOR HIM
        </span>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.18em', color: 'rgba(240,236,232,.65)' }}>SHOP THE EDIT →</span>
      </div>

      {/* dual panel hero */}
      <div style={{ display: 'flex', width: '100%', height: 'clamp(380px,56vw,640px)', overflow: 'hidden' }}>
        {PANELS.map((p, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: hovered === i ? 1.18 : hovered !== null ? 0.82 : 1,
              position: 'relative',
              overflow: 'hidden',
              transition: 'flex .5s cubic-bezier(.4,0,.2,1)',
              borderRight: i === 0 ? '1px solid rgba(240,236,232,.06)' : 'none',
              cursor: 'none',
            }}
          >
            <img
              src={p.img}
              alt={p.tag}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                transform: hovered === i ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,6,.82) 0%, rgba(6,6,6,.28) 50%, rgba(6,6,6,.1) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,3.8vw,56px)', color: '#cc0000', letterSpacing: '.03em', lineHeight: 1 }}>{p.tag}</div>
              <div style={{ width: 40, height: 1, background: 'rgba(240,236,232,.35)', margin: '10px auto 10px' }} />
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.26em', color: 'rgba(240,236,232,.75)', fontWeight: 600 }}>{p.sub}</div>
            </div>
          </div>
        ))}
        {/* next arrow */}
        <button style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          width: 38, height: 38, borderRadius: '50%', background: 'rgba(240,236,232,.12)',
          border: '1px solid rgba(240,236,232,.2)', color: '#f0ece8', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          cursor: 'none', backdropFilter: 'blur(8px)',
        }}>›</button>
      </div>
    </section>
  );
}
