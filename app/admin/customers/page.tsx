'use client';
import { useEffect, useState } from 'react';
import { ORDERS_KEY } from '@/lib/admin-auth';

interface RawOrder {
  id: string; date: string; total: number;
  shipping: { firstName: string; lastName: string; email: string; phone: string; city: string; state: string; };
  status: string;
}

interface Customer {
  email: string; name: string; phone: string; city: string; state: string;
  orders: number; totalSpent: number; lastOrder: string; status: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<RawOrder[]>([]);

  useEffect(() => {
    try {
      const raw: RawOrder[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      setOrders(raw);
      // Group by email
      const map = new Map<string, Customer>();
      raw.forEach(o => {
        const email = o.shipping.email;
        if (!email) return;
        const existing = map.get(email);
        if (existing) {
          existing.orders++;
          existing.totalSpent += o.total;
          if (new Date(o.date) > new Date(existing.lastOrder)) existing.lastOrder = o.date;
        } else {
          map.set(email, { email, name: `${o.shipping.firstName} ${o.shipping.lastName}`, phone: o.shipping.phone, city: o.shipping.city, state: o.shipping.state, orders: 1, totalSpent: o.total, lastOrder: o.date, status: o.status });
        }
      });
      setCustomers(Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent));
    } catch {}
  }, []);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgLTV = customers.length ? Math.round(totalRevenue / customers.length) : 0;

  return (
    <div className="adm-page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ece8', marginBottom: 4 }}>Customers</div>
        <div style={{ fontSize: 12, color: 'rgba(240,236,232,.35)' }}>{customers.length} unique customers · Avg. LTV ₹{avgLTV.toLocaleString('en-IN')}</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Customers', value: customers.length, color: '#f0ece8' },
          { label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#cc0000' },
          { label: 'Avg. Order Value', value: `₹${avgLTV.toLocaleString('en-IN')}`, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="adm-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <input className="adm-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…" style={{ maxWidth: 280, marginBottom: 16 }} />

      {filtered.length === 0 ? (
        <div className="adm-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(240,236,232,.2)', fontSize: 14 }}>
          {customers.length === 0 ? 'No customers yet. Orders will appear here.' : 'No customers match your search.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 16 }}>
          <div className="adm-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="adm-table" style={{ minWidth: 580 }}>
                <thead>
                  <tr>
                    <th className="adm-th">Customer</th>
                    <th className="adm-th">Location</th>
                    <th className="adm-th">Orders</th>
                    <th className="adm-th">Total Spent</th>
                    <th className="adm-th">Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.email}
                      onClick={() => setSelected(selected?.email === c.email ? null : c)}
                      style={{ cursor: 'pointer', background: selected?.email === c.email ? 'rgba(204,0,0,.05)' : 'transparent', transition: 'background .15s' }}
                      onMouseEnter={e => { if (selected?.email !== c.email) (e.currentTarget as HTMLElement).style.background = 'rgba(240,236,232,.02)'; }}
                      onMouseLeave={e => { if (selected?.email !== c.email) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <td className="adm-td">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `hsl(${c.email.charCodeAt(0) * 15},50%,20%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: `hsl(${c.email.charCodeAt(0) * 15},70%,60%)`, flexShrink: 0 }}>
                            {c.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#f0ece8' }}>{c.name}</div>
                            <div style={{ fontSize: 10, color: 'rgba(240,236,232,.35)' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="adm-td" style={{ fontSize: 12, color: 'rgba(240,236,232,.5)' }}>{c.city}, {c.state}</td>
                      <td className="adm-td"><span style={{ fontWeight: 700, color: '#cc0000' }}>{c.orders}</span></td>
                      <td className="adm-td" style={{ fontWeight: 700 }}>₹{c.totalSpent.toLocaleString('en-IN')}</td>
                      <td className="adm-td" style={{ fontSize: 11, color: 'rgba(240,236,232,.4)' }}>{new Date(c.lastOrder).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selected && (
            <div className="adm-card" style={{ padding: 24, height: 'fit-content', position: 'sticky', top: 20 }}>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.3)', cursor: 'pointer', float: 'right', fontSize: 18 }}>✕</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `hsl(${selected.email.charCodeAt(0) * 15},50%,20%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: `hsl(${selected.email.charCodeAt(0) * 15},70%,60%)` }}>
                  {selected.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f0ece8' }}>{selected.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(240,236,232,.35)' }}>{selected.email}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'rgba(240,236,232,.03)', padding: '12px 14px', borderRadius: 4 }}>
                  <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 4 }}>Orders</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#cc0000' }}>{selected.orders}</div>
                </div>
                <div style={{ background: 'rgba(240,236,232,.03)', padding: '12px 14px', borderRadius: 4 }}>
                  <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 4 }}>Spent</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#f0ece8' }}>₹{selected.totalSpent.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 8 }}>Details</div>
              <div style={{ fontSize: 12, color: 'rgba(240,236,232,.5)', lineHeight: 1.8 }}>
                📞 {selected.phone}<br />
                📍 {selected.city}, {selected.state}
              </div>

              <div style={{ height: 1, background: 'rgba(240,236,232,.06)', margin: '16px 0' }} />
              <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', marginBottom: 10 }}>Order History</div>
              {orders.filter(o => o.shipping.email === selected.email).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(240,236,232,.04)' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#cc0000' }}>{o.id}</div>
                    <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)' }}>{new Date(o.date).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f0ece8' }}>₹{o.total.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(240,236,232,.3)' }}>{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
