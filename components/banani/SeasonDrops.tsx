'use client';
import { useRef } from 'react';

const BRANDS = [
  { name: 'BALLY', img: '/editorial-back.jpg' },
  { name: 'BOSS', img: '/editorial-portrait.jpg' },
  { name: 'FARM RIO', img: '/editorial-swirl.jpg' },
  { name: 'EMPORIO', img: '/hero-model.jpg' },
  { name: 'VERSACE', img: '/tee-floating.jpg' },
];

export function SeasonDrops() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <section style={{ width: '100%', background: 'linear-gradient(160deg,#0a2a2e 0%,#0d1a1c 60%,#060606 100%)', padding: '52px 0 60px', position: 'relative', overflow: 'hidden' }}>
      {/* subtle bg swirl */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,180,160,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: 'rgba(240,236,232,.45)', marginBottom: 8 }}>JUST IN FOR SUMMER</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '.04em', color: '#f0ece8' }}>SPRING–SUMMER &#39;26 DROPS</div>
      </div>

      <div style={{ position: 'relative', padding: '0 48px' }}>
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}
        >
          {BRANDS.map((b, i) => (
            <div
              key={i}
              style={{
                flex: '0 0 clamp(220px,22vw,310px)',
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '3/4',
                cursor: 'none',
                background: '#0d0d0d',
              }}
            >
              <img
                src={b.img}
                alt={b.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,6,6,.75) 0%,transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center' }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(22px,2.8vw,38px)', color: '#f0ece8', letterSpacing: '.06em', textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>{b.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* arrows */}
        {(['left','right'] as const).map((dir, idx) => (
          <button
            key={dir}
            onClick={() => scroll(idx === 0 ? -1 : 1)}
            style={{
              position: 'absolute', top: '50%', [dir]: 4, transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(240,236,232,.1)', border: '1px solid rgba(240,236,232,.18)',
              color: '#f0ece8', fontSize: 18, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'none', backdropFilter: 'blur(8px)',
            }}
          >{idx === 0 ? '‹' : '›'}</button>
        ))}
      </div>
    </section>
  );
}
