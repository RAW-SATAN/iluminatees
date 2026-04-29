import Link from 'next/link';
import { products, type ProductCategory } from '@/lib/products';

interface Props { searchParams: Promise<{ cat?: string }>; }

export default async function ShopPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const activeCategory = (cat && ['APEX','CIPHER','SACRED'].includes(cat)) ? (cat as ProductCategory) : null;
  const filtered = activeCategory ? products.filter(p => p.category === activeCategory) : products;

  const categories = [
    { id: 'ALL',    label: 'ALL DROPS',  count: products.length },
    { id: 'APEX',   label: 'APEX',       count: products.filter(p => p.category === 'APEX').length },
    { id: 'CIPHER', label: 'CIPHER',     count: products.filter(p => p.category === 'CIPHER').length },
    { id: 'SACRED', label: 'SACRED',     count: products.filter(p => p.category === 'SACRED').length },
  ];

  return (
    <div style={{ background: 'var(--blk)', minHeight: '100vh', paddingTop: 80 }}>
      <style>{`
        .shop-cat-bar { display: flex; gap: 2px; padding: 0 52px; overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; }
        .shop-cat-bar::-webkit-scrollbar { display: none; }
        .shop-products-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
        @media (max-width: 1100px) { .shop-products-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 768px)  { .shop-cat-bar { padding: 0 16px; } .shop-products-grid { grid-template-columns: repeat(2,1fr); } .shop-header { padding: 32px 20px 28px !important; } }
        @media (max-width: 400px)  { .shop-products-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div className="shop-header" style={{ padding: '48px 52px 36px', borderBottom: '1px solid rgba(240,236,232,.05)' }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--r)', marginBottom: 8 }}>SS26 · DROP 001</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(48px,7vw,96px)', color: 'var(--w)', lineHeight: .9, margin: 0, letterSpacing: '.01em' }}>THE DROP</h1>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: 'rgba(240,236,232,.4)', marginTop: 12 }}>
          {filtered.length} piece{filtered.length !== 1 ? 's' : ''} {activeCategory ? `in ${activeCategory}` : 'available'}
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ position: 'sticky', top: 52, zIndex: 40, background: 'rgba(6,6,6,.95)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(240,236,232,.05)' }}>
        <div className="shop-cat-bar" style={{ padding: '0 52px' }}>
          {categories.map(({ id, label, count }) => {
            const active = id === 'ALL' ? !activeCategory : activeCategory === id;
            return (
              <Link key={id} href={id === 'ALL' ? '/shop' : `/shop?cat=${id}`}
                style={{
                  fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.18em',
                  textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap',
                  padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8,
                  color: active ? 'var(--w)' : 'rgba(240,236,232,.4)',
                  borderBottom: active ? '2px solid var(--r)' : '2px solid transparent',
                  transition: 'color .2s, border-color .2s',
                }}>
                {label}
                <span style={{ fontSize: 8, color: active ? 'var(--r)' : 'rgba(240,236,232,.2)' }}>{count}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '2px 0' }}>
        <div className="shop-products-grid">
          {filtered.map(p => (
            <Link key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: 'none', display: 'block', background: 'var(--s1)', position: 'relative', overflow: 'hidden', transition: 'background .3s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='var(--s2)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='var(--s1)'}
            >
              {/* image placeholder — gradient with symbol */}
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: p.shirtColor }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, opacity: .12, color: p.accentColor }}>◈</div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,6,6,.8) 0%,rgba(6,6,6,.1) 50%,transparent 100%)' }} />
                {p.limited && (
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--r)', color: 'var(--w)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 7, letterSpacing: '.12em', padding: '3px 8px', textTransform: 'uppercase' }}>LIMITED</span>
                )}
                {p.tags.includes('bestseller') && (
                  <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(240,236,232,.1)', color: 'var(--w)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 7, letterSpacing: '.12em', padding: '3px 8px', textTransform: 'uppercase', border: '1px solid rgba(240,236,232,.15)' }}>BESTSELLER</span>
                )}
              </div>

              <div style={{ padding: '16px 18px 20px' }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 4 }}>{p.category}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: 'var(--w)', letterSpacing: '.04em', lineHeight: 1, marginBottom: 8 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--w)' }}>₹ {p.price.toLocaleString('en-IN')}</span>
                  {p.originalPrice && (
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'rgba(240,236,232,.3)', textDecoration: 'line-through' }}>₹ {p.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '100px 52px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: 'rgba(240,236,232,.2)' }}>NOTHING HERE YET</div>
          </div>
        )}
      </div>
    </div>
  );
}
