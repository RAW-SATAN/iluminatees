'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: '▦' },
  { href: '/admin/orders',   label: 'Orders',     icon: '📦' },
  { href: '/admin/products', label: 'Products',   icon: '👕' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="admin-cursor-reset" style={{ display: 'flex', minHeight: '100vh', background: '#080808', fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        .admin-sidebar { width: 220px; background: #0a0a0a; border-right: 1px solid rgba(240,236,232,.06); display: flex; flex-direction: column; flex-shrink: 0; }
        .admin-main { flex: 1; overflow-x: hidden; }
        @media (max-width: 768px) {
          .admin-sidebar { width: 56px; }
          .admin-nav-label { display: none; }
          .admin-brand-text { display: none; }
        }
      `}</style>

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(240,236,232,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#cc0000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: "'Bebas Neue',sans-serif", color: '#fff', flexShrink: 0 }}>I</div>
          <div className="admin-brand-text">
            <div style={{ fontSize: 11, fontWeight: 600, color: '#f0ece8', letterSpacing: '.08em' }}>ILUMINATEES</div>
            <div style={{ fontSize: 9, color: 'rgba(240,236,232,.3)', letterSpacing: '.12em' }}>ADMIN</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/admin' ? path === '/admin' : path.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 6, textDecoration: 'none', transition: 'background .2s',
                background: active ? 'rgba(204,0,0,.12)' : 'transparent',
                color: active ? '#cc0000' : 'rgba(240,236,232,.5)',
                fontSize: 10, letterSpacing: '.1em',
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                <span className="admin-nav-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px 18px', borderTop: '1px solid rgba(240,236,232,.05)' }}>
          <Link href="/" style={{ fontSize: 9, letterSpacing: '.14em', color: 'rgba(240,236,232,.25)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>←</span><span className="admin-nav-label">Back to Store</span>
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="admin-main">{children}</div>
    </div>
  );
}
