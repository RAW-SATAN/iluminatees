import type { Product } from "@/lib/products";

const TSHIRT_PATH =
  "M 68,28 C 80,10 120,10 132,28 L 158,16 L 198,52 L 176,80 L 158,64 L 158,232 L 42,232 L 42,64 L 24,80 L 2,52 L 42,16 Z";

const symbols: Record<string, (color: string) => React.ReactNode> = {
  eye: (c) => (
    <g transform="translate(100,125)">
      <polygon points="0,-52 55,30 -55,30" fill="none" stroke={c} strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="0" cy="10" rx="22" ry="14" fill="none" stroke={c} strokeWidth="1.8" />
      <circle cx="0" cy="10" r="7" fill={c} opacity="0.6" />
      <circle cx="0" cy="10" r="2.5" fill={c} />
      <line x1="-55" y1="30" x2="55" y2="30" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="-38" y1="16" x2="38" y2="16" stroke={c} strokeWidth="0.7" opacity="0.25" />
      <line x1="-22" y1="2" x2="22" y2="2" stroke={c} strokeWidth="0.7" opacity="0.2" />
    </g>
  ),
  pyramid: (c) => (
    <g transform="translate(100,128)">
      <polygon points="0,-55 55,30 -55,30" fill="none" stroke={c} strokeWidth="2" />
      <line x1="-55" y1="30" x2="55" y2="30" stroke={c} strokeWidth="1.5" />
      <line x1="-38" y1="8" x2="38" y2="8" stroke={c} strokeWidth="0.8" opacity="0.4" />
      <line x1="-24" y1="-12" x2="24" y2="-12" stroke={c} strokeWidth="0.8" opacity="0.35" />
      <line x1="-10" y1="-32" x2="10" y2="-32" stroke={c} strokeWidth="0.8" opacity="0.3" />
      {/* XIII at base */}
      <text x="0" y="48" textAnchor="middle" fill={c} fontSize="9" fontFamily="Georgia" opacity="0.7" letterSpacing="3">XIII</text>
    </g>
  ),
  compass: (c) => (
    <g transform="translate(100,128)">
      <circle cx="0" cy="0" r="50" fill="none" stroke={c} strokeWidth="1" opacity="0.3" />
      <circle cx="0" cy="0" r="35" fill="none" stroke={c} strokeWidth="1.2" opacity="0.5" />
      {/* Compass legs */}
      <line x1="-18" y1="-38" x2="0" y2="42" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="18" y1="-38" x2="0" y2="42" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
      {/* Square */}
      <rect x="-22" y="-10" width="44" height="32" fill="none" stroke={c} strokeWidth="1.8" opacity="0.8" />
      <circle cx="0" cy="-38" r="3.5" fill={c} opacity="0.9" />
      <text x="0" y="62" textAnchor="middle" fill={c} fontSize="7" fontFamily="Georgia" opacity="0.6" letterSpacing="4">G</text>
    </g>
  ),
  star: (c) => (
    <g transform="translate(100,128)">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const r1 = 48, r2 = 22;
        const a1 = (angle - 90) * (Math.PI / 180);
        const a2 = (angle + 30 - 90) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1={Math.cos(a1) * r2} y1={Math.sin(a1) * r2}
            x2={Math.cos(a1) * r1} y2={Math.sin(a1) * r1}
            stroke={c} strokeWidth="1.8" opacity="0.8"
          />
        );
      })}
      <polygon
        points="0,-48 13.8,-19 45.6,-14.8 23.2,7 28,39 0,24.4 -28,39 -23.2,7 -45.6,-14.8 -13.8,-19"
        fill="none" stroke={c} strokeWidth="1.5" opacity="0.7"
      />
      <circle cx="0" cy="0" r="8" fill={c} opacity="0.5" />
    </g>
  ),
  spiral: (c) => (
    <g transform="translate(100,128)">
      <path
        d="M 0,0 C 10,-10 25,-10 25,0 C 25,15 10,25 -5,20 C -25,12 -30,-10 -18,-25 C -5,-42 20,-45 38,-30 C 55,-12 55,18 38,35 C 18,52 -18,52 -38,30"
        fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"
      />
      <circle cx="0" cy="0" r="3" fill={c} />
    </g>
  ),
  cross: (c) => (
    <g transform="translate(100,128)">
      <rect x="-6" y="-52" width="12" height="104" fill={c} opacity="0.6" rx="1" />
      <rect x="-52" y="-18" width="104" height="12" fill={c} opacity="0.6" rx="1" />
      <rect x="-8" y="-54" width="16" height="108" fill="none" stroke={c} strokeWidth="1" opacity="0.4" rx="2" />
      <rect x="-54" y="-20" width="108" height="16" fill="none" stroke={c} strokeWidth="1" opacity="0.4" rx="2" />
    </g>
  ),
  ouroboros: (c) => (
    <g transform="translate(100,128)">
      <circle cx="0" cy="0" r="44" fill="none" stroke={c} strokeWidth="7" opacity="0.15" />
      <circle cx="0" cy="0" r="44" fill="none" stroke={c} strokeWidth="3" strokeDasharray="8 4" opacity="0.6" />
      <circle cx="0" cy="-44" r="5" fill={c} opacity="0.8" />
      {/* Tail/head triangle */}
      <polygon points="0,-52 -6,-36 6,-36" fill={c} opacity="0.7" />
      <circle cx="0" cy="0" r="15" fill="none" stroke={c} strokeWidth="1.2" opacity="0.4" />
      <circle cx="0" cy="0" r="4" fill={c} opacity="0.6" />
    </g>
  ),
  hexagon: (c) => (
    <g transform="translate(100,128)">
      {[0, 1, 2, 3].map((i) => {
        const r = 50 - i * 12;
        const pts = Array.from({ length: 6 }, (_, j) => {
          const a = (j * 60 - 30) * (Math.PI / 180);
          return `${Math.cos(a) * r},${Math.sin(a) * r}`;
        }).join(" ");
        return <polygon key={i} points={pts} fill="none" stroke={c} strokeWidth={1.5 - i * 0.2} opacity={0.8 - i * 0.15} />;
      })}
      <circle cx="0" cy="0" r="6" fill={c} opacity="0.7" />
      {/* Cross-lines */}
      {[0, 60, 120].map((angle, i) => {
        const a = angle * (Math.PI / 180);
        return (
          <line key={i} x1={Math.cos(a) * -50} y1={Math.sin(a) * -50} x2={Math.cos(a) * 50} y2={Math.sin(a) * 50}
            stroke={c} strokeWidth="0.7" opacity="0.2" />
        );
      })}
    </g>
  ),
  rose: (c) => (
    <g transform="translate(100,128)">
      <circle cx="0" cy="0" r="48" fill="none" stroke={c} strokeWidth="1" opacity="0.4" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60) * (Math.PI / 180);
        return (
          <ellipse
            key={i}
            cx={Math.cos(a) * 24} cy={Math.sin(a) * 24}
            rx="20" ry="8"
            transform={`rotate(${i * 60}, ${Math.cos(a) * 24}, ${Math.sin(a) * 24})`}
            fill="none" stroke={c} strokeWidth="1.4" opacity="0.65"
          />
        );
      })}
      <circle cx="0" cy="0" r="10" fill="none" stroke={c} strokeWidth="1.8" opacity="0.8" />
      <circle cx="0" cy="0" r="4" fill={c} opacity="0.9" />
    </g>
  ),
  ankh: (c) => (
    <g transform="translate(100,128)">
      <ellipse cx="0" cy="-24" rx="16" ry="22" fill="none" stroke={c} strokeWidth="2.5" />
      <rect x="-6" y="-2" width="12" height="56" fill={c} opacity="0.7" rx="1" />
      <rect x="-32" y="8" width="64" height="10" fill={c} opacity="0.7" rx="1" />
    </g>
  ),
  omega: (c) => (
    <g transform="translate(100,128)">
      <path
        d="M -40,-20 C -40,-60 40,-60 40,-20 C 40,10 25,35 10,45 L -10,45 C -25,35 -40,10 -40,-20 Z"
        fill="none" stroke={c} strokeWidth="2.5" opacity="0.8"
      />
      <rect x="-48" y="42" width="20" height="8" fill={c} opacity="0.7" rx="1" />
      <rect x="28" y="42" width="20" height="8" fill={c} opacity="0.7" rx="1" />
    </g>
  ),
  sigil: (c) => (
    <g transform="translate(100,128)">
      <circle cx="0" cy="0" r="48" fill="none" stroke={c} strokeWidth="1.2" opacity="0.5" />
      <circle cx="0" cy="0" r="32" fill="none" stroke={c} strokeWidth="0.8" opacity="0.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r = (i % 2 === 0) ? 48 : 32;
        const rad = a * (Math.PI / 180);
        const x1 = Math.cos(rad) * 8, y1 = Math.sin(rad) * 8;
        const x2 = Math.cos(rad) * r, y2 = Math.sin(rad) * r;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="1.2" opacity="0.6" />;
      })}
      <circle cx="0" cy="-32" r="5" fill={c} opacity="0.8" />
      <circle cx="22.6" cy="22.6" r="5" fill={c} opacity="0.8" />
      <circle cx="-22.6" cy="22.6" r="5" fill={c} opacity="0.8" />
      <path d="M 0,-32 L 22.6,22.6 L -22.6,22.6 Z" fill="none" stroke={c} strokeWidth="1.5" opacity="0.7" />
    </g>
  ),
};

interface Props {
  product: Pick<Product, "shirtColor" | "accentColor" | "symbol" | "slug"> &
    Partial<Pick<Product, "name" | "customImage" | "customImages">>;
  size?: number;
  className?: string;
  colorOverride?: string;
}

export function ProductMockup({ product, size = 260, className, colorOverride }: Props) {
  const { accentColor, symbol, slug } = product;
  const shirtColor = colorOverride ?? product.shirtColor;

  /* Real product photo wins over the drawn mockup wherever this component is used */
  const photo = product.customImage ?? product.customImages?.[0];
  if (photo) {
    return (
      <img
        src={photo}
        alt={product.name}
        className={className}
        width={size}
        height={size * 1.2}
        style={{ width: size, height: size * 1.2, objectFit: "cover", pointerEvents: "none" }}
      />
    );
  }
  const SymbolEl = symbols[symbol] ?? symbols.eye;
  /* Use slug (unique per product) as the SVG ID prefix so multiple
     ProductMockup instances with the same symbol never share gradient IDs. */
  const uid = slug;

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={className}
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`shirt-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shirtColor} />
          <stop offset="50%" stopColor={shirtColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={shirtColor} />
        </linearGradient>
        <radialGradient id={`light-${uid}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* T-shirt body */}
      <path d={TSHIRT_PATH} fill={`url(#shirt-grad-${uid})`} />
      {/* Subtle fabric highlight */}
      <path d={TSHIRT_PATH} fill={`url(#light-${uid})`} />
      {/* Neck ribbing */}
      <ellipse cx="100" cy="28" rx="22" ry="6" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

      {/* Symbol */}
      <g filter={`url(#glow-${uid})`}>
        {SymbolEl(accentColor)}
      </g>
    </svg>
  );
}
