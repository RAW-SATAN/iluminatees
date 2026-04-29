'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products as staticProducts } from '@/lib/products';
import { getAdminProducts, deleteAdminProduct, type AdminProduct } from '@/lib/store-products';

type AnyProduct = { id:string; name:string; category:string; price:number; originalPrice?:number; inStock:boolean; limited:boolean; tags:string[]; shirtColor:string; accentColor:string; slug:string; status?:string; inventory?:number; isCustom?:boolean; };

export default function ProductsPage() {
  const [customProds, setCustomProds] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('ALL');
  const [view, setView] = useState<'table'|'grid'>('table');

  useEffect(() => { setCustomProds(getAdminProducts()); }, []);

  const all: AnyProduct[] = [
    ...customProds.map(p => ({ ...p, isCustom:true })),
    ...staticProducts.map(p => ({ ...p, status:'active', inventory:10, isCustom:false })),
  ];

  const filtered = all.filter(p => {
    const q = search.toLowerCase();
    return (cat==='ALL' || p.category===cat) && (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return;
    deleteAdminProduct(id);
    setCustomProds(getAdminProducts());
  };

  const categories = ['ALL','APEX','CIPHER','SACRED'];

  return (
    <>
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">Products</div>
          <div className="adm-page-title">All Products</div>
        </div>
        <Link href="/admin/products/new" className="adm-btn-primary" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add product
        </Link>
      </div>

      {/* Stats strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
        {[
          { label:'Total',  n:all.length,                                         color:'#1a1a1a' },
          { label:'APEX',   n:all.filter(p=>p.category==='APEX').length,          color:'#cc0000' },
          { label:'CIPHER', n:all.filter(p=>p.category==='CIPHER').length,        color:'#d97706' },
          { label:'SACRED', n:all.filter(p=>p.category==='SACRED').length,        color:'#16a34a' },
        ].map(s => (
          <div key={s.label} className="adm-stat-card" style={{ padding:'12px 16px' }}>
            <div className="adm-stat-label">{s.label}</div>
            <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.n}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="adm-card" style={{ borderRadius:'12px 12px 0 0', borderBottom:'none', padding:'12px 16px', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:180 }}>
          <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="adm-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter products…" style={{ paddingLeft:32 }} />
        </div>
        <div style={{ display:'flex', gap:0, border:'1px solid #e3e5e8', borderRadius:8, overflow:'hidden' }}>
          {categories.map(c => (
            <button key={c} onClick={()=>setCat(c)} style={{ background:cat===c?'#cc0000':'#fff', border:'none', borderRight:'1px solid #e3e5e8', color:cat===c?'#fff':'#6b7280', fontFamily:"'Space Grotesk',sans-serif", fontSize:11, fontWeight:600, padding:'8px 14px', cursor:'pointer', transition:'all .15s', letterSpacing:'.04em' }}>{c}</button>
          ))}
        </div>
        <div style={{ display:'flex', border:'1px solid #e3e5e8', borderRadius:8, overflow:'hidden', marginLeft:'auto' }}>
          {(['table','grid'] as const).map(v => (
            <button key={v} onClick={()=>setView(v)} style={{ background:view===v?'#f9fafb':'#fff', border:'none', borderRight:v==='table'?'1px solid #e3e5e8':'none', color:view===v?'#1a1a1a':'#9ca3af', fontFamily:"'Space Grotesk',sans-serif", fontSize:13, padding:'8px 12px', cursor:'pointer' }}>
              {v==='table'?'☰':'⊞'}
            </button>
          ))}
        </div>
      </div>

      {view==='grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:10, padding:'2px 0' }}>
          {filtered.map(p => (
            <div key={p.id} className="adm-card" style={{ overflow:'hidden', transition:'box-shadow .2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(0,0,0,.1)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.boxShadow='none'}
            >
              <div style={{ background:p.shirtColor, aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:50, color:p.accentColor, opacity:.7, position:'relative' }}>
                ◈
                {(p as AnyProduct & {isCustom?:boolean}).isCustom && <span style={{ position:'absolute', top:8, left:8, background:'#2563eb', color:'#fff', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:600 }}>CUSTOM</span>}
                {p.limited && <span style={{ position:'absolute', top:8, right:8, background:'#cc0000', color:'#fff', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:600 }}>LIMITED</span>}
              </div>
              <div style={{ padding:'12px 14px' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', marginBottom:2 }}>{p.name}</div>
                <div style={{ fontSize:10, color:'#9ca3af', marginBottom:8 }}>{p.category}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:14, fontWeight:700, color:'#cc0000' }}>₹{p.price.toLocaleString('en-IN')}</span>
                  <span className={`adm-badge ${p.inStock ? 'adm-badge-green':'adm-badge-gray'}`} style={{ fontSize:9 }}>{p.inStock?'Active':'Draft'}</span>
                </div>
                <div style={{ display:'flex', gap:6, marginTop:10 }}>
                  <Link href={`/product/${p.slug}`} className="adm-btn-secondary" style={{ textDecoration:'none', fontSize:11, padding:'5px 10px', flex:1, textAlign:'center' }}>View</Link>
                  {(p as AnyProduct & {isCustom?:boolean}).isCustom && <button onClick={()=>handleDelete(p.id)} className="adm-btn-danger" style={{ fontSize:11, padding:'5px 10px' }}>Del</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adm-card" style={{ overflow:'hidden', borderRadius:'0 0 12px 12px' }}>
          <div style={{ overflowX:'auto' }}>
            <table className="adm-table" style={{ minWidth:680 }}>
              <thead>
                <tr>
                  <th className="adm-th">Product</th>
                  <th className="adm-th">Status</th>
                  <th className="adm-th">Inventory</th>
                  <th className="adm-th">Category</th>
                  <th className="adm-th">Price</th>
                  <th className="adm-th"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="adm-tr">
                    <td className="adm-td">
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:40, height:40, background:p.shirtColor, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:p.accentColor, flexShrink:0 }}>◈</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'flex', alignItems:'center', gap:6 }}>
                            {p.name}
                            {(p as AnyProduct & {isCustom?:boolean}).isCustom && <span style={{ fontSize:9, background:'#eff6ff', color:'#2563eb', padding:'1px 6px', borderRadius:4, fontWeight:700 }}>CUSTOM</span>}
                          </div>
                          <div style={{ fontSize:11, color:'#9ca3af' }}>/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="adm-td"><span className={`adm-badge ${p.inStock?'adm-badge-green':'adm-badge-gray'}`}>{p.inStock?'Active':'Draft'}</span></td>
                    <td className="adm-td" style={{ fontSize:13, color:'#374151' }}>{(p as {inventory?:number}).inventory ?? 10} in stock</td>
                    <td className="adm-td"><span className="adm-badge adm-badge-blue" style={{ fontSize:10 }}>{p.category}</span></td>
                    <td className="adm-td">
                      <div style={{ fontWeight:700, color:'#cc0000' }}>₹{p.price.toLocaleString('en-IN')}</div>
                      {p.originalPrice && <div style={{ fontSize:11, color:'#9ca3af', textDecoration:'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</div>}
                    </td>
                    <td className="adm-td">
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <Link href={`/product/${p.slug}`} className="adm-btn-secondary" style={{ textDecoration:'none', fontSize:11, padding:'5px 12px' }}>View</Link>
                        {(p as AnyProduct & {isCustom?:boolean}).isCustom && (
                          <button onClick={()=>handleDelete(p.id)} className="adm-btn-danger" style={{ fontSize:11, padding:'5px 12px' }}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length===0 && <div style={{ padding:'40px', textAlign:'center', color:'#d1d5db', fontSize:13 }}>No products found</div>}
        </div>
      )}
    </>
  );
}
