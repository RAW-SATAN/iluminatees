'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products } from '@/lib/products';

interface Order {
  id: string; date: string; items: { name: string; price: number; quantity: number }[];
  total: number; shipping: { firstName: string; lastName: string; city: string }; status: string; payMethod: string;
}

const STAT_STYLE: React.CSSProperties = {
  background: '#0d0d0d', border: '1px solid rgba(240,236,232,.06)',
  padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 6,
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem('ilum_orders') || '[]')); } catch {}
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;

  const statLabel: React.CSSProperties = { fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(240,236,232,.35)' };
  const statVal: React.CSSProperties = { fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, color: '#f0ece8', lineHeight: 1, letterSpacing: '.02em' };
  const statSub: React.CSSProperties = { fontSize: 10, color: 'rgba(240,236,232,.3)' };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      <style>{`
        .admin-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; margin-bottom: 32px; }
        .admin-recent-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
        @media (max-width: 900px) { .admin-stats { grid-template-columns: repeat(2,1fr); } .admin-recent-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .admin-stats { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: '#cc0000', marginBottom: 6 }}>OVERVIEW</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: '#f0ece8', letterSpacing: '.04em', margin: 0 }}>DASHBOARD</h1>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div style={STAT_STYLE}>
          <span style={statLabel}>Total Revenue</span>
          <span style={statVal}>₹{revenue > 0 ? revenue.toLocaleString('en-IN') : '0'}</span>
          <span style={statSub}>{orders.length} orders</span>
        </div>
        <div style={STAT_STYLE}>
          <span style={statLabel}>Products</span>
          <span style={statVal}>{products.length}</span>
          <span style={statSub}>across 3 collections</span>
        </div>
        <div style={STAT_STYLE}>
          <span style={statLabel}>Avg. Order Value</span>
          <span style={statVal}>₹{avgOrder.toLocaleString('en-IN')}</span>
          <span style={statSub}>per order</span>
        </div>
        <div style={STAT_STYLE}>
          <span style={statLabel}>Pending</span>
          <span style={{ ...statVal, color: '#cc0000' }}>{orders.filter(o => o.status === 'confirmed').length}</span>
          <span style={statSub}>orders to fulfil</span>
        </div>
      </div>

      <div className="admin-recent-grid">
        {/* Recent Orders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#f0ece8', letterSpacing: '.1em' }}>RECENT ORDERS</div>
            <Link href="/admin/orders" style={{ fontSize: 10, color: '#cc0000', textDecoration: 'none', letterSpacing: '.1em' }}>VIEW ALL →</Link>
          </div>
          <div style={{ border: '1px solid rgba(240,236,232,.06)', overflow: 'hidden' }}>
            {orders.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'rgba(240,236,232,.2)', fontSize: 12 }}>No orders yet — share the link!</div>
            ) : orders.slice(0, 8).map((o, i) => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < Math.min(orders.length, 8) - 1 ? '1px solid rgba(240,236,232,.05)' : 'none', background: i % 2 === 0 ? '#0d0d0d' : 'transparent' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#cc0000', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f0ece8', marginBottom: 2 }}>{o.id}</div>
                  <div style={{ fontSize: 10, color: 'rgba(240,236,232,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.shipping.firstName} {o.shipping.lastName} · {o.shipping.city}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#f0ece8', flexShrink: 0 }}>₹{o.total.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', background: 'rgba(204,0,0,.12)', color: '#cc0000', padding: '3px 8px', flexShrink: 0 }}>NEW</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#f0ece8', letterSpacing: '.1em', marginBottom: 14 }}>PRODUCTS</div>
          <div style={{ border: '1px solid rgba(240,236,232,.06)', overflow: 'hidden' }}>
            {products.slice(0, 6).map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < 5 ? '1px solid rgba(240,236,232,.05)' : 'none', background: i % 2 === 0 ? '#0d0d0d' : 'transparent' }}>
                <div style={{ width: 32, height: 32, background: p.shirtColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: p.accentColor, opacity: .7 }}>◈</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#f0ece8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(240,236,232,.3)', letterSpacing: '.1em' }}>{p.category}</div>
                </div>
                <div style={{ fontSize: 11, color: '#cc0000', flexShrink: 0, fontWeight: 600 }}>₹{p.price.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
          <Link href="/admin/products" style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'rgba(240,236,232,.03)', border: '1px solid rgba(240,236,232,.06)', borderTop: 'none', fontSize: 10, letterSpacing: '.12em', color: 'rgba(240,236,232,.35)', textDecoration: 'none', marginTop: 0 }}>VIEW ALL {products.length} PRODUCTS</Link>
        </div>
      </div>
    </div>
  );
}
