'use client';
import { useEffect, useState } from 'react';
import { SETTINGS_KEY } from '@/lib/admin-auth';

interface Settings {
  storeName: string; storeEmail: string; storePhone: string;
  storeAddress: string; storeCity: string; storeState: string; storePin: string;
  currency: string; freeShippingThreshold: number; defaultShipping: number;
  instagramUrl: string; tiktokUrl: string; youtubeUrl: string; twitterUrl: string;
  metaTitle: string; metaDescription: string;
  razorpayKey: string; upiId: string;
  notifyEmail: string; orderNotifications: boolean; lowStockAlert: boolean;
  maintenanceMode: boolean;
}

const DEFAULTS: Settings = {
  storeName: 'ILUMINATEES', storeEmail: 'hello@iluminatees.com', storePhone: '+91 9999999999',
  storeAddress: '404 Streetwear Lane', storeCity: 'Mumbai', storeState: 'Maharashtra', storePin: '400001',
  currency: 'INR', freeShippingThreshold: 999, defaultShipping: 99,
  instagramUrl: '', tiktokUrl: '', youtubeUrl: '', twitterUrl: '',
  metaTitle: 'ILUMINATEES® — Not Made To Fit In', metaDescription: 'Dark brutalist luxury streetwear. Limited drops.',
  razorpayKey: '', upiId: '',
  notifyEmail: '', orderNotifications: true, lowStockAlert: true, maintenanceMode: false,
};

type Section = 'general' | 'shipping' | 'social' | 'seo' | 'payments' | 'notifications';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<Section>('general');

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
      if (s) setSettings({ ...DEFAULTS, ...s });
    } catch {}
  }, []);

  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings(p => ({ ...p, [k]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(240,236,232,.04)', border: '1px solid rgba(240,236,232,.1)', color: '#f0ece8', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, padding: '10px 12px', outline: 'none', borderRadius: 4, transition: 'border-color .2s' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,236,232,.4)', marginBottom: 6 };
  const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };

  const SECTIONS: { id: Section; label: string }[] = [
    { id: 'general',       label: 'General' },
    { id: 'shipping',      label: 'Shipping' },
    { id: 'payments',      label: 'Payments' },
    { id: 'social',        label: 'Social Media' },
    { id: 'seo',           label: 'SEO' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="adm-page" style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ece8', marginBottom: 4 }}>Settings</div>
          <div style={{ fontSize: 12, color: 'rgba(240,236,232,.35)' }}>Configure your store</div>
        </div>
        <button onClick={handleSave} className="adm-btn-red" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(240,236,232,.06)', marginBottom: 24, overflowX: 'auto' }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{ background: 'none', border: 'none', borderBottom: `2px solid ${section === s.id ? '#cc0000' : 'transparent'}`, color: section === s.id ? '#f0ece8' : 'rgba(240,236,232,.4)', fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, padding: '10px 20px', cursor: 'pointer', transition: 'color .2s', whiteSpace: 'nowrap' }}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="adm-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {section === 'general' && <>
          <div style={row}>
            <div><label style={lbl}>Store Name</label><input style={inp} value={settings.storeName} onChange={set('storeName')} /></div>
            <div><label style={lbl}>Contact Email</label><input style={inp} type="email" value={settings.storeEmail} onChange={set('storeEmail')} /></div>
          </div>
          <div style={row}>
            <div><label style={lbl}>Phone</label><input style={inp} value={settings.storePhone} onChange={set('storePhone')} /></div>
            <div><label style={lbl}>Currency</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={settings.currency} onChange={set('currency')}>
                <option value="INR">INR — Indian Rupee (₹)</option>
                <option value="USD">USD — US Dollar ($)</option>
              </select>
            </div>
          </div>
          <div><label style={lbl}>Store Address</label><input style={inp} value={settings.storeAddress} onChange={set('storeAddress')} /></div>
          <div style={row}>
            <div><label style={lbl}>City</label><input style={inp} value={settings.storeCity} onChange={set('storeCity')} /></div>
            <div><label style={lbl}>PIN Code</label><input style={inp} value={settings.storePin} onChange={set('storePin')} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(204,0,0,.06)', border: '1px solid rgba(204,0,0,.15)', borderRadius: 6 }}>
            <input type="checkbox" checked={settings.maintenanceMode} onChange={set('maintenanceMode')} id="maint" style={{ cursor: 'pointer', accentColor: '#cc0000', width: 16, height: 16 }} />
            <label htmlFor="maint" style={{ fontSize: 13, color: '#f0ece8', cursor: 'pointer' }}>Maintenance Mode <span style={{ fontSize: 11, color: '#cc0000' }}>(store will be hidden)</span></label>
          </div>
        </>}

        {section === 'shipping' && <>
          <div style={row}>
            <div>
              <label style={lbl}>Free Shipping Threshold (₹)</label>
              <input style={inp} type="number" value={settings.freeShippingThreshold} onChange={set('freeShippingThreshold')} />
              <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)', marginTop: 5 }}>Orders above this get free shipping</div>
            </div>
            <div>
              <label style={lbl}>Default Shipping Rate (₹)</label>
              <input style={inp} type="number" value={settings.defaultShipping} onChange={set('defaultShipping')} />
            </div>
          </div>
          <div style={{ padding: '14px 16px', background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.15)', borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 4 }}>✓ Current shipping setup</div>
            <div style={{ fontSize: 12, color: 'rgba(240,236,232,.5)' }}>Free for orders above ₹{settings.freeShippingThreshold} · ₹{settings.defaultShipping} flat rate below</div>
          </div>
        </>}

        {section === 'payments' && <>
          <div>
            <label style={lbl}>UPI ID</label>
            <input style={inp} value={settings.upiId} onChange={set('upiId')} placeholder="yourstore@upi" />
            <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)', marginTop: 5 }}>Shown to customers during UPI checkout</div>
          </div>
          <div>
            <label style={lbl}>Razorpay Key ID <span style={{ color: 'rgba(240,236,232,.25)', fontSize: 9, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label>
            <input style={inp} value={settings.razorpayKey} onChange={set('razorpayKey')} placeholder="rzp_live_xxxxxxxxxx" />
          </div>
          <div style={{ padding: '14px 16px', background: 'rgba(240,236,232,.03)', border: '1px solid rgba(240,236,232,.08)', borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#f0ece8', marginBottom: 6 }}>Accepted Payment Methods</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map(m => (
                <span key={m} style={{ fontSize: 10, padding: '4px 10px', background: 'rgba(34,197,94,.12)', color: '#22c55e', borderRadius: 4, letterSpacing: '.06em' }}>✓ {m}</span>
              ))}
            </div>
          </div>
        </>}

        {section === 'social' && <>
          {[
            { key: 'instagramUrl' as keyof Settings, label: 'Instagram URL', placeholder: 'https://instagram.com/iluminatees' },
            { key: 'tiktokUrl' as keyof Settings, label: 'TikTok URL', placeholder: 'https://tiktok.com/@iluminatees' },
            { key: 'youtubeUrl' as keyof Settings, label: 'YouTube URL', placeholder: 'https://youtube.com/@iluminatees' },
            { key: 'twitterUrl' as keyof Settings, label: 'Twitter/X URL', placeholder: 'https://x.com/iluminatees' },
          ].map(f => (
            <div key={f.key}>
              <label style={lbl}>{f.label}</label>
              <input style={inp} value={String(settings[f.key])} onChange={set(f.key)} placeholder={f.placeholder} />
            </div>
          ))}
        </>}

        {section === 'seo' && <>
          <div>
            <label style={lbl}>Meta Title</label>
            <input style={inp} value={settings.metaTitle} onChange={set('metaTitle')} />
            <div style={{ fontSize: 10, color: 'rgba(240,236,232,.3)', marginTop: 5 }}>{settings.metaTitle.length}/60 characters</div>
          </div>
          <div>
            <label style={lbl}>Meta Description</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: 80, fontFamily: "'Space Grotesk',sans-serif" }} value={settings.metaDescription} onChange={set('metaDescription')} />
            <div style={{ fontSize: 10, color: settings.metaDescription.length > 160 ? '#cc0000' : 'rgba(240,236,232,.3)', marginTop: 5 }}>{settings.metaDescription.length}/160 characters</div>
          </div>
          {/* Preview */}
          <div style={{ padding: '16px', background: 'rgba(240,236,232,.03)', border: '1px solid rgba(240,236,232,.08)', borderRadius: 6 }}>
            <div style={{ fontSize: 9, letterSpacing: '.14em', color: 'rgba(240,236,232,.3)', marginBottom: 8, textTransform: 'uppercase' }}>Google Preview</div>
            <div style={{ fontSize: 14, color: '#4a9eff' }}>{settings.metaTitle || 'Page Title'}</div>
            <div style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>iluminatees.com</div>
            <div style={{ fontSize: 11, color: 'rgba(240,236,232,.4)', marginTop: 4, lineHeight: 1.5 }}>{settings.metaDescription || 'Meta description...'}</div>
          </div>
        </>}

        {section === 'notifications' && <>
          <div>
            <label style={lbl}>Notification Email</label>
            <input style={inp} type="email" value={settings.notifyEmail} onChange={set('notifyEmail')} placeholder="admin@youremail.com" />
          </div>
          {[
            { key: 'orderNotifications' as keyof Settings, label: 'New order notifications', sub: 'Get notified when a new order is placed' },
            { key: 'lowStockAlert' as keyof Settings, label: 'Low stock alerts', sub: 'Get notified when product stock is low' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: 'rgba(240,236,232,.03)', border: '1px solid rgba(240,236,232,.08)', borderRadius: 6, cursor: 'pointer' }}
              onClick={() => setSettings(p => ({ ...p, [item.key]: !p[item.key] }))}>
              <input type="checkbox" checked={Boolean(settings[item.key])} onChange={set(item.key)} onClick={e => e.stopPropagation()} style={{ marginTop: 2, cursor: 'pointer', accentColor: '#cc0000', width: 15, height: 15, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, color: '#f0ece8', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(240,236,232,.35)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </>}
      </div>

      {/* Save button bottom */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={handleSave} className="adm-btn-red" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
