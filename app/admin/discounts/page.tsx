'use client';
import { useEffect, useState } from 'react';
import { DISCOUNTS_KEY } from '@/lib/admin-auth';

interface Discount {
  id: string; code: string; type: 'percent' | 'fixed';
  value: number; minOrder: number; uses: number; maxUses: number; active: boolean; created: string;
  description: string;
}

const DEFAULT_DISCOUNTS: Discount[] = [
  { id: '1', code: 'ILUM10', type: 'percent', value: 10, minOrder: 0, uses: 0, maxUses: 999, active: true, created: new Date().toISOString(), description: 'Exit intent 10% off' },
  { id: '2', code: 'WELCOME15', type: 'percent', value: 15, minOrder: 0, uses: 0, maxUses: 100, active: true, created: new Date().toISOString(), description: 'New customer discount' },
  { id: '3', code: 'FREESHIP', type: 'fixed', value: 99, minOrder: 500, uses: 0, maxUses: 500, active: true, created: new Date().toISOString(), description: 'Free shipping code' },
];

function genId() { return Date.now().toString(36); }

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Discount>>({ type: 'percent', value: 10, minOrder: 0, maxUses: 999, active: true, description: '' });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DISCOUNTS_KEY) || 'null');
      setDiscounts(saved || DEFAULT_DISCOUNTS);
    } catch { setDiscounts(DEFAULT_DISCOUNTS); }
  }, []);

  const save = (next: Discount[]) => { setDiscounts(next); localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(next)); };

  const toggle = (id: string) => save(discounts.map(d => d.id === id ? { ...d, active: !d.active } : d));
  const del = (id: string) => { if (confirm('Delete this discount?')) save(discounts.filter(d => d.id !== id)); };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;
    const newDiscount: Discount = {
      id: genId(), code: form.code!.toUpperCase().trim(), type: form.type || 'percent',
      value: Number(form.value) || 10, minOrder: Number(form.minOrder) || 0,
      uses: 0, maxUses: Number(form.maxUses) || 999, active: true,
      created: new Date().toISOString(), description: form.description || '',
    };
    save([newDiscount, ...discounts]);
    setShowForm(false);
    setForm({ type: 'percent', value: 10, minOrder: 0, maxUses: 999, active: true, description: '' });
  };

  const setF = (k: keyof Discount) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const inputStyle = { width: '100%', background: 'rgba(240,236,232,.04)', border: '1px solid rgba(240,236,232,.1)', color: '#f0ece8', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, padding: '10px 12px', outline: 'none', borderRadius: 4, transition: 'border-color .2s' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.4)', marginBottom: 6 };

  return (
    <div className="adm-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ece8', marginBottom: 4 }}>Discounts</div>
          <div style={{ fontSize: 12, color: 'rgba(240,236,232,.35)' }}>{discounts.filter(d => d.active).length} active codes</div>
        </div>
        <button className="adm-btn-red" onClick={() => setShowForm(o => !o)}>
          {showForm ? '✕ Cancel' : '+ Create Discount'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="adm-card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f0ece8', marginBottom: 20 }}>New Discount Code</div>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Code *</label>
                <input style={inputStyle} value={form.code || ''} onChange={setF('code')} placeholder="e.g. SUMMER20" required />
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.type} onChange={setF('type')}>
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Value ({form.type === 'percent' ? '%' : '₹'})</label>
                <input style={inputStyle} type="number" value={form.value || ''} onChange={setF('value')} min={1} />
              </div>
              <div>
                <label style={labelStyle}>Min Order (₹)</label>
                <input style={inputStyle} type="number" value={form.minOrder || 0} onChange={setF('minOrder')} min={0} />
              </div>
              <div>
                <label style={labelStyle}>Max Uses</label>
                <input style={inputStyle} type="number" value={form.maxUses || 999} onChange={setF('maxUses')} min={1} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <input style={inputStyle} value={form.description || ''} onChange={setF('description')} placeholder="Internal note" />
              </div>
            </div>
            <button type="submit" className="adm-btn-red">Create Discount →</button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="adm-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-table" style={{ minWidth: 620 }}>
            <thead>
              <tr>
                <th className="adm-th">Code</th>
                <th className="adm-th">Type</th>
                <th className="adm-th">Value</th>
                <th className="adm-th">Min Order</th>
                <th className="adm-th">Uses</th>
                <th className="adm-th">Description</th>
                <th className="adm-th">Status</th>
                <th className="adm-th"></th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id} style={{ opacity: d.active ? 1 : .45 }}>
                  <td className="adm-td">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: '#cc0000', letterSpacing: '.08em' }}>{d.code}</span>
                      <button onClick={() => navigator.clipboard?.writeText(d.code)} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.25)', cursor: 'pointer', fontSize: 11, padding: '2px 4px' }} title="Copy">⎘</button>
                    </div>
                  </td>
                  <td className="adm-td"><span className={`adm-badge ${d.type === 'percent' ? 'adm-badge-yellow' : 'adm-badge-green'}`} style={{ fontSize: 9 }}>{d.type}</span></td>
                  <td className="adm-td" style={{ fontWeight: 700, color: '#f0ece8' }}>{d.type === 'percent' ? `${d.value}%` : `₹${d.value}`}</td>
                  <td className="adm-td" style={{ fontSize: 12, color: 'rgba(240,236,232,.4)' }}>{d.minOrder > 0 ? `₹${d.minOrder}` : '—'}</td>
                  <td className="adm-td">
                    <div style={{ fontSize: 12 }}>{d.uses} <span style={{ color: 'rgba(240,236,232,.35)' }}>/ {d.maxUses}</span></div>
                    <div style={{ width: 60, height: 3, background: 'rgba(240,236,232,.06)', borderRadius: 2, marginTop: 3 }}>
                      <div style={{ height: '100%', width: `${(d.uses / d.maxUses) * 100}%`, background: d.uses / d.maxUses > .8 ? '#cc0000' : '#22c55e', borderRadius: 2 }} />
                    </div>
                  </td>
                  <td className="adm-td" style={{ fontSize: 11, color: 'rgba(240,236,232,.4)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.description || '—'}</td>
                  <td className="adm-td">
                    <button onClick={() => toggle(d.id)} style={{ background: d.active ? 'rgba(34,197,94,.12)' : 'rgba(107,114,128,.15)', border: 'none', color: d.active ? '#22c55e' : '#9ca3af', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, padding: '4px 10px', borderRadius: 20, cursor: 'pointer', transition: 'all .2s', letterSpacing: '.06em' }}>
                      {d.active ? 'Active' : 'Paused'}
                    </button>
                  </td>
                  <td className="adm-td">
                    <button onClick={() => del(d.id)} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.2)', cursor: 'pointer', fontSize: 14, padding: '2px 6px', transition: 'color .2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#cc0000'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,236,232,.2)'}
                    >✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
