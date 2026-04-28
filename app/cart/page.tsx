'use client';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

const IMAGES = ['/hero-model.jpg','/tee-floating.jpg','/editorial-back.jpg','/editorial-portrait.jpg','/editorial-swirl.jpg'];

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const shipping = total > 999 ? 0 : 99;

  return (
    <div style={{ background: 'var(--blk)', minHeight: '100vh', paddingTop: 100 }}>

      {/* Header */}
      <div style={{ padding: '40px 52px 32px', borderBottom: '1px solid rgba(240,236,232,.05)' }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--r)', marginBottom: 8 }}>YOUR ORDER</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(42px,6vw,80px)', color: 'var(--w)', lineHeight: 1, margin: 0 }}>YOUR CART</h1>
        {itemCount > 0 && (
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: 'rgba(240,236,232,.4)', marginTop: 8 }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
        )}
      </div>

      {itemCount === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 52px', gap: 24 }}>
          <div style={{ fontFamily: "'Rubik Dirt',cursive", fontSize: 'clamp(28px,4vw,48px)', color: 'var(--r)', textAlign: 'center' }}>YOUR CART IS EMPTY</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: 'rgba(240,236,232,.4)', textAlign: 'center' }}>Nothing here yet. Go find something worth wearing.</div>
          <Link href="/shop" style={{ background: 'var(--r)', color: 'var(--w)', fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: '.14em', padding: '14px 36px', textDecoration: 'none', marginTop: 8, transition: 'box-shadow .25s' }}>
            EXPLORE THE DROPS ↗
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0, padding: '0 52px 80px', maxWidth: 1400, margin: '0 auto' }}>

          {/* Items */}
          <div style={{ paddingRight: 48, paddingTop: 32 }}>
            {items.map((item, idx) => (
              <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid rgba(240,236,232,.06)' }}>
                <div style={{ width: 80, height: 80, flexShrink: 0, overflow: 'hidden' }}>
                  <img src={IMAGES[idx % IMAGES.length]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--w)' }}>{item.name}</div>
                    <div style={{ fontFamily: "'Rubik Dirt',cursive", fontSize: 20, color: 'var(--r)' }}>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.18em', color: 'var(--r)', border: '1px solid rgba(204,0,0,.3)', padding: '2px 8px' }}>{item.size}</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(240,236,232,.12)', marginLeft: 'auto' }}>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: 'rgba(240,236,232,.5)', cursor: 'none', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: 'var(--w)', padding: '0 12px', borderLeft: '1px solid rgba(240,236,232,.12)', borderRight: '1px solid rgba(240,236,232,.12)' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: 'rgba(240,236,232,.5)', cursor: 'none', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.size)} style={{ background: 'none', border: 'none', color: 'rgba(240,236,232,.25)', cursor: 'none', fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', marginLeft: 8 }}>✕ REMOVE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{ paddingTop: 32 }}>
            <div style={{ background: 'var(--s1)', border: '1px solid rgba(240,236,232,.06)', padding: 32, position: 'sticky', top: 100 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: 'var(--w)', letterSpacing: '.04em', marginBottom: 24 }}>ORDER SUMMARY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'rgba(240,236,232,.45)' }}>Subtotal</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'var(--w)' }}>₹ {total.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'rgba(240,236,232,.45)' }}>Shipping</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: shipping === 0 ? 'var(--r)' : 'var(--w)' }}>{shipping === 0 ? 'FREE' : `₹ ${shipping}`}</span>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(240,236,232,.06)', marginBottom: 20 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: 'var(--w)', letterSpacing: '.04em' }}>TOTAL</span>
                <span style={{ fontFamily: "'Rubik Dirt',cursive", fontSize: 28, color: 'var(--r)' }}>₹ {(total + shipping).toLocaleString('en-IN')}</span>
              </div>
              <button style={{ width: '100%', background: 'var(--r)', border: 'none', color: 'var(--w)', fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: '.1em', padding: '18px 0', cursor: 'none', transition: 'box-shadow .25s' }}>
                PROCEED TO CHECKOUT
              </button>
              <Link href="/shop" style={{ display: 'block', textAlign: 'center', fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.3)', textDecoration: 'none', marginTop: 16 }}>
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
