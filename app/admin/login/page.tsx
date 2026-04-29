'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/admin-auth';

export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(pw)) {
        router.replace('/admin');
      } else {
        setError('Incorrect password. Try again.');
        setLoading(false);
        setPw('');
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', width: 48, height: 48, background: '#cc0000', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#fff', marginBottom: 16 }}>I</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: '#f0ece8', letterSpacing: '.12em' }}>ILUMINATEES ADMIN</div>
          <div style={{ fontSize: 11, color: 'rgba(240,236,232,.3)', letterSpacing: '.1em', marginTop: 4 }}>Store Management</div>
        </div>

        {/* Card */}
        <div style={{ background: '#0d0d0d', border: '1px solid rgba(240,236,232,.08)', padding: '36px 32px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f0ece8', marginBottom: 6 }}>Sign in</div>
          <div style={{ fontSize: 11, color: 'rgba(240,236,232,.35)', marginBottom: 28 }}>Enter your admin password to continue</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(240,236,232,.4)', marginBottom: 7 }}>Password</label>
              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                autoFocus
                style={{ width: '100%', background: 'rgba(240,236,232,.04)', border: `1px solid ${error ? '#cc0000' : 'rgba(240,236,232,.1)'}`, color: '#f0ece8', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, padding: '12px 14px', outline: 'none', transition: 'border-color .2s' }}
                onFocus={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(204,0,0,.4)'; }}
                onBlur={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(240,236,232,.1)'; }}
                placeholder="••••••••••••"
              />
              {error && <div style={{ fontSize: 11, color: '#cc0000', marginTop: 6 }}>{error}</div>}
            </div>

            <button
              type="submit"
              disabled={loading || !pw}
              style={{ width: '100%', background: pw && !loading ? '#cc0000' : 'rgba(204,0,0,.3)', border: 'none', color: '#fff', fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: '.12em', padding: '14px 0', cursor: pw && !loading ? 'pointer' : 'default', transition: 'background .25s, box-shadow .25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              onMouseEnter={e => pw && !loading && ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(204,0,0,.35)')}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'}
            >
              {loading ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> SIGNING IN</> : 'SIGN IN →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ fontSize: 10, color: 'rgba(240,236,232,.2)', textDecoration: 'none', letterSpacing: '.1em' }}>← Back to store</a>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
