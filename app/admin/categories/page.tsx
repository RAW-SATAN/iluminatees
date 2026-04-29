'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products as staticProducts } from '@/lib/products';
import { getAdminProducts } from '@/lib/store-products';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  image: string;
  conditions: string;
  active: boolean;
  createdAt: string;
  sortOrder: number;
}

const DEFAULT_COLLECTIONS: Collection[] = [
  { id:'apex', name:'APEX', slug:'apex', description:'The premium tier. Highest GSM, ultra-heavy constructions, numbered and limited. Worn by those who refuse compromise.', color:'#cc0000', image:'/hero-model.jpg', conditions:'Category is APEX', active:true, createdAt:'2026-01-01', sortOrder:1 },
  { id:'cipher', name:'CIPHER', slug:'cipher', description:'Between the lines. Relaxed fits, washed fabrics, everyday rebellion. The code others can\'t read.', color:'#d97706', image:'/editorial-portrait.jpg', conditions:'Category is CIPHER', active:true, createdAt:'2026-01-01', sortOrder:2 },
  { id:'sacred', name:'SACRED', slug:'sacred', description:'The origin. Geometric symbols, ancient knowledge encoded in cotton. Where the brand began.', color:'#16a34a', image:'/editorial-back.jpg', conditions:'Category is SACRED', active:true, createdAt:'2026-01-01', sortOrder:3 },
];

const KEY = 'ilum_collections';

export default function CategoriesPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState<Partial<Collection>>({ active:true, color:'#cc0000' });
  const [allProducts] = useState([...staticProducts, ...getAdminProducts()]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY)||'null');
      setCollections(saved||DEFAULT_COLLECTIONS);
    } catch { setCollections(DEFAULT_COLLECTIONS); }
  }, []);

  const save = (next: Collection[]) => { setCollections(next); localStorage.setItem(KEY, JSON.stringify(next)); };

  const handleEdit = (c: Collection) => {
    setEditId(c.id);
    setForm({ ...c });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditId(null);
    setForm({ active:true, color:'#cc0000' });
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    if (editId) {
      save(collections.map(c => c.id===editId ? { ...c, ...form } as Collection : c));
    } else {
      const newCol: Collection = {
        id: Date.now().toString(36),
        name: (form.name||'').toUpperCase(),
        slug: (form.name||'').toLowerCase().replace(/\s+/g,'-'),
        description: form.description||'',
        color: form.color||'#cc0000',
        image: form.image||'',
        conditions: form.conditions||'',
        active: form.active??true,
        createdAt: new Date().toISOString(),
        sortOrder: collections.length+1,
      };
      save([...collections, newCol]);
    }
    setShowForm(false);
    setEditId(null);
  };

  const toggleActive = (id: string) => save(collections.map(c => c.id===id?{...c,active:!c.active}:c));
  const deleteCol = (id: string) => { if (['apex','cipher','sacred'].includes(id)) { alert('Default collections cannot be deleted.'); return; } if(confirm('Delete this collection?')) save(collections.filter(c=>c.id!==id)); };

  const getCount = (name: string) => allProducts.filter(p => p.category === name.toUpperCase()).length;

  const inp = "adm-input";
  const lbl = "adm-label";

  return (
    <>
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">Products / Collections</div>
          <div className="adm-page-title">Collections</div>
        </div>
        <button className="adm-btn-primary" onClick={handleCreate} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create collection
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="adm-card" style={{ padding:24, marginBottom:16 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1a1a1a', marginBottom:20 }}>{editId?'Edit':'New'} Collection</div>
          <form onSubmit={handleSave}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label className={lbl}>Name *</label>
                <input className={inp} value={form.name||''} onChange={e=>setForm(p=>({...p,name:e.target.value.toUpperCase()}))} placeholder="e.g. VOID" required />
              </div>
              <div>
                <label className={lbl}>Accent Colour</label>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="color" value={form.color||'#cc0000'} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{ width:42, height:42, border:'1px solid #e3e5e8', borderRadius:8, cursor:'pointer', background:'none', padding:2 }} />
                  <input className={inp} value={form.color||''} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{ flex:1 }} />
                </div>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label className={lbl}>Description</label>
              <textarea className={`${inp} adm-textarea`} value={form.description||''} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="What defines this collection?" style={{ minHeight:70 }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label className={lbl}>Conditions / Rules</label>
                <input className={inp} value={form.conditions||''} onChange={e=>setForm(p=>({...p,conditions:e.target.value}))} placeholder="e.g. Category is APEX" />
              </div>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'11px 14px', border:`2px solid ${form.active?'#16a34a':'#e3e5e8'}`, borderRadius:8, background:form.active?'#f0fdf4':'#fafafa', transition:'all .15s' }}>
                  <input type="checkbox" checked={form.active??true} onChange={e=>setForm(p=>({...p,active:e.target.checked}))} style={{ accentColor:'#16a34a', width:15, height:15 }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:form.active?'#16a34a':'#374151' }}>Active</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>Visible to customers</div>
                  </div>
                </label>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" className="adm-btn-primary">{editId?'Update':'Create'} collection</button>
              <button type="button" className="adm-btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Collections grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:12 }}>
        {collections.map(c => {
          const count = getCount(c.name);
          return (
            <div key={c.id} className="adm-card" style={{ overflow:'hidden', opacity:c.active?1:.6, transition:'opacity .2s' }}>
              {/* Hero strip */}
              <div style={{ height:6, background:c.color }} />
              <div style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:40, height:40, background:c.color+'22', border:`2px solid ${c.color}`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:c.color, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:'.06em' }}>
                      {c.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:800, color:'#1a1a1a', fontFamily:"'Bebas Neue',sans-serif", letterSpacing:'.06em' }}>{c.name}</div>
                      <div style={{ fontSize:11, color:'#9ca3af' }}>{count} product{count!==1?'s':''}</div>
                    </div>
                  </div>
                  <span className={`adm-badge ${c.active?'adm-badge-green':'adm-badge-gray'}`}>{c.active?'Active':'Inactive'}</span>
                </div>

                <p style={{ fontSize:12, color:'#6b7280', lineHeight:1.6, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {c.description||'No description'}
                </p>

                {c.conditions && (
                  <div style={{ fontSize:11, color:'#9ca3af', background:'#f9fafb', padding:'6px 10px', borderRadius:6, marginBottom:14, fontFamily:'monospace' }}>
                    {c.conditions}
                  </div>
                )}

                {/* Product count bar */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:11, color:'#9ca3af' }}>Products</span>
                    <span style={{ fontSize:11, fontWeight:600, color:'#374151' }}>{count}</span>
                  </div>
                  <div style={{ height:4, background:'#f1f2f4', borderRadius:2 }}>
                    <div style={{ height:'100%', width:`${Math.min((count/12)*100,100)}%`, background:c.color, borderRadius:2, transition:'width .5s ease' }} />
                  </div>
                </div>

                <div style={{ display:'flex', gap:6 }}>
                  <Link href={`/collections`} className="adm-btn-secondary" style={{ textDecoration:'none', fontSize:12, padding:'6px 12px', flex:1, textAlign:'center' }}>View in store</Link>
                  <button onClick={()=>handleEdit(c)} className="adm-btn-secondary" style={{ fontSize:12, padding:'6px 12px', flex:1 }}>Edit</button>
                  <button onClick={()=>toggleActive(c.id)} style={{ background:'none', border:`1px solid ${c.active?'#fca5a5':'#bbf7d0'}`, color:c.active?'#cc0000':'#16a34a', fontFamily:"'Space Grotesk',sans-serif", fontSize:12, padding:'6px 12px', borderRadius:8, cursor:'pointer', transition:'all .15s' }}>
                    {c.active?'Pause':'Enable'}
                  </button>
                  {!['apex','cipher','sacred'].includes(c.id) && (
                    <button onClick={()=>deleteCol(c.id)} className="adm-btn-danger" style={{ fontSize:12, padding:'6px 10px' }}>✕</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
