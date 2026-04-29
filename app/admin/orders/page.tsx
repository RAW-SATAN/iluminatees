'use client';
import { useEffect, useState } from 'react';

interface OrderItem { name: string; price: number; quantity: number; size: string; }
interface Order {
  id: string; date: string; items: OrderItem[];
  total: number; shipping: { firstName: string; lastName: string; address: string; city: string; state: string; pin: string; email: string; phone: string; };
  status: string; payMethod: string;
}

const STATUS_COLORS: Record<string, string> = { confirmed: '#cc0000', shipped: '#f59e0b', delivered: '#22c55e', cancelled: '#6b7280' };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem('ilum_orders') || '[]')); } catch {}
  }, []);

  const updateStatus = (id: string, status: string) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('ilum_orders', JSON.stringify(next));
      if (selected?.id === id) setSelected(o => o ? { ...o, status } : o);
      return next;
    });
  };

  const th: React.CSSProperties = { fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', padding: '10px 16px', textAlign: 'left', fontWeight: 600, background: '#080808', borderBottom: '1px solid rgba(240,236,232,.06)' };
  const td: React.CSSProperties = { fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: '#f0ece8', padding: '14px 16px', borderBottom: '1px solid rgba(240,236,232,.04)', verticalAlign: 'middle' };

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 6 }}>MANAGE</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: '#f0ece8', letterSpacing: '.04em', margin: 0 }}>ORDERS</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'rgba(240,236,232,.2)', fontSize: 14 }}>No orders yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
          <div style={{ border: '1px solid rgba(240,236,232,.06)', overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={th}>Order</th><th style={th}>Customer</th><th style={th}>Items</th>
                  <th style={th}>Total</th><th style={th}>Payment</th><th style={th}>Status</th><th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}
                    onClick={() => setSelected(selected?.id === o.id ? null : o)}
                    style={{ cursor: 'pointer', background: selected?.id === o.id ? 'rgba(204,0,0,.06)' : i % 2 === 0 ? '#0d0d0d' : 'transparent', transition: 'background .2s' }}
                  >
                    <td style={td}><span style={{ fontWeight: 700, color: '#cc0000' }}>{o.id}</span></td>
                    <td style={td}>{o.shipping.firstName} {o.shipping.lastName}</td>
                    <td style={td}>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                    <td style={{ ...td, fontWeight: 700 }}>₹{o.total.toLocaleString('en-IN')}</td>
                    <td style={{ ...td, textTransform: 'uppercase', fontSize: 10, letterSpacing: '.1em', color: 'rgba(240,236,232,.5)' }}>{o.payMethod}</td>
                    <td style={td}>
                      <select
                        value={o.status}
                        onChange={e => { e.stopPropagation(); updateStatus(o.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        style={{ background: 'rgba(0,0,0,.5)', border: '1px solid rgba(240,236,232,.1)', color: STATUS_COLORS[o.status] || '#f0ece8', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.1em', padding: '4px 8px', cursor: 'pointer', textTransform: 'uppercase' }}
                      >
                        {['confirmed','shipped','delivered','cancelled'].map(s => <option key={s} value={s} style={{ background: '#0d0d0d' }}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ ...td, fontSize: 10, color: 'rgba(240,236,232,.4)' }}>{new Date(o.date).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Detail Panel */}
          {selected && (
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(240,236,232,.06)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#f0ece8', letterSpacing: '.04em' }}>{selected.id}</div>
                  <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: STATUS_COLORS[selected.status] || '#f0ece8', marginTop: 2 }}>{selected.status}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.3)', fontSize: 18, cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 8 }}>CUSTOMER</div>
              <div style={{ fontSize: 12, color: '#f0ece8', marginBottom: 2 }}>{selected.shipping.firstName} {selected.shipping.lastName}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,236,232,.4)', marginBottom: 2 }}>{selected.shipping.email}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,236,232,.4)', marginBottom: 16 }}>{selected.shipping.phone}</div>

              <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 8 }}>SHIP TO</div>
              <div style={{ fontSize: 11, color: 'rgba(240,236,232,.6)', lineHeight: 1.6, marginBottom: 20 }}>
                {selected.shipping.address}<br/>{selected.shipping.city}, {selected.shipping.state} — {selected.shipping.pin}
              </div>

              <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 10 }}>ITEMS</div>
              {selected.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(240,236,232,.05)', fontSize: 11 }}>
                  <div style={{ color: '#f0ece8' }}>{item.name} <span style={{ color: 'rgba(240,236,232,.35)' }}>× {item.quantity}</span></div>
                  <div style={{ color: '#cc0000', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: '#f0ece8' }}>TOTAL</span>
                <span style={{ color: '#cc0000', fontFamily: "'Bebas Neue',sans-serif", fontSize: 20 }}>₹{selected.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
