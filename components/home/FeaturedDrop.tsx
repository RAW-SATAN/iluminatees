'use client';
import { useEffect, useRef, useState } from 'react';

const DROPS = [
  { name: 'LIQUID METAL TEE',  price: '₹ 1,899', img: '/hero-model.jpg',          slug: 'eye-of-providence' },
  { name: 'VOID HOODIE',        price: '₹ 2,999', img: '/tee-floating.jpg',        slug: 'cipher-33' },
  { name: 'SHADOW CARGO',       price: '₹ 2,499', img: '/editorial-portrait.jpg',  slug: 'the-architect' },
  { name: 'ABSTRACT TEE',       price: '₹ 1,799', img: '/editorial-back.jpg',      slug: 'sacred-geometry' },
  { name: 'DISTORT CAP',        price: '₹ 999',   img: '/editorial-swirl.jpg',     slug: 'the-veil' },
];

function pad(n: number) { return String(Math.floor(n)).padStart(2, '0'); }

export function FeaturedDrop() {
  const [time, setTime] = useState({ d: '09', h: '23', m: '56', s: '48' });
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = new Date('2026-05-15T00:00:00').getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff < 0) return;
      setTime({ d: pad(diff / 86400000), h: pad((diff % 86400000) / 3600000), m: pad((diff % 3600000) / 60000), s: pad((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!stripRef.current) return;
      ScrollTrigger.create({
        trigger: stripRef.current,
        start: 'top 85%',
        onEnter: () => gsap.from(stripRef.current!.querySelectorAll('.ds-prod'), { opacity: 0, y: 28, stagger: .08, duration: .6, ease: 'power2.out' }),
      });
    });
  }, []);

  return (
    <>
      <style>{`
        .fd-wrap {
          display: grid;
          grid-template-columns: 162px 1fr 216px;
          background: var(--s1);
          border-top: 1px solid rgba(240,236,232,.04);
        }
        .fd-label { padding: 26px 22px; border-right: 1px solid rgba(240,236,232,.05); display: flex; flex-direction: column; justify-content: space-between; }
        .fd-countdown { padding: 22px 18px; border-left: 1px solid rgba(240,236,232,.05); display: flex; flex-direction: column; justify-content: center; gap: 12px; }
        .fd-rail { display: flex; overflow-x: auto; }
        @media (max-width: 768px) {
          .fd-wrap { grid-template-columns: 1fr; }
          .fd-label { flex-direction: row; align-items: center; border-right: none; border-bottom: 1px solid rgba(240,236,232,.05); padding: 16px 20px; }
          .fd-countdown { border-left: none; border-top: 1px solid rgba(240,236,232,.05); padding: 20px; }
          .fd-rail { padding: 0 4px; }
          .ds-prod { width: 130px !important; padding: 14px 12px 16px !important; }
          .ds-prod-img { height: 80px !important; }
        }
      `}</style>
      <div className="fd-wrap">
        {/* label */}
        <div className="fd-label">
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--r)', marginBottom: 5 }}>FEATURED</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: 'var(--w)', letterSpacing: '.04em', lineHeight: 1 }}>DROP<br className="fd-br"/>PIECES</div>
          </div>
          <a href="/shop" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(204,0,0,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--r)', fontSize: 16, marginTop: 18, background: 'none', textDecoration: 'none', transition: 'background .2s, color .2s', flexShrink: 0 }}>›</a>
        </div>

        {/* product rail */}
        <div ref={stripRef} className="fd-rail no-scrollbar">
          {DROPS.map((d) => (
            <a key={d.name} href={`/product/${d.slug}`} className="ds-prod" style={{ flexShrink: 0, width: 148, padding: '18px 14px 20px', cursor: 'none', position: 'relative', borderRight: '1px solid rgba(240,236,232,.04)', transition: 'background .25s', textDecoration: 'none', display: 'block' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(240,236,232,.025)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background=''}
            >
              <span style={{ position: 'absolute', top: 10, right: 8, background: 'var(--r)', color: 'var(--w)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 7, letterSpacing: '.1em', padding: '2px 7px', textTransform: 'uppercase', zIndex: 2 }}>NEW</span>
              <div className="ds-prod-img" style={{ height: 96, overflow: 'hidden', marginBottom: 12 }}>
                <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, fontWeight: 500, color: 'var(--w)', letterSpacing: '.04em', marginBottom: 3, textTransform: 'uppercase' }}>{d.name}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, color: 'rgba(240,236,232,.45)' }}>{d.price}</div>
            </a>
          ))}
        </div>

        {/* countdown */}
        <div className="fd-countdown">
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--r)' }}>NEXT DROP IN</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 0 }}>
            {[{ v: time.d, l: 'DAYS' }, { v: time.h, l: 'HRS' }, { v: time.m, l: 'MINS' }, { v: time.s, l: 'SECS' }].map((u, i) => (
              <div key={u.l} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'center', minWidth: 42 }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: 'var(--w)', display: 'block', lineHeight: 1 }}>{u.v}</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 7, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', display: 'block', marginTop: 2 }}>{u.l}</span>
                </div>
                {i < 3 && <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: 'var(--r)', padding: '0 1px', marginBottom: 12 }}>:</span>}
              </div>
            ))}
          </div>
          <button style={{ background: 'none', border: 'none', fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(240,236,232,.5)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'color .2s, gap .2s', padding: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color='var(--r)'; (e.currentTarget as HTMLButtonElement).style.gap='14px'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color='rgba(240,236,232,.5)'; (e.currentTarget as HTMLButtonElement).style.gap='8px'; }}
          >JOIN THE WAITLIST →</button>
        </div>
      </div>
    </>
  );
}
