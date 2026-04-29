'use client';
import { useEffect, useState, useRef } from 'react';

const SESSION_KEY = 'ilum_exit_shown';

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    triggered.current = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    setOpen(true);
  };

  useEffect(() => {
    // Desktop: mouse leaves top of viewport
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 8) trigger();
    };

    // Mobile: 45s timer
    const mobileTimer = setTimeout(() => {
      if (window.innerWidth < 768) trigger();
    }, 45000);

    document.addEventListener('mouseout', onMouseOut);
    return () => {
      document.removeEventListener('mouseout', onMouseOut);
      clearTimeout(mobileTimer);
    };
  }, []);

  const close = () => setOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText('ILUM10').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fu .35s ease forwards',
    }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div style={{
        position: 'relative',
        background: 'var(--s1)',
        border: '1px solid rgba(204,0,0,.2)',
        maxWidth: 520, width: '100%',
        padding: '48px 44px 40px',
        animation: 'popUp .45s cubic-bezier(.22,1,.36,1) forwards',
      }}>
        {/* close */}
        <button onClick={close} style={{
          position: 'absolute', top: 16, right: 18,
          background: 'none', border: 'none', color: 'rgba(240,236,232,.3)',
          fontSize: 20, cursor: 'pointer', lineHeight: 1,
          transition: 'color .2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--w)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,236,232,.3)')}
        >✕</button>

        {/* red accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--r)' }} />

        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--r)', marginBottom: 10 }}>
          WAIT — DON&apos;T GO
        </div>

        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(38px,6vw,64px)', color: 'var(--w)', lineHeight: .92, marginBottom: 16 }}>
          HERE&apos;S<br />
          <span style={{ color: 'var(--r)' }}>10% OFF</span><br />
          YOUR ORDER
        </div>

        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: 'rgba(240,236,232,.5)', lineHeight: 1.7, marginBottom: 28 }}>
          Enter your email and we&apos;ll send the drop news first — plus <span style={{ color: 'var(--w)' }}>exclusive early access</span> to every new release.
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: 'var(--r)', marginBottom: 10 }}>CODE UNLOCKED</div>
            <div
              onClick={copyCode}
              style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 34,
                color: 'var(--w)', letterSpacing: '.18em',
                border: '1px dashed rgba(204,0,0,.4)',
                padding: '14px 28px', display: 'inline-block',
                cursor: 'pointer', transition: 'border-color .2s',
              }}
            >
              {copied ? 'COPIED ✓' : 'ILUM10'}
            </div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.3)', letterSpacing: '.12em', marginTop: 10 }}>
              Click to copy · Valid for 48 hours
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1, background: 'rgba(240,236,232,.04)',
                border: '1px solid rgba(240,236,232,.12)',
                borderRight: 'none',
                color: 'var(--w)', padding: '14px 16px',
                fontFamily: "'Space Grotesk',sans-serif", fontSize: 13,
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(204,0,0,.5)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(240,236,232,.12)')}
            />
            <button type="submit" style={{
              background: 'var(--r)', border: 'none', color: 'var(--w)',
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 15,
              letterSpacing: '.12em', padding: '14px 22px',
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'box-shadow .25s',
            }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 28px rgba(204,0,0,.45)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              GET CODE ↗
            </button>
          </form>
        )}

        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, color: 'rgba(240,236,232,.2)', letterSpacing: '.1em', marginTop: 16, textAlign: 'center' }}>
          No spam. Unsubscribe anytime. One use per customer.
        </div>
      </div>

      <style>{`
        @keyframes popUp {
          from { opacity:0; transform: scale(.92) translateY(20px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
