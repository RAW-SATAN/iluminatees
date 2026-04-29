'use client';
import { useState } from 'react';
import Link from 'next/link';
import { products } from '@/lib/products';

type SortKey = 'name' | 'price' | 'category';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [cat, setCat] = useState('ALL');

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = cat === 'ALL' || p.category === cat;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'category') return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });

  const th: React.CSSProperties = { fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', padding: '10px 16px', textAlign: 'left', fontWeight: 600, background: '#080808', borderBottom: '1px solid rgba(240,236,232,.06)', whiteSpace: 'nowrap' };
  const td: React.CSSProperties = { fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: '#f0ece8', padding: '14px 16px', borderBottom: '1px solid rgba(240,236,232,.04)', verticalAlign: 'middle' };

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 6 }}>MANAGE</div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: '#f0ece8', letterSpacing: '.04em', margin: 0 }}>PRODUCTS</h1>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '.1em', color: 'rgba(240,236,232,.3)' }}>{filtered.length} / {products.length} shown</div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{ background: '#0d0d0d', border: '1px solid rgba(240,236,232,.1)', color: '#f0ece8', fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, padding: '10px 14px', outline: 'none', flex: 1, minWidth: 180 }}
        />
        {['ALL','APEX','CIPHER','SACRED'].map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? 'rgba(204,0,0,.12)' : '#0d0d0d', border: cat === c ? '1px solid rgba(204,0,0,.4)' : '1px solid rgba(240,236,232,.1)', color: cat === c ? '#cc0000' : 'rgba(240,236,232,.5)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.14em', padding: '10px 16px', cursor: 'pointer', transition: 'all .2s' }}>{c}</button>
        ))}
        <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={{ background: '#0d0d0d', border: '1px solid rgba(240,236,232,.1)', color: 'rgba(240,236,232,.5)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.1em', padding: '10px 14px', cursor: 'pointer' }}>
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="category">Sort: Category</option>
        </select>
      </div>

      <div style={{ border: '1px solid rgba(240,236,232,.06)', overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr>
              <th style={th}>Product</th><th style={th}>Category</th><th style={th}>Price</th>
              <th style={th}>Sizes</th><th style={th}>Tags</th><th style={th}>Stock</th><th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? '#0d0d0d' : 'transparent', transition: 'background .2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(240,236,232,.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background=i % 2 === 0 ? '#0d0d0d' : 'transparent'}
              >
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: p.shirtColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: p.accentColor, opacity: .8, flexShrink: 0 }}>◈</div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 1 }}>{p.name}</div>
                      <div style={{ fontSize: 9, color: 'rgba(240,236,232,.3)', letterSpacing: '.1em' }}>{p.codename}</div>
                    </div>
                  </div>
                </td>
                <td style={td}><span style={{ fontSize: 9, letterSpacing: '.14em', color: '#cc0000', border: '1px solid rgba(204,0,0,.25)', padding: '3px 8px', textTransform: 'uppercase' }}>{p.category}</span></td>
                <td style={{ ...td, fontWeight: 700, color: '#cc0000' }}>
                  ₹{p.price.toLocaleString('en-IN')}
                  {p.originalPrice && <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)', textDecoration: 'line-through', fontWeight: 400 }}>₹{p.originalPrice.toLocaleString('en-IN')}</div>}
                </td>
                <td style={{ ...td, fontSize: 10 }}>{p.sizes.join(', ')}</td>
                <td style={td}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {p.tags.map(t => <span key={t} style={{ fontSize: 8, letterSpacing: '.1em', color: 'rgba(240,236,232,.35)', border: '1px solid rgba(240,236,232,.08)', padding: '2px 6px', textTransform: 'uppercase' }}>{t}</span>)}
                    {p.limited && <span style={{ fontSize: 8, letterSpacing: '.1em', color: '#f59e0b', border: '1px solid rgba(245,158,11,.3)', padding: '2px 6px', textTransform: 'uppercase' }}>LIMITED</span>}
                  </div>
                </td>
                <td style={td}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.inStock ? '#22c55e' : '#cc0000', display: 'inline-block' }} />
                  <span style={{ fontSize: 10, color: 'rgba(240,236,232,.4)', marginLeft: 6 }}>{p.inStock ? 'In Stock' : 'Out'}</span>
                </td>
                <td style={td}>
                  <Link href={`/product/${p.slug}`} style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: '#cc0000', textDecoration: 'none', border: '1px solid rgba(204,0,0,.25)', padding: '4px 10px', transition: 'background .2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background='rgba(204,0,0,.1)'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background='transparent'}
                  >VIEW →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
