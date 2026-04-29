'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthed, logout } from '@/lib/admin-auth';

const NAV_GROUPS = [
  {
    items: [
      { href: '/admin', label: 'Home', exact: true, icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    ]
  },
  {
    label: 'Sales',
    items: [
      { href: '/admin/orders',    label: 'Orders',    badge: true, icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
    ]
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/products',    label: 'Products',    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
      { href: '/admin/categories',  label: 'Collections', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    ]
  },
  {
    label: 'Customers',
    items: [
      { href: '/admin/customers', label: 'Customers', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    ]
  },
  {
    label: 'Store',
    items: [
      { href: '/admin/analytics',  label: 'Analytics', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
      { href: '/admin/discounts',  label: 'Discounts', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
      { href: '/admin/settings',   label: 'Settings',  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
    ]
  },
];

const MOBILE_QUICK = [
  { href: '/admin',            label: 'Home',      exact: true },
  { href: '/admin/orders',     label: 'Orders' },
  { href: '/admin/products',   label: 'Products' },
  { href: '/admin/customers',  label: 'Customers' },
  { href: '/admin/analytics',  label: 'Analytics' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    if (path === '/admin/login') { setAuthed(true); return; }
    if (!isAuthed()) { router.replace('/admin/login'); return; }
    setAuthed(true);
    try { setOrderCount(JSON.parse(localStorage.getItem('ilum_orders') || '[]').filter((o: {status:string}) => o.status === 'confirmed').length); } catch {}
  }, [path, router]);

  if (authed === null) return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 22, height: 22, border: '2px solid rgba(255,255,255,.1)', borderTopColor: '#cc0000', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (path === '/admin/login') return <>{children}</>;

  const isActive = (href: string, exact?: boolean) => exact ? path === href : (path === href || path.startsWith(href + '/'));

  const handleLogout = () => { logout(); router.replace('/admin/login'); };

  return (
    <div className="adm-root admin-cursor-reset">
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }

        /* ── Root ── */
        .adm-root { display:flex; min-height:100vh; background:#f1f2f4; font-family:'Space Grotesk',system-ui,sans-serif; color:#1a1a1a; }

        /* ── Sidebar ── */
        .adm-sidebar {
          width:244px; background:#1a1a1a; display:flex; flex-direction:column;
          position:fixed; top:0; left:0; bottom:0; z-index:200; overflow-y:auto;
          scrollbar-width:none; transition:transform .3s cubic-bezier(.22,1,.36,1);
        }
        .adm-sidebar::-webkit-scrollbar { display:none; }
        .adm-sidebar-brand { padding:14px 16px; display:flex; align-items:center; gap:10px; border-bottom:1px solid rgba(255,255,255,.07); flex-shrink:0; }
        .adm-sidebar-logo { width:32px; height:32px; background:#cc0000; border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:18px; color:#fff; flex-shrink:0; }
        .adm-sidebar-name { font-size:13px; font-weight:700; color:#fff; letter-spacing:.04em; }
        .adm-sidebar-sub  { font-size:10px; color:rgba(255,255,255,.35); letter-spacing:.1em; margin-top:1px; }

        /* ── Nav groups ── */
        .adm-nav { flex:1; padding:8px 8px; }
        .adm-nav-section { margin-bottom:4px; }
        .adm-nav-section-label { font-size:10px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.25); padding:8px 10px 4px; }
        .adm-nav-item {
          display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px;
          text-decoration:none; font-size:13px; font-weight:500; color:rgba(255,255,255,.55);
          transition:background .15s,color .15s; cursor:pointer; position:relative;
          margin-bottom:1px;
        }
        .adm-nav-item:hover { background:rgba(255,255,255,.07); color:#fff; }
        .adm-nav-item.active { background:rgba(204,0,0,.18); color:#ff6666; }
        .adm-nav-item.active svg { stroke:#ff6666; }
        .adm-nav-badge { background:#cc0000; color:#fff; font-size:10px; font-weight:700; padding:1px 6px; border-radius:20px; margin-left:auto; }

        /* ── Sidebar footer ── */
        .adm-sidebar-footer { padding:10px 8px; border-top:1px solid rgba(255,255,255,.07); flex-shrink:0; }

        /* ── Main ── */
        .adm-main { flex:1; margin-left:244px; display:flex; flex-direction:column; min-height:100vh; min-width:0; }

        /* ── Top bar ── */
        .adm-topbar {
          position:sticky; top:0; z-index:100; background:#f1f2f4;
          border-bottom:1px solid #e3e5e8; display:flex; align-items:center;
          gap:12px; padding:0 24px; height:56px; flex-shrink:0;
        }
        .adm-topbar-hamburger { display:none; }
        .adm-search-wrap { flex:1; max-width:380px; position:relative; }
        .adm-search-input {
          width:100%; background:#fff; border:1px solid #e3e5e8; border-radius:8px;
          font-family:'Space Grotesk',sans-serif; font-size:13px; color:#1a1a1a;
          padding:8px 12px 8px 36px; outline:none; transition:border-color .2s, box-shadow .2s;
        }
        .adm-search-input:focus { border-color:#cc0000; box-shadow:0 0 0 3px rgba(204,0,0,.1); }
        .adm-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#9ca3af; pointer-events:none; }
        .adm-topbar-actions { display:flex; align-items:center; gap:8px; margin-left:auto; }
        .adm-icon-btn { width:36px; height:36px; border-radius:8px; border:1px solid #e3e5e8; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .15s; color:#6b7280; }
        .adm-icon-btn:hover { background:#f9fafb; }
        .adm-avatar { width:36px; height:36px; border-radius:8px; background:#cc0000; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#fff; cursor:pointer; flex-shrink:0; }

        /* ── Content ── */
        .adm-content { flex:1; padding:24px; }
        @media (max-width:640px) { .adm-content { padding:16px; } }

        /* ── Cards ── */
        .adm-card { background:#fff; border:1px solid #e3e5e8; border-radius:12px; }
        .adm-card-header { padding:16px 20px; border-bottom:1px solid #f1f2f4; display:flex; align-items:center; justify-content:space-between; }
        .adm-card-title { font-size:14px; font-weight:600; color:#1a1a1a; }

        /* ── Tables ── */
        .adm-table { width:100%; border-collapse:collapse; }
        .adm-th { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#6b7280; padding:10px 16px; text-align:left; border-bottom:1px solid #f1f2f4; background:#fafafa; white-space:nowrap; }
        .adm-td { font-size:13px; color:#1a1a1a; padding:13px 16px; border-bottom:1px solid #f9fafb; vertical-align:middle; }
        .adm-tr:hover .adm-td { background:#fafafa; }

        /* ── Badges ── */
        .adm-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; display:inline-block; letter-spacing:.04em; }
        .adm-badge-red    { background:#fef2f2; color:#cc0000; }
        .adm-badge-green  { background:#f0fdf4; color:#16a34a; }
        .adm-badge-yellow { background:#fffbeb; color:#d97706; }
        .adm-badge-gray   { background:#f3f4f6; color:#6b7280; }
        .adm-badge-blue   { background:#eff6ff; color:#2563eb; }

        /* ── Inputs / Buttons ── */
        .adm-input {
          background:#fff; border:1px solid #e3e5e8; color:#1a1a1a;
          font-family:'Space Grotesk',sans-serif; font-size:13px; padding:9px 12px;
          outline:none; border-radius:8px; width:100%; transition:border-color .2s,box-shadow .2s;
        }
        .adm-input:focus { border-color:#cc0000; box-shadow:0 0 0 3px rgba(204,0,0,.1); }
        .adm-textarea { resize:vertical; min-height:90px; line-height:1.6; }
        .adm-label { display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:6px; }
        .adm-hint { font-size:11px; color:#9ca3af; margin-top:4px; }
        .adm-btn-primary { background:#cc0000; border:none; color:#fff; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; padding:9px 18px; border-radius:8px; cursor:pointer; transition:background .2s,box-shadow .2s; letter-spacing:.02em; }
        .adm-btn-primary:hover { background:#b30000; box-shadow:0 4px 14px rgba(204,0,0,.3); }
        .adm-btn-secondary { background:#fff; border:1px solid #e3e5e8; color:#374151; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; padding:9px 18px; border-radius:8px; cursor:pointer; transition:background .15s,border-color .15s; }
        .adm-btn-secondary:hover { background:#f9fafb; border-color:#d1d5db; }
        .adm-btn-danger { background:#fff; border:1px solid #fca5a5; color:#cc0000; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; padding:9px 18px; border-radius:8px; cursor:pointer; transition:background .15s; }
        .adm-btn-danger:hover { background:#fef2f2; }

        /* ── Page header ── */
        .adm-page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
        .adm-page-title { font-size:20px; font-weight:700; color:#1a1a1a; }
        .adm-breadcrumb { font-size:12px; color:#9ca3af; margin-bottom:4px; }

        /* ── Stat cards ── */
        .adm-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
        .adm-stat-card { background:#fff; border:1px solid #e3e5e8; border-radius:12px; padding:18px 20px; }
        .adm-stat-label { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#9ca3af; margin-bottom:6px; }
        .adm-stat-value { font-size:26px; font-weight:700; color:#1a1a1a; line-height:1; }
        .adm-stat-sub { font-size:11px; color:#9ca3af; margin-top:4px; }

        /* ── Mobile ── */
        .adm-overlay { display:none; }
        .adm-mobile-nav { display:none; }
        @media (max-width:900px) {
          .adm-sidebar { transform:translateX(-100%); box-shadow:none; }
          .adm-sidebar.open { transform:translateX(0); box-shadow:4px 0 40px rgba(0,0,0,.3); }
          .adm-main { margin-left:0; padding-bottom:64px; }
          .adm-topbar-hamburger { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; border:1px solid #e3e5e8; background:#fff; cursor:pointer; flex-shrink:0; }
          .adm-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:199; }
          .adm-mobile-nav {
            display:flex; position:fixed; bottom:0; left:0; right:0; height:60px;
            background:#fff; border-top:1px solid #e3e5e8; z-index:150;
            align-items:stretch; padding:0;
          }
          .adm-mob-item { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; text-decoration:none; color:#9ca3af; font-size:9px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; transition:color .2s; border-right:1px solid #f1f2f4; }
          .adm-mob-item:last-child { border-right:none; }
          .adm-mob-item.active { color:#cc0000; }
        }
        @media (max-width:640px) {
          .adm-stat-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar${drawerOpen ? ' open' : ''}`}>
        {/* Brand */}
        <div className="adm-sidebar-brand">
          <div className="adm-sidebar-logo">I</div>
          <div>
            <div className="adm-sidebar-name">ILUMINATEES</div>
            <div className="adm-sidebar-sub">ADMIN</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className="adm-nav-section">
              {group.label && <div className="adm-nav-section-label">{group.label}</div>}
              {group.items.map(item => (
                <Link key={item.href} href={item.href}
                  className={`adm-nav-item${isActive(item.href, (item as {exact?:boolean}).exact) ? ' active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {(item as {badge?:boolean}).badge && orderCount > 0 && <span className="adm-nav-badge">{orderCount}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="adm-sidebar-footer">
          <Link href="/" className="adm-nav-item" style={{ textDecoration: 'none' }} onClick={() => setDrawerOpen(false)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>View Store</span>
          </Link>
          <button className="adm-nav-item" onClick={handleLogout} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {drawerOpen && <div className="adm-overlay" onClick={() => setDrawerOpen(false)} />}

      {/* ── MAIN ── */}
      <div className="adm-main">
        {/* Top bar */}
        <div className="adm-topbar">
          <button className="adm-topbar-hamburger" onClick={() => setDrawerOpen(o => !o)}>
            <svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          {/* Search */}
          <div className="adm-search-wrap">
            <svg className="adm-search-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="adm-search-input" placeholder="Search…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>

          {/* Actions */}
          <div className="adm-topbar-actions">
            <Link href="/admin/products/new" className="adm-btn-primary" style={{ textDecoration: 'none', fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add product
            </Link>
            <button className="adm-icon-btn" title="Notifications">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </button>
            <div className="adm-avatar">I</div>
          </div>
        </div>

        {/* Page content */}
        <div className="adm-content">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="adm-mobile-nav">
          {MOBILE_QUICK.map(item => (
            <Link key={item.href} href={item.href} className={`adm-mob-item${isActive(item.href, item.exact) ? ' active' : ''}`}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                {item.label === 'Home' && <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
                {item.label === 'Orders' && <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>}
                {item.label === 'Products' && <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>}
                {item.label === 'Customers' && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>}
                {item.label === 'Analytics' && <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>}
              </svg>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
