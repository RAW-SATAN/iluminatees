'use client';
import { useEffect, useRef, useState } from 'react';

const BENTO_TOP = [
  { img: '/editorial-back.jpg',     icon: '+',  eye: 'Fit Guide',   title: 'OVERSIZED FIT.\nMAXIMUM IMPACT.',     link: 'EXPLORE FITS' },
  { img: '/editorial-swirl.jpg',    icon: '⊕', eye: 'Materials',   title: 'PREMIUM\nHEAVYWEIGHT\n240 GSM',     link: 'FEEL THE QUALITY' },
  { img: '/editorial-portrait.jpg', icon: '★', eye: 'Brand Story', title: 'DESIGNED\nTO BREAK RULES.',          link: 'OUR STORY', iconRed: true },
  { img: '/hero-model.jpg',         icon: '⊛', eye: 'Community',   title: 'A COMMUNITY\nTHAT CREATES.',         link: 'JOIN US' },
];

export function BentoGrid() {
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (topRef.current) {
        ScrollTrigger.create({ trigger: topRef.current, start: 'top 85%', onEnter: () => gsap.from(topRef.current!.querySelectorAll('.bi'), { opacity: 0, y: 36, scale: .97, stagger: .09, duration: .7, ease: 'power2.out' }) });
      }
      if (botRef.current) {
        ScrollTrigger.create({ trigger: botRef.current, start: 'top 85%', onEnter: () => gsap.from(botRef.current!.querySelectorAll('.bi-bot'), { opacity: 0, y: 28, stagger: .08, duration: .65, ease: 'power2.out' }) });
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        .bento-top-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .bento-bot-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 56px; }
        .bi-red-strip { display: flex; }
        @media (max-width: 900px) {
          .bento-top-grid { grid-template-columns: repeat(2,1fr); }
          .bento-bot-grid { grid-template-columns: 1fr 1fr; }
          .bi-red-strip { display: none; }
        }
        @media (max-width: 520px) {
          .bento-top-grid { grid-template-columns: 1fr 1fr; }
          .bento-bot-grid { grid-template-columns: 1fr; }
          .bi { min-height: 220px !important; }
        }
      `}</style>

      {/* Bento Top */}
      <div ref={topRef} className="bento-top-grid">
        {BENTO_TOP.map((b) => (
          <div key={b.eye} className="bi" style={{ position: 'relative', overflow: 'hidden', cursor: 'none', minHeight: 290, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '26px 24px' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
              <img src={b.img} alt={b.eye} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform .7s ease' }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform='scale(1.06)'}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform=''}
              />
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top,rgba(6,6,6,.9) 0%,rgba(6,6,6,.45) 40%,rgba(6,6,6,.1) 70%,transparent 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span style={{ fontSize: 16, marginBottom: 9, display: 'block', color: b.iconRed ? 'var(--r)' : 'rgba(240,236,232,.5)' }}>{b.icon}</span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(240,236,232,.32)', marginBottom: 6, display: 'block' }}>{b.eye}</span>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(18px,2vw,26px)', color: 'var(--w)', letterSpacing: '.03em', lineHeight: 1.05, whiteSpace: 'pre-line' }}>{b.title}</div>
              <a href="#" className="bi-link" style={{ marginTop: 12, display: 'inline-flex' }}>{b.link} →</a>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Bottom */}
      <div ref={botRef} className="bento-bot-grid">
        {/* newsletter */}
        <div className="bi-bot" style={{ background: 'var(--s2)', padding: '30px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 230, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 130%,rgba(204,0,0,.08),transparent)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(19px,2.1vw,28px)', color: 'var(--w)', letterSpacing: '.03em', lineHeight: 1.05, marginBottom: 18 }}>GET EARLY ACCESS<br/>TO EXCLUSIVE DROPS</div>
          {submitted ? (
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--r)', padding: '14px 0' }}>You&apos;re in. Watch for the light. ✦</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', border: '1px solid rgba(240,236,232,.09)', overflow: 'hidden' }}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ENTER YOUR EMAIL" style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--w)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.08em', padding: '13px 14px', outline: 'none', minWidth: 0 }} />
              <button type="submit" style={{ width: 44, background: 'var(--r)', border: 'none', color: 'var(--w)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s' }}>→</button>
            </form>
          )}
        </div>

        {/* photo 1 */}
        <div className="bi-bot" style={{ position: 'relative', overflow: 'hidden', minHeight: 230, cursor: 'none' }}>
          <img src="/editorial-back.jpg" alt="Editorial" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .7s ease' }}
            onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform='scale(1.06)'}
            onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform=''}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,6,6,.5) 0%,transparent 50%)', pointerEvents: 'none' }} />
        </div>

        {/* photo 2 */}
        <div className="bi-bot" style={{ position: 'relative', overflow: 'hidden', minHeight: 230, cursor: 'none' }}>
          <img src="/editorial-swirl.jpg" alt="Editorial" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .7s ease' }}
            onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform='scale(1.06)'}
            onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform=''}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,6,6,.5) 0%,transparent 50%)', pointerEvents: 'none' }} />
        </div>

        {/* info */}
        <div className="bi-bot" style={{ background: 'var(--s2)', padding: '30px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 230 }}>
          <span style={{ fontSize: 28, color: 'rgba(240,236,232,.2)' }}>⊕</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {['WORLDWIDE SHIPPING', 'SECURE PAYMENTS', 'EASY RETURNS'].map((item, i, arr) => (
              <div key={item} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.06em', color: 'rgba(240,236,232,.48)', paddingBottom: i < arr.length - 1 ? 11 : 0, borderBottom: i < arr.length - 1 ? '1px solid rgba(240,236,232,.05)' : 'none' }}>{item}</div>
            ))}
          </div>
        </div>

        {/* red strip — hidden on mobile via CSS */}
        <div className="bi-bot bi-red-strip" style={{ background: 'var(--r)', alignItems: 'center', justifyContent: 'center', minHeight: 230 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: '.28em', color: 'rgba(0,0,0,.32)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>ILUMINATEES®</div>
        </div>
      </div>
    </>
  );
}
