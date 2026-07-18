/*
 * ILUMINATEES wordmark — thin geometric caps, wide tracking,
 * signature triple-bar E (≡) and crossbar-less A.
 * Stroke uses currentColor so it inherits text color (black navbar, white footer).
 */

const SW = 7;          /* stroke width */
const H = 100;         /* cap height */
const LW = 60;         /* letter width */
const GAP = 42;        /* tracking */

type Glyph = (x: number) => React.ReactNode;

const g = {
  I: ((x) => <path key={x} d={`M${x + LW / 2} 0 V${H}`} />) as Glyph,
  L: ((x) => <path key={x} d={`M${x + SW / 2} 0 V${H - SW / 2} H${x + LW}`} />) as Glyph,
  U: ((x) => <path key={x} d={`M${x + SW / 2} 0 V${H - 34} Q${x + SW / 2} ${H - SW / 2} ${x + LW / 2} ${H - SW / 2} Q${x + LW - SW / 2} ${H - SW / 2} ${x + LW - SW / 2} ${H - 34} V0`} />) as Glyph,
  M: ((x) => <path key={x} d={`M${x + SW / 2} ${H} V0 L${x + LW / 2} 58 L${x + LW - SW / 2} 0 V${H}`} />) as Glyph,
  N: ((x) => <path key={x} d={`M${x + SW / 2} ${H} V0 L${x + LW - SW / 2} ${H} V0`} />) as Glyph,
  A: ((x) => <path key={x} d={`M${x} ${H} L${x + LW / 2} 0 L${x + LW} ${H}`} />) as Glyph,
  T: ((x) => <path key={x} d={`M${x} ${SW / 2} H${x + LW} M${x + LW / 2} ${SW / 2} V${H}`} />) as Glyph,
  E: ((x) => (
    <g key={x}>
      <path d={`M${x} ${SW / 2} H${x + LW}`} />
      <path d={`M${x} ${H / 2} H${x + LW}`} />
      <path d={`M${x} ${H - SW / 2} H${x + LW}`} />
    </g>
  )) as Glyph,
  S: ((x) => (
    <path key={x} d={`M${x + LW - 8} 13 Q${x + LW - 18} ${SW / 2} ${x + LW / 2} ${SW / 2} Q${x + 6} ${SW / 2} ${x + 6} 26 Q${x + 6} 46 ${x + LW / 2} 50 Q${x + LW - 6} 54 ${x + LW - 6} 74 Q${x + LW - 6} ${H - SW / 2} ${x + LW / 2} ${H - SW / 2} Q${x + 14} ${H - SW / 2} ${x + 6} 85`} />
  )) as Glyph,
};

const LETTERS: (keyof typeof g)[] = ["I", "L", "U", "M", "I", "N", "A", "T", "E", "E", "S"];

export function Logo({ height = 18, color, showR = true }: { height?: number; color?: string; showR?: boolean }) {
  const totalW = LETTERS.length * (LW + GAP) - GAP + (showR ? 78 : 0);
  const rX = LETTERS.length * (LW + GAP) - GAP + 44;

  return (
    <svg
      viewBox={`-4 -6 ${totalW + 12} ${H + 14}`}
      height={height}
      style={{ display: "block", color }}
      fill="none"
      stroke="currentColor"
      strokeWidth={SW}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-label="ILUMINATEES"
      role="img"
    >
      {LETTERS.map((L, i) => g[L](i * (LW + GAP)))}
      {showR && (
        <g strokeWidth={4}>
          <circle cx={rX} cy={H - 22} r={21} />
          <path d={`M${rX - 7} ${H - 12} V${H - 32} H${rX + 4} Q${rX + 9} ${H - 32} ${rX + 9} ${H - 27} Q${rX + 9} ${H - 22} ${rX + 4} ${H - 22} H${rX - 7} M${rX + 1} ${H - 22} L${rX + 9} ${H - 12}`} />
        </g>
      )}
    </svg>
  );
}
