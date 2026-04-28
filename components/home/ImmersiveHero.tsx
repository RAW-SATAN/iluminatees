'use client';
import { useEffect, useRef, useState } from 'react';

export function ImmersiveHero() {
  const bgRef = useRef<HTMLImageElement>(null);
  const [cartN, setCartN] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      bgRef.current.style.transform = `scale(1.06) translate(${dx * -14}px,${dy * -8}px)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const btn = document.getElementById('hero-explore-btn');
      if (!btn) return;
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.22, duration: .3, ease: 'power2.out' });
      };
      const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.5)' });
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      return () => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave); };
    });
  }, []);

  return (
    <section style={{ height: '100vh', minHeight: 640, position: 'relative', overflow: 'hidden', display: 'flex' }}>

      {/* background */}
      <img
        ref={bgRef}
        src="/hero-model.jpg"
        alt="Iluminatees"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '65% center', zIndex: 0, transition: 'transform .1s linear' }}
      />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg,rgba(6,6,6,.92) 0%,rgba(6,6,6,.72) 38%,rgba(6,6,6,.22) 62%,rgba(6,6,6,.05) 100%)' }} />

      {/* slide numbers */}
      <div style={{ position: 'absolute', left: 26, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, zIndex: 11, opacity: 0, animation: 'fu .6s ease 3.4s forwards' }}>
        {['01','02','03'].map((n, i) => (
          <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.1em', color: i === 0 ? 'var(--r)' : 'rgba(240,236,232,.3)', fontWeight: i === 0 ? 600 : 400 }}>{n}</span>
            {i < 2 && <div style={{ width: 1, height: 26, background: 'rgba(240,236,232,.1)', margin: '6px 0' }} />}
          </div>
        ))}
      </div>

      {/* SVG filters */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden>
        <defs>
          {/* Worn/distressed texture — large grain, punches holes in white text */}
          <filter id="grunge-text" x="-4%" y="-8%" width="108%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.038 0.042" numOctaves="5" seed="7" result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 4.5 -1.2" in="noise" result="mask"/>
            <feComposite in="SourceGraphic" in2="mask" operator="in" result="worn"/>
            <feDisplacementMap in="worn" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          {/* subtle edge roughen for red text — very light, just breaks clean edges */}
          <filter id="brush-edge" x="-4%" y="-20%" width="108%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.02" numOctaves="3" seed="4" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      {/* left content */}
      <div style={{ position: 'relative', zIndex: 10, width: '46%', padding: 'clamp(108px,13vh,155px) 0 60px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--r)', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, opacity: 0, animation: 'fu .6s ease 2.6s forwards' }}>
          NEW DROP — SS&#39;26 →
        </div>
        <div>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(62px,8.4vw,134px)', lineHeight: .88, letterSpacing: '.01em', color: 'var(--w)', display: 'block', opacity: 0, transform: 'translateY(105%)', animation: 'su .9s cubic-bezier(.22,1,.36,1) 2.3s forwards', filter: 'url(#grunge-text)' }}>NOT MADE</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(62px,8.4vw,134px)', lineHeight: .88, letterSpacing: '.01em', color: 'var(--w)', display: 'block', opacity: 0, transform: 'translateY(105%)', animation: 'su .9s cubic-bezier(.22,1,.36,1) 2.46s forwards', filter: 'url(#grunge-text)' }}>TO FIT IN.</span>
          </div>
          <div style={{ overflow: 'visible' }}>
            <span style={{ fontFamily: "'Rubik Dirt',cursive", fontSize: 'clamp(44px,5.6vw,90px)', lineHeight: 1, color: 'var(--r)', display: 'inline-block', transform: 'skewX(-4deg)', transformOrigin: 'left bottom', letterSpacing: '.01em', opacity: 0, animation: 'su .9s cubic-bezier(.22,1,.36,1) 2.62s forwards', filter: 'url(#brush-edge)', textShadow: '0 0 60px rgba(204,0,0,.5),0 0 120px rgba(180,0,0,.25)' }}>MADE TO STAND OUT.</span>
          </div>
        </div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, lineHeight: 1.85, color: 'var(--m)', marginTop: 26, maxWidth: 295, opacity: 0, animation: 'fu .7s ease 3s forwards' }}>
          Iluminatees is more than fabric.<br />It&apos;s a mindset. A rebellion. A way of life.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 34, opacity: 0, animation: 'fu .7s ease 3.2s forwards' }}>
          <button id="hero-explore-btn" className="btn-r">EXPLORE DROP <span style={{ fontSize: 13 }}>↗</span></button>
          <button className="btn-wf">
            WATCH FILM{' '}
            <span style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(240,236,232,.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>▶</span>
          </button>
        </div>
      </div>

      {/* stamp badge */}
      <div style={{ position: 'absolute', top: 82, right: 46, zIndex: 11, width: 108, height: 108, opacity: 0, animation: 'fu .7s ease 3.3s forwards' }}>
        <svg viewBox="0 0 110 110" width="108" height="108">
          <circle cx="55" cy="55" r="50" fill="rgba(10,10,10,0.72)" stroke="rgba(240,236,232,0.15)" strokeWidth="1"/>
          <g style={{ animation: 'spin 22s linear infinite', transformOrigin: 'center' }}>
            <path id="stamp-path" d="M55,55 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" fill="none"/>
            <text fontFamily="'Space Grotesk',sans-serif" fontSize="7.2" letterSpacing="3.1" fill="rgba(240,236,232,0.65)">
              <textPath href="#stamp-path">DIFFERENT · WORK · STYLE · HUSTLE · ARTISTRY ·</textPath>
            </text>
          </g>
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <svg viewBox="0 0 28 28" width="28" height="28">
            <polygon points="14,2 17,10 26,10 19,16 22,24 14,18 6,24 9,16 2,10 11,10" fill="#cc0000"/>
          </svg>
        </div>
      </div>

      {/* floating product card */}
      <div style={{ position: 'absolute', bottom: 56, right: 40, zIndex: 12, width: 216, background: 'rgba(12,12,12,.88)', backdropFilter: 'blur(24px)', border: '1px solid rgba(240,236,232,.08)', opacity: 0, animation: 'float 5.5s ease-in-out 3.2s infinite, fu .7s ease 3.2s forwards' }}>
        <div style={{ width: '100%', height: 130, overflow: 'hidden' }}>
          <img src="/tee-floating.jpg" alt="Angelo Oversized Tee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.35)', marginBottom: 2 }}>ANGELO OVERSIZED TEE</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600, color: 'var(--w)', marginBottom: 10 }}>WASHED BLACK</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: 'var(--r)' }}>₹ 1,899</div>
            <button onClick={() => setCartN(n => n + 1)} style={{ width: 30, height: 30, background: 'var(--r)', border: 'none', color: 'var(--w)', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', transition: 'background .2s' }}>+</button>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, opacity: 0, animation: 'fu .6s ease 3.6s forwards' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(240,236,232,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(240,236,232,.55)', animation: 'pulse 2.6s ease-in-out infinite' }}>↓</div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 7, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(240,236,232,.35)' }}>SCROLL TO DISCOVER</span>
      </div>
    </section>
  );
}
