'use client';
import { useEffect, useState } from 'react';

const BUYERS = [
  { name: 'Rahul', city: 'Mumbai' },
  { name: 'Arjun', city: 'Delhi' },
  { name: 'Priya', city: 'Bangalore' },
  { name: 'Karan', city: 'Hyderabad' },
  { name: 'Ananya', city: 'Pune' },
  { name: 'Dev', city: 'Chennai' },
  { name: 'Siddharth', city: 'Kolkata' },
  { name: 'Ishaan', city: 'Jaipur' },
  { name: 'Meera', city: 'Ahmedabad' },
  { name: 'Rishi', city: 'Chandigarh' },
];

const PRODUCTS = [
  'Eye of Providence Tee',
  'Angelo Oversized Tee',
  'Cipher Drop Hoodie',
  'Apex Washed Tee',
  'Sacred Geometry Tee',
  'Washed Black Oversized',
];

const TIMES = ['just now', '2 min ago', '4 min ago', '7 min ago', '11 min ago'];

interface Toast {
  name: string;
  city: string;
  product: string;
  time: string;
}

function randomToast(): Toast {
  return {
    name: BUYERS[Math.floor(Math.random() * BUYERS.length)].name,
    city: BUYERS[Math.floor(Math.random() * BUYERS.length)].city,
    product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
    time: TIMES[Math.floor(Math.random() * TIMES.length)],
  };
}

export function SocialProofToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      setToast(randomToast());
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    };

    // First show after 8s
    const first = setTimeout(show, 8000);

    // Then every 20-28s
    let interval: ReturnType<typeof setInterval>;
    const startLoop = () => {
      interval = setInterval(() => {
        show();
      }, 20000 + Math.random() * 8000);
    };
    const loopStart = setTimeout(startLoop, 8000);

    return () => {
      clearTimeout(first);
      clearTimeout(loopStart);
      clearInterval(interval);
    };
  }, []);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: 24, zIndex: 8000,
      transform: visible ? 'translateY(0)' : 'translateY(120%)',
      opacity: visible ? 1 : 0,
      transition: 'transform .5s cubic-bezier(.22,1,.36,1), opacity .4s ease',
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'rgba(13,13,13,.96)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(204,0,0,.2)',
      padding: '12px 16px',
      maxWidth: 290,
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: 'var(--r)', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: 'var(--w)',
      }}>
        {toast.name[0]}
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, color: 'var(--w)', fontWeight: 600, lineHeight: 1.4 }}>
          {toast.name} from {toast.city}
        </div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: 'rgba(240,236,232,.5)', lineHeight: 1.4 }}>
          purchased <span style={{ color: 'var(--r)' }}>{toast.product}</span>
        </div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, color: 'rgba(240,236,232,.3)', letterSpacing: '.08em', marginTop: 2 }}>
          ✓ verified · {toast.time}
        </div>
      </div>
    </div>
  );
}
