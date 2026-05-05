'use client';
import { useRef } from 'react';

const PRODUCTS = [
  { brand: 'Canali',        type: 'Polo',       img: '/editorial-portrait.jpg', price: '₹ 24,900' },
  { brand: 'Zegna',         type: 'Trousers',   img: '/editorial-back.jpg',     price: '₹ 38,500' },
  { brand: 'Versace',       type: 'Bucket Bag', img: '/editorial-swirl.jpg',    price: '₹ 1,42,000' },
  { brand: 'All Saints',    type: 'Sweater',    img: '/hero-model.jpg',         price: '₹ 16,800' },
  { brand: 'Cult Gaia',     type: 'Shoulder Bag', img: '/tee-floating.jpg',     price: '₹ 68,000' },
  { brand: 'Dolce & Gabbana', type: 'Eyewear', img: '/editorial-portrait.jpg', price: '₹ 28,500' },
];

export function NewArrivals() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section style={{ width: '100%', background: '#fff', padding: '60px 0 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>THIS IS JUST IN</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,4vw,52px)', color: '#111', letterSpacing: '.04em' }}>NEW ARRIVALS</div>
      </div>

      <div style={{ position: 'relative', padding: '0 52px' }}>
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: 28, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8 }}
        >
          {PRODUCTS.map((p, i) => (
            <div
              key={i}
              style={{ flex: '0 0 clamp(160px,18vw,240px)', cursor: 'none' }}
            >
              <div style={{
                width: '100%', aspectRatio: '3/4',
                background: '#f2eeeb', borderRadius: 4, overflow: 'hidden', marginBottom: 14,
              }}>
                <img
                  src={p.img} alt={p.brand}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 }}>{p.brand}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: '#888', marginBottom: 6 }}>{p.type}</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: '#cc0000' }}>{p.price}</div>
            </div>
          ))}
        </div>

        {(['left','right'] as const).map((dir, idx) => (
          <button
            key={dir}
            onClick={() => scroll(idx === 0 ? -1 : 1)}
            style={{
              position: 'absolute', top: '40%', [dir]: 8, transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: '50%',
              background: '#fff', border: '1px solid #ddd',
              color: '#111', fontSize: 18, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'none', boxShadow: '0 2px 10px rgba(0,0,0,.1)',
            }}
          >{idx === 0 ? '‹' : '›'}</button>
        ))}
      </div>
    </section>
  );
}
