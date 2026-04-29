'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';

type Step = 'info' | 'payment' | 'confirm';
type PayMethod = 'card' | 'upi' | 'cod';

interface ShippingInfo {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; state: string; pin: string;
}

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('info');
  const [payMethod, setPayMethod] = useState<PayMethod>('upi');
  const [orderNum] = useState(() => 'ILM' + Math.floor(100000 + Math.random() * 900000));
  const [info, setInfo] = useState<ShippingInfo>({ firstName:'', lastName:'', email:'', phone:'', address:'', city:'', state:'Maharashtra', pin:'' });
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ num:'', name:'', exp:'', cvv:'' });
  const [loading, setLoading] = useState(false);

  const shipping = total > 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const set = (k: keyof ShippingInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setInfo(p => ({ ...p, [k]: e.target.value }));

  const infoValid = info.firstName && info.lastName && info.email && info.phone && info.address && info.city && info.pin.length === 6;

  const handlePay = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('ilum_orders') || '[]');
      orders.unshift({
        id: orderNum,
        date: new Date().toISOString(),
        items: [...items],
        total: grandTotal,
        shipping: info,
        payMethod,
        status: 'confirmed',
      });
      localStorage.setItem('ilum_orders', JSON.stringify(orders));
      clearCart();
      setLoading(false);
      setStep('confirm');
    }, 1800);
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <div style={{ background: 'var(--blk)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: 'var(--r)' }}>CART IS EMPTY</div>
        <Link href="/shop" style={{ background: 'var(--r)', color: 'var(--w)', fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: '.14em', padding: '14px 36px', textDecoration: 'none' }}>SHOP NOW</Link>
      </div>
    );
  }

  // ── ORDER CONFIRMED ─────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div style={{ background: 'var(--blk)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 24, animation: 'pulse 2s ease-in-out infinite' }}>✓</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.3em', color: 'var(--r)', marginBottom: 12 }}>ORDER CONFIRMED</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(42px,7vw,80px)', color: 'var(--w)', lineHeight: .9, marginBottom: 16 }}>THANK YOU<br/>FOR YOUR ORDER</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: 'rgba(240,236,232,.45)', marginBottom: 8 }}>
          Order <span style={{ color: 'var(--w)', fontWeight: 600 }}>{orderNum}</span> has been placed
        </div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'rgba(240,236,232,.3)', marginBottom: 36 }}>
          Confirmation sent to <span style={{ color: 'rgba(240,236,232,.6)' }}>{info.email || 'your email'}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/shop" style={{ background: 'var(--r)', color: 'var(--w)', fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: '.12em', padding: '14px 32px', textDecoration: 'none' }}>KEEP SHOPPING</Link>
          <Link href="/" style={{ background: 'none', border: '1px solid rgba(240,236,232,.15)', color: 'rgba(240,236,232,.5)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.14em', padding: '14px 28px', textDecoration: 'none' }}>HOME</Link>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(240,236,232,.04)', border: '1px solid rgba(240,236,232,.1)',
    color: 'var(--w)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13,
    padding: '12px 14px', outline: 'none', width: '100%', transition: 'border-color .2s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: '.18em',
    textTransform: 'uppercase', color: 'rgba(240,236,232,.45)', marginBottom: 6, display: 'block',
  };

  return (
    <div style={{ background: 'var(--blk)', minHeight: '100vh', paddingTop: 68 }}>
      <style>{`
        .co-wrap { display: grid; grid-template-columns: 1fr 380px; min-height: calc(100vh - 68px); }
        .co-form { padding: 48px 52px; border-right: 1px solid rgba(240,236,232,.05); }
        .co-summary { padding: 48px 32px; background: var(--s1); }
        .co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 900px) {
          .co-wrap { grid-template-columns: 1fr; }
          .co-summary { border-top: 1px solid rgba(240,236,232,.05); order: -1; padding: 24px 20px; }
          .co-form { padding: 32px 20px; border-right: none; }
          .co-row { grid-template-columns: 1fr; }
        }
        .co-input:focus { border-color: rgba(204,0,0,.5) !important; }
        .pay-opt { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border: 1px solid rgba(240,236,232,.1); cursor: pointer; transition: border-color .2s, background .2s; margin-bottom: 8px; }
        .pay-opt.active { border-color: rgba(204,0,0,.5); background: rgba(204,0,0,.05); }
      `}</style>

      {/* Steps indicator */}
      <div style={{ background: 'var(--s1)', borderBottom: '1px solid rgba(240,236,232,.05)', padding: '0 52px', display: 'flex', alignItems: 'center', gap: 0 }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: '.1em', color: 'var(--w)', textDecoration: 'none', padding: '14px 0', marginRight: 32 }}>
          ILUMINATEES<sup style={{ color: 'var(--r)', fontSize: 8, fontFamily: "'Space Grotesk',sans-serif" }}>®</sup>
        </Link>
        {(['info','payment'] as Step[]).map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ padding: '14px 16px', fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: step === s ? 'var(--w)' : 'rgba(240,236,232,.3)', borderBottom: step === s ? '2px solid var(--r)' : '2px solid transparent', transition: 'color .2s, border-color .2s' }}>
              <span style={{ color: step === s ? 'var(--r)' : 'rgba(240,236,232,.2)', marginRight: 8 }}>{i+1}</span>{s === 'info' ? 'Information' : 'Payment'}
            </div>
            {i === 0 && <span style={{ color: 'rgba(240,236,232,.2)', margin: '0 4px', fontSize: 12 }}>›</span>}
          </div>
        ))}
      </div>

      <div className="co-wrap">
        {/* LEFT — form */}
        <div className="co-form">
          {step === 'info' && (
            <>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: 'var(--w)', letterSpacing: '.04em', marginBottom: 28 }}>CONTACT & SHIPPING</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="co-row">
                  <div><label style={labelStyle}>First Name</label><input className="co-input" style={inputStyle} value={info.firstName} onChange={set('firstName')} /></div>
                  <div><label style={labelStyle}>Last Name</label><input className="co-input" style={inputStyle} value={info.lastName} onChange={set('lastName')} /></div>
                </div>
                <div className="co-row">
                  <div><label style={labelStyle}>Email</label><input className="co-input" type="email" style={inputStyle} value={info.email} onChange={set('email')} /></div>
                  <div><label style={labelStyle}>Phone</label><input className="co-input" type="tel" style={inputStyle} value={info.phone} onChange={set('phone')} placeholder="+91" /></div>
                </div>
                <div><label style={labelStyle}>Address</label><input className="co-input" style={inputStyle} value={info.address} onChange={set('address')} /></div>
                <div className="co-row">
                  <div><label style={labelStyle}>City</label><input className="co-input" style={inputStyle} value={info.city} onChange={set('city')} /></div>
                  <div><label style={labelStyle}>PIN Code</label><input className="co-input" style={inputStyle} value={info.pin} onChange={set('pin')} maxLength={6} /></div>
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <select className="co-input" style={{ ...inputStyle, cursor: 'pointer' }} value={info.state} onChange={set('state')}>
                    {STATES.map(s => <option key={s} value={s} style={{ background: '#0d0d0d' }}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={() => infoValid && setStep('payment')}
                disabled={!infoValid}
                style={{ width: '100%', marginTop: 28, background: infoValid ? 'var(--r)' : 'rgba(204,0,0,.3)', border: 'none', color: 'var(--w)', fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: '.1em', padding: '18px 0', cursor: infoValid ? 'pointer' : 'default', transition: 'background .25s, box-shadow .25s' }}
                onMouseEnter={e => infoValid && ((e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 32px rgba(204,0,0,.4)')}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow='none'}
              >
                CONTINUE TO PAYMENT →
              </button>

              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <Link href="/cart" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.1em', color: 'rgba(240,236,232,.3)', textDecoration: 'none' }}>← Return to Cart</Link>
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                  {['🔒 Secure','📦 Free Ship >₹999','↩ Easy Returns'].map(b => (
                    <span key={b} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.25)' }}>{b}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'payment' && (
            <>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: 'var(--w)', letterSpacing: '.04em', marginBottom: 28 }}>PAYMENT</div>

              {/* UPI */}
              <div className={`pay-opt${payMethod === 'upi' ? ' active' : ''}`} onClick={() => setPayMethod('upi')}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: payMethod === 'upi' ? 'var(--r)' : 'rgba(240,236,232,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {payMethod === 'upi' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--r)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--w)' }}>UPI / QR</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.35)' }}>GPay, PhonePe, Paytm, BHIM</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: 'var(--r)' }}>₹</div>
              </div>
              {payMethod === 'upi' && (
                <div style={{ marginBottom: 12, padding: '0 0 12px 32px' }}>
                  <label style={labelStyle}>UPI ID</label>
                  <input className="co-input" style={inputStyle} placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>
              )}

              {/* Card */}
              <div className={`pay-opt${payMethod === 'card' ? ' active' : ''}`} onClick={() => setPayMethod('card')}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: payMethod === 'card' ? 'var(--r)' : 'rgba(240,236,232,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {payMethod === 'card' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--r)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--w)' }}>Credit / Debit Card</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.35)' }}>Visa, Mastercard, RuPay</div>
                </div>
                <span style={{ fontSize: 16 }}>💳</span>
              </div>
              {payMethod === 'card' && (
                <div style={{ marginBottom: 12, padding: '0 0 12px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={labelStyle}>Card Number</label><input className="co-input" style={inputStyle} placeholder="1234 5678 9012 3456" value={card.num} onChange={e => setCard(c => ({ ...c, num: e.target.value }))} /></div>
                  <div><label style={labelStyle}>Cardholder Name</label><input className="co-input" style={inputStyle} value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div><label style={labelStyle}>Expiry (MM/YY)</label><input className="co-input" style={inputStyle} placeholder="09/28" value={card.exp} onChange={e => setCard(c => ({ ...c, exp: e.target.value }))} /></div>
                    <div><label style={labelStyle}>CVV</label><input className="co-input" style={inputStyle} type="password" maxLength={4} value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} /></div>
                  </div>
                </div>
              )}

              {/* COD */}
              <div className={`pay-opt${payMethod === 'cod' ? ' active' : ''}`} onClick={() => setPayMethod('cod')}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: payMethod === 'cod' ? 'var(--r)' : 'rgba(240,236,232,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {payMethod === 'cod' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--r)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--w)' }}>Cash on Delivery</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.35)' }}>Pay when your order arrives</div>
                </div>
                <span style={{ fontSize: 16 }}>💵</span>
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                style={{ width: '100%', marginTop: 24, background: loading ? 'rgba(204,0,0,.5)' : 'var(--r)', border: 'none', color: 'var(--w)', fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: '.1em', padding: '18px 0', cursor: loading ? 'default' : 'pointer', transition: 'box-shadow .25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 32px rgba(204,0,0,.4)')}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow='none'}
              >
                {loading ? (
                  <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'var(--w)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> PROCESSING…</>
                ) : `PAY ₹ ${grandTotal.toLocaleString('en-IN')} →`}
              </button>

              <button onClick={() => setStep('info')} style={{ background: 'none', border: 'none', fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, letterSpacing: '.1em', color: 'rgba(240,236,232,.3)', marginTop: 16, cursor: 'pointer', padding: 0 }}>← Back to Information</button>
            </>
          )}
        </div>

        {/* RIGHT — order summary */}
        <div className="co-summary">
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: 'var(--w)', letterSpacing: '.04em', marginBottom: 20 }}>ORDER SUMMARY</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {items.map(item => (
              <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, background: item.shirtColor || 'var(--s2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'rgba(240,236,232,.1)', position: 'relative' }}>
                  ◈
                  <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--r)', color: 'var(--w)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600, color: 'var(--w)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.35)' }}>Size: {item.size}</div>
                </div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'var(--w)', fontWeight: 600, flexShrink: 0 }}>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(240,236,232,.06)', marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'rgba(240,236,232,.4)' }}>Subtotal</span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'var(--w)' }}>₹ {total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: 'rgba(240,236,232,.4)' }}>Shipping</span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: shipping === 0 ? 'var(--r)' : 'var(--w)' }}>{shipping === 0 ? 'FREE' : `₹ ${shipping}`}</span>
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(240,236,232,.06)', marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: 'var(--w)', letterSpacing: '.04em' }}>TOTAL</span>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: 'var(--r)' }}>₹ {grandTotal.toLocaleString('en-IN')}</span>
          </div>

          {total > 999 && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(204,0,0,.08)', border: '1px solid rgba(204,0,0,.15)' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'var(--r)', letterSpacing: '.1em' }}>🎉 FREE SHIPPING UNLOCKED</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
