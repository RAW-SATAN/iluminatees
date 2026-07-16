"use client";

import { useState, useEffect, useRef } from "react";
import { products as staticProducts, type Product } from "@/lib/products";
import { ProductMockup } from "@/components/ProductMockup";

const ADMIN_PASSWORD = "ILUM2026";
const ORDER_KEY      = "iluminatees_orders";
const EDITS_KEY      = "iluminatees_product_edits";
const ADDED_KEY      = "iluminatees_added_products";
const DELETED_KEY    = "iluminatees_deleted_products";

/* ── Types ── */
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
interface OrderItem { name: string; size: string; qty: number; price: number }
interface Order {
  id: string; customer: string; phone: string; address: string; city: string;
  items: OrderItem[]; total: number; status: OrderStatus;
  payment: "paid" | "unpaid" | "cod"; date: string;
}
interface ProductEdit {
  price?: number; originalPrice?: number | null; inStock?: boolean;
  name?: string; description?: string; category?: "APEX"|"SACRED"|"CIPHER";
  sizes?: string; limited?: boolean; customImage?: string; customImages?: string[];
}
interface PanelDraft {
  name: string; description: string; price: string; mrp: string;
  category: "APEX"|"SACRED"|"CIPHER"; sizes: string[]; inStock: boolean;
  limited: boolean; customImages: string[];
}
interface CustomProduct {
  id: string; slug: string; name: string; category: "APEX"|"SACRED"|"CIPHER";
  price: number; originalPrice?: number; sizes: string; inStock: boolean; limited: boolean;
}

function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s)); } catch {} }, [key]);
  const save = (x: T) => { setV(x); try { localStorage.setItem(key, JSON.stringify(x)); } catch {} };
  return [v, save] as const;
}

/* ── Demo data ── */
const DEMO_ORDERS: Order[] = [
  { id: "#1001", customer: "Rahul Kumar",  phone: "9876543210", address: "12 MG Road", city: "Bangalore", items: [{ name: "Eye of Providence", size: "L", qty: 1, price: 1333 }], total: 1333, status: "delivered", payment: "paid",   date: "Jul 10, 2026" },
  { id: "#1002", customer: "Priya Sharma", phone: "9123456789", address: "45 Connaught Place", city: "Delhi",     items: [{ name: "Sacred Geometry", size: "M", qty: 1, price: 1111 }, { name: "Cipher 33", size: "M", qty: 1, price: 1111 }], total: 2222, status: "shipped",   payment: "paid",   date: "Jul 12, 2026" },
  { id: "#1003", customer: "Aryan Mehta",  phone: "9988776655", address: "7 Bandra West", city: "Mumbai",     items: [{ name: "The Architect", size: "XL", qty: 2, price: 1199 }], total: 2398, status: "confirmed", payment: "cod",    date: "Jul 14, 2026" },
  { id: "#1004", customer: "Neha Singh",   phone: "8877665544", address: "23 Anna Salai", city: "Chennai",    items: [{ name: "Novus Ordo Seclorum", size: "S", qty: 1, price: 999 }], total: 999, status: "pending",   payment: "unpaid", date: "Jul 15, 2026" },
  { id: "#1005", customer: "Vikram Patel", phone: "7766554433", address: "90 CG Road", city: "Ahmedabad",  items: [{ name: "Third Eye Open", size: "L", qty: 1, price: 1111 }, { name: "Ouroboros", size: "L", qty: 1, price: 1299 }], total: 2410, status: "pending",   payment: "cod",    date: "Jul 15, 2026" },
  { id: "#1006", customer: "Sneha Reddy",  phone: "9900112233", address: "14 Film Nagar", city: "Hyderabad", items: [{ name: "Eye of Providence", size: "M", qty: 1, price: 1333 }], total: 1333, status: "cancelled",  payment: "unpaid", date: "Jul 13, 2026" },
];

/* ── Badge configs ── */
const ORDER_STATUS: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  pending:   { label: "Pending",   bg: "#FFF3CD", color: "#856404" },
  confirmed: { label: "Confirmed", bg: "#CCE5FF", color: "#004085" },
  shipped:   { label: "Shipped",   bg: "#E2D9F3", color: "#5A2D91" },
  delivered: { label: "Delivered", bg: "#D4EDDA", color: "#155724" },
  cancelled: { label: "Cancelled", bg: "#F8D7DA", color: "#721C24" },
};
const PAYMENT: Record<Order["payment"], { label: string; bg: string; color: string; dot: string }> = {
  paid:   { label: "Paid",   bg: "#D4EDDA", color: "#155724", dot: "#28A745" },
  unpaid: { label: "Unpaid", bg: "#F8D7DA", color: "#721C24", dot: "#DC3545" },
  cod:    { label: "COD",    bg: "#FFF3CD", color: "#856404", dot: "#FFC107" },
};

/* ── Shopify-ish palette ── */
const S = {
  sidebar:  "#1A1C2E",
  sidebarBorder: "rgba(255,255,255,0.06)",
  sidebarText: "rgba(255,255,255,0.65)",
  sidebarActive: "rgba(255,255,255,0.10)",
  sidebarActiveBorder: "#00D97E",
  bg:       "#F6F6F7",
  card:     "#FFFFFF",
  border:   "#E4E5E7",
  text:     "#202223",
  muted:    "#6D7175",
  green:    "#008060",
  greenHover: "#006B4F",
  red:      "#D72C0D",
  topbar:   "#FFFFFF",
};

/* ══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed, setAuthed]         = useState(false);
  const [pw, setPw]                 = useState("");
  const [pwErr, setPwErr]           = useState(false);
  const [tab, setTab]               = useState<"home"|"orders"|"products">("home");
  const [orders, setOrders]         = useLS<Order[]>(ORDER_KEY, DEMO_ORDERS);
  const [edits, setEdits]           = useLS<Record<string, ProductEdit>>(EDITS_KEY, {});
  const [search, setSearch]         = useState("");
  const [oSearch, setOSearch]       = useState("");
  const [oFilter, setOFilter]       = useState<OrderStatus|"all">("all");
  const [editId, setEditId]         = useState<string|null>(null);
  const [draft, setDraft]           = useState<ProductEdit>({});
  const [selOrders, setSelOrders]   = useState<Set<string>>(new Set());
  const [selProds, setSelProds]     = useState<Set<string>>(new Set());
  const [expandedOrder, setExpandedOrder] = useState<string|null>(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState({ name: "", price: "", mrp: "", category: "APEX" as "APEX"|"SACRED"|"CIPHER", sizes: "S,M,L,XL" });
  const [panelProduct, setPanelProduct] = useState<Product|null>(null);
  const [panelDraft, setPanelDraft] = useState<PanelDraft>({ name: "", description: "", price: "", mrp: "", category: "APEX", sizes: ["S","M","L","XL"], inStock: true, limited: false, customImages: [] });
  const [imgUrlInput, setImgUrlInput] = useState("");
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [addedProducts, setAddedProducts] = useLS<CustomProduct[]>(ADDED_KEY, []);
  const [deletedIds, setDeletedIds] = useLS<string[]>(DELETED_KEY, []);
  const [confirmDelete, setConfirmDelete] = useState<string|null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast]           = useState<string|null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const staticMapped: Product[] = staticProducts.map(p => {
    const e = edits[p.id] ?? {};
    return {
      ...p,
      name: e.name ?? p.name,
      description: e.description ?? p.description,
      category: e.category ?? p.category,
      sizes: e.sizes ? (e.sizes.split(",").map(s=>s.trim()) as Product["sizes"]) : p.sizes,
      limited: e.limited ?? p.limited,
      price: e.price ?? p.price,
      originalPrice: e.originalPrice === null ? undefined : (e.originalPrice ?? p.originalPrice),
      inStock: e.inStock ?? p.inStock,
    };
  });
  const staticIds = new Set(staticProducts.map(p => p.id));
  const staticSlugs = new Set(staticMapped.map(p => p.slug));

  const customMapped: Product[] = addedProducts
    .filter(cp => !staticSlugs.has(cp.slug))
    .map(cp => {
      const e = edits[cp.id] ?? {};
      return {
        id: cp.id, slug: cp.slug, name: cp.name, codename: cp.id.toUpperCase(),
        category: cp.category,
        price: e.price ?? cp.price,
        originalPrice: e.originalPrice === null ? undefined : (e.originalPrice ?? cp.originalPrice),
        description: "", lore: "", symbol: "eye" as const, shirtColor: "#111", accentColor: "#c9a84c",
        sizes: (cp.sizes.split(",").map(s => s.trim()) as Product["sizes"]),
        inStock: e.inStock ?? cp.inStock, limited: cp.limited, tags: ["custom"],
      };
    });

  // Static products are never hidden by deletedIds — only custom products can be deleted
  const products: Product[] = [
    ...staticMapped,
    ...customMapped.filter(p => !deletedIds.includes(p.id)),
  ];

  function deleteProduct(id: string, name: string) {
    if (staticIds.has(id)) {
      // Static products cannot be deleted — mark out of stock instead
      setEdits({ ...edits, [id]: { ...(edits[id] ?? {}), inStock: false } });
      setPanelProduct(null);
      setConfirmDelete(null);
      showToast(`⚠️ "${name}" marked as Out of Stock`);
      return;
    }
    setDeletedIds([...deletedIds, id]);
    setAddedProducts(addedProducts.filter(p => p.id !== id));
    setPanelProduct(null);
    setConfirmDelete(null);
    showToast(`🗑️ "${name}" deleted`);
  }

  function bulkDeleteProducts() {
    const ids = Array.from(selProds);
    const customIds  = ids.filter(id => !staticIds.has(id));
    const staticSelected = ids.filter(id => staticIds.has(id));
    // Static products → mark out of stock
    if (staticSelected.length > 0) {
      const newEdits = { ...edits };
      staticSelected.forEach(id => { newEdits[id] = { ...(newEdits[id] ?? {}), inStock: false }; });
      setEdits(newEdits);
    }
    // Custom products → delete
    setDeletedIds([...deletedIds, ...customIds]);
    setAddedProducts(addedProducts.filter(p => !selProds.has(p.id)));
    setSelProds(new Set());
    setConfirmBulkDelete(false);
    showToast(`🗑️ ${ids.length} product${ids.length > 1 ? "s" : ""} removed`);
  }

  const revenue  = orders.filter(o => o.payment === "paid").reduce((s, o) => s + o.total, 0);
  const pending  = orders.filter(o => o.status === "pending").length;
  const todaySales = orders.filter(o => o.date.includes("Jul 15") && o.payment === "paid").reduce((s, o) => s + o.total, 0);

  const filtOrders = orders.filter(o =>
    (oFilter === "all" || o.status === oFilter) &&
    (o.customer.toLowerCase().includes(oSearch.toLowerCase()) || o.id.includes(oSearch))
  );
  const filtProds = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  function login() {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false); }
    else setPwErr(true);
  }
  function toggleOrderSel(id: string) {
    setSelOrders(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleProdSel(id: string) {
    setSelProds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function saveEdit(id: string) { setEdits({ ...edits, [id]: draft }); setEditId(null); }

  /* ── Login ── */
  if (!authed) return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: S.card, borderRadius: 12, padding: "2.5rem 2.2rem", width: "100%", maxWidth: 400, boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <span style={{ fontFamily: "Anton, sans-serif", fontSize: "0.55rem", letterSpacing: "0.06em", color: "#fff" }}>ILU</span>
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: S.text, marginBottom: 4 }}>Log in to your store</div>
          <div style={{ fontSize: "0.65rem", color: S.muted }}>iluminatees</div>
        </div>

        <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, color: S.text, marginBottom: 6 }}>Password</label>
        <input
          type="password" value={pw}
          onChange={e => { setPw(e.target.value); setPwErr(false); }}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="••••••••"
          style={{ width: "100%", padding: "0.7rem 0.85rem", border: `1px solid ${pwErr ? "#D72C0D" : "#C9CCCF"}`, borderRadius: 8, fontSize: "0.85rem", color: S.text, outline: "none", marginBottom: pwErr ? 6 : 16, boxSizing: "border-box" }}
        />
        {pwErr && <div style={{ fontSize: "0.6rem", color: S.red, marginBottom: 14 }}>Incorrect password. Try again.</div>}

        <button onClick={login} style={{ width: "100%", padding: "0.72rem", background: S.green, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" }}>
          Log in
        </button>
      </div>
    </div>
  );

  /* ── Nav items ── */
  const NAV = [
    { key: "home"     as const, label: "Home",     icon: "🏠" },
    { key: "orders"   as const, label: "Orders",   icon: "🛍️", badge: pending },
    { key: "products" as const, label: "Products", icon: "📦" },
  ];

  /* ══════ MAIN LAYOUT ══════ */
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", fontFamily: "Inter, sans-serif", overflow: "hidden", background: S.bg }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: S.sidebar, display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", overflowY: "auto" }}>
        {/* Store header */}
        <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: `1px solid ${S.sidebarBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0.6rem", borderRadius: 8, background: S.sidebarActive, cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "Anton, sans-serif", fontSize: "0.4rem", letterSpacing: "0.04em", color: "#fff" }}>ILU</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>iluminatees</div>
              <div style={{ fontSize: "0.48rem", color: S.sidebarText }}>iluminatees.vercel.app</div>
            </div>
            <span style={{ color: S.sidebarText, fontSize: 10 }}>⌄</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.6rem 0.75rem", overflowY: "auto" }}>
          {NAV.map(({ key, label, icon, badge }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0.55rem 0.75rem", borderRadius: 8, background: active ? S.sidebarActive : "none", border: "none", borderLeft: active ? `3px solid ${S.sidebarActiveBorder}` : "3px solid transparent", cursor: "pointer", marginBottom: 2, textAlign: "left", transition: "all 0.12s" }}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ flex: 1, fontSize: "0.68rem", fontWeight: active ? 600 : 400, color: active ? "#fff" : S.sidebarText }}>{label}</span>
                {badge ? <span style={{ background: S.red, color: "#fff", fontSize: "0.42rem", fontWeight: 700, borderRadius: 10, padding: "0.12rem 0.45rem", minWidth: 16, textAlign: "center" }}>{badge}</span> : null}
              </button>
            );
          })}

          <div style={{ height: 1, background: S.sidebarBorder, margin: "0.75rem 0" }} />

          {/* Bottom links */}
          {[{icon:"⚙️", label:"Settings"}, {icon:"📊", label:"Analytics"}].map(({icon, label}) => (
            <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0.55rem 0.75rem", borderRadius: 8, background: "none", border: "none", borderLeft: "3px solid transparent", cursor: "pointer", marginBottom: 2 }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span style={{ fontSize: "0.68rem", color: S.sidebarText }}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "0.75rem", borderTop: `1px solid ${S.sidebarBorder}` }}>
          <button onClick={() => setAuthed(false)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0.75rem", borderRadius: 8, background: "none", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: 14 }}>↩️</span>
            <span style={{ fontSize: "0.62rem", color: S.sidebarText }}>Log out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, background: S.bg, overflowY: "auto", height: "100vh", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: S.topbar, borderBottom: `1px solid ${S.border}`, padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 50, flexShrink: 0 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#C9CCCF" }}>🔍</span>
            <input placeholder="Search" style={{ width: "100%", maxWidth: 380, padding: "0.45rem 0.75rem 0.45rem 2rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.72rem", color: S.text, background: S.bg, outline: "none" }} />
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ fontFamily: "Anton, sans-serif", fontSize: "0.48rem", color: "#fff", letterSpacing: "0.06em" }}>ILU</span>
          </div>
        </div>

        <div style={{ padding: "1.5rem 1.75rem 3rem" }}>

          {/* ════ HOME ════ */}
          {tab === "home" && (<>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: S.text, marginBottom: 20 }}>Good morning, ILUMINATEES 👁️</h1>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Today's sales", value: `₹${todaySales.toLocaleString("en-IN")}`, sub: "Jul 15, 2026", color: S.green },
                { label: "Total revenue",  value: `₹${revenue.toLocaleString("en-IN")}`,    sub: "All time",    color: S.green },
                { label: "Total orders",   value: orders.length,                              sub: `${pending} pending`,    color: S.text },
                { label: "Products live",  value: products.filter(p => p.inStock).length,    sub: `${products.length} total`, color: S.text },
              ].map(({ label, value, sub, color }) => (
                <div key={label} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "1.1rem 1.25rem" }}>
                  <div style={{ fontSize: "0.6rem", color: S.muted, marginBottom: 8, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{value}</div>
                  <div style={{ fontSize: "0.56rem", color: S.muted }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Recent orders card */}
            <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: S.text }}>Recent orders</span>
                <button onClick={() => setTab("orders")} style={{ fontSize: "0.62rem", color: S.green, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all orders</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: S.bg }}>
                    {["Order","Date","Customer","Total","Payment","Status"].map(h => (
                      <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.58rem", fontWeight: 600, color: S.muted, borderBottom: `1px solid ${S.border}`, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: i < 4 ? `1px solid ${S.border}` : "none" }}>
                      <td style={{ padding: "0.75rem 1rem" }}><span style={{ fontSize: "0.65rem", fontWeight: 600, color: S.green, cursor: "pointer" }}>{o.id}</span></td>
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.62rem", color: S.muted, whiteSpace: "nowrap" }}>{o.date}</td>
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.65rem", color: S.text, fontWeight: 500 }}>{o.customer}</td>
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.65rem", color: S.text, fontWeight: 600 }}>₹{o.total.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.58rem", fontWeight: 600, color: PAYMENT[o.payment].color, background: PAYMENT[o.payment].bg, borderRadius: 20, padding: "0.2rem 0.65rem" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: PAYMENT[o.payment].dot, display: "inline-block" }} />
                          {PAYMENT[o.payment].label}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ fontSize: "0.58rem", fontWeight: 600, color: ORDER_STATUS[o.status].color, background: ORDER_STATUS[o.status].bg, borderRadius: 20, padding: "0.2rem 0.65rem" }}>
                          {ORDER_STATUS[o.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>)}

          {/* ════ ORDERS ════ */}
          {tab === "orders" && (<>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: S.text }}>Orders</h1>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "0.5rem 1rem", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.65rem", color: S.text, cursor: "pointer", fontWeight: 500 }}>Export</button>
                <button style={{ padding: "0.5rem 1rem", background: S.green, border: "none", borderRadius: 8, fontSize: "0.65rem", color: "#fff", cursor: "pointer", fontWeight: 600 }}>+ Create order</button>
              </div>
            </div>

            <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
              {/* Filter tabs */}
              <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${S.border}`, overflowX: "auto" }}>
                {([{k:"all",l:"All"},{k:"pending",l:"Pending"},{k:"confirmed",l:"Confirmed"},{k:"shipped",l:"Shipped"},{k:"delivered",l:"Delivered"},{k:"cancelled",l:"Cancelled"}] as {k:OrderStatus|"all",l:string}[]).map(({k,l}) => (
                  <button key={k} onClick={() => setOFilter(k)}
                    style={{ padding: "0.75rem 1.1rem", background: "none", border: "none", borderBottom: oFilter===k ? `2px solid ${S.green}` : "2px solid transparent", fontSize: "0.65rem", fontWeight: oFilter===k ? 700 : 500, color: oFilter===k ? S.green : S.muted, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {l}
                  </button>
                ))}
              </div>

              {/* Search + filter bar */}
              <div style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${S.border}`, display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#C9CCCF" }}>🔍</span>
                  <input value={oSearch} onChange={e => setOSearch(e.target.value)} placeholder="Search orders..."
                    style={{ width: "100%", paddingLeft: 30, paddingRight: 12, paddingTop: 6, paddingBottom: 6, border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.65rem", color: S.text, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: S.bg }}>
                      <th style={{ padding: "0.6rem 1rem", width: 36 }}>
                        <input type="checkbox" onChange={e => e.target.checked ? setSelOrders(new Set(filtOrders.map(o=>o.id))) : setSelOrders(new Set())} />
                      </th>
                      {["Order","Date","Customer","Items","Total","Payment","Fulfillment",""].map(h => (
                        <th key={h} style={{ padding: "0.6rem 0.85rem", textAlign: "left", fontSize: "0.58rem", fontWeight: 600, color: S.muted, whiteSpace: "nowrap", borderBottom: `1px solid ${S.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtOrders.map((o, i) => (
                      <>
                        <tr key={o.id} style={{ borderBottom: `1px solid ${S.border}`, background: selOrders.has(o.id) ? "#F0F7FF" : "transparent" }}>
                          <td style={{ padding: "0.75rem 1rem" }}><input type="checkbox" checked={selOrders.has(o.id)} onChange={() => toggleOrderSel(o.id)} /></td>
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                              style={{ fontSize: "0.65rem", fontWeight: 700, color: S.green, background: "none", border: "none", cursor: "pointer", padding: 0 }}>{o.id}</button>
                          </td>
                          <td style={{ padding: "0.75rem 0.85rem", fontSize: "0.62rem", color: S.muted, whiteSpace: "nowrap" }}>{o.date}</td>
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <div style={{ fontSize: "0.65rem", fontWeight: 500, color: S.text }}>{o.customer}</div>
                            <div style={{ fontSize: "0.55rem", color: S.muted }}>{o.city}</div>
                          </td>
                          <td style={{ padding: "0.75rem 0.85rem", fontSize: "0.62rem", color: S.muted }}>{o.items.reduce((s,i)=>s+i.qty,0)} item{o.items.reduce((s,i)=>s+i.qty,0)>1?"s":""}</td>
                          <td style={{ padding: "0.75rem 0.85rem", fontSize: "0.65rem", fontWeight: 600, color: S.text }}>₹{o.total.toLocaleString("en-IN")}</td>
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.58rem", fontWeight: 600, color: PAYMENT[o.payment].color, background: PAYMENT[o.payment].bg, borderRadius: 20, padding: "0.2rem 0.65rem", whiteSpace: "nowrap" }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: PAYMENT[o.payment].dot }} />
                              {PAYMENT[o.payment].label}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <span style={{ fontSize: "0.58rem", fontWeight: 600, color: ORDER_STATUS[o.status].color, background: ORDER_STATUS[o.status].bg, borderRadius: 20, padding: "0.2rem 0.65rem", whiteSpace: "nowrap" }}>
                              {ORDER_STATUS[o.status].label}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <select value={o.status} onChange={e => setOrders(orders.map(x => x.id===o.id ? {...x,status:e.target.value as OrderStatus} : x))}
                              style={{ fontSize: "0.58rem", border: `1px solid ${S.border}`, borderRadius: 6, padding: "0.3rem 0.5rem", color: S.text, cursor: "pointer", outline: "none", background: S.card }}>
                              {(["pending","confirmed","shipped","delivered","cancelled"] as OrderStatus[]).map(s => (
                                <option key={s} value={s}>{ORDER_STATUS[s].label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        {expandedOrder === o.id && (
                          <tr key={`${o.id}-exp`}>
                            <td colSpan={9} style={{ padding: "0 1rem 1rem 4rem", background: "#FAFBFB" }}>
                              <div style={{ padding: "1rem", background: S.card, border: `1px solid ${S.border}`, borderRadius: 10 }}>
                                <div style={{ fontSize: "0.6rem", fontWeight: 600, color: S.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Order Details</div>
                                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 12 }}>
                                  <div>
                                    <div style={{ fontSize: "0.55rem", color: S.muted }}>Customer</div>
                                    <div style={{ fontSize: "0.65rem", fontWeight: 600, color: S.text }}>{o.customer}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: "0.55rem", color: S.muted }}>Phone</div>
                                    <div style={{ fontSize: "0.65rem", fontWeight: 600, color: S.text }}>{o.phone}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: "0.55rem", color: S.muted }}>Shipping address</div>
                                    <div style={{ fontSize: "0.65rem", fontWeight: 600, color: S.text }}>{o.address}, {o.city}</div>
                                  </div>
                                </div>
                                {o.items.map((item, idx) => (
                                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderTop: `1px solid ${S.border}` }}>
                                    <span style={{ fontSize: "0.62rem", color: S.text }}>{item.name} <span style={{ color: S.muted }}>/ Size {item.size}</span></span>
                                    <span style={{ fontSize: "0.62rem", color: S.muted }}>×{item.qty} · <strong style={{ color: S.text }}>₹{(item.price*item.qty).toLocaleString("en-IN")}</strong></span>
                                  </div>
                                ))}
                                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: `1px solid ${S.border}`, marginTop: 4 }}>
                                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: S.text }}>Total: ₹{o.total.toLocaleString("en-IN")}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
                {filtOrders.length === 0 && (
                  <div style={{ textAlign: "center", padding: "3rem", fontSize: "0.7rem", color: S.muted }}>No orders found.</div>
                )}
              </div>
            </div>
          </>)}

          {/* ════ PRODUCTS ════ */}
          {tab === "products" && (<>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: S.text }}>Products</h1>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "0.5rem 1rem", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.65rem", color: S.text, cursor: "pointer", fontWeight: 500 }}>Export</button>
                <button style={{ padding: "0.5rem 1rem", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.65rem", color: S.text, cursor: "pointer", fontWeight: 500 }}>Import</button>
                <button onClick={() => { setAddForm({ name: "", price: "", mrp: "", category: "APEX", sizes: "S,M,L,XL" }); setShowAdd(true); }} style={{ padding: "0.5rem 1rem", background: S.green, border: "none", borderRadius: 8, fontSize: "0.65rem", color: "#fff", cursor: "pointer", fontWeight: 600 }}>+ Add product</button>
              </div>
            </div>

            <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
              {/* Search */}
              <div style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${S.border}`, display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#C9CCCF" }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                    style={{ width: "100%", paddingLeft: 30, paddingRight: 12, paddingTop: 6, paddingBottom: 6, border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.65rem", color: S.text, outline: "none", boxSizing: "border-box" }} />
                </div>
                <button style={{ padding: "0.4rem 0.85rem", background: "none", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.62rem", color: S.text, cursor: "pointer" }}>Category ⌄</button>
                <button style={{ padding: "0.4rem 0.85rem", background: "none", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.62rem", color: S.text, cursor: "pointer" }}>Stock ⌄</button>
              </div>

              {/* Bulk action bar */}
              {selProds.size > 0 && (
                <div style={{ padding: "0.65rem 1rem", borderBottom: `1px solid ${S.border}`, background: "#EAF4FF", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#004085" }}>
                    {selProds.size} product{selProds.size > 1 ? "s" : ""} selected
                  </span>
                  <div style={{ flex: 1 }} />
                  {confirmBulkDelete ? (
                    <>
                      <span style={{ fontSize: "0.62rem", color: S.red, fontWeight: 600 }}>
                        Delete {selProds.size} product{selProds.size > 1 ? "s" : ""}?
                      </span>
                      <button onClick={bulkDeleteProducts}
                        style={{ padding: "0.38rem 0.9rem", background: S.red, border: "none", borderRadius: 7, fontSize: "0.62rem", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                        Confirm
                      </button>
                      <button onClick={() => setConfirmBulkDelete(false)}
                        style={{ padding: "0.38rem 0.9rem", background: "none", border: `1px solid ${S.border}`, borderRadius: 7, fontSize: "0.62rem", color: S.text, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setConfirmBulkDelete(true)}
                        style={{ padding: "0.38rem 0.9rem", background: S.red, border: "none", borderRadius: 7, fontSize: "0.62rem", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                        🗑️ Delete selected
                      </button>
                      <button onClick={() => setSelProds(new Set())}
                        style={{ padding: "0.38rem 0.9rem", background: "none", border: `1px solid ${S.border}`, borderRadius: 7, fontSize: "0.62rem", color: S.text, cursor: "pointer" }}>
                        Clear selection
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: S.bg }}>
                      <th style={{ padding: "0.6rem 1rem", width: 36 }}>
                        <input type="checkbox" onChange={e => e.target.checked ? setSelProds(new Set(filtProds.map(p=>p.id))) : setSelProds(new Set())} />
                      </th>
                      {["Product","Category","Price","MRP","Stock","Actions"].map(h => (
                        <th key={h} style={{ padding: "0.6rem 0.85rem", textAlign: "left", fontSize: "0.58rem", fontWeight: 600, color: S.muted, whiteSpace: "nowrap", borderBottom: `1px solid ${S.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtProds.map((p, i) => {
                      const isEditing = editId === p.id;
                      const hasEdit   = !!edits[p.id];
                      return (
                        <tr key={p.id} style={{ borderBottom: i < filtProds.length - 1 ? `1px solid ${S.border}` : "none", background: selProds.has(p.id) ? "#F0F7FF" : "transparent" }}>
                          <td style={{ padding: "0.75rem 1rem" }}><input type="checkbox" checked={selProds.has(p.id)} onChange={() => toggleProdSel(p.id)} /></td>

                          {/* Product */}
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 40, height: 48, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                                {(edits[p.id]?.customImages?.[0] || edits[p.id]?.customImage)
                                  ? <img src={edits[p.id]?.customImages?.[0] || edits[p.id]?.customImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  : <ProductMockup product={p} size={32} />
                                }
                              </div>
                              <div>
                                <div style={{ fontSize: "0.65rem", fontWeight: 600, color: S.text }}>{p.name}</div>
                                <div style={{ fontSize: "0.52rem", color: S.muted }}>{p.codename}</div>
                                {hasEdit && <span style={{ fontSize: "0.46rem", color: "#856404", background: "#FFF3CD", borderRadius: 4, padding: "0.08rem 0.4rem", fontWeight: 600 }}>edited</span>}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <span style={{ fontSize: "0.58rem", fontWeight: 600, color: "#5A2D91", background: "#E2D9F3", borderRadius: 20, padding: "0.2rem 0.6rem" }}>{p.category}</span>
                          </td>

                          {/* Price */}
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: S.text }}>₹{p.price.toLocaleString("en-IN")}</span>
                          </td>

                          {/* MRP */}
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <span style={{ fontSize: "0.65rem", color: p.originalPrice ? S.muted : "#C9CCCF", textDecoration: p.originalPrice ? "line-through" : "none" }}>
                              {p.originalPrice ? `₹${p.originalPrice.toLocaleString("en-IN")}` : "—"}
                            </span>
                          </td>

                          {/* Stock */}
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.58rem", fontWeight: 600,
                              color: p.inStock ? "#155724" : "#721C24",
                              background: p.inStock ? "#D4EDDA" : "#F8D7DA",
                              borderRadius: 20, padding: "0.2rem 0.65rem" }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.inStock ? "#28A745" : "#DC3545" }} />
                              {p.inStock ? "In stock" : "Out of stock"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "0.75rem 0.85rem" }}>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            {confirmDelete === p.id ? (
                              <>
                                <span style={{ fontSize: "0.56rem", color: S.red, fontWeight: 600 }}>Delete?</span>
                                <button onClick={() => deleteProduct(p.id, p.name)}
                                  style={{ padding: "0.3rem 0.65rem", background: S.red, border: "none", borderRadius: 6, fontSize: "0.56rem", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Yes</button>
                                <button onClick={() => setConfirmDelete(null)}
                                  style={{ padding: "0.3rem 0.65rem", background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, fontSize: "0.56rem", color: S.text, cursor: "pointer" }}>No</button>
                              </>
                            ) : (
                              <button onClick={() => setConfirmDelete(p.id)}
                                style={{ padding: "0.35rem 0.6rem", background: "none", border: `1px solid #F8D7DA`, borderRadius: 6, fontSize: "0.62rem", color: S.red, cursor: "pointer", lineHeight: 1 }}
                                title="Delete product">🗑️</button>
                            )}
                            <button
                              onClick={() => {
                                setConfirmDelete(null);
                                const e = edits[p.id] ?? {};
                                setPanelProduct(p);
                                setPanelDraft({
                                  name: e.name ?? p.name,
                                  description: e.description ?? p.description ?? "",
                                  price: String(e.price ?? p.price),
                                  mrp: e.originalPrice != null ? String(e.originalPrice) : (p.originalPrice ? String(p.originalPrice) : ""),
                                  category: e.category ?? p.category,
                                  sizes: e.sizes ? e.sizes.split(",").map(s=>s.trim()) : [...(p.sizes as string[])],
                                  inStock: e.inStock ?? p.inStock,
                                  limited: e.limited ?? p.limited,
                                  customImages: e.customImages ?? (e.customImage ? [e.customImage] : []),
                                });
                              }}
                              style={{ padding: "0.35rem 0.85rem", background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, fontSize: "0.58rem", color: S.text, cursor: "pointer", fontWeight: 500 }}>
                              Edit
                            </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div style={{ padding: "0.75rem 1rem", borderTop: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.6rem", color: S.muted }}>Showing {filtProds.length} of {products.length} products</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ padding: "0.3rem 0.7rem", border: `1px solid ${S.border}`, borderRadius: 6, fontSize: "0.6rem", background: S.card, color: S.muted, cursor: "pointer" }}>← Previous</button>
                  <button style={{ padding: "0.3rem 0.7rem", border: `1px solid ${S.border}`, borderRadius: 6, fontSize: "0.6rem", background: S.card, color: S.muted, cursor: "pointer" }}>Next →</button>
                </div>
              </div>
            </div>
          </>)}

        </div>
      </div>

      {/* ── Full Edit Panel ── */}
      {panelProduct && (() => {
        const ALL_SIZES = ["XS","S","M","L","XL","XXL"];
        function toggleSize(s: string) {
          setPanelDraft(d => ({
            ...d,
            sizes: d.sizes.includes(s) ? d.sizes.filter(x=>x!==s) : [...d.sizes, s]
          }));
        }
        const pid = panelProduct.id;
        const pname = panelProduct.name;
        function savePanel() {
          const newEdit: ProductEdit = {
            name: panelDraft.name.trim() || undefined,
            description: panelDraft.description.trim() || undefined,
            price: panelDraft.price ? parseInt(panelDraft.price) : undefined,
            originalPrice: panelDraft.mrp ? parseInt(panelDraft.mrp) : null,
            category: panelDraft.category,
            sizes: panelDraft.sizes.join(","),
            inStock: panelDraft.inStock,
            limited: panelDraft.limited,
            customImage: panelDraft.customImages[0] || undefined,
            customImages: panelDraft.customImages.length > 0 ? panelDraft.customImages : undefined,
          };
          setEdits({ ...edits, [pid]: newEdit });
          setPanelProduct(null);
          showToast(`✅ "${panelDraft.name || pname}" saved`);
        }
        function handleImageFiles(e: React.ChangeEvent<HTMLInputElement>) {
          const files = Array.from(e.target.files ?? []);
          files.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
              if (typeof ev.target?.result === "string")
                setPanelDraft(d => ({ ...d, customImages: [...d.customImages, ev.target!.result as string] }));
            };
            reader.readAsDataURL(file);
          });
        }
        function insertDesc(prefix: string, suffix = "") {
          const el = descRef.current;
          if (!el) { setPanelDraft(d => ({ ...d, description: d.description + prefix })); return; }
          const start = el.selectionStart ?? el.value.length;
          const end   = el.selectionEnd   ?? el.value.length;
          const sel   = el.value.slice(start, end);
          const newVal = el.value.slice(0, start) + prefix + sel + suffix + el.value.slice(end);
          setPanelDraft(d => ({ ...d, description: newVal }));
          setTimeout(() => { el.focus(); el.setSelectionRange(start + prefix.length, start + prefix.length + sel.length); }, 0);
        }
        const DESC_TEMPLATE = `Premium 240 GSM heavyweight cotton, crafted for those who move through the world differently.

• 100% ring-spun cotton — butter-soft, zero compromise
• Oversized drop-shoulder cut — structured, not sloppy
• Pre-shrunk fabric — what you buy is what stays
• Ribbed crew neck — holds shape, wash after wash
• Reactive dye print — the symbol does not fade, does not conform

⚠️ Limited vault drop. Once it sells out, it does not return.`;

        return (
          <div style={{ position: "absolute", inset: 0, zIndex: 150, display: "flex", alignItems: "stretch" }}>
            {/* Backdrop */}
            <div style={{ flex: 1, background: "rgba(32,34,35,0.5)" }} onClick={() => setPanelProduct(null)} />

            {/* Drawer */}
            <div style={{ width: "min(720px, 100%)", background: S.bg, display: "flex", flexDirection: "column", overflowY: "auto", boxShadow: "-4px 0 32px rgba(0,0,0,0.18)" }}>

              {/* Header */}
              <div style={{ background: S.card, borderBottom: `1px solid ${S.border}`, padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: S.text }}>{panelDraft.name || panelProduct.name}</div>
                  <div style={{ fontSize: "0.56rem", color: S.muted, marginTop: 2 }}>{panelProduct.codename}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => setPanelProduct(null)} style={{ padding: "0.5rem 1rem", background: "none", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.68rem", color: S.text, cursor: "pointer", fontWeight: 500 }}>Discard</button>
                  <button onClick={savePanel} style={{ padding: "0.5rem 1.2rem", background: S.green, border: "none", borderRadius: 8, fontSize: "0.68rem", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Save</button>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 260px", gap: "1.25rem", alignItems: "start" }}>

                {/* ── LEFT COL ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                  {/* Title & Description */}
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "1.1rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, color: S.text, marginBottom: 12 }}>Product details</div>
                    <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 500, color: S.text, marginBottom: 5 }}>Title</label>
                    <input value={panelDraft.name} onChange={e => setPanelDraft(d=>({...d, name: e.target.value}))}
                      style={{ width: "100%", padding: "0.6rem 0.75rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.78rem", color: S.text, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: "0.62rem", fontWeight: 500, color: S.text }}>Description</label>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[
                          { label: "• Bullet", ins: "\n• ", suf: "" },
                          { label: "→", ins: "→ ", suf: "" },
                          { label: "★", ins: "★ ", suf: "" },
                          { label: "⚠️", ins: "\n⚠️ ", suf: "" },
                          { label: "B", ins: "**", suf: "**", title: "Bold" },
                          { label: "I", ins: "_", suf: "_", title: "Italic" },
                        ].map(({ label, ins, suf, title }) => (
                          <button key={label} title={title} onClick={() => insertDesc(ins, suf)}
                            style={{ padding: "0.18rem 0.48rem", border: `1px solid ${S.border}`, borderRadius: 5, fontSize: label === "B" ? "0.7rem" : "0.62rem", fontWeight: label === "B" ? 800 : label === "I" ? 400 : 500, fontStyle: label === "I" ? "italic" : "normal", color: S.text, background: S.bg, cursor: "pointer" }}>
                            {label}
                          </button>
                        ))}
                        <button onClick={() => setPanelDraft(d => ({ ...d, description: DESC_TEMPLATE }))}
                          style={{ padding: "0.18rem 0.6rem", border: `1px solid ${S.green}`, borderRadius: 5, fontSize: "0.55rem", color: S.green, background: "#F0FBF7", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                          Use template
                        </button>
                      </div>
                    </div>
                    <textarea
                      ref={descRef}
                      value={panelDraft.description}
                      onChange={e => setPanelDraft(d=>({...d, description: e.target.value}))}
                      rows={9}
                      placeholder={"Premium 240 GSM heavyweight cotton...\n\n• Oversized drop-shoulder cut\n• Pre-shrunk fabric\n\n⚠️ Limited vault drop."}
                      style={{ width: "100%", padding: "0.65rem 0.75rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.72rem", color: S.text, outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif", lineHeight: 1.7, boxSizing: "border-box" }} />
                    <div style={{ textAlign: "right", fontSize: "0.52rem", color: S.muted, marginTop: 4 }}>
                      {panelDraft.description.length} chars
                    </div>
                  </div>

                  {/* Media */}
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "1.1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: S.text }}>Media</div>
                      <span style={{ fontSize: "0.55rem", color: S.muted }}>{panelDraft.customImages.length} photo{panelDraft.customImages.length !== 1 ? "s" : ""}</span>
                    </div>

                    {/* Image grid */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                      {panelDraft.customImages.length === 0 && (
                        <div style={{ width: 90, height: 108, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ProductMockup product={panelProduct} size={68} />
                        </div>
                      )}
                      {panelDraft.customImages.map((img, idx) => (
                        <div key={idx} style={{ position: "relative", width: 90, height: 108, borderRadius: 8, overflow: "hidden", border: `2px solid ${idx === 0 ? S.green : S.border}`, flexShrink: 0 }}>
                          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {idx === 0 && (
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,128,96,0.88)", fontSize: "0.4rem", color: "#fff", textAlign: "center", padding: "0.22rem", fontWeight: 700, letterSpacing: "0.06em" }}>MAIN</div>
                          )}
                          <button
                            onClick={() => setPanelDraft(d => ({ ...d, customImages: d.customImages.filter((_, i) => i !== idx) }))}
                            style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", lineHeight: 1 }}>
                            ✕
                          </button>
                          {idx > 0 && (
                            <button
                              onClick={() => {
                                const imgs = [...panelDraft.customImages];
                                [imgs[0], imgs[idx]] = [imgs[idx], imgs[0]];
                                setPanelDraft(d => ({ ...d, customImages: imgs }));
                              }}
                              style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", fontSize: "0.42rem", color: "#fff", padding: "0.2rem", fontWeight: 700, textAlign: "center" }}>
                              Set main
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Upload placeholder */}
                      <label style={{ width: 90, height: 108, border: `2px dashed ${S.border}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 5, flexShrink: 0, background: S.bg }}>
                        <span style={{ fontSize: 22, opacity: 0.35 }}>+</span>
                        <span style={{ fontSize: "0.46rem", color: S.muted, textAlign: "center", lineHeight: 1.4 }}>Upload<br/>photo</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageFiles} style={{ display: "none" }} />
                      </label>
                    </div>

                    {/* URL input */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={imgUrlInput}
                        onChange={e => setImgUrlInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && imgUrlInput.trim()) { setPanelDraft(d => ({ ...d, customImages: [...d.customImages, imgUrlInput.trim()] })); setImgUrlInput(""); }}}
                        placeholder="Paste image URL and press Add →"
                        style={{ flex: 1, padding: "0.5rem 0.7rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.62rem", color: S.text, outline: "none" }} />
                      <button
                        onClick={() => { if (imgUrlInput.trim()) { setPanelDraft(d => ({ ...d, customImages: [...d.customImages, imgUrlInput.trim()] })); setImgUrlInput(""); }}}
                        style={{ padding: "0.5rem 0.85rem", background: S.green, border: "none", borderRadius: 8, fontSize: "0.62rem", color: "#fff", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                        Add →
                      </button>
                    </div>
                    {panelDraft.customImages.length > 1 && (
                      <div style={{ marginTop: 8, fontSize: "0.55rem", color: S.muted }}>
                        Tip: click "Set main" on any photo to make it the primary display image.
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "1.1rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, color: S.text, marginBottom: 12 }}>Pricing</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { label: "Price (₹)", key: "price" as const },
                        { label: "Compare at price / MRP (₹)", key: "mrp" as const },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 500, color: S.text, marginBottom: 5 }}>{label}</label>
                          <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: "0.72rem", color: S.muted }}>₹</span>
                            <input type="number" value={panelDraft[key]}
                              onChange={e => setPanelDraft(d=>({...d, [key]: e.target.value}))}
                              placeholder="0"
                              style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 1.4rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.75rem", color: S.text, outline: "none", boxSizing: "border-box" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {panelDraft.price && panelDraft.mrp && parseInt(panelDraft.mrp) > parseInt(panelDraft.price) && (
                      <div style={{ marginTop: 10, fontSize: "0.58rem", color: S.green, fontWeight: 600 }}>
                        {Math.round((1 - parseInt(panelDraft.price)/parseInt(panelDraft.mrp))*100)}% discount applied
                      </div>
                    )}
                  </div>
                </div>

                {/* ── RIGHT COL ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                  {/* Status */}
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "1rem" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 600, color: S.text, marginBottom: 10 }}>Status</div>
                    <select value={panelDraft.inStock ? "1" : "0"} onChange={e => setPanelDraft(d=>({...d, inStock: e.target.value==="1"}))}
                      style={{ width: "100%", padding: "0.55rem 0.7rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.68rem", color: S.text, outline: "none", background: "#fff" }}>
                      <option value="1">Active (In stock)</option>
                      <option value="0">Draft (Out of stock)</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "1rem" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 600, color: S.text, marginBottom: 10 }}>Category</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(["APEX","SACRED","CIPHER"] as const).map(cat => (
                        <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                          <input type="radio" name="cat" checked={panelDraft.category===cat} onChange={() => setPanelDraft(d=>({...d, category: cat}))} />
                          <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#5A2D91", background: "#E2D9F3", borderRadius: 20, padding: "0.18rem 0.6rem" }}>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "1rem" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 600, color: S.text, marginBottom: 10 }}>Sizes available</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {ALL_SIZES.map(sz => {
                        const on = panelDraft.sizes.includes(sz);
                        return (
                          <button key={sz} onClick={() => toggleSize(sz)}
                            style={{ padding: "0.3rem 0.65rem", borderRadius: 6, border: `1.5px solid ${on ? S.green : S.border}`, background: on ? "#D4EDDA" : S.bg, color: on ? "#155724" : S.muted, fontSize: "0.6rem", fontWeight: 700, cursor: "pointer" }}>
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Limited */}
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <div>
                        <div style={{ fontSize: "0.68rem", fontWeight: 600, color: S.text }}>Limited edition</div>
                        <div style={{ fontSize: "0.56rem", color: S.muted, marginTop: 2 }}>Shows "LIMITED" badge</div>
                      </div>
                      <div onClick={() => setPanelDraft(d=>({...d, limited: !d.limited}))}
                        style={{ width: 38, height: 22, borderRadius: 11, background: panelDraft.limited ? S.green : "#C4CDD5", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                        <div style={{ position: "absolute", top: 3, left: panelDraft.limited ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                      </div>
                    </label>
                  </div>

                  {/* Delete */}
                  <div style={{ background: "#FFF5F5", border: `1px solid #FEB2B2`, borderRadius: 10, padding: "1rem" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 600, color: S.red, marginBottom: 8 }}>Danger zone</div>
                    {confirmDelete === pid ? (
                      <div>
                        <div style={{ fontSize: "0.6rem", color: S.text, marginBottom: 10 }}>Are you sure? This cannot be undone.</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => deleteProduct(pid, panelDraft.name || pname)}
                            style={{ padding: "0.5rem 1rem", background: S.red, border: "none", borderRadius: 8, fontSize: "0.65rem", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                            Yes, delete
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            style={{ padding: "0.5rem 1rem", background: "none", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.65rem", color: S.text, cursor: "pointer" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(pid)}
                        style={{ width: "100%", padding: "0.55rem", background: "none", border: `1px solid #FEB2B2`, borderRadius: 8, fontSize: "0.65rem", color: S.red, cursor: "pointer", fontWeight: 600 }}>
                        🗑️ Delete product
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 300, background: "#1a2e1a", color: "#fff", padding: "0.75rem 1.4rem", borderRadius: 10, fontSize: "0.72rem", fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,0.25)", whiteSpace: "nowrap", pointerEvents: "none" }}>
          {toast}
        </div>
      )}

      {/* ── Add Product Modal ── */}
      {showAdd && (
        <div style={{ position: "absolute", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={{ background: S.card, borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", margin: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: S.text }}>Add product</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: S.muted, lineHeight: 1 }}>✕</button>
            </div>

            {[
              { label: "Product name", key: "name" as const, placeholder: "e.g. Eye of Providence" },
              { label: "Price (₹)", key: "price" as const, placeholder: "e.g. 1333" },
              { label: "MRP / Original price (₹)", key: "mrp" as const, placeholder: "e.g. 1999 (leave blank if no discount)" },
              { label: "Sizes (comma separated)", key: "sizes" as const, placeholder: "S,M,L,XL" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, color: S.text, marginBottom: 5 }}>{label}</label>
                <input
                  value={addForm[key]}
                  onChange={e => setAddForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.75rem", color: S.text, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, color: S.text, marginBottom: 5 }}>Category</label>
              <select
                value={addForm.category}
                onChange={e => setAddForm(f => ({ ...f, category: e.target.value as "APEX"|"SACRED"|"CIPHER" }))}
                style={{ width: "100%", padding: "0.6rem 0.75rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.75rem", color: S.text, outline: "none", background: "#fff" }}
              >
                <option value="APEX">APEX</option>
                <option value="SACRED">SACRED</option>
                <option value="CIPHER">CIPHER</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "0.6rem 1.1rem", border: `1px solid ${S.border}`, borderRadius: 8, fontSize: "0.7rem", background: S.card, color: S.text, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
              <button
                disabled={publishing}
                onClick={async () => {
                  if (!addForm.name.trim() || !addForm.price.trim()) return;
                  const id   = `custom-${Date.now()}`;
                  const slug = addForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
                  const newP: CustomProduct = {
                    id, slug, name: addForm.name.trim(),
                    category: addForm.category,
                    price: parseInt(addForm.price) || 0,
                    originalPrice: addForm.mrp.trim() ? (parseInt(addForm.mrp) || undefined) : undefined,
                    sizes: addForm.sizes || "S,M,L,XL",
                    inStock: true, limited: false,
                  };
                  /* Save to localStorage immediately so it shows locally */
                  setAddedProducts([...addedProducts, newP]);
                  setShowAdd(false);
                  /* Publish to codebase via API → triggers Vercel redeploy */
                  setPublishing(true);
                  showToast("⏳ Publishing product...");
                  try {
                    const res = await fetch("/api/products", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id, slug,
                        name: newP.name,
                        category: newP.category,
                        price: newP.price,
                        originalPrice: newP.originalPrice,
                        sizes: newP.sizes,
                        inStock: newP.inStock,
                        limited: newP.limited,
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      showToast(`✅ "${newP.name}" published! Live in ~1 min.`);
                    } else {
                      showToast(`⚠️ Saved locally. Publish failed: ${data.error}`);
                    }
                  } catch {
                    showToast(`⚠️ "${newP.name}" saved locally only.`);
                  } finally {
                    setPublishing(false);
                  }
                }}
                style={{ padding: "0.6rem 1.2rem", background: publishing ? "#aaa" : S.green, border: "none", borderRadius: 8, fontSize: "0.7rem", color: "#fff", cursor: publishing ? "not-allowed" : "pointer", fontWeight: 700 }}
              >
                {publishing ? "Publishing..." : "Publish product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
