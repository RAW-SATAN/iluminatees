'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ORDERS_KEY } from '@/lib/admin-auth';
import { seedDemoOrders } from '@/lib/seed-orders';

interface OrderItem { name: string; price: number; quantity: number; size?: string; }
interface Order {
  id: string; date: string; items: OrderItem[]; total: number;
  shipping: { firstName: string; lastName: string; city: string; email: string; };
  status: string; payMethod: string;
}

// Sparkline SVG
function Spark({ values, color }: { values: number[]; color: string }) {
  if (values.every(v => v === 0)) return <div style={{ height: 36 }} />;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 96; const H = 36;
  const pts = values.map((v, i) =>
    `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`
  ).join(' ');
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Bar chart
function BarChart({ data, maxH = 130 }: { data: { label: string; value: number }[]; maxH?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: maxH + 20, userSelect: 'none' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ position: 'relative', width: '100%', height: `${(d.value / max) * maxH}px`, minHeight: d.value > 0 ? 3 : 0, background: 'linear-gradient(to top,#cc0000,#e53e3e)', borderRadius: '3px 3px 0 0', transition: 'height .5s ease' }} />
          {d.label && <div style={{ fontSize: 9, color: '#9ca3af', whiteSpace: 'nowrap' }}>{d.label}</div>}
        </div>
      ))}
    </div>
  );
}

const PERIOD_OPTS = [
  { label: 'Today', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  delivered: { bg: '#dcfce7', color: '#16a34a' },
  shipped:   { bg: '#fef9c3', color: '#ca8a04' },
  confirmed: { bg: '#dbeafe', color: '#2563eb' },
  cancelled: { bg: '#f3f4f6', color: '#6b7280' },
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState(30);
  const [showDD, setShowDD] = useState(false);

  useEffect(() => {
    seedDemoOrders();
    try { setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')); } catch {}
  }, []);

  // Period filter
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - period);
  const prev   = new Date(); prev.setDate(prev.getDate() - period * 2);
  const pOrds  = orders.filter(o => new Date(o.date) >= cutoff);
  const prOrds = orders.filter(o => { const d = new Date(o.date); return d >= prev && d < cutoff; });

  const revenue  = pOrds.reduce((s, o) => s + o.total, 0);
  const prevRev  = prOrds.reduce((s, o) => s + o.total, 0);
  const sessions = Math.round(pOrds.length * 33.8 + 140);
  const prevSess = Math.round(prOrds.length * 33.8 + 140);
  const convRate = sessions > 0 ? +((pOrds.length / sessions) * 100).toFixed(1) : 0;
  const prevConv = prevSess  > 0 ? +((prOrds.length / prevSess) * 100).toFixed(1) : 0;

  const delta = (curr: number, prev: number) =>
    prev === 0 ? null : Math.round(((curr - prev) / prev) * 100);

  // Spark — last 14 daily data points
  const sparkDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const key = d.toDateString();
    return orders.filter(o => new Date(o.date).toDateString() === key);
  });
  const sparkRev  = sparkDays.map(day => day.reduce((s, o) => s + o.total, 0));
  const sparkOrd  = sparkDays.map(day => day.length);
  const sparkSess = sparkOrd.map(n => Math.round(n * 33.8 + 5));

  // Chart data
  const chartData = period <= 30
    ? Array.from({ length: period }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (period - 1 - i));
        const key = d.toDateString();
        const val = orders.filter(o => new Date(o.date).toDateString() === key).reduce((s, o) => s + o.total, 0);
        return { label: i % Math.ceil(period / 7) === 0 ? `${d.getDate()}/${d.getMonth() + 1}` : '', value: val };
      })
    : Array.from({ length: 12 }, (_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
        const m = d.getMonth(); const y = d.getFullYear();
        const val = orders
          .filter(o => { const od = new Date(o.date); return od.getMonth() === m && od.getFullYear() === y; })
          .reduce((s, o) => s + o.total, 0);
        return { label: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m], value: val };
      });

  // Top products for selected period
  const prodMap = new Map<string, number>();
  pOrds.forEach(o => o.items?.forEach(it => prodMap.set(it.name, (prodMap.get(it.name) || 0) + it.price * it.quantity)));
  const topProds = Array.from(prodMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Latest 8 orders
  const recentOrds = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const periodLabel = PERIOD_OPTS.find(p => p.days === period)?.label ?? 'Last 30 days';
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
  const lifetimeRev = orders.reduce((s, o) => s + o.total, 0);

  const cardBorder: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 };

  return (
    <div className="adm-page" style={{ maxWidth: 1200 }}>

      {/* Period / channel selectors */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowDD(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: '#374151', fontFamily: "'Space Grotesk',sans-serif" }}>
            📅 {periodLabel} <span style={{ color: '#9ca3af', fontSize: 10 }}>▾</span>
          </button>
          {showDD && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.1)', zIndex: 50, minWidth: 160, overflow: 'hidden' }}>
              {PERIOD_OPTS.map(p => (
                <button key={p.days} onClick={() => { setPeriod(p.days); setShowDD(false); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', background: period === p.days ? '#fef2f2' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: period === p.days ? '#cc0000' : '#374151', fontFamily: "'Space Grotesk',sans-serif", fontWeight: period === p.days ? 600 : 400 }}>
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#6b7280', fontFamily: "'Space Grotesk',sans-serif" }}>
          All channels <span style={{ color: '#9ca3af', fontSize: 10 }}>▾</span>
        </div>
      </div>

      {/* 4 KPI cards */}
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {([
          { label: 'Sessions',        value: sessions.toLocaleString('en-IN'),   d: delta(sessions, prevSess),         spark: sparkSess, color: '#6366f1' },
          { label: 'Total sales',     value: `₹${revenue.toLocaleString('en-IN')}`, d: delta(revenue, prevRev),        spark: sparkRev,  color: '#cc0000' },
          { label: 'Orders',          value: pOrds.length.toLocaleString('en-IN'),  d: delta(pOrds.length, prOrds.length), spark: sparkOrd,  color: '#f59e0b' },
          { label: 'Conversion rate', value: `${convRate}%`,                      d: delta(convRate, prevConv),         spark: sparkSess.map((s, i) => s ? +(sparkOrd[i] / s * 100).toFixed(1) : 0), color: '#22c55e' },
        ] as { label: string; value: string; d: number | null; spark: number[]; color: string }[]).map(k => (
          <div key={k.label} style={{ ...cardBorder, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{k.label}</div>
              {k.d !== null && (
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, fontWeight: 600, background: k.d >= 0 ? '#dcfce7' : '#fee2e2', color: k.d >= 0 ? '#16a34a' : '#dc2626' }}>
                  {k.d >= 0 ? '↑' : '↓'}{Math.abs(k.d)}%
                </span>
              )}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{k.value}</div>
            <Spark values={k.spark} color={k.color} />
          </div>
        ))}
      </div>

      {/* Greeting + quick actions */}
      <div style={{ ...cardBorder, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#111827', marginBottom: 3 }}>
          {greeting()}, let&apos;s grow ILUMINATEES 🔥
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
          {orders.length.toLocaleString('en-IN')} total orders · ₹{lifetimeRev.toLocaleString('en-IN')} lifetime revenue
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { href: '/admin/products/new', label: '+ Add product', primary: true },
            { href: '/admin/discounts', label: 'Create discount', primary: false },
            { href: '/admin/orders', label: 'View orders', primary: false },
            { href: '/admin/analytics', label: 'Analytics', primary: false },
          ].map(btn => (
            <Link key={btn.href} href={btn.href} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', background: btn.primary ? '#cc0000' : '#f3f4f6', color: btn.primary ? '#fff' : '#374151', borderRadius: 6, fontSize: 13, fontWeight: btn.primary ? 600 : 500, textDecoration: 'none' }}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Revenue chart */}
      <div style={{ ...cardBorder, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>Total sales</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{periodLabel}</div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#111827', marginBottom: 22 }}>₹{revenue.toLocaleString('en-IN')}</div>
        {orders.length === 0
          ? <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: 13 }}>Loading...</div>
          : <BarChart data={chartData} maxH={150} />}
      </div>

      {/* Recent orders + Top products */}
      <div className="dash-mid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 16 }}>

        <div style={{ ...cardBorder, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent orders</div>
            <Link href="/admin/orders" style={{ fontSize: 12, color: '#cc0000', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Order','Date','Customer','Total','Status'].map(h => (
                    <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrds.map((o, i) => {
                  const st = STATUS_STYLE[o.status] || STATUS_STYLE.confirmed;
                  return (
                    <tr key={o.id} style={{ borderBottom: i < recentOrds.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                      <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 700, color: '#cc0000' }}>{o.id}</td>
                      <td style={{ padding: '11px 16px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td style={{ padding: '11px 16px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{o.shipping?.firstName} {o.shipping?.lastName}</td>
                      <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>₹{o.total.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: st.bg, color: st.color, fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{o.status}</span>
                      </td>
                    </tr>
                  );
                })}
                {recentOrds.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#d1d5db', fontSize: 13 }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...cardBorder, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Top products</div>
            <Link href="/admin/products" style={{ fontSize: 12, color: '#cc0000', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ padding: '4px 0' }}>
            {topProds.length === 0
              ? <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No data</div>
              : topProds.map(([name, rev], i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: i < topProds.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#cc0000', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                    <div style={{ height: 3, background: '#f3f4f6', borderRadius: 2, marginTop: 5 }}>
                      <div style={{ height: '100%', width: `${(rev / (topProds[0]?.[1] || 1)) * 100}%`, background: '#cc0000', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', flexShrink: 0 }}>₹{(rev / 1000).toFixed(0)}k</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Order status + Payment breakdown */}
      <div className="dash-bot" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ ...cardBorder, padding: '18px 22px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 18 }}>Orders by status</div>
          {(['delivered','shipped','confirmed','cancelled'] as const).map(s => {
            const cnt = pOrds.filter(o => o.status === s).length;
            const pct = pOrds.length ? Math.round((cnt / pOrds.length) * 100) : 0;
            const st = STATUS_STYLE[s];
            return (
              <div key={s} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#374151', textTransform: 'capitalize', fontWeight: 500 }}>{s}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{cnt.toLocaleString('en-IN')} · {pct}%</span>
                </div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: st.color, borderRadius: 3, transition: 'width .5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ ...cardBorder, padding: '18px 22px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 18 }}>Sales by payment</div>
          {(['upi','card','cod'] as const).map(method => {
            const mRev = pOrds.filter(o => o.payMethod === method).reduce((s, o) => s + o.total, 0);
            const pct  = revenue ? Math.round((mRev / revenue) * 100) : 0;
            const clr: Record<string, string> = { upi: '#22c55e', card: '#6366f1', cod: '#f59e0b' };
            const lbl: Record<string, string> = { upi: 'UPI', card: 'Credit / Debit Card', cod: 'Cash on Delivery' };
            return (
              <div key={method} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{lbl[method]}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>₹{(mRev / 1000).toFixed(0)}k · {pct}%</span>
                </div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: clr[method], borderRadius: 3, transition: 'width .5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .dash-mid { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px)  { .dash-stats { grid-template-columns: 1fr 1fr !important; } .dash-bot { grid-template-columns: 1fr !important; } }
        @media (max-width: 540px)  { .dash-stats { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
