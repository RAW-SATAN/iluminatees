'use client';

export function ImmersiveFooter() {
  return (
    <footer style={{
      background: 'var(--blk)',
      borderTop: '1px solid rgba(240,236,232,.05)',
      padding: '20px 44px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 14, position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--r),transparent)', animation: 'fg 4s ease-in-out infinite' }} />

      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.18)', letterSpacing: '.04em' }}>© ILUMINATEES 2026</div>

      <ul style={{ display: 'flex', gap: 26, listStyle: 'none' }}>
        {['SHIPPING','RETURNS','TERMS','PRIVACY','FAQS'].map(label => (
          <li key={label}>
            <a href="#" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(240,236,232,.32)', textDecoration: 'none', transition: 'color .2s', cursor: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color='var(--w)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color='rgba(240,236,232,.32)'}
            >{label}</a>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(240,236,232,.26)', marginRight: 12 }}>FOLLOW US</span>
        {['IG','TK','YT','X'].map(s => (
          <a key={s} href="#" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(240,236,232,.4)', textDecoration: 'none', padding: '4px 8px', cursor: 'none', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color='var(--r)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color='rgba(240,236,232,.4)'}
          >{s}</a>
        ))}
      </div>
    </footer>
  );
}
