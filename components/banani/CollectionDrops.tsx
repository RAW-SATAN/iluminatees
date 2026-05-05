'use client';
import { useRef, useState } from 'react';

const SLIDES = [
  {
    brand: 'TISSOT',
    tagline: 'SWISS WATCHES SINCE 1853',
    desc: 'Introducing the Gentleman Collection, a refined selection of timepieces designed for modern, everyday elegance',
    cta: 'Shop Now',
    img: '/editorial-back.jpg',
    bg: '#f5f0d0',
    accent: '#111',
  },
  {
    brand: 'VERSACE',
    tagline: 'ITALIAN LUXURY SINCE 1978',
    desc: "Medusa-embossed leather bags and signature baroque prints — the season's most coveted statement pieces.",
    cta: 'Discover',
    img: '/editorial-swirl.jpg',
    bg: '#f0eaea',
    accent: '#8b1a1a',
  },
  {
    brand: 'ZEGNA',
    tagline: 'THE ART OF FABRIC',
    desc: "Oasi Cashmere — nature's finest fibre, woven into garments that define effortless Italian masculinity.",
    cta: 'Explore',
    img: '/editorial-portrait.jpg',
    bg: '#e8edf0',
    accent: '#1a2a3a',
  },
];

export function CollectionDrops() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (i: number) => setActive((i + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[active];

  return (
    <section style={{ width: '100%', background: slide.bg, transition: 'background .5s ease', padding: '52px 40px 60px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>ON OUR RADAR</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,4vw,52px)', color: '#111', letterSpacing: '.04em' }}>NEW COLLECTION DROPS</div>
      </div>

      {/* slide card */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', borderRadius: 8, overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,.14)',
        background: '#1a1208',
        minHeight: 'clamp(260px,32vw,420px)',
      }}>
        {/* image */}
        <div style={{ flex: '0 0 48%', position: 'relative', overflow: 'hidden' }}>
          <img
            key={active}
            src={slide.img}
            alt={slide.brand}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'fu .6s ease forwards' }}
          />
        </div>

        {/* content */}
        <div style={{ flex: 1, padding: 'clamp(28px,4vw,56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#16130c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, background: slide.accent, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✦</span>
            </div>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(22px,3vw,38px)', color: '#f0ece8', letterSpacing: '.06em' }}>{slide.brand}</span>
          </div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.2em', color: 'rgba(240,236,232,.4)', textTransform: 'uppercase', marginBottom: 20 }}>{slide.tagline}</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, color: 'rgba(240,236,232,.8)', lineHeight: 1.75, marginBottom: 28, maxWidth: 380 }}>{slide.desc}</div>
          <button style={{
            alignSelf: 'flex-start',
            background: 'none', border: 'none',
            fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700,
            color: '#f0ece8', letterSpacing: '.1em', cursor: 'none',
            borderBottom: '1px solid rgba(240,236,232,.4)', paddingBottom: 3,
          }}>{slide.cta}</button>
        </div>
      </div>

      {/* dots + arrows */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 }}>
        <button onClick={() => go(active - 1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,.1)', border: '1px solid rgba(0,0,0,.12)', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#111' }}>‹</button>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8, height: 8,
              borderRadius: 4, border: 'none',
              background: i === active ? '#cc0000' : 'rgba(0,0,0,.2)',
              cursor: 'none', transition: 'all .3s ease',
            }}
          />
        ))}
        <button onClick={() => go(active + 1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,.1)', border: '1px solid rgba(0,0,0,.12)', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#111' }}>›</button>
      </div>

      {/* pause btn (decorative) */}
      <button style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, background: 'rgba(0,0,0,.15)', border: 'none', borderRadius: 2, cursor: 'none', color: '#333', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏸</button>
    </section>
  );
}
