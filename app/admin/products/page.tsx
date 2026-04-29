'use client';
import { useState } from 'react';
import Link from 'next/link';
import { products } from '@/lib/products';

type SortKey = 'name' | 'price' | 'category';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [cat, setCat] = useState('ALL');
  const [view, setView] = useState<'table' | 'grid'>('table');

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      return (cat === 'ALL' || p.category === cat) && (!q || p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    })
    .sort((a, b) => sort === 'price' ? a.price - b.price : sort === 'category' ? a.category.localeCompare(b.category) : a.name.localeCompare(b.name));

  const totalValue = products.reduce((s, p) => s + p.price, 0);

  return (
    <div className="adm-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ece8', marginBottom: 4 }}>Products</div>
          <div style={{ fontSize: 12, color: 'rgba(240,236,232,.35)' }}>{products.length} products · Catalogue value ₹{totalValue.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/shop" className="adm-btn-ghost" style={{ textDecoration: 'none', fontSize: 12, padding: '9px 16px', borderRadius: 4, border: '1px solid rgba(240,236,232,.12)', color: 'rgba(240,236,232,.6)', display: 'flex', alignItems: 'center', gap: 6 }}>View in store ↗</Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total',   count: products.length,                                  color: '#f0ece8' },
          { label: 'APEX',    count: products.filter(p => p.category === 'APEX').length,   color: '#cc0000' },
          { label: 'CIPHER',  count: products.filter(p => p.category === 'CIPHER').length, color: '#f59e0b' },
          { label: 'SACRED',  count: products.filter(p => p.category === 'SACRED').length, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="adm-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="adm-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, tags…" style={{ maxWidth: 240 }} />
        <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(240,236,232,.08)', borderRadius: 4, overflow: 'hidden' }}>
          {['ALL','APEX','CIPHER','SACRED'].map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? 'rgba(204,0,0,.1)' : 'transparent', border: 'none', borderRight: '1px solid rgba(240,236,232,.08)', color: cat === c ? '#cc0000' : 'rgba(240,236,232,.4)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.1em', padding: '8px 14px', cursor: 'pointer', textTransform: 'uppercase', transition: 'all .15s' }}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="adm-input" style={{ width: 'auto', cursor: 'pointer' }}>
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="category">Sort: Category</option>
        </select>
        {/* View toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', border: '1px solid rgba(240,236,232,.08)', borderRadius: 4, overflow: 'hidden' }}>
          {(['table','grid'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? 'rgba(240,236,232,.08)' : 'transparent', border: 'none', color: view === v ? '#f0ece8' : 'rgba(240,236,232,.35)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, padding: '8px 12px', cursor: 'pointer' }}>
              {v === 'table' ? '☰' : '⊞'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
          {filtered.map(p => (
            <Link key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className="adm-card" style={{ overflow: 'hidden', transition: 'border-color .2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(204,0,0,.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,236,232,.06)'}
              >
                <div style={{ background: p.shirtColor, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: p.accentColor, opacity: .7 }}>◈</div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f0ece8', marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'rgba(240,236,232,.3)', marginBottom: 6, textTransform: 'uppercase' }}>{p.category}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#cc0000' }}>₹{p.price.toLocaleString('en-IN')}</span>
                    {p.limited && <span className="adm-badge adm-badge-yellow" style={{ fontSize: 8 }}>LIMITED</span>}
                    {p.inStock ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> : <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="adm-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th className="adm-th">Product</th>
                  <th className="adm-th">Category</th>
                  <th className="adm-th">Price</th>
                  <th className="adm-th">Sizes</th>
                  <th className="adm-th">Tags</th>
                  <th className="adm-th">Stock</th>
                  <th className="adm-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}
                    style={{ cursor: 'pointer', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(240,236,232,.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td className="adm-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: p.shirtColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: p.accentColor, borderRadius: 4 }}>◈</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece8' }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)' }}>{p.codename}</div>
                        </div>
                      </div>
                    </td>
                    <td className="adm-td"><span className="adm-badge adm-badge-red" style={{ fontSize: 9 }}>{p.category}</span></td>
                    <td className="adm-td">
                      <div style={{ fontWeight: 700, color: '#cc0000' }}>₹{p.price.toLocaleString('en-IN')}</div>
                      {p.originalPrice && <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</div>}
                    </td>
                    <td className="adm-td" style={{ fontSize: 11, color: 'rgba(240,236,232,.5)' }}>{p.sizes.join(' · ')}</td>
                    <td className="adm-td">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {p.tags.map(t => <span key={t} className="adm-badge adm-badge-gray" style={{ fontSize: 8 }}>{t}</span>)}
                        {p.limited && <span className="adm-badge adm-badge-yellow" style={{ fontSize: 8 }}>LIMITED</span>}
                      </div>
                    </td>
                    <td className="adm-td">
                      <span className={`adm-badge ${p.inStock ? 'adm-badge-green' : 'adm-badge-gray'}`} style={{ fontSize: 10 }}>
                        {p.inStock ? '● In Stock' : '● Out of Stock'}
                      </span>
                    </td>
                    <td className="adm-td">
                      <Link href={`/product/${p.slug}`} className="adm-btn-ghost" style={{ textDecoration: 'none', fontSize: 11, padding: '5px 12px', display: 'inline-block', borderRadius: 4 }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
