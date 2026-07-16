"use client";

import { useState, useEffect } from "react";
import { products as staticProducts, type Product } from "@/lib/products";
import { ProductMockup } from "@/components/ProductMockup";
import {
  LayoutDashboard, Package, ShoppingCart, LogOut,
  TrendingUp, Eye, Edit2, Check, X, Search, Tag, ToggleLeft, ToggleRight,
} from "lucide-react";

const ADMIN_PASSWORD = "ILUM2026";
const ORDER_KEY = "iluminatees_orders";
const EDITS_KEY = "iluminatees_product_edits";

/* ── Types ── */
interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  date: string;
}

interface ProductEdit {
  price?: number;
  originalPrice?: number | null;
  inStock?: boolean;
}

/* ── Helpers ── */
function useLocalStorage<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(init);
  useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setVal(JSON.parse(s)); } catch {}
  }, [key]);
  function save(v: T) { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }
  return [val, save] as const;
}

const STATUS_COLOR: Record<Order["status"], string> = {
  pending: "#f5a623", confirmed: "#3b82f6", shipped: "#8b5cf6",
  delivered: "#16a34a", cancelled: "#e8000d",
};
const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pending", confirmed: "Confirmed", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled",
};

/* ── Mock orders for demo ── */
const DEMO_ORDERS: Order[] = [
  { id: "ORD-001", customer: "Rahul Kumar", phone: "9876543210", address: "12 MG Road, Bangalore 560001", items: [{ name: "Eye of Providence", size: "L", qty: 1, price: 1333 }], total: 1333, status: "delivered", date: "2026-07-10" },
  { id: "ORD-002", customer: "Priya Sharma", phone: "9123456789", address: "45 Connaught Place, Delhi 110001", items: [{ name: "Sacred Geometry", size: "M", qty: 1, price: 1111 }, { name: "Cipher 33", size: "M", qty: 1, price: 1111 }], total: 2222, status: "shipped", date: "2026-07-12" },
  { id: "ORD-003", customer: "Aryan Mehta", phone: "9988776655", address: "7 Bandra West, Mumbai 400050", items: [{ name: "The Architect", size: "XL", qty: 2, price: 1199 }], total: 2398, status: "confirmed", date: "2026-07-14" },
  { id: "ORD-004", customer: "Neha Singh", phone: "8877665544", address: "23 Anna Salai, Chennai 600002", items: [{ name: "Novus Ordo Seclorum", size: "S", qty: 1, price: 999 }], total: 999, status: "pending", date: "2026-07-15" },
  { id: "ORD-005", customer: "Vikram Patel", phone: "7766554433", address: "90 CG Road, Ahmedabad 380009", items: [{ name: "Third Eye Open", size: "L", qty: 1, price: 1111 }, { name: "Ouroboros", size: "L", qty: 1, price: 1299 }], total: 2410, status: "pending", date: "2026-07-15" },
];

/* ══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const [orders, setOrders] = useLocalStorage<Order[]>(ORDER_KEY, DEMO_ORDERS);
  const [edits, setEdits] = useLocalStorage<Record<string, ProductEdit>>(EDITS_KEY, {});
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ProductEdit>({});
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "ALL">("ALL");

  /* merge static products with local edits */
  const products: Product[] = staticProducts.map(p => ({
    ...p,
    ...(edits[p.id] ?? {}),
    originalPrice: edits[p.id]?.originalPrice === null ? undefined : (edits[p.id]?.originalPrice ?? p.originalPrice),
  }));

  /* stats */
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  function login() {
    if (pwInput === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  }

  function saveEdit(id: string) {
    setEdits({ ...edits, [id]: editDraft });
    setEditingId(null);
  }

  function updateOrderStatus(id: string, status: Order["status"]) {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    (statusFilter === "ALL" || o.status === statusFilter) &&
    (o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
     o.id.toLowerCase().includes(orderSearch.toLowerCase()))
  );

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ width: "100%", maxWidth: 380, background: "#111", border: "1px solid #222", borderRadius: 16, padding: "2.5rem 2rem" }}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: "1.5rem", letterSpacing: "0.12em", color: "#fff", marginBottom: 4 }}>
            ILUMINATEES<span style={{ color: "#e8000d", fontSize: "0.5em" }}>®</span>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 32 }}>
            Admin Panel
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="Enter admin password"
              style={{ width: "100%", padding: "0.85rem 1rem", background: "#1a1a1a", border: `1px solid ${pwError ? "#e8000d" : "#2a2a2a"}`, borderRadius: 8, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", outline: "none" }}
            />
            {pwError && <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", color: "#e8000d", marginTop: 6 }}>Incorrect password</div>}
          </div>

          <button
            onClick={login}
            style={{ width: "100%", padding: "0.9rem", background: "#e8000d", color: "#fff", border: "none", borderRadius: 10, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", cursor: "pointer" }}
          >
            ENTER THE VAULT →
          </button>
        </div>
      </div>
    );
  }

  /* ── Sidebar ── */
  const NAV = [
    { key: "dashboard" as const, label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { key: "products"  as const, label: "Products",  icon: <Package size={16} /> },
    { key: "orders"    as const, label: "Orders",    icon: <ShoppingCart size={16} />, badge: pendingOrders },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 220, background: "#111", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "1.5rem 1.2rem 1rem" }}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: "1rem", letterSpacing: "0.12em", color: "#fff" }}>
            ILUMINATEES<span style={{ color: "#e8000d", fontSize: "0.45em" }}>®</span>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.48rem", color: "#444", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>Admin Panel</div>
        </div>

        <div style={{ height: 1, background: "#1e1e1e", margin: "0 1.2rem" }} />

        <nav style={{ flex: 1, padding: "0.75rem 0.6rem" }}>
          {NAV.map(({ key, label, icon, badge }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0.65rem 0.75rem", borderRadius: 8, background: active ? "rgba(232,0,13,0.12)" : "none", border: "none", cursor: "pointer", marginBottom: 2, color: active ? "#e8000d" : "#555", textAlign: "left", transition: "all 0.15s" }}
              >
                {icon}
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.04em", flex: 1 }}>{label}</span>
                {badge ? (
                  <span style={{ background: "#e8000d", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.42rem", borderRadius: 10, padding: "0.1rem 0.45rem" }}>{badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "1rem 0.6rem" }}>
          <button
            onClick={() => setAuthed(false)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0.65rem 0.75rem", borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "#333" }}
          >
            <LogOut size={15} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 500 }}>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflow: "auto" }}>

        {/* ════ DASHBOARD ════ */}
        {tab === "dashboard" && (
          <div style={{ padding: "2rem" }}>
            <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>Dashboard</h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#555", marginBottom: 28 }}>Welcome back. Here's what's happening.</p>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 32 }}>
              {[
                { label: "Total Products", value: products.length, icon: <Package size={18} color="#8b5cf6" />, bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
                { label: "Total Orders", value: orders.length, icon: <ShoppingCart size={18} color="#3b82f6" />, bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
                { label: "Pending Orders", value: pendingOrders, icon: <TrendingUp size={18} color="#f5a623" />, bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.2)" },
                { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: <Tag size={18} color="#16a34a" />, bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.2)" },
              ].map(({ label, value, icon, bg, border }) => (
                <div key={label} style={{ background: "#111", border: `1px solid #1e1e1e`, borderRadius: 12, padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
                  </div>
                  <div style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "1.4rem", color: "#fff" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#fff" }}>Recent Orders</span>
                <button onClick={() => setTab("orders")} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#e8000d", background: "none", border: "none", cursor: "pointer" }}>View All →</button>
              </div>
              {orders.slice(0, 5).map(o => (
                <div key={o.id} style={{ padding: "0.9rem 1.25rem", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.62rem", color: "#fff", marginBottom: 2 }}>{o.customer}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#444" }}>{o.id} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.72rem", color: "#fff" }}>₹{o.total.toLocaleString("en-IN")}</div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.46rem", letterSpacing: "0.1em", textTransform: "uppercase", background: `${STATUS_COLOR[o.status]}22`, color: STATUS_COLOR[o.status], borderRadius: 6, padding: "0.25rem 0.6rem" }}>
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ PRODUCTS ════ */}
        {tab === "products" && (
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>Products</h1>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#555" }}>{products.length} products · Click edit to change price or stock status</p>
              </div>
              <div style={{ position: "relative" }}>
                <Search size={12} color="#444" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", outline: "none", width: 200 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredProducts.map(p => {
                const isEditing = editingId === p.id;
                const hasEdit = !!edits[p.id];
                return (
                  <div key={p.id} style={{ background: "#111", border: `1px solid ${isEditing ? "#333" : "#1e1e1e"}`, borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Thumbnail */}
                    <div style={{ width: 52, height: 62, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      <ProductMockup product={p} size={42} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.68rem", color: "#fff" }}>{p.name}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.42rem", color: "#555", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4, padding: "0.1rem 0.4rem", letterSpacing: "0.1em" }}>{p.category}</span>
                        {hasEdit && <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.42rem", color: "#f5a623", background: "rgba(245,166,35,0.1)", borderRadius: 4, padding: "0.1rem 0.4rem" }}>EDITED</span>}
                      </div>
                      <div style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", color: "#aaa" }}>
                        {p.codename} · ID {p.id}
                      </div>
                    </div>

                    {/* Price + stock */}
                    {isEditing ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.48rem", color: "#555", marginBottom: 4 }}>PRICE (₹)</div>
                          <input
                            type="number"
                            value={editDraft.price ?? p.price}
                            onChange={e => setEditDraft(d => ({ ...d, price: Number(e.target.value) }))}
                            style={{ width: 90, padding: "0.4rem 0.6rem", background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, color: "#fff", fontFamily: "Space Mono, monospace", fontSize: "0.72rem", outline: "none" }}
                          />
                        </div>
                        <div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.48rem", color: "#555", marginBottom: 4 }}>MRP (₹, 0=none)</div>
                          <input
                            type="number"
                            value={editDraft.originalPrice ?? (p.originalPrice ?? 0)}
                            onChange={e => setEditDraft(d => ({ ...d, originalPrice: Number(e.target.value) || null }))}
                            style={{ width: 90, padding: "0.4rem 0.6rem", background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, color: "#fff", fontFamily: "Space Mono, monospace", fontSize: "0.72rem", outline: "none" }}
                          />
                        </div>
                        <div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.48rem", color: "#555", marginBottom: 4 }}>IN STOCK</div>
                          <button
                            onClick={() => setEditDraft(d => ({ ...d, inStock: !(d.inStock ?? p.inStock) }))}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                          >
                            {(editDraft.inStock ?? p.inStock)
                              ? <ToggleRight size={28} color="#16a34a" />
                              : <ToggleLeft size={28} color="#555" />
                            }
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => saveEdit(p.id)} style={{ padding: "0.5rem 0.85rem", background: "#16a34a", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem" }}>
                            <Check size={12} /> Save
                          </button>
                          <button onClick={() => setEditingId(null)} style={{ padding: "0.5rem 0.85rem", background: "#2a2a2a", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "0.55rem" }}>
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>₹{p.price.toLocaleString("en-IN")}</div>
                          {p.originalPrice && <div style={{ fontFamily: "Space Mono, monospace", fontSize: "0.55rem", color: "#555", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString("en-IN")}</div>}
                        </div>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.46rem", fontWeight: 700, letterSpacing: "0.08em", background: p.inStock ? "rgba(22,163,74,0.1)" : "rgba(232,0,13,0.1)", color: p.inStock ? "#16a34a" : "#e8000d", borderRadius: 6, padding: "0.2rem 0.55rem" }}>
                          {p.inStock ? "IN STOCK" : "OUT"}
                        </span>
                        <button
                          onClick={() => { setEditingId(p.id); setEditDraft({ price: p.price, originalPrice: p.originalPrice ?? null, inStock: p.inStock }); }}
                          style={{ padding: "0.5rem 0.9rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#aaa", fontFamily: "Inter, sans-serif", fontSize: "0.55rem" }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", color: "#333", marginTop: 16, textAlign: "center" }}>
              Price changes save locally. To make them permanent, update <code style={{ color: "#555" }}>lib/products.ts</code> with the new values.
            </p>
          </div>
        )}

        {/* ════ ORDERS ════ */}
        {tab === "orders" && (
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>Orders</h1>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#555" }}>{orders.length} total · {pendingOrders} pending</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ position: "relative" }}>
                  <Search size={12} color="#444" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    placeholder="Search orders..."
                    style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", outline: "none", width: 180 }}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as Order["status"] | "ALL")}
                  style={{ padding: "0.4rem 0.75rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#aaa", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", outline: "none", cursor: "pointer" }}
                >
                  <option value="ALL">All Status</option>
                  {(["pending","confirmed","shipped","delivered","cancelled"] as Order["status"][]).map(s => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredOrders.map(o => (
                <div key={o.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.62rem", color: "#e8000d" }}>{o.id}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#555" }}>{o.date}</span>
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#fff", marginBottom: 2 }}>{o.customer}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", color: "#555" }}>📱 {o.phone}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", color: "#555", marginTop: 2 }}>📍 {o.address}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: 8 }}>₹{o.total.toLocaleString("en-IN")}</div>
                      <select
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value as Order["status"])}
                        style={{ padding: "0.35rem 0.75rem", background: `${STATUS_COLOR[o.status]}18`, border: `1px solid ${STATUS_COLOR[o.status]}44`, borderRadius: 8, color: STATUS_COLOR[o.status], fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", outline: "none", cursor: "pointer" }}
                      >
                        {(["pending","confirmed","shipped","delivered","cancelled"] as Order["status"][]).map(s => (
                          <option key={s} value={s} style={{ background: "#111", color: "#fff" }}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                    {o.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#888" }}>
                          {item.name} <span style={{ color: "#555" }}>· Size {item.size} · ×{item.qty}</span>
                        </span>
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.58rem", color: "#aaa" }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div style={{ textAlign: "center", padding: "4rem", fontFamily: "Inter, sans-serif", color: "#333", fontSize: "0.7rem" }}>
                  No orders found.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
