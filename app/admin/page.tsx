'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ORDERS_KEY } from '@/lib/admin-auth';
import { products as staticProducts } from '@/lib/products';
import { getAdminProducts } from '@/lib/store-products';

interface Order { id: string; date: string; items: {name:string;price:number;quantity:number}[]; total: number; shipping: {firstName:string;lastName:string;city:string;email:string}; status: string; payMethod: string; }

const STATUS_COLOR: Record<string,string> = { confirmed:'adm-badge-red', shipped:'adm-badge-yellow', delivered:'adm-badge-green', cancelled:'adm-badge-gray' };

function BarChart({ data }: { data: { label:string; value:number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:80, paddingTop:8 }}>
      {data.map(d => (
        <div key={d.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          <div style={{ width:'100%', background: d.value > 0 ? 'linear-gradient(to top,#cc0000,#ff4444)' : '#f1f2f4', borderRadius:'4px 4px 0 0', height:`${Math.max((d.value/max)*68,d.value>0?4:0)}px`, transition:'height .6s cubic-bezier(.22,1,.36,1)', minHeight:0 }} />
          <div style={{ fontSize:9, color:'#9ca3af', letterSpacing:'.04em' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customProds, setCustomProds] = useState(0);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')); } catch {}
    setCustomProds(getAdminProducts().length);
  }, []);

  const revenue = orders.reduce((s,o) => s+o.total, 0);
  const totalProducts = staticProducts.length + customProds;
  const pending = orders.filter(o => o.status==='confirmed').length;
  const avgOrder = orders.length ? Math.round(revenue/orders.length) : 0;

  const last7 = Array.from({length:7},(_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(6-i));
    const key = d.toDateString();
    return { label:['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()], value: orders.filter(o => new Date(o.date).toDateString()===key).reduce((s,o)=>s+o.total,0) };
  });

  const last30 = Array.from({length:30},(_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(29-i));
    const key = d.toDateString();
    return { label: i%6===0?`${d.getDate()}/${d.getMonth()+1}`:'', value: orders.filter(o => new Date(o.date).toDateString()===key).reduce((s,o)=>s+o.total,0) };
  });

  return (
    <>
      {/* Greeting */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:22, fontWeight:700, color:'#1a1a1a', marginBottom:2 }}>Overview</div>
        <div style={{ fontSize:13, color:'#9ca3af' }}>Your store performance at a glance</div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { label:'Add product', href:'/admin/products/new', primary:true },
          { label:'View orders', href:'/admin/orders', primary:false },
          { label:'Manage discounts', href:'/admin/discounts', primary:false },
        ].map(a => (
          <Link key={a.label} href={a.href} className={a.primary ? 'adm-btn-primary' : 'adm-btn-secondary'} style={{ textDecoration:'none', fontSize:12, padding:'8px 16px' }}>{a.label}</Link>
        ))}
      </div>

      {/* Stats */}
      <div className="adm-stat-grid">
        {[
          { label:'Total Sales',    value:`₹${revenue.toLocaleString('en-IN')}`,  sub:`${orders.length} orders total` },
          { label:'Orders Pending', value:String(pending),                         sub:'need to be fulfilled', alert:pending>0 },
          { label:'Products',       value:String(totalProducts),                   sub:'across 3 collections' },
          { label:'Avg. Order',     value:`₹${avgOrder.toLocaleString('en-IN')}`, sub:'per transaction' },
        ].map(s => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-label">{s.label}</div>
            <div className="adm-stat-value" style={{ color: (s as {alert?:boolean}).alert ? '#cc0000' : '#1a1a1a' }}>{s.value}</div>
            <div className="adm-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:12, marginBottom:12 }}>
        <div className="adm-card">
          <div className="adm-card-header">
            <div className="adm-card-title">Revenue — Last 30 days</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#cc0000' }}>₹{last30.reduce((s,d)=>s+d.value,0).toLocaleString('en-IN')}</div>
          </div>
          <div style={{ padding:'12px 20px 16px' }}>
            {orders.length===0 ? <div style={{ height:80, display:'flex', alignItems:'center', justifyContent:'center', color:'#d1d5db', fontSize:13 }}>No orders yet</div> : <BarChart data={last30} />}
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header"><div className="adm-card-title">This week</div></div>
          <div style={{ padding:'12px 20px 16px' }}>
            <BarChart data={last7} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14 }}>
              {[
                { label:'Delivered', count:orders.filter(o=>o.status==='delivered').length, color:'#16a34a' },
                { label:'Cancelled', count:orders.filter(o=>o.status==='cancelled').length, color:'#cc0000' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center', padding:'10px', background:'#fafafa', borderRadius:8 }}>
                  <div style={{ fontSize:18, fontWeight:700, color:s.color }}>{s.count}</div>
                  <div style={{ fontSize:10, color:'#9ca3af', letterSpacing:'.06em', textTransform:'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders + top products */}
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:12 }}>
        <div className="adm-card" style={{ overflow:'hidden' }}>
          <div className="adm-card-header">
            <div className="adm-card-title">Recent orders</div>
            <Link href="/admin/orders" style={{ fontSize:12, color:'#cc0000', textDecoration:'none', fontWeight:500 }}>View all →</Link>
          </div>
          {orders.length===0 ? (
            <div style={{ padding:'40px 20px', textAlign:'center', color:'#d1d5db', fontSize:13 }}>No orders yet</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="adm-table">
                <thead><tr><th className="adm-th">Order</th><th className="adm-th">Customer</th><th className="adm-th">Total</th><th className="adm-th">Status</th></tr></thead>
                <tbody>
                  {orders.slice(0,6).map(o => (
                    <tr key={o.id} className="adm-tr">
                      <td className="adm-td"><span style={{ color:'#cc0000', fontWeight:700, fontSize:12 }}>{o.id}</span></td>
                      <td className="adm-td" style={{ fontSize:12 }}>{o.shipping.firstName} {o.shipping.lastName}</td>
                      <td className="adm-td" style={{ fontWeight:600 }}>₹{o.total.toLocaleString('en-IN')}</td>
                      <td className="adm-td"><span className={`adm-badge ${STATUS_COLOR[o.status]||'adm-badge-gray'}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="adm-card" style={{ overflow:'hidden' }}>
          <div className="adm-card-header">
            <div className="adm-card-title">Top products</div>
            <Link href="/admin/products" style={{ fontSize:12, color:'#cc0000', textDecoration:'none', fontWeight:500 }}>Manage →</Link>
          </div>
          {staticProducts.slice(0,5).map((p,i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 20px', borderBottom:i<4?'1px solid #f9fafb':'none' }}>
              <div style={{ width:34, height:34, background:p.shirtColor, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:p.accentColor, flexShrink:0 }}>◈</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                <div style={{ fontSize:10, color:'#9ca3af' }}>{p.category}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:'#cc0000', flexShrink:0 }}>₹{p.price.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .adm-stat-grid{grid-template-columns:1fr 1fr!important} }
        @media(max-width:640px){ div[style*="grid-template-columns:'1.4fr 1fr'"]{grid-template-columns:1fr!important} div[style*="grid-template-columns:'1.3fr 1fr'"]{grid-template-columns:1fr!important} }
      `}</style>
    </>
  );
}
