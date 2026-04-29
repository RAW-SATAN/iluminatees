'use client';
import { useEffect, useState } from 'react';
import { ORDERS_KEY } from '@/lib/admin-auth';

interface OrderItem { name: string; price: number; quantity: number; size?: string; }
interface Order {
  id: string; date: string; items: OrderItem[];
  total: number;
  shipping: { firstName: string; lastName: string; address: string; city: string; state: string; pin: string; email: string; phone: string; };
  status: string; payMethod: string;
}

const STATUSES = ['confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLOR: Record<string, string> = { confirmed: 'adm-badge-red', shipped: 'adm-badge-yellow', delivered: 'adm-badge-green', cancelled: 'adm-badge-gray' };
const PAY_LABEL: Record<string, string> = { upi: 'UPI', card: 'Card', cod: 'COD' };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')); } catch {}
  }, []);

  const save = (next: Order[]) => { setOrders(next); localStorage.setItem(ORDERS_KEY, JSON.stringify(next)); };

  const updateStatus = (id: string, status: string) => {
    const next = orders.map(o => o.id === id ? { ...o, status } : o);
    save(next);
    setSelected(s => s?.id === id ? { ...s, status } : s);
  };

  const deleteOrder = (id: string) => {
    if (!confirm('Delete this order?')) return;
    save(orders.filter(o => o.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.shipping.firstName.toLowerCase().includes(q) || o.shipping.lastName.toLowerCase().includes(q) || o.shipping.email.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="adm-page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ece8', marginBottom: 4 }}>Orders</div>
        <div style={{ fontSize: 12, color: 'rgba(240,236,232,.35)' }}>{orders.length} total orders · ₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')} revenue</div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="adm-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, customers…" style={{ maxWidth: 260 }} />
        <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(240,236,232,.08)', borderRadius: 4, overflow: 'hidden' }}>
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? 'rgba(204,0,0,.1)' : 'transparent', border: 'none', color: filter === s ? '#cc0000' : 'rgba(240,236,232,.4)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.1em', padding: '8px 14px', cursor: 'pointer', textTransform: 'uppercase', transition: 'all .15s', borderRight: '1px solid rgba(240,236,232,.08)' }}>
              {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="adm-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(240,236,232,.2)', fontSize: 14 }}>No orders found</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 16 }}>
          {/* Table */}
          <div className="adm-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="adm-table" style={{ minWidth: 620 }}>
                <thead>
                  <tr>
                    <th className="adm-th">Order</th>
                    <th className="adm-th">Date</th>
                    <th className="adm-th">Customer</th>
                    <th className="adm-th">Total</th>
                    <th className="adm-th">Payment</th>
                    <th className="adm-th">Status</th>
                    <th className="adm-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => (
                    <tr key={o.id}
                      onClick={() => setSelected(selected?.id === o.id ? null : o)}
                      style={{ cursor: 'pointer', background: selected?.id === o.id ? 'rgba(204,0,0,.05)' : i % 2 === 0 ? 'rgba(255,255,255,.01)' : 'transparent', transition: 'background .15s' }}
                      onMouseEnter={e => { if (selected?.id !== o.id) (e.currentTarget as HTMLElement).style.background = 'rgba(240,236,232,.02)'; }}
                      onMouseLeave={e => { if (selected?.id !== o.id) (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'rgba(255,255,255,.01)' : 'transparent'; }}
                    >
                      <td className="adm-td"><span style={{ color: '#cc0000', fontWeight: 700, fontSize: 12 }}>{o.id}</span></td>
                      <td className="adm-td" style={{ fontSize: 11, color: 'rgba(240,236,232,.45)' }}>{new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td className="adm-td">
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{o.shipping.firstName} {o.shipping.lastName}</div>
                        <div style={{ fontSize: 10, color: 'rgba(240,236,232,.35)' }}>{o.shipping.city}</div>
                      </td>
                      <td className="adm-td" style={{ fontWeight: 700 }}>₹{o.total.toLocaleString('en-IN')}</td>
                      <td className="adm-td"><span style={{ fontSize: 10, color: 'rgba(240,236,232,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{PAY_LABEL[o.payMethod] || o.payMethod}</span></td>
                      <td className="adm-td">
                        <select
                          value={o.status}
                          onChange={e => { e.stopPropagation(); updateStatus(o.id, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          className={`adm-badge ${STATUS_COLOR[o.status] || 'adm-badge-gray'}`}
                          style={{ border: 'none', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '.06em', textTransform: 'capitalize', background: 'transparent' }}
                        >
                          {STATUSES.map(s => <option key={s} value={s} style={{ background: '#0d0d0d', color: '#f0ece8' }}>{s}</option>)}
                        </select>
                      </td>
                      <td className="adm-td" style={{ textAlign: 'right' }}>
                        <button onClick={e => { e.stopPropagation(); deleteOrder(o.id); }} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.2)', cursor: 'pointer', fontSize: 14, padding: '2px 6px', transition: 'color .2s' }}
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

          {/* Detail panel */}
          {selected && (
            <div className="adm-card" style={{ padding: 24, height: 'fit-content', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f0ece8' }}>{selected.id}</div>
                  <div style={{ fontSize: 11, color: 'rgba(240,236,232,.35)', marginTop: 2 }}>{new Date(selected.date).toLocaleString('en-IN')}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.3)', cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>

              {/* Status update */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 8 }}>Order Status</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ background: selected.status === s ? '#cc0000' : 'transparent', border: `1px solid ${selected.status === s ? '#cc0000' : 'rgba(240,236,232,.12)'}`, color: selected.status === s ? '#fff' : 'rgba(240,236,232,.45)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.08em', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', textTransform: 'capitalize', transition: 'all .15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(240,236,232,.06)', marginBottom: 16 }} />

              {/* Customer */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 10 }}>Customer</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece8', marginBottom: 3 }}>{selected.shipping.firstName} {selected.shipping.lastName}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,236,232,.45)', marginBottom: 2 }}>{selected.shipping.email}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,236,232,.45)' }}>{selected.shipping.phone}</div>
              </div>

              {/* Shipping address */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 10 }}>Ship To</div>
                <div style={{ fontSize: 12, color: 'rgba(240,236,232,.55)', lineHeight: 1.7 }}>
                  {selected.shipping.address}<br />
                  {selected.shipping.city}, {selected.shipping.state}<br />
                  PIN {selected.shipping.pin}
                </div>
              </div>

              {/* Payment */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 6 }}>Payment</div>
                <div style={{ fontSize: 12, color: 'rgba(240,236,232,.55)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{PAY_LABEL[selected.payMethod] || selected.payMethod}</div>
              </div>

              <div style={{ height: 1, background: 'rgba(240,236,232,.06)', marginBottom: 16 }} />

              {/* Items */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 10 }}>Items ({selected.items.length})</div>
                {selected.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < selected.items.length - 1 ? '1px solid rgba(240,236,232,.04)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#f0ece8' }}>{item.name}</div>
                      {item.size && <div style={{ fontSize: 10, color: 'rgba(240,236,232,.35)' }}>Size: {item.size} · Qty: {item.quantity}</div>}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f0ece8' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'rgba(240,236,232,.06)', marginBottom: 12 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f0ece8' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#cc0000' }}>₹{selected.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
