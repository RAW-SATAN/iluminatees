'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAdminProduct, genSlug, type AdminProduct } from '@/lib/store-products';
import type { ProductSize } from '@/lib/products';

const ALL_SIZES: ProductSize[] = ['XS','S','M','L','XL','XXL'];
const CATEGORIES = ['APEX','CIPHER','SACRED'];
const SHIRT_COLORS = [
  { label:'Washed Black', value:'#0d0d0d' },
  { label:'Onyx', value:'#050505' },
  { label:'Dark Navy', value:'#0a0a1a' },
  { label:'Forest', value:'#001a00' },
  { label:'Burgundy', value:'#1a0010' },
  { label:'Rust', value:'#1a0500' },
];
const ACCENT_COLORS = [
  { label:'Gold', value:'#c9a84c' },
  { label:'Red', value:'#cc0000' },
  { label:'White', value:'#f0ece8' },
  { label:'Cyan', value:'#00e5ff' },
  { label:'Purple', value:'#d4a0ff' },
  { label:'Yellow', value:'#ffd700' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '', codename: '', category: 'APEX' as string,
    price: '', originalPrice: '', description: '',
    sku: '', inventory: '10', weight: '250',
    shirtColor: '#0d0d0d', accentColor: '#c9a84c',
    sizes: ['S','M','L','XL'] as ProductSize[],
    tags: '', limited: false, inStock: true,
    status: 'active' as 'active'|'draft',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const val = e.target.type==='checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(p => ({ ...p, [k]: val }));
  };

  const toggleSize = (s: ProductSize) => {
    setForm(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x=>x!==s) : [...p.sizes, s] }));
  };

  const handleSave = (status: 'active'|'draft') => {
    if (!form.name || !form.price) return;
    setSaving(true);
    const product: AdminProduct = {
      id: Date.now().toString(36),
      slug: genSlug(form.name),
      name: form.name,
      codename: form.codename || `CUSTOM-${Date.now().toString(36).toUpperCase()}`,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      description: form.description,
      sizes: form.sizes,
      inStock: form.inStock,
      limited: form.limited,
      tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      status,
      inventory: Number(form.inventory),
      sku: form.sku || genSlug(form.name).toUpperCase(),
      weight: Number(form.weight),
      shirtColor: form.shirtColor,
      accentColor: form.accentColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAdminProduct(product);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => router.push('/admin/products'), 800); }, 600);
  };

  const inp = "adm-input";
  const lbl = "adm-label";

  return (
    <>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">
            <Link href="/admin/products" style={{ color:'#9ca3af', textDecoration:'none' }}>Products</Link>
            {' / '}<span style={{ color:'#1a1a1a' }}>Add product</span>
          </div>
          <div className="adm-page-title">Add product</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=>handleSave('draft')} className="adm-btn-secondary" disabled={saving||!form.name}>Save as draft</button>
          <button onClick={()=>handleSave('active')} className="adm-btn-primary" disabled={saving||!form.name||!form.price} style={{ minWidth:120, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {saving ? <><span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} /> Saving…</> : saved ? '✓ Saved!' : 'Save product'}
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, alignItems:'start' }}>
        {/* Left column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Title & desc */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:16 }}>Product details</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label className={lbl}>Title *</label>
                <input className={inp} value={form.name} onChange={set('name')} placeholder="e.g. Eye of Providence Tee" />
              </div>
              <div>
                <label className={lbl}>Codename <span style={{ color:'#9ca3af', fontWeight:400 }}>(internal)</span></label>
                <input className={inp} value={form.codename} onChange={set('codename')} placeholder="e.g. DOSSIER-13" />
              </div>
              <div>
                <label className={lbl}>Description</label>
                <textarea className={`${inp} adm-textarea`} value={form.description} onChange={set('description')} placeholder="Describe the product…" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:16 }}>Pricing</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className={lbl}>Price (₹) *</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:13 }}>₹</span>
                  <input className={inp} type="number" value={form.price} onChange={set('price')} placeholder="0.00" style={{ paddingLeft:28 }} />
                </div>
              </div>
              <div>
                <label className={lbl}>Compare-at price</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:13 }}>₹</span>
                  <input className={inp} type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="0.00" style={{ paddingLeft:28 }} />
                </div>
                <div className="adm-hint">Shows strikethrough price</div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:16 }}>Inventory</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <div>
                <label className={lbl}>SKU</label>
                <input className={inp} value={form.sku} onChange={set('sku')} placeholder="Auto-generated" />
              </div>
              <div>
                <label className={lbl}>Quantity</label>
                <input className={inp} type="number" value={form.inventory} onChange={set('inventory')} min={0} />
              </div>
              <div>
                <label className={lbl}>Weight (g)</label>
                <input className={inp} type="number" value={form.weight} onChange={set('weight')} />
              </div>
            </div>
          </div>

          {/* Variants / Sizes */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:4 }}>Variants</div>
            <div style={{ fontSize:12, color:'#9ca3af', marginBottom:16 }}>Select available sizes</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {ALL_SIZES.map(s => (
                <button key={s} type="button" onClick={()=>toggleSize(s)} style={{ padding:'8px 18px', border:`2px solid ${form.sizes.includes(s)?'#cc0000':'#e3e5e8'}`, borderRadius:8, background:form.sizes.includes(s)?'#fef2f2':'#fff', color:form.sizes.includes(s)?'#cc0000':'#6b7280', fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                  {s}
                </button>
              ))}
            </div>
            {form.sizes.length===0 && <div style={{ fontSize:12, color:'#cc0000', marginTop:8 }}>Select at least one size</div>}
          </div>

          {/* Design */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:16 }}>Design & Colours</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label className={lbl}>Shirt Colour</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
                  {SHIRT_COLORS.map(c => (
                    <button key={c.value} type="button" onClick={()=>setForm(p=>({...p,shirtColor:c.value}))} title={c.label} style={{ width:32, height:32, borderRadius:'50%', background:c.value, border:`3px solid ${form.shirtColor===c.value?'#cc0000':'transparent'}`, outline:'2px solid rgba(0,0,0,.1)', cursor:'pointer', transition:'border-color .15s' }} />
                  ))}
                </div>
                <div style={{ fontSize:11, color:'#9ca3af', marginTop:6 }}>{SHIRT_COLORS.find(c=>c.value===form.shirtColor)?.label}</div>
              </div>
              <div>
                <label className={lbl}>Accent / Symbol Colour</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
                  {ACCENT_COLORS.map(c => (
                    <button key={c.value} type="button" onClick={()=>setForm(p=>({...p,accentColor:c.value}))} title={c.label} style={{ width:32, height:32, borderRadius:'50%', background:c.value, border:`3px solid ${form.accentColor===c.value?'#cc0000':'transparent'}`, outline:`2px solid rgba(0,0,0,${c.value==="#f0ece8"?.3:.1})`, cursor:'pointer', transition:'border-color .15s' }} />
                  ))}
                </div>
                <div style={{ fontSize:11, color:'#9ca3af', marginTop:6 }}>{ACCENT_COLORS.find(c=>c.value===form.accentColor)?.label}</div>
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginTop:20, padding:16, background:'#f9fafb', borderRadius:8, display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:80, height:80, background:form.shirtColor, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, color:form.accentColor }}>◈</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{form.name||'Product Preview'}</div>
                <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>{form.category} · {form.sizes.length} sizes</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#cc0000', marginTop:4 }}>₹{Number(form.price||0).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Status */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:14 }}>Status</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {(['active','draft'] as const).map(s => (
                <label key={s} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'10px 12px', border:`2px solid ${form.status===s?'#cc0000':'#e3e5e8'}`, borderRadius:8, background:form.status===s?'#fef2f2':'#fff', transition:'all .15s' }}>
                  <input type="radio" name="status" value={s} checked={form.status===s} onChange={()=>setForm(p=>({...p,status:s}))} style={{ accentColor:'#cc0000' }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:form.status===s?'#cc0000':'#1a1a1a', textTransform:'capitalize' }}>{s}</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{s==='active'?'Visible in store':'Hidden from store'}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Organisation */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:14 }}>Organisation</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <label className={lbl}>Collection</label>
                <select className={inp} value={form.category} onChange={set('category')} style={{ cursor:'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Tags</label>
                <input className={inp} value={form.tags} onChange={set('tags')} placeholder="oversized, washed, limited…" />
                <div className="adm-hint">Comma-separated</div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="adm-card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a', marginBottom:14 }}>Options</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { key:'inStock'  as const, label:'In stock',        sub:'Customers can purchase' },
                { key:'limited'  as const, label:'Limited edition', sub:'Shows LIMITED badge' },
              ].map(o => (
                <label key={o.key} style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', padding:'10px 12px', border:'1px solid #e3e5e8', borderRadius:8, background:'#fafafa' }}>
                  <input type="checkbox" checked={Boolean(form[o.key])} onChange={set(o.key)} style={{ accentColor:'#cc0000', marginTop:2, width:15, height:15 }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{o.label}</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{o.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save actions */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={()=>handleSave('active')} className="adm-btn-primary" disabled={saving||!form.name||!form.price} style={{ width:'100%', padding:'12px', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {saving?<><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} /> Saving…</>:saved?'✓ Saved!':'Save product'}
            </button>
            <button onClick={()=>handleSave('draft')} className="adm-btn-secondary" disabled={saving||!form.name} style={{ width:'100%', padding:'11px', fontSize:13 }}>Save as draft</button>
            <Link href="/admin/products" className="adm-btn-secondary" style={{ display:'block', textAlign:'center', textDecoration:'none', padding:'10px', fontSize:13 }}>Discard</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          div[style*="grid-template-columns:'1fr 320px'"]{grid-template-columns:1fr!important}
        }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </>
  );
}
