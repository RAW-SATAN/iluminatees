'use client';
import { useEffect, useState } from 'react';
import { ORDERS_KEY } from '@/lib/admin-auth';

interface Order { id: string; date: string; total: number; items: { name: string; price: number; quantity: number }[]; shipping: { city: string; state: string }; status: string; payMethod: string; }

function BarChart({ data, maxH = 120 }: { data: { label: string; value: number }[]; maxH?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: maxH + 20 }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', background: 'linear-gradient(to top,#cc0000,rgba(204,0,0,.4))', borderRadius: '3px 3px 0 0', height: `${(d.value / max) * maxH}px`, minHeight: d.value > 0 ? 2 : 0, transition: 'height .6s cubic-bezier(.22,1,.36,1)', position: 'relative' }}>
            {d.value > 0 && <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: '#6b7280', whiteSpace: 'nowrap' }}>
              {d.value > 999 ? `₹${Math.round(d.value/1000)}k` : d.value > 0 ? `₹${d.value}` : ''}
            </div>}
          </div>
          <div style={{ fontSize: 8, color: '#9ca3af', letterSpacing: '.06em', textAlign: 'center' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')); } catch {}
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const units = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0);

  // Last 30 days daily revenue
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const key = d.toDateString();
    return {
      label: i % 6 === 0 ? `${d.getDate()}/${d.getMonth() + 1}` : '',
      value: orders.filter(o => new Date(o.date).toDateString() === key).reduce((s, o) => s + o.total, 0),
    };
  });

  // Top cities
  const cityMap = new Map<string, number>();
  orders.forEach(o => cityMap.set(o.shipping.city, (cityMap.get(o.shipping.city) || 0) + o.total));
  const topCities = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Payment breakdown
  const payMap = new Map<string, number>();
  orders.forEach(o => payMap.set(o.payMethod, (payMap.get(o.payMethod) || 0) + 1));

  // Best selling products
  const prodMap = new Map<string, { count: number; revenue: number }>();
  orders.forEach(o => o.items.forEach(item => {
    const e = prodMap.get(item.name) || { count: 0, revenue: 0 };
    e.count += item.quantity; e.revenue += item.price * item.quantity;
    prodMap.set(item.name, e);
  }));
  const topProducts = Array.from(prodMap.entries()).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);

  return (
    <div className="adm-page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Analytics</div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>Store performance overview</div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue',  value: `₹${revenue.toLocaleString('en-IN')}` },
          { label: 'Total Orders',   value: orders.length },
          { label: 'Units Sold',     value: units },
          { label: 'Avg Order',      value: `₹${orders.length ? Math.round(revenue / orders.length).toLocaleString('en-IN') : 0}` },
        ].map(k => (
          <div key={k.label} className="adm-card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart — 30 days */}
      <div className="adm-card" style={{ padding: '20px 20px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>Revenue — Last 30 Days</div>
        {orders.length === 0 ? (
          <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,236,232,.15)', fontSize: 13 }}>No data yet</div>
        ) : <BarChart data={last30} maxH={140} />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Top cities */}
        <div className="adm-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Top Cities</div>
          {topCities.length === 0 ? (
            <div style={{ color: '#d1d5db', fontSize: 12 }}>No data</div>
          ) : topCities.map(([city, rev], i) => (
            <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(204,0,0,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#cc0000', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#1a1a1a', marginBottom: 2 }}>{city}</div>
                <div style={{ height: 3, background: 'rgba(240,236,232,.06)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${(rev / (topCities[0]?.[1] || 1)) * 100}%`, background: '#cc0000', borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', flexShrink: 0 }}>₹{rev.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="adm-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Payment Methods</div>
          {payMap.size === 0 ? <div style={{ color: '#d1d5db', fontSize: 12 }}>No data</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from(payMap.entries()).map(([method, count]) => {
                const pct = Math.round((count / orders.length) * 100);
                const colors: Record<string, string> = { upi: '#22c55e', card: '#f59e0b', cod: '#3b82f6' };
                return (
                  <div key={method}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '.08em' }}>{method}</span>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{pct}% · {count}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(240,236,232,.06)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: colors[method] || '#cc0000', borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="adm-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Best Sellers</div>
          {topProducts.length === 0 ? <div style={{ color: '#d1d5db', fontSize: 12 }}>No data</div> : topProducts.map(([name, data], i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#d1d5db', width: 16, flexShrink: 0 }}>#{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                <div style={{ fontSize: 10, color: '#9ca3af' }}>{data.count} units · ₹{data.revenue.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-3col { grid-template-columns: 1fr !important; }
          .analytics-4col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
