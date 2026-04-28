"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Play, Plus } from "lucide-react";

/* ─── Manual character split (no Club SplitText needed) ─── */
function splitToChars(el: HTMLElement) {
  const text = el.textContent || "";
  el.innerHTML = [...text]
    .map((c) =>
      c === " "
        ? `<span class="char-wrap" style="display:inline-block;width:0.28em"> </span>`
        : `<span class="char-wrap"><span class="char-inner">${c}</span></span>`
    )
    .join("");
  return [...el.querySelectorAll<HTMLElement>(".char-inner")];
}

/* ─── WebGL Smoke Shader ─────────────────────────────────── */
function initWebGL(canvas: HTMLCanvasElement) {
  const vert = `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `;
  const frag = `
    precision highp float;
    uniform float uTime;
    varying vec2 vUv;

    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }
    float fbm(vec2 p){
      float v=0.,a=0.5;
      for(int i=0;i<6;i++){ v+=a*noise(p); p=p*2.+vec2(1.5,3.7); a*=0.5; }
      return v;
    }
    void main(){
      vec2 uv=vUv;
      float t=uTime*0.07;
      vec2 q=vec2(fbm(uv+vec2(0.,t*.5)),fbm(uv+vec2(3.1,5.3)));
      vec2 r=vec2(fbm(uv+q+vec2(1.7,9.2)+t*.15),fbm(uv+q+vec2(8.3,2.8)+t*.126));
      float f=fbm(uv*2.+r);
      vec3 col=mix(vec3(0.),vec3(0.78,0.01,0.04),clamp(f*f*2.,0.,1.));
      col=mix(col,vec3(0.4,0.,0.01),clamp(length(q),0.,1.));
      col=mix(col,vec3(0.9,0.04,0.07),clamp(r.x*r.y*2.5,0.,1.));
      float alpha=(f*f*f+0.6*f*f+0.5*f)*0.38;
      alpha*=smoothstep(0.0,0.3,uv.x);
      alpha*=(1.-smoothstep(0.85,1.,uv.x));
      alpha*=(1.-smoothstep(0.85,1.,uv.y))*(1.-smoothstep(0.,0.05,1.-uv.y));
      gl_FragColor=vec4(col,alpha);
    }
  `;

  let THREE: typeof import("three") | null = null;
  let renderer: import("three").WebGLRenderer | null = null;
  let animId: number;

  import("three").then((T) => {
    THREE = T;
    const scene    = new T.Scene();
    const camera   = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const material = new T.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
    });

    const geo  = new T.PlaneGeometry(2, 2);
    const mesh = new T.Mesh(geo, material);
    scene.add(mesh);

    const clock = new T.Clock();
    const render = () => {
      animId = requestAnimationFrame(render);
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer!.render(scene, camera);
    };
    render();

    const onResize = () => {
      renderer!.setSize(canvas.offsetWidth, canvas.offsetHeight);
    };
    window.addEventListener("resize", onResize, { passive: true });
    (canvas as HTMLCanvasElement & { _cleanup?: () => void })._cleanup = () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer!.dispose();
    };
  });
}

/* ─── Magnetic button hook ───────────────────────────────── */
function useMagnetic(ref: React.RefObject<HTMLElement | null>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.35, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [strength]);
}

/* ─── Component ──────────────────────────────────────────── */
export function ImmersiveHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const modelRef    = useRef<HTMLDivElement>(null);
  const h1Ref       = useRef<HTMLHeadingElement>(null);
  const redRef      = useRef<HTMLSpanElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const btn1Ref     = useRef<HTMLElement>(null);
  const btn2Ref     = useRef<HTMLElement>(null);

  useMagnetic(btn1Ref as React.RefObject<HTMLElement>);
  useMagnetic(btn2Ref as React.RefObject<HTMLElement>);

  useEffect(() => {
    // WebGL
    if (canvasRef.current) {
      initWebGL(canvasRef.current);
      return () => {
        const c = canvasRef.current as (HTMLCanvasElement & { _cleanup?: () => void }) | null;
        c?._cleanup?.();
      };
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* 1 ── Char reveal on load */
      if (h1Ref.current) {
        const chars = splitToChars(h1Ref.current);
        gsap.from(chars, {
          yPercent: 110,
          opacity: 0,
          duration: 1,
          stagger: 0.022,
          ease: "power4.out",
          delay: 0.2,
        });
      }

      /* 2 ── Red line reveal */
      if (redRef.current) {
        gsap.from(redRef.current, {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.1,
          ease: "power3.inOut",
          delay: 0.55,
        });
      }

      /* 3 ── Sub + CTA fade up */
      gsap.from([subRef.current, ctaRef.current], {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.9,
      });

      /* 4 ── Model scale in */
      gsap.from(modelRef.current, {
        scale: 1.08,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.1,
      });

      /* 5 ── Floating card slide in */
      gsap.from(cardRef.current, {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.1,
      });

      /* 6 ── Mouse parallax on model */
      const onMouse = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 18;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        gsap.to(modelRef.current, { x: x * -0.5, y: y * -0.5, duration: 0.8, ease: "power2.out" });
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      /* 7 ── ScrollTrigger: hero scale out */
      gsap.to(sectionRef.current, {
        scale: 0.96,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => window.removeEventListener("mousemove", onMouse);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-end overflow-hidden pb-16"
      style={{ background: "#000" }}
    >
      {/* Grid overlay */}
      <div className="grid-overlay" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
      </div>

      {/* Full bleed model photo */}
      <div
        ref={modelRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      >
        <img
          src="/hero-model.jpg"
          alt=""
          aria-hidden
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            objectPosition: "55% center", opacity: 0.8,
          }}
        />
      </div>

      {/* Left gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.38) 62%, rgba(0,0,0,0.06) 100%)" }}
      />
      <div className="absolute top-0 left-0 right-0" style={{ height: "22%", background: "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "18%", background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }} />

      {/* WebGL smoke overlay */}
      <canvas ref={canvasRef} className="webgl-canvas" style={{ opacity: 0.9 }} />

      {/* Rotating badge */}
      <div className="absolute top-24 right-8 hidden lg:block z-10" ref={badgeRef}>
        <div style={{ position: "relative", width: 90, height: 90 }}>
          <svg viewBox="0 0 100 100" width={90} height={90} className="spin-badge">
            <path id="bpath" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" fill="none" />
            <text fontSize="9.2" fill="rgba(255,255,255,0.5)" fontFamily="Space Mono" letterSpacing="2.8">
              <textPath href="#bpath">✦ WILL DIFFERENT · WORN BY ALL · REBELS AFTER ·&nbsp;</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ color: "#e8000d", fontSize: "1.3rem" }}>✦</span>
          </div>
        </div>
      </div>

      {/* Left indicators */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 z-10">
        {["01","02","03"].map((n, i) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <span
              className="font-mono text-[0.6rem] font-bold"
              style={{ color: i === 0 ? "#e8000d" : "rgba(255,255,255,0.2)", fontFamily: "Space Mono" }}
            >{n}</span>
            {i < 2 && <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.1)" }} />}
          </div>
        ))}
      </div>

      {/* Vertical left rule */}
      <div className="absolute left-16 top-0 bottom-0 hidden xl:block" style={{ width: 1, background: "linear-gradient(to bottom, transparent, #1a1a1a 20%, #1a1a1a 80%, transparent)" }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">

          {/* Left content */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tag */}
            <div className="flex items-center gap-3">
              <span className="tag">NEW DROP</span>
              <span className="section-label flex items-center gap-2">
                SS&apos;24 <span style={{ color: "#e8000d" }}>——→</span>
              </span>
            </div>

            {/* Headlines */}
            <div>
              <h1 ref={h1Ref} className="hero-headline" aria-label="NOT MADE TO FIT IN.">
                NOT MADE<br />TO FIT IN.
              </h1>
              <span ref={redRef} className="hero-redline mt-1.5">
                MADE TO STAND OUT.
              </span>
            </div>

            {/* Sub */}
            <p
              ref={subRef}
              style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "340px" }}
            >
              Iluminatees is more than fabric.<br />
              It&apos;s a mindset. A rebellion. A way of life.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex items-center gap-4 pt-1">
              <span ref={btn1Ref as React.RefObject<HTMLSpanElement>} className="magnetic">
                <Link href="/shop" className="btn-primary">
                  EXPLORE DROP <ArrowUpRight size={13} />
                </Link>
              </span>
              <span ref={btn2Ref as React.RefObject<HTMLSpanElement>} className="magnetic">
                <button className="btn-ghost">
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)"
                  }}>
                    <Play size={7} fill="white" />
                  </span>
                  WATCH FILM
                </button>
              </span>
            </div>
          </div>

          {/* Floating product card */}
          <div className="lg:col-span-5 hidden lg:flex justify-end items-end pb-2">
            <div ref={cardRef} className="float-card flex items-center gap-3 p-3 pr-4" style={{ width: 260 }}>
              <div style={{ width: 80, height: 90, overflow: "hidden", background: "#000", flexShrink: 0 }}>
                <img src="/tee-floating.jpg" alt="Angelo Oversized Tee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="section-label mb-1">NEW ARRIVAL</p>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "0.04em" }}>ANGELO OVERSIZED TEE</p>
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>WASHED BLACK</p>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#e8000d", marginTop: "0.5rem" }}>₹ 1,899</p>
              </div>
              <button style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: "#e8000d", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={14} color="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex items-center gap-3 mt-8">
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />
          </div>
          <span className="section-label" style={{ letterSpacing: "0.32em" }}>SCROLL TO DISCOVER</span>
        </div>
      </div>
    </section>
  );
}
