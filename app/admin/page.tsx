'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ORDERS_KEY } from '@/lib/admin-auth';
import { products } from '@/lib/products';

interface Order { id: string; date: string; items: { name: string; price: number; quantity: number }[]; total: number; shipping: { firstName: string; lastName: string; city: string; email: string }; status: string; payMethod: string; }

const STATUS_COLOR: Record<string, string> = { confirmed: 'adm-badge-red', shipped: 'adm-badge-yellow', delivered: 'adm-badge-green', cancelled: 'adm-badge-gray' };

function SparkLine({ data, color = '#cc0000' }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 80, h = 30, pad = 2;
  const pts = data.map((v, i) => `${pad + (i / (data.length - 1 || 1)) * (w - pad * 2)},${h - pad - (v / max) * (h - pad * 2)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MiniBar({ data, color = '#cc0000' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: '100%', background: color, opacity: .75 + (d.value / max) * .25, borderRadius: '2px 2px 0 0', height: `${(d.value / max) * 40}px`, minHeight: 2, transition: 'height .5s ease' }} />
          <div style={{ fontSize: 7, color: 'rgba(240,236,232,.3)', letterSpacing: '.05em' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')); } catch {}
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const pending = orders.filter(o => o.status === 'confirmed').length;

  // Last 7 days revenue data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    return { label: ['S','M','T','W','T','F','S'][d.getDay()], value: orders.filter(o => new Date(o.date).toDateString() === key).reduce((s, o) => s + o.total, 0) };
  });

  const stats = [
    { label: 'Total Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, sub: `${orders.length} orders`, trend: last7.map(d => d.value), color: '#cc0000' },
    { label: 'Avg. Order', value: `₹${avgOrder.toLocaleString('en-IN')}`, sub: 'per customer', trend: last7.map((_, i) => avgOrder * (0.7 + Math.random() * 0.6)), color: '#f59e0b' },
    { label: 'Delivered', value: String(delivered), sub: `of ${orders.length} orders`, trend: last7.map((_, i) => Math.floor(delivered * i / 6)), color: '#22c55e' },
    { label: 'Pending', value: String(pending), sub: 'to fulfil', trend: last7.map(() => pending), color: '#cc0000' },
  ];

  return (
    <div className="adm-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ece8', marginBottom: 2 }}>Good morning, Iluminatees 👋</div>
          <div style={{ fontSize: 12, color: 'rgba(240,236,232,.35)' }}>Here&apos;s what&apos;s happening with your store today.</div>
        </div>
        <Link href="/shop" style={{ fontSize: 11, color: '#cc0000', textDecoration: 'none', border: '1px solid rgba(204,0,0,.3)', padding: '8px 16px', borderRadius: 4, letterSpacing: '.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
          VIEW STORE ↗
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className="adm-card" style={{ padding: '20px 20px 16px' }}>
            <div style={{ fontSize: 10, color: 'rgba(240,236,232,.35)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#f0ece8', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)', marginBottom: 12 }}>{s.sub}</div>
            <SparkLine data={s.trend} color={s.color} />
          </div>
        ))}
      </div>

      {/* Revenue bar + recent orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Revenue chart */}
        <div className="adm-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece8' }}>Revenue — Last 7 days</div>
            <div style={{ fontSize: 11, color: '#cc0000', fontWeight: 700 }}>₹{last7.reduce((s, d) => s + d.value, 0).toLocaleString('en-IN')}</div>
          </div>
          <MiniBar data={last7} />
        </div>

        {/* Order status breakdown */}
        <div className="adm-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece8', marginBottom: 16 }}>Order Status</div>
          {[
            { label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length, color: '#cc0000' },
            { label: 'Shipped',   count: orders.filter(o => o.status === 'shipped').length,   color: '#f59e0b' },
            { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: '#22c55e' },
            { label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: '#6b7280' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12, color: 'rgba(240,236,232,.6)' }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f0ece8' }}>{count}</div>
              <div style={{ width: 80, height: 4, background: 'rgba(240,236,232,.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${orders.length ? (count / orders.length) * 100 : 0}%`, background: color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders + top products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        {/* Recent orders */}
        <div className="adm-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(240,236,232,.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece8' }}>Recent Orders</div>
            <Link href="/admin/orders" style={{ fontSize: 11, color: '#cc0000', textDecoration: 'none', letterSpacing: '.06em' }}>View all →</Link>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(240,236,232,.2)', fontSize: 12 }}>No orders yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="adm-table">
                <thead><tr><th className="adm-th">Order</th><th className="adm-th">Customer</th><th className="adm-th">Total</th><th className="adm-th">Status</th></tr></thead>
                <tbody>
                  {orders.slice(0, 6).map(o => (
                    <tr key={o.id}>
                      <td className="adm-td"><span style={{ color: '#cc0000', fontWeight: 600 }}>{o.id}</span></td>
                      <td className="adm-td" style={{ fontSize: 12 }}>{o.shipping.firstName} {o.shipping.lastName}</td>
                      <td className="adm-td" style={{ fontWeight: 600 }}>₹{o.total.toLocaleString('en-IN')}</td>
                      <td className="adm-td"><span className={`adm-badge ${STATUS_COLOR[o.status] || 'adm-badge-gray'}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="adm-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(240,236,232,.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece8' }}>Products</div>
            <Link href="/admin/products" style={{ fontSize: 11, color: '#cc0000', textDecoration: 'none', letterSpacing: '.06em' }}>Manage →</Link>
          </div>
          {products.slice(0, 6).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < 5 ? '1px solid rgba(240,236,232,.04)' : 'none' }}>
              <div style={{ width: 32, height: 32, background: p.shirtColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: p.accentColor, borderRadius: 4 }}>◈</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#f0ece8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)', letterSpacing: '.08em' }}>{p.category}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#cc0000', flexShrink: 0 }}>₹{p.price.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 900px) {
          .dash-stats { grid-template-columns: repeat(2,1fr) !important; }
          .dash-mid { grid-template-columns: 1fr !important; }
          .dash-bot { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .dash-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
