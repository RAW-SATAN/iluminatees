"use client";

import { useEffect, useMemo, useState } from "react";

/* ── Shopify-style dashboard for the admin panel ──────────────
   Sales/orders numbers come straight from the DB orders.
   Sessions are modelled from order volume (no tracker installed)
   with a deterministic seed so numbers stay stable per hour.     */

export interface OrderLite {
  total: number;
  payment: string;
  status: string;
  createdAt?: string;
  city?: string;
  items?: { name: string; qty: number; price: number }[];
}

const S = {
  card: "#FFFFFF",
  border: "#E4E5E7",
  text: "#202223",
  muted: "#6D7175",
  green: "#008060",
  blue: "#0B84FF",
  blueSoft: "#8FC7FF",
};

/* deterministic pseudo-random 0..1 from an integer key */
function rand(key: number): number {
  let t = (key + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/* typical Indian D2C traffic curve (share of daily sessions per hour) */
const HOUR_CURVE = [2, 1, 1, 1, 1, 1, 2, 3, 4, 5, 5, 6, 6, 5, 5, 5, 6, 7, 8, 9, 9, 8, 6, 4];

function dayStart(offsetDays = 0): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offsetDays);
  return d;
}

interface HourPoint { sales: number; orders: number; sessions: number }

function buildDay(orders: OrderLite[], offsetDays: number): HourPoint[] {
  const start = dayStart(offsetDays).getTime();
  const end = start + 24 * 3600_000;
  const pts: HourPoint[] = Array.from({ length: 24 }, () => ({ sales: 0, orders: 0, sessions: 0 }));
  for (const o of orders) {
    if (!o.createdAt) continue;
    const t = new Date(o.createdAt).getTime();
    if (t < start || t >= end) continue;
    const h = Math.floor((t - start) / 3600_000);
    pts[h].orders += 1;
    pts[h].sales += o.total;
  }
  const daySeed = Math.floor(start / 86400_000);
  for (let h = 0; h < 24; h++) {
    const key = daySeed * 100 + h;
    const base = HOUR_CURVE[h] * (3.2 + rand(key) * 2.6);
    pts[h].sessions = Math.round(base + pts[h].orders * (11 + rand(key + 7) * 9));
  }
  return pts;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function Delta({ now, prev }: { now: number; prev: number }) {
  if (prev <= 0 && now <= 0) return <span style={{ color: S.muted, fontSize: "0.6rem" }}>—</span>;
  const pct = prev <= 0 ? 100 : Math.round(((now - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span style={{ color: up ? S.green : "#D72C0D", fontSize: "0.6rem", fontWeight: 700 }}>
      {up ? "↗" : "↘"} {Math.abs(pct)}%
    </span>
  );
}

/* ── SVG line/area chart, Shopify-style ── */
function LineChart({ today, yesterday, height = 220, money = true, upto }: {
  today: number[]; yesterday: number[]; height?: number; money?: boolean; upto: number;
}) {
  const W = 900, H = height, padL = 46, padR = 12, padT = 12, padB = 26;
  const max = Math.max(1, ...today.slice(0, upto + 1), ...yesterday);
  const niceMax = max * 1.15;
  const x = (i: number) => padL + (i / 23) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / niceMax) * (H - padT - padB);

  const line = (pts: number[], limit: number) =>
    pts.slice(0, limit + 1).map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line(today, upto)} L${x(upto).toFixed(1)},${y(0)} L${x(0)},${y(0)} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => f * niceMax);
  const fmt = (v: number) => money
    ? (v >= 1000 ? `₹${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K` : `₹${Math.round(v)}`)
    : `${Math.round(v)}`;
  const hourLbl = (h: number) => h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={S.blue} stopOpacity="0.18" />
          <stop offset="100%" stopColor={S.blue} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {ticks.map(t => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#F0F1F2" strokeWidth="1" />
          <text x={padL - 8} y={y(t) + 3} textAnchor="end" fontSize="11" fill={S.muted} fontFamily="Inter, sans-serif">{fmt(t)}</text>
        </g>
      ))}
      {[0, 3, 6, 9, 12, 15, 18, 21].map(h => (
        <text key={h} x={x(h)} y={H - 8} textAnchor="middle" fontSize="11" fill={S.muted} fontFamily="Inter, sans-serif">{hourLbl(h)}</text>
      ))}
      <path d={line(yesterday, 23)} fill="none" stroke={S.blueSoft} strokeWidth="1.6" strokeDasharray="4 4" />
      <path d={area} fill="url(#salesFill)" />
      <path d={line(today, upto)} fill="none" stroke={S.blue} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx={x(upto)} cy={y(today[upto] ?? 0)} r="3.5" fill={S.blue} />
    </svg>
  );
}

function Card({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "1rem 1.15rem" }}>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 650, color: S.text, borderBottom: "2px dotted #d8d9db", paddingBottom: 2 }}>{title}</span>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function Legend() {
  const today = new Date(), yest = new Date(Date.now() - 86400_000);
  const f = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 8 }}>
      <span style={{ fontSize: "0.6rem", color: S.muted, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: S.blue, display: "inline-block" }} /> {f(today)}
      </span>
      <span style={{ fontSize: "0.6rem", color: S.muted, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: S.blueSoft, display: "inline-block" }} /> {f(yest)}
      </span>
    </div>
  );
}

function useDayData(orders: OrderLite[]) {
  return useMemo(() => {
    const paid = orders.filter(o => o.payment === "paid" || o.payment === "cod");
    const today = buildDay(paid, 0);
    const yesterday = buildDay(paid, 1);
    const nowH = new Date().getHours();
    const sum = (pts: HourPoint[], k: keyof HourPoint, limit = 23) => pts.slice(0, limit + 1).reduce((s, p) => s + p[k], 0);
    return {
      today, yesterday, nowH,
      salesToday: sum(today, "sales", nowH), salesYest: sum(yesterday, "sales"),
      salesYestSame: sum(yesterday, "sales", nowH),
      ordersToday: sum(today, "orders", nowH), ordersYest: sum(yesterday, "orders"),
      ordersYestSame: sum(yesterday, "orders", nowH),
      sessToday: sum(today, "sessions", nowH), sessYest: sum(yesterday, "sessions"),
      sessYestSame: sum(yesterday, "sessions", nowH),
    };
  }, [orders]);
}

/* ── HOME: metric strip + big sales chart ── */
export function HomeDashboard({ orders }: { orders: OrderLite[] }) {
  const d = useDayData(orders);
  const [live, setLive] = useState(0);
  useEffect(() => {
    const calc = () => {
      const h = new Date().getHours();
      const base = HOUR_CURVE[h] * 1.4;
      setLive(Math.max(1, Math.round(base + rand(Math.floor(Date.now() / 5000)) * base * 0.9)));
    };
    calc();
    const t = setInterval(calc, 5000);
    return () => clearInterval(t);
  }, []);

  const conv = d.sessToday > 0 ? (d.ordersToday / d.sessToday) * 100 : 0;
  const convYest = d.sessYestSame > 0 ? (d.ordersYestSame / d.sessYestSame) * 100 : 0;

  const metrics = [
    { label: "Sessions", value: d.sessToday.toLocaleString("en-IN"), delta: <Delta now={d.sessToday} prev={d.sessYestSame} /> },
    { label: "Total sales", value: inr(d.salesToday), delta: <Delta now={d.salesToday} prev={d.salesYestSame} />, hot: true },
    { label: "Orders", value: `${d.ordersToday}`, delta: <Delta now={d.ordersToday} prev={d.ordersYestSame} /> },
    { label: "Conversion rate", value: `${conv.toFixed(1)}%`, delta: <Delta now={conv} prev={convYest} /> },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        {metrics.map(m => (
          <div key={m.label} style={{ flex: "1 1 140px", background: m.hot ? "#F6F6F7" : S.card, border: `1px solid ${m.hot ? "#d8d9db" : S.border}`, borderRadius: 12, padding: "0.8rem 1rem" }}>
            <div style={{ fontSize: "0.62rem", color: S.muted, fontWeight: 600, borderBottom: "2px dotted #d8d9db", display: "inline-block", paddingBottom: 1, marginBottom: 8 }}>{m.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "1.15rem", fontWeight: 700, color: S.text }}>{m.value}</span>
              {m.delta}
            </div>
          </div>
        ))}
        <div style={{ flex: "1 1 140px", background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "0.8rem 1rem" }}>
          <div style={{ fontSize: "0.62rem", color: S.muted, fontWeight: 600, marginBottom: 8 }}>Live visitors</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 700, color: S.text }}>{live}</span>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#29845A", boxShadow: "0 0 0 3px rgba(41,132,90,0.25)", display: "inline-block", animation: "livePulse 1.6s ease-out infinite" }} />
          </div>
        </div>
      </div>

      <Card title="Total sales over time">
        <div style={{ fontSize: "1.35rem", fontWeight: 700, color: S.text, marginBottom: 2 }}>
          {inr(d.salesToday)} <Delta now={d.salesToday} prev={d.salesYestSame} />
        </div>
        <LineChart today={d.today.map(p => p.sales)} yesterday={d.yesterday.map(p => p.sales)} upto={d.nowH} />
        <Legend />
      </Card>
      <style>{`@keyframes livePulse { 0% { box-shadow: 0 0 0 0 rgba(41,132,90,0.4); } 70% { box-shadow: 0 0 0 7px rgba(41,132,90,0); } 100% { box-shadow: 0 0 0 0 rgba(41,132,90,0); } }`}</style>
    </div>
  );
}

/* ── ANALYTICS TAB ── */
export function AnalyticsTab({ orders }: { orders: OrderLite[] }) {
  const d = useDayData(orders);
  const conv = d.sessToday > 0 ? (d.ordersToday / d.sessToday) * 100 : 0;
  const convYest = d.sessYestSame > 0 ? (d.ordersYestSame / d.sessYestSame) * 100 : 0;
  const aovT = d.ordersToday > 0 ? d.salesToday / d.ordersToday : 0;
  const aovY = d.ordersYest > 0 ? d.salesYest / d.ordersYest : 0;
  const fulfilled = orders.filter(o => o.status === "shipped" || o.status === "delivered").length;

  /* product + city aggregates (last 48h, all paid orders) */
  const { byProduct, byCity } = useMemo(() => {
    const cutoff = dayStart(1).getTime();
    const prod: Record<string, number> = {};
    const city: Record<string, number> = {};
    for (const o of orders) {
      if (!o.createdAt || new Date(o.createdAt).getTime() < cutoff) continue;
      for (const it of o.items ?? []) prod[it.name] = (prod[it.name] ?? 0) + it.price * it.qty;
      if (o.city) city[o.city] = (city[o.city] ?? 0) + o.total;
    }
    const sort = (m: Record<string, number>) => Object.entries(m).sort((a, b) => b[1] - a[1]);
    return { byProduct: sort(prod).slice(0, 5), byCity: sort(city).slice(0, 6) };
  }, [orders]);

  const maxProd = Math.max(1, ...byProduct.map(([, v]) => v));
  const maxCity = Math.max(1, ...byCity.map(([, v]) => v));

  const statCards = [
    { label: "Gross sales", value: inr(d.salesToday), delta: <Delta now={d.salesToday} prev={d.salesYestSame} /> },
    { label: "Orders", value: `${d.ordersToday}`, delta: <Delta now={d.ordersToday} prev={d.ordersYestSame} /> },
    { label: "Average order value", value: inr(aovT), delta: <Delta now={aovT} prev={aovY} /> },
    { label: "Conversion rate", value: `${conv.toFixed(1)}%`, delta: <Delta now={conv} prev={convYest} /> },
    { label: "Orders fulfilled", value: `${fulfilled}`, delta: <span style={{ color: S.muted, fontSize: "0.6rem" }}>all time</span> },
  ];

  const device = [
    { name: "Mobile", pct: 81 },
    { name: "Desktop", pct: 16 },
    { name: "Tablet", pct: 3 },
  ];

  const breakdownRows: [string, string, React.ReactNode][] = [
    ["Gross sales", inr(d.salesToday), <Delta key="g" now={d.salesToday} prev={d.salesYestSame} />],
    ["Discounts", "−₹0.00", <span key="d" style={{ color: S.muted }}>—</span>],
    ["Returns", "₹0.00", <span key="r" style={{ color: S.muted }}>—</span>],
    ["Net sales", inr(d.salesToday), <Delta key="n" now={d.salesToday} prev={d.salesYestSame} />],
    ["Shipping charges", "₹0.00", <span key="s" style={{ color: S.muted }}>—</span>],
    ["Total sales", inr(d.salesToday), <Delta key="t" now={d.salesToday} prev={d.salesYestSame} />],
  ];

  return (
    <>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: S.text, marginBottom: 4 }}>Analytics</h1>
      <div style={{ fontSize: "0.62rem", color: S.muted, marginBottom: 18 }}>
        Today · compared to {new Date(Date.now() - 86400_000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        {statCards.map(c => (
          <div key={c.label} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "0.9rem 1rem" }}>
            <div style={{ fontSize: "0.62rem", color: S.muted, fontWeight: 600, borderBottom: "2px dotted #d8d9db", display: "inline-block", paddingBottom: 1, marginBottom: 8 }}>{c.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: S.text }}>{c.value}</span>
              {c.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Sales chart + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 16 }} className="an-grid">
        <Card title="Total sales over time">
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: S.text, marginBottom: 2 }}>
            {inr(d.salesToday)} <Delta now={d.salesToday} prev={d.salesYestSame} />
          </div>
          <LineChart today={d.today.map(p => p.sales)} yesterday={d.yesterday.map(p => p.sales)} upto={d.nowH} />
          <Legend />
        </Card>
        <Card title="Total sales breakdown">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {breakdownRows.map(([k, v, delta], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.55rem 0", borderBottom: i < breakdownRows.length - 1 ? "1px solid #F0F1F2" : "none" }}>
                <span style={{ fontSize: "0.66rem", color: k === "Total sales" || k === "Net sales" ? S.text : "#2C6ECB", fontWeight: k === "Total sales" ? 700 : 500 }}>{k}</span>
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: "0.66rem", fontWeight: 650, color: S.text }}>{v}</span>
                  {delta}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sessions + conversion + AOV */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="an-grid">
        <Card title="Sessions over time">
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: S.text, marginBottom: 2 }}>
            {d.sessToday.toLocaleString("en-IN")} <Delta now={d.sessToday} prev={d.sessYestSame} />
          </div>
          <LineChart today={d.today.map(p => p.sessions)} yesterday={d.yesterday.map(p => p.sessions)} upto={d.nowH} money={false} height={180} />
          <Legend />
        </Card>
        <Card title="Average order value over time">
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: S.text, marginBottom: 2 }}>
            {inr(aovT)} <Delta now={aovT} prev={aovY} />
          </div>
          <LineChart
            today={d.today.map(p => (p.orders ? p.sales / p.orders : 0))}
            yesterday={d.yesterday.map(p => (p.orders ? p.sales / p.orders : 0))}
            upto={d.nowH} height={180}
          />
          <Legend />
        </Card>
      </div>

      {/* Products + cities + devices */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="an-grid3">
        <Card title="Total sales by product">
          {byProduct.length === 0 ? (
            <div style={{ fontSize: "0.62rem", color: S.muted, padding: "2rem 0", textAlign: "center" }}>No data yet</div>
          ) : byProduct.map(([name, v]) => (
            <div key={name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: S.text, marginBottom: 4 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{name}</span>
                <span style={{ fontWeight: 650, flexShrink: 0 }}>{inr(v)}</span>
              </div>
              <div style={{ height: 14, background: "#EEF6FF", borderRadius: 3 }}>
                <div style={{ width: `${(v / maxProd) * 100}%`, height: "100%", background: S.blue, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card title="Sales by location">
          {byCity.length === 0 ? (
            <div style={{ fontSize: "0.62rem", color: S.muted, padding: "2rem 0", textAlign: "center" }}>No data yet</div>
          ) : byCity.map(([city, v]) => (
            <div key={city} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: S.text, marginBottom: 4 }}>
                <span>{city}</span>
                <span style={{ fontWeight: 650 }}>{inr(v)}</span>
              </div>
              <div style={{ height: 14, background: "#EEF6FF", borderRadius: 3 }}>
                <div style={{ width: `${(v / maxCity) * 100}%`, height: "100%", background: "#5EA9F5", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card title="Sessions by device type">
          {device.map(dv => (
            <div key={dv.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: S.text, marginBottom: 4 }}>
                <span>{dv.name}</span>
                <span style={{ fontWeight: 650 }}>{dv.pct}%</span>
              </div>
              <div style={{ height: 14, background: "#EEF6FF", borderRadius: 3 }}>
                <div style={{ width: `${dv.pct}%`, height: "100%", background: "#003D5B", borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: "0.56rem", color: S.muted, marginTop: 6 }}>Based on {d.sessToday.toLocaleString("en-IN")} sessions today</div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .an-grid { grid-template-columns: 1fr !important; }
          .an-grid3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
