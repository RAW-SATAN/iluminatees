'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthed, logout } from '@/lib/admin-auth';

const NAV = [
  { href: '/admin',             label: 'Home',       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, exact: true },
  { href: '/admin/orders',      label: 'Orders',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { href: '/admin/products',    label: 'Products',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { href: '/admin/customers',   label: 'Customers',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { href: '/admin/analytics',   label: 'Analytics',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { href: '/admin/discounts',   label: 'Discounts',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { href: '/admin/settings',    label: 'Settings',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

// Mobile bottom nav shows only first 5
const MOBILE_NAV = NAV.slice(0, 5);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (path === '/admin/login') { setAuthed(true); return; }
    const ok = isAuthed();
    setAuthed(ok);
    if (!ok) router.replace('/admin/login');
  }, [path, router]);

  if (authed === null) return (
    <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 20, height: 20, border: '2px solid rgba(240,236,232,.1)', borderTopColor: '#cc0000', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (path === '/admin/login') return <>{children}</>;

  const isActive = (href: string, exact?: boolean) => exact ? path === href : path.startsWith(href);

  const handleLogout = () => { logout(); router.replace('/admin/login'); };

  return (
    <div className="admin-cursor-reset" style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Sidebar */
        .adm-sidebar {
          width: 240px; background: #060606; border-right: 1px solid rgba(240,236,232,.06);
          display: flex; flex-direction: column; flex-shrink: 0;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; overflow-y: auto;
        }
        .adm-main {
          flex: 1; min-width: 0; margin-left: 240px;
          display: flex; flex-direction: column;
        }
        .adm-topbar { display: none; }
        .adm-mobile-nav { display: none; }

        @media (max-width: 900px) {
          .adm-sidebar { transform: translateX(-100%); transition: transform .3s cubic-bezier(.22,1,.36,1); }
          .adm-sidebar.open { transform: translateX(0); box-shadow: 4px 0 40px rgba(0,0,0,.8); }
          .adm-main { margin-left: 0; padding-bottom: 68px; }
          .adm-topbar { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 52px; background: #060606; border-bottom: 1px solid rgba(240,236,232,.06); position: sticky; top: 0; z-index: 50; }
          .adm-mobile-nav {
            display: flex; position: fixed; bottom: 0; left: 0; right: 0; height: 60px;
            background: #060606; border-top: 1px solid rgba(240,236,232,.06);
            z-index: 100; align-items: center; justify-content: space-around; padding: 0 4px;
          }
          .adm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 99; }
        }

        /* Nav items */
        .adm-nav-item {
          display: flex; align-items: center; gap: 10px; padding: 9px 14px;
          text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: .02em;
          border-radius: 6px; transition: background .15s, color .15s; color: rgba(240,236,232,.5);
          margin: 0 8px;
        }
        .adm-nav-item:hover { background: rgba(240,236,232,.04); color: #f0ece8; }
        .adm-nav-item.active { background: rgba(204,0,0,.1); color: #cc0000; }
        .adm-nav-item.active svg { stroke: #cc0000; }

        /* Mobile nav items */
        .adm-mob-item {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 3px; flex: 1; padding: 6px 4px; text-decoration: none; color: rgba(240,236,232,.35);
          font-size: 8px; letter-spacing: .1em; transition: color .2s; cursor: pointer;
        }
        .adm-mob-item.active { color: #cc0000; }

        /* Content */
        .adm-page { padding: 28px 32px; }
        @media (max-width: 640px) { .adm-page { padding: 20px 16px; } }

        /* Tables */
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-th { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: rgba(240,236,232,.3); padding: 10px 14px; text-align: left; font-weight: 600; border-bottom: 1px solid rgba(240,236,232,.06); background: rgba(255,255,255,.01); white-space: nowrap; }
        .adm-td { font-size: 13px; color: #f0ece8; padding: 13px 14px; border-bottom: 1px solid rgba(240,236,232,.04); vertical-align: middle; }

        /* Cards */
        .adm-card { background: #0d0d0d; border: 1px solid rgba(240,236,232,.06); border-radius: 8px; }

        /* Input */
        .adm-input { background: rgba(240,236,232,.04); border: 1px solid rgba(240,236,232,.1); color: #f0ece8; font-family: 'Space Grotesk',sans-serif; font-size: 13px; padding: 10px 12px; outline: none; border-radius: 4px; width: 100%; transition: border-color .2s; }
        .adm-input:focus { border-color: rgba(204,0,0,.5); }
        .adm-btn-red { background: #cc0000; border: none; color: #fff; font-family: 'Space Grotesk',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .06em; padding: 9px 18px; border-radius: 4px; cursor: pointer; transition: box-shadow .2s; }
        .adm-btn-red:hover { box-shadow: 0 4px 18px rgba(204,0,0,.4); }
        .adm-btn-ghost { background: transparent; border: 1px solid rgba(240,236,232,.12); color: rgba(240,236,232,.6); font-family: 'Space Grotesk',sans-serif; font-size: 12px; padding: 9px 18px; border-radius: 4px; cursor: pointer; transition: border-color .2s, color .2s; }
        .adm-btn-ghost:hover { border-color: rgba(240,236,232,.3); color: #f0ece8; }

        /* Badge */
        .adm-badge { font-size: 10px; font-weight: 600; letter-spacing: .06em; padding: 3px 8px; border-radius: 20px; display: inline-block; }
        .adm-badge-red { background: rgba(204,0,0,.15); color: #cc0000; }
        .adm-badge-green { background: rgba(34,197,94,.12); color: #22c55e; }
        .adm-badge-yellow { background: rgba(245,158,11,.12); color: #f59e0b; }
        .adm-badge-gray { background: rgba(107,114,128,.15); color: #9ca3af; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Brand */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(240,236,232,.06)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: '#cc0000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: '#fff', flexShrink: 0, borderRadius: 4 }}>I</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f0ece8', letterSpacing: '.06em' }}>ILUMINATEES</div>
            <div style={{ fontSize: 9, color: '#cc0000', letterSpacing: '.14em', marginTop: 1 }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          <div style={{ padding: '4px 22px 6px', fontSize: 9, letterSpacing: '.2em', color: 'rgba(240,236,232,.2)' }}>STORE</div>
          {NAV.slice(0, 5).map(({ href, label, icon, exact }) => (
            <Link key={href} href={href} className={`adm-nav-item${isActive(href, exact) ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {icon}<span>{label}</span>
            </Link>
          ))}

          <div style={{ height: 1, background: 'rgba(240,236,232,.05)', margin: '10px 20px' }} />
          <div style={{ padding: '4px 22px 6px', fontSize: 9, letterSpacing: '.2em', color: 'rgba(240,236,232,.2)' }}>MANAGE</div>
          {NAV.slice(5).map(({ href, label, icon, exact }) => (
            <Link key={href} href={href} className={`adm-nav-item${isActive(href, exact) ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {icon}<span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(240,236,232,.05)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link href="/" className="adm-nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>View Store</span>
          </Link>
          <button className="adm-nav-item" onClick={handleLogout} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", width: '100%' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN ── */}
      <div className="adm-main">
        {/* Mobile top bar */}
        <div className="adm-topbar">
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.6)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, padding: 4 }}>
            <span style={{ display: 'block', width: 18, height: 1.5, background: 'currentColor' }} />
            <span style={{ display: 'block', width: 18, height: 1.5, background: 'currentColor' }} />
            <span style={{ display: 'block', width: 12, height: 1.5, background: 'currentColor' }} />
          </button>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: '#f0ece8', letterSpacing: '.1em' }}>
            {NAV.find(n => isActive(n.href, n.exact))?.label || 'ADMIN'}
          </div>
          <Link href="/" style={{ fontSize: 9, letterSpacing: '.12em', color: 'rgba(240,236,232,.3)', textDecoration: 'none' }}>STORE ↗</Link>
        </div>

        {/* Page content */}
        {children}

        {/* Mobile bottom nav */}
        <nav className="adm-mobile-nav">
          {MOBILE_NAV.map(({ href, label, icon, exact }) => (
            <Link key={href} href={href} className={`adm-mob-item${isActive(href, exact) ? ' active' : ''}`}>
              {icon}<span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
