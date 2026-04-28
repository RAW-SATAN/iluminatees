'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export function ImmersiveNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
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

      <div style={{ display: 'flex', gap: 36 }}>
        {['SHOP', 'COLLECTIONS', 'DROPS', 'ABOUT', 'COMMUNITY'].map(label => (
          <Link key={label} href={label === 'SHOP' ? '/shop' : '#'} className="nav-link">{label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.6)', background: 'none', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color .2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color='var(--w)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color='rgba(240,236,232,.6)'}
        >
          SEARCH
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <div style={{ width: 1, height: 13, background: 'rgba(240,236,232,.14)' }} />
        <Link href="/cart" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.6)', textDecoration: 'none', cursor: 'none', transition: 'color .2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color='var(--w)'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color='rgba(240,236,232,.6)'}
        >CART ({itemCount})</Link>
        <button style={{ background: 'none', border: 'none', cursor: 'none', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}>
          <span style={{ display: 'block', height: 1.5, width: 22, background: 'rgba(240,236,232,.6)' }} />
          <span style={{ display: 'block', height: 1.5, width: 22, background: 'rgba(240,236,232,.6)' }} />
          <span style={{ display: 'block', height: 1.5, width: 14, background: 'rgba(240,236,232,.6)' }} />
        </button>
      </div>
    </nav>
  );
}
