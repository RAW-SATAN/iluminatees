'use client';
import { useEffect, useState } from 'react';

export function Loader() {
  const [out, setOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOut(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`loader${out ? ' out' : ''}`}>
      <div className="ld-logo">ILUMI<b>N</b>ATEES<sup style={{fontSize:9,verticalAlign:'super',color:'var(--r)',fontFamily:"'Space Grotesk',sans-serif"}}>®</sup></div>
      <div className="ld-bar-w"><div className="ld-bar" /></div>
      <div className="ld-txt">SS26 · DROP 001 · LOADING</div>
    </div>
  );
}
