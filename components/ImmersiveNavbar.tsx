'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

const NAV_LINKS = [
  { label: 'SHOP',        href: '/shop' },
  { label: 'COLLECTIONS', href: '/collections' },
  { label: 'DROPS',       href: '/collections' },
  { label: 'ABOUT',       href: '/about' },
  { label: 'COMMUNITY',   href: '/contact' },
];

export function ImmersiveNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: scrolled ? '14px 36px' : '20px 36px',
        background: scrolled ? 'rgba(6,6,6,.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(32px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(204,0,0,.1)' : '1px solid transparent',
        transition: 'padding .4s, background .4s, border-color .4s',
      }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: '.1em', color: 'var(--w)', textDecoration: 'none', cursor: 'none' }}>
          ILUMINATEES<sup style={{ color: 'var(--r)', fontSize: 9, verticalAlign: 'super', fontFamily: "'Space Grotesk',sans-serif" }}>®</sup>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop-links" style={{ display: 'flex', gap: 36 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="nav-link">{label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Search — desktop only */}
          <button className="nav-search-btn" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.6)', background: 'none', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--w)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,236,232,.6)'}
          >
            SEARCH
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <div className="nav-divider" style={{ width: 1, height: 13, background: 'rgba(240,236,232,.14)' }} />
          <Link href="/cart" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.6)', textDecoration: 'none', cursor: 'none', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--w)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,236,232,.6)'}
          >CART ({itemCount})</Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4, zIndex: 510 }}
            aria-label="Toggle menu"
          >
            <span style={{ display: 'block', height: 1.5, width: 22, background: menuOpen ? 'var(--r)' : 'rgba(240,236,232,.6)', transition: 'transform .3s, opacity .3s, background .3s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', height: 1.5, width: 22, background: menuOpen ? 'var(--r)' : 'rgba(240,236,232,.6)', transition: 'opacity .3s, background .3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', height: 1.5, width: menuOpen ? 22 : 14, background: menuOpen ? 'var(--r)' : 'rgba(240,236,232,.6)', transition: 'transform .3s, width .3s, background .3s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 490,
        background: 'rgba(6,6,6,.98)',
        backdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: '80px 48px 60px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .55s cubic-bezier(.22,1,.36,1)',
        pointerEvents: menuOpen ? 'all' : 'none',
      }}>
        {/* Red accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--r)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          {NAV_LINKS.map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 'clamp(38px,8vw,72px)',
                color: 'var(--w)',
                textDecoration: 'none',
                lineHeight: 1.05,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(30px)',
                transition: `opacity .45s ease ${i * 0.07 + 0.15}s, transform .45s cubic-bezier(.22,1,.36,1) ${i * 0.07 + 0.15}s, color .2s`,
                display: 'block',
                paddingBottom: 6,
                borderBottom: '1px solid rgba(240,236,232,.05)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--r)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--w)'}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 40, display: 'flex', gap: 20, flexWrap: 'wrap', opacity: menuOpen ? 1 : 0, transition: 'opacity .4s ease .55s' }}>
          <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.5)', textDecoration: 'none' }}>
            CART ({itemCount})
          </Link>
          <span style={{ color: 'rgba(240,236,232,.15)' }}>·</span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)' }}>SEARCH</span>
        </div>

        <div style={{ position: 'absolute', bottom: 40, left: 48, fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(240,236,232,.2)', opacity: menuOpen ? 1 : 0, transition: 'opacity .4s ease .6s' }}>
          ILUMINATEES® — SS26 DROP 001
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-search-btn { display: none !important; }
          .nav-divider { display: none !important; }
        }
      `}</style>
    </>
  );
}
