'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ background: '#060606', minHeight: '100vh', color: '#f0ece8', fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', borderBottom: '1px solid rgba(240,236,232,.06)' }}>
        <div style={{ fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 20 }}>About</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 12vw, 120px)', lineHeight: .92, letterSpacing: '.02em', margin: '0 0 24px' }}>
          NOT MADE<br />TO FIT IN
        </h1>
        <p style={{ maxWidth: 520, margin: '0 auto', fontSize: 15, lineHeight: 1.8, color: 'rgba(240,236,232,.55)' }}>
          ILUMINATEES was born from the belief that clothing should say what words can't. Dark. Deliberate. Unapologetic.
        </p>
      </section>

      {/* Story */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.25em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 16 }}>Our Story</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 1, marginBottom: 24, color: '#f0ece8' }}>
              WEAR THE UNSEEN
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: 'rgba(240,236,232,.55)', marginBottom: 16 }}>
              We started ILUMINATEES with one question: why does standing out feel like breaking a rule? We decided to make that rule obsolete.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: 'rgba(240,236,232,.55)' }}>
              Every drop is limited. Every piece is heavyweight. No compromises, no reprints. If you slept on it, it's gone.
            </p>
          </div>
          <div style={{ background: '#0d0d0d', border: '1px solid rgba(240,236,232,.06)', borderRadius: 4, aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, color: 'rgba(240,236,232,.04)', letterSpacing: '.1em' }}>ILUM</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(240,236,232,.06)', margin: '0 24px' }} />

      {/* Team */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 10, letterSpacing: '.25em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 14 }}>The People</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 1, color: '#f0ece8' }}>BEHIND THE BRAND</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 32 }}>

          {/* Aman Mudgal */}
          <div style={{ width: 280, textAlign: 'center' }}>
            <div style={{ width: 160, height: 160, borderRadius: '50%', background: 'linear-gradient(135deg,#1a0000,#330000)', border: '1px solid rgba(204,0,0,.3)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: '#cc0000', letterSpacing: '.04em' }}>AM</span>
              <div style={{ position: 'absolute', bottom: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: '#cc0000' }} />
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '.06em', color: '#f0ece8', marginBottom: 4 }}>Aman Mudgal</div>
            <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 16 }}>Founder</div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(240,236,232,.45)' }}>
              Building ILUMINATEES from India — one limited drop at a time. Every piece is designed, quality-checked and shipped under his watch.
            </p>
          </div>

        </div>
      </section>

      {/* Values */}
      <section style={{ background: '#0a0a0a', borderTop: '1px solid rgba(240,236,232,.06)', borderBottom: '1px solid rgba(240,236,232,.06)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 10, letterSpacing: '.25em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 14 }}>What We Stand For</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 1, color: '#f0ece8' }}>THE CODE</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {[
              { num: '01', title: 'LIMITED ALWAYS', desc: 'Every piece is a limited drop. We never reprint. Scarcity is the point.' },
              { num: '02', title: 'HEAVYWEIGHT ONLY', desc: '320 GSM minimum. Built to last longer than trends.' },
              { num: '03', title: 'NO COMPROMISES', desc: 'No fast fashion. No filler drops. Every release has to earn its place.' },
            ].map(v => (
              <div key={v.num} style={{ padding: '36px 32px', border: '1px solid rgba(240,236,232,.05)', background: '#060606' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: 'rgba(204,0,0,.2)', marginBottom: 12 }}>{v.num}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '.06em', color: '#f0ece8', marginBottom: 12 }}>{v.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(240,236,232,.4)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: 1, marginBottom: 24, color: '#f0ece8' }}>
          READY TO WEAR<br /><span style={{ color: '#cc0000' }}>THE UNSEEN?</span>
        </h2>
        <Link href="/shop" style={{ display: 'inline-block', background: '#cc0000', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '.1em', padding: '14px 40px', textDecoration: 'none', marginTop: 8 }}>
          SHOP NOW
        </Link>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-story-grid { grid-template-columns: 1fr !important; }
          .about-values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
