'use client';

const CATEGORIES = [
  { label: 'SHIRTS',   img: '/editorial-portrait.jpg' },
  { label: 'JEANS',    img: '/hero-model.jpg' },
  { label: 'EYEWEAR',  img: '/editorial-swirl.jpg' },
  { label: 'FOOTWEAR', img: '/editorial-back.jpg' },
  { label: 'HOME',     img: '/tee-floating.jpg' },
  { label: 'MORE ▶',   img: '/editorial-back.jpg', accent: true },
];

export function ShopByCategory() {
  return (
    <section style={{ width: '100%', background: '#f5f2ef', padding: '56px 40px 0' }}>
      {/* heading */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 18, opacity: .5 }}>🌴</span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: '#555' }}>HANDPICKED FOR YOU</span>
          <span style={{ fontSize: 18, opacity: .5 }}>🌴</span>
        </div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,4vw,52px)', color: '#111', letterSpacing: '.04em' }}>SHOP BY CATEGORY</div>
      </div>

      {/* category cards */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 52 }}>
        {CATEGORIES.map((cat, i) => (
          <div
            key={i}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              cursor: 'none',
            }}
          >
            <div style={{
              width: 'clamp(100px,13vw,170px)',
              aspectRatio: '3/4',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#e8e4e0',
              boxShadow: '0 4px 20px rgba(0,0,0,.1)',
              transition: 'transform .3s ease, box-shadow .3s ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,.1)'; }}
            >
              <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 12, fontWeight: 700, letterSpacing: '.16em',
              color: cat.accent ? '#cc0000' : '#111',
              textTransform: 'uppercase',
            }}>{cat.label}</div>
          </div>
        ))}
      </div>

      {/* gift card banner */}
      <div style={{
        width: '100%',
        background: '#8b1a1a',
        padding: '36px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(22px,3vw,40px)', color: '#f0ece8', letterSpacing: '.05em' }}>ILUMINATEES GIFT CARDS</div>
          <div style={{ width: '80%', height: 1, background: 'rgba(240,236,232,.25)', margin: '10px 0 12px' }} />
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: 'rgba(240,236,232,.7)', lineHeight: 1.7 }}>Still deciding on a present? Let them choose with gift cards.</div>
          <button style={{
            marginTop: 20, padding: '12px 28px',
            background: '#0d0d0d', border: 'none',
            color: '#f0ece8', fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 12, letterSpacing: '.2em', fontWeight: 600,
            borderRadius: 2, cursor: 'none',
          }}>SHOP NOW ▶</button>
        </div>
        <div style={{ fontSize: 80, opacity: .25, userSelect: 'none' }}>🎁</div>
      </div>
    </section>
  );
}
