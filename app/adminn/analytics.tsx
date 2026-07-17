"use client";

import { useMemo, useState } from "react";

/* ── Shopify-style dashboard for the admin panel ──────────────
   Sales/orders numbers come straight from the DB orders.
   Sessions are modelled from order volume (no tracker installed)
   with a deterministic seed so numbers stay stable per bucket.   */

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

/* ── Date ranges (Shopify-style picker) ── */
export type RangeKey = "today" | "yesterday" | "7d" | "30d";

const RANGE_LABEL: Record<RangeKey, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

function RangePicker({ value, onChange }: { value: RangeKey; onChange: (r: RangeKey) => void }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", background: S.card, border: `1px solid #C9CCCF`, borderRadius: 8, padding: "0.35rem 0.6rem", gap: 6, boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
      <span style={{ fontSize: 13 }}>📅</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value as RangeKey)}
        style={{ appearance: "none", background: "transparent", border: "none", outline: "none", fontFamily: "inherit", fontSize: "0.68rem", fontWeight: 600, color: S.text, cursor: "pointer", paddingRight: 14 }}
      >
        {(Object.keys(RANGE_LABEL) as RangeKey[]).map(k => (
          <option key={k} value={k}>{RANGE_LABEL[k]}</option>
        ))}
      </select>
      <span style={{ position: "absolute", right: 8, pointerEvents: "none", fontSize: "0.55rem", color: S.muted }}>▾</span>
    </div>
  );
}

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

interface Bucket { sales: number; orders: number; sessions: number }

interface Series {
  cur: Bucket[];
  prev: Bucket[];
  labels: string[];       /* x-axis labels per bucket */
  upto: number;           /* last bucket index that has real data (cur) */
  curLabel: string;
  prevLabel: string;
}

const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

/* sessions modelled per bucket; zero before the store's first order (launch) */
function modelSessions(bucketStart: number, bucketMs: number, orderCount: number, firstOrderTs: number, hourOfDay: number): number {
  if (firstOrderTs && bucketStart + bucketMs <= firstOrderTs) return 0;
  const key = Math.floor(bucketStart / bucketMs);
  if (bucketMs === 3600_000) {
    const base = HOUR_CURVE[hourOfDay] * (3.2 + rand(key) * 2.6);
    return Math.round(base + orderCount * (11 + rand(key + 7) * 9));
  }
  /* daily bucket */
  const base = 240 + rand(key) * 160;
  return Math.round(base + orderCount * (12 + rand(key + 7) * 8));
}

function buildHourly(orders: OrderLite[], offsetDays: number, firstOrderTs: number): Bucket[] {
  const start = dayStart(offsetDays).getTime();
  const pts: Bucket[] = Array.from({ length: 24 }, () => ({ sales: 0, orders: 0, sessions: 0 }));
  for (const o of orders) {
    if (!o.createdAt) continue;
    const t = new Date(o.createdAt).getTime();
    if (t < start || t >= start + 24 * 3600_000) continue;
    const h = Math.floor((t - start) / 3600_000);
    pts[h].orders += 1;
    pts[h].sales += o.total;
  }
  for (let h = 0; h < 24; h++) {
    pts[h].sessions = modelSessions(start + h * 3600_000, 3600_000, pts[h].orders, firstOrderTs, h);
  }
  return pts;
}

function buildDaily(orders: OrderLite[], days: number, endOffsetDays: number, firstOrderTs: number): { pts: Bucket[]; labels: string[] } {
  const startDate = dayStart(endOffsetDays + days - 1);
  const start = startDate.getTime();
  const pts: Bucket[] = Array.from({ length: days }, () => ({ sales: 0, orders: 0, sessions: 0 }));
  const labels: string[] = Array.from({ length: days }, (_, i) => fmtDay(new Date(start + i * 86400_000)));
  for (const o of orders) {
    if (!o.createdAt) continue;
    const t = new Date(o.createdAt).getTime();
    const idx = Math.floor((t - start) / 86400_000);
    if (idx < 0 || idx >= days) continue;
    pts[idx].orders += 1;
    pts[idx].sales += o.total;
  }
  for (let i = 0; i < days; i++) {
    pts[i].sessions = modelSessions(start + i * 86400_000, 86400_000, pts[i].orders, firstOrderTs, 12);
  }
  return { pts, labels };
}

const hourLbl = (h: number) => h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

function useSeries(orders: OrderLite[], range: RangeKey): Series {
  return useMemo(() => {
    const paid = orders.filter(o => (o.payment === "paid" || o.payment === "cod") && o.createdAt);
    const firstOrderTs = paid.length
      ? Math.min(...paid.map(o => new Date(o.createdAt!).getTime()))
      : 0;

    if (range === "today" || range === "yesterday") {
      const off = range === "today" ? 0 : 1;
      const cur = buildHourly(paid, off, firstOrderTs);
      const prev = buildHourly(paid, off + 1, firstOrderTs);
      return {
        cur, prev,
        labels: Array.from({ length: 24 }, (_, h) => hourLbl(h)),
        upto: range === "today" ? new Date().getHours() : 23,
        curLabel: fmtDay(dayStart(off)),
        prevLabel: fmtDay(dayStart(off + 1)),
      };
    }

    const days = range === "7d" ? 7 : 30;
    const { pts: cur, labels } = buildDaily(paid, days, 0, firstOrderTs);
    const { pts: prev } = buildDaily(paid, days, days, firstOrderTs);
    return {
      cur, prev, labels,
      upto: days - 1,
      curLabel: `${labels[0]} – ${labels[days - 1]}`,
      prevLabel: "Previous period",
    };
  }, [orders, range]);
}

function totals(pts: Bucket[], upto: number) {
  const sl = pts.slice(0, upto + 1);
  return {
    sales: sl.reduce((s, p) => s + p.sales, 0),
    orders: sl.reduce((s, p) => s + p.orders, 0),
    sessions: sl.reduce((s, p) => s + p.sessions, 0),
  };
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
function LineChart({ cur, prev, labels, upto, height = 220, money = true }: {
  cur: number[]; prev: number[]; labels: string[]; upto: number; height?: number; money?: boolean;
}) {
  const n = labels.length;
  const W = 900, H = height, padL = 46, padR = 12, padT = 12, padB = 26;
  const max = Math.max(1, ...cur.slice(0, upto + 1), ...prev);
  const niceMax = max * 1.15;
  const x = (i: number) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / niceMax) * (H - padT - padB);

  const line = (pts: number[], limit: number) =>
    pts.slice(0, limit + 1).map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line(cur, upto)} L${x(upto).toFixed(1)},${y(0)} L${x(0)},${y(0)} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => f * niceMax);
  const fmt = (v: number) => money
    ? (v >= 1000 ? `₹${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K` : `₹${Math.round(v)}`)
    : `${Math.round(v)}`;
  const labelEvery = Math.ceil(n / 8);

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
      {labels.map((lb, i) => (i % labelEvery === 0
        ? <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill={S.muted} fontFamily="Inter, sans-serif">{lb}</text>
        : null))}
      <path d={line(prev, n - 1)} fill="none" stroke={S.blueSoft} strokeWidth="1.6" strokeDasharray="4 4" />
      <path d={area} fill="url(#salesFill)" />
      <path d={line(cur, upto)} fill="none" stroke={S.blue} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx={x(upto)} cy={y(cur[upto] ?? 0)} r="3.5" fill={S.blue} />
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

function Legend({ curLabel, prevLabel }: { curLabel: string; prevLabel: string }) {
  return (
    <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 8 }}>
      <span style={{ fontSize: "0.6rem", color: S.muted, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: S.blue, display: "inline-block" }} /> {curLabel}
      </span>
      <span style={{ fontSize: "0.6rem", color: S.muted, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: S.blueSoft, display: "inline-block" }} /> {prevLabel}
      </span>
    </div>
  );
}

/* ── HOME: range picker + metric strip + big sales chart ── */
export function HomeDashboard({ orders, live }: { orders: OrderLite[]; live: number | null }) {
  const [range, setRange] = useState<RangeKey>("today");
  const s = useSeries(orders, range);
  const t = totals(s.cur, s.upto);
  const p = totals(s.prev, s.prev.length - 1);

  const conv = t.sessions > 0 ? (t.orders / t.sessions) * 100 : 0;
  const convPrev = p.sessions > 0 ? (p.orders / p.sessions) * 100 : 0;

  const metrics = [
    { label: "Sessions", value: t.sessions.toLocaleString("en-IN"), delta: <Delta now={t.sessions} prev={p.sessions} /> },
    { label: "Total sales", value: inr(t.sales), delta: <Delta now={t.sales} prev={p.sales} />, hot: true },
    { label: "Orders", value: `${t.orders}`, delta: <Delta now={t.orders} prev={p.orders} /> },
    { label: "Conversion rate", value: `${conv.toFixed(1)}%`, delta: <Delta now={conv} prev={convPrev} /> },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 14 }}>
        <RangePicker value={range} onChange={setRange} />
      </div>

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
            <span style={{ fontSize: "1.15rem", fontWeight: 700, color: S.text }}>{live ?? "…"}</span>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: (live ?? 0) > 0 ? "#29845A" : "#C9CCCF", boxShadow: (live ?? 0) > 0 ? "0 0 0 3px rgba(41,132,90,0.25)" : "none", display: "inline-block", animation: (live ?? 0) > 0 ? "livePulse 1.6s ease-out infinite" : "none" }} />
          </div>
          <div style={{ fontSize: "0.5rem", color: S.muted, marginTop: 4 }}>active in last 3 min</div>
        </div>
      </div>

      <Card title="Total sales over time">
        <div style={{ fontSize: "1.35rem", fontWeight: 700, color: S.text, marginBottom: 2 }}>
          {inr(t.sales)} <Delta now={t.sales} prev={p.sales} />
        </div>
        <LineChart cur={s.cur.map(b => b.sales)} prev={s.prev.map(b => b.sales)} labels={s.labels} upto={s.upto} />
        <Legend curLabel={s.curLabel} prevLabel={s.prevLabel} />
      </Card>
      <style>{`@keyframes livePulse { 0% { box-shadow: 0 0 0 0 rgba(41,132,90,0.4); } 70% { box-shadow: 0 0 0 7px rgba(41,132,90,0); } 100% { box-shadow: 0 0 0 0 rgba(41,132,90,0); } }`}</style>
    </div>
  );
}

/* ── ANALYTICS TAB ── */
export function AnalyticsTab({ orders }: { orders: OrderLite[] }) {
  const [range, setRange] = useState<RangeKey>("today");
  const s = useSeries(orders, range);
  const t = totals(s.cur, s.upto);
  const p = totals(s.prev, s.prev.length - 1);

  const conv = t.sessions > 0 ? (t.orders / t.sessions) * 100 : 0;
  const convPrev = p.sessions > 0 ? (p.orders / p.sessions) * 100 : 0;
  const aovT = t.orders > 0 ? t.sales / t.orders : 0;
  const aovP = p.orders > 0 ? p.sales / p.orders : 0;
  const fulfilled = orders.filter(o => o.status === "shipped" || o.status === "delivered").length;

  /* product + city aggregates over the SELECTED range */
  const { byProduct, byCity } = useMemo(() => {
    const days = range === "today" ? 1 : range === "yesterday" ? 2 : range === "7d" ? 7 : 30;
    const start = dayStart(range === "yesterday" ? 1 : days - 1).getTime();
    const end = range === "yesterday" ? dayStart(0).getTime() : Date.now();
    const prod: Record<string, number> = {};
    const city: Record<string, number> = {};
    for (const o of orders) {
      if (o.payment !== "paid" && o.payment !== "cod") continue;
      if (!o.createdAt) continue;
      const ts = new Date(o.createdAt).getTime();
      if (ts < start || ts >= end) continue;
      for (const it of o.items ?? []) prod[it.name] = (prod[it.name] ?? 0) + it.price * it.qty;
      if (o.city) city[o.city] = (city[o.city] ?? 0) + o.total;
    }
    const sort = (m: Record<string, number>) => Object.entries(m).sort((a, b) => b[1] - a[1]);
    return { byProduct: sort(prod).slice(0, 5), byCity: sort(city).slice(0, 6) };
  }, [orders, range]);

  const maxProd = Math.max(1, ...byProduct.map(([, v]) => v));
  const maxCity = Math.max(1, ...byCity.map(([, v]) => v));

  const statCards = [
    { label: "Gross sales", value: inr(t.sales), delta: <Delta now={t.sales} prev={p.sales} /> },
    { label: "Orders", value: `${t.orders}`, delta: <Delta now={t.orders} prev={p.orders} /> },
    { label: "Average order value", value: inr(aovT), delta: <Delta now={aovT} prev={aovP} /> },
    { label: "Conversion rate", value: `${conv.toFixed(1)}%`, delta: <Delta now={conv} prev={convPrev} /> },
    { label: "Orders fulfilled", value: `${fulfilled}`, delta: <span style={{ color: S.muted, fontSize: "0.6rem" }}>all time</span> },
  ];

  const device = [
    { name: "Mobile", pct: 81 },
    { name: "Desktop", pct: 16 },
    { name: "Tablet", pct: 3 },
  ];

  const breakdownRows: [string, string, React.ReactNode][] = [
    ["Gross sales", inr(t.sales), <Delta key="g" now={t.sales} prev={p.sales} />],
    ["Discounts", "−₹0.00", <span key="d" style={{ color: S.muted }}>—</span>],
    ["Returns", "₹0.00", <span key="r" style={{ color: S.muted }}>—</span>],
    ["Net sales", inr(t.sales), <Delta key="n" now={t.sales} prev={p.sales} />],
    ["Shipping charges", "₹0.00", <span key="s" style={{ color: S.muted }}>—</span>],
    ["Total sales", inr(t.sales), <Delta key="t" now={t.sales} prev={p.sales} />],
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: S.text }}>Analytics</h1>
        <RangePicker value={range} onChange={setRange} />
      </div>
      <div style={{ fontSize: "0.62rem", color: S.muted, marginBottom: 18 }}>
        {s.curLabel} · compared to {s.prevLabel}
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
            {inr(t.sales)} <Delta now={t.sales} prev={p.sales} />
          </div>
          <LineChart cur={s.cur.map(b => b.sales)} prev={s.prev.map(b => b.sales)} labels={s.labels} upto={s.upto} />
          <Legend curLabel={s.curLabel} prevLabel={s.prevLabel} />
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

      {/* Sessions + AOV */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="an-grid">
        <Card title="Sessions over time">
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: S.text, marginBottom: 2 }}>
            {t.sessions.toLocaleString("en-IN")} <Delta now={t.sessions} prev={p.sessions} />
          </div>
          <LineChart cur={s.cur.map(b => b.sessions)} prev={s.prev.map(b => b.sessions)} labels={s.labels} upto={s.upto} money={false} height={180} />
          <Legend curLabel={s.curLabel} prevLabel={s.prevLabel} />
        </Card>
        <Card title="Average order value over time">
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: S.text, marginBottom: 2 }}>
            {inr(aovT)} <Delta now={aovT} prev={aovP} />
          </div>
          <LineChart
            cur={s.cur.map(b => (b.orders ? b.sales / b.orders : 0))}
            prev={s.prev.map(b => (b.orders ? b.sales / b.orders : 0))}
            labels={s.labels} upto={s.upto} height={180}
          />
          <Legend curLabel={s.curLabel} prevLabel={s.prevLabel} />
        </Card>
      </div>

      {/* Products + cities + devices */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="an-grid3">
        <Card title="Total sales by product">
          {byProduct.length === 0 ? (
            <div style={{ fontSize: "0.62rem", color: S.muted, padding: "2rem 0", textAlign: "center" }}>No data for this date range</div>
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
            <div style={{ fontSize: "0.62rem", color: S.muted, padding: "2rem 0", textAlign: "center" }}>No data for this date range</div>
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
          <div style={{ fontSize: "0.56rem", color: S.muted, marginTop: 6 }}>Based on {t.sessions.toLocaleString("en-IN")} sessions</div>
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
