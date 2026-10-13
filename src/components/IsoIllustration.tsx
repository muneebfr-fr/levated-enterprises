import { useId, type CSSProperties } from 'react';

/*
 * Tiny isometric drawing kit. Products are built from boxes and upright cylinders,
 * grouped into parts. Each part carries an explode vector (screen px); the card
 * toggles `.is-exploded` (or :hover on desktop) and CSS slides the parts apart.
 * Only small SVG groups move, so it stays cheap on phones.
 */

const C = Math.cos(Math.PI / 6); // 0.866
const S = 0.5;
const P = (x: number, y: number, z: number): [number, number] => [(x - y) * C, (x + y) * S - z];

type Mat = { top: string; left: string; right: string };
const M = {
  purple: { top: '#6E6AC4', left: '#4B479E', right: '#2D2A6E' },
  dark:   { top: '#3D3A88', left: '#2D2A6E', right: '#1A1840' },
  light:  { top: '#FFFFFF', left: '#E8E6FB', right: '#C9C5EF' },
  paper:  { top: '#FFFFFF', left: '#F4F3FE', right: '#DCD9F5' },
  orange: { top: '#FFB48C', left: '#F07840', right: '#C8552A' },
} satisfies Record<string, Mat>;
type MatName = keyof typeof M;

type Shape =
  | { t: 'poly'; pts: [number, number][]; fill: string }
  | { t: 'cylSide'; d: string; mat: MatName; bounds: [number, number][] }
  | { t: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill: string };

function box(x: number, y: number, z: number, w: number, d: number, h: number, mat: MatName): Shape[] {
  const m = M[mat];
  return [
    { t: 'poly', fill: m.left,  pts: [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)] },
    { t: 'poly', fill: m.right, pts: [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)] },
    { t: 'poly', fill: m.top,   pts: [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)] },
  ];
}

// Upright cylinder. A horizontal circle of radius r projects to an ellipse 1.2247r x 0.7071r.
function cyl(cx: number, cy: number, z: number, r: number, h: number, mat: MatName, cap: string = M[mat].top): Shape[] {
  const rx = r * 1.2247, ry = r * 0.7071;
  const [bx, by] = P(cx, cy, z);
  const [tx, ty] = P(cx, cy, z + h);
  const d = `M${tx - rx},${ty} L${bx - rx},${by} A${rx},${ry} 0 0 0 ${bx + rx},${by} L${tx + rx},${ty} Z`;
  return [
    { t: 'cylSide', d, mat, bounds: [[bx - rx, by + ry], [tx + rx, ty]] },
    { t: 'ellipse', cx: tx, cy: ty, rx, ry, fill: cap },
  ];
}

// A small dot lying on a +y facing front face (LEDs, buttons)
const dotFront = (x: number, y: number, z: number, r: number, fill: string): Shape => {
  const [cx, cy] = P(x, y, z);
  return { t: 'ellipse', cx, cy, rx: r, ry: r, fill };
};

/** reveal: hidden while assembled, so it can be drawn last (on top) without showing through */
type Part = { shapes: Shape[]; dx?: number; dy?: number; delay?: number; reveal?: boolean };

// Screen vectors for pushing parts along an iso axis
const alongX = (n: number) => ({ dx: n * C, dy: n * S });
const alongY = (n: number) => ({ dx: -n * C, dy: n * S });
const up = (n: number) => ({ dx: 0, dy: -n });

const ART: Record<string, Part[]> = {
  // Industrial & MRO: toolbox, lid lifts, tools pop out
  industrial: [
    { shapes: box(0, 0, 0, 44, 22, 20, 'orange') },
    { shapes: [...box(0, 0, 20, 44, 22, 5, 'orange'), ...box(15, 9, 25, 14, 4, 2, 'dark'), ...box(15, 9, 27, 2, 4, 5, 'dark'), ...box(27, 9, 27, 2, 4, 5, 'dark'), ...box(15, 9, 32, 14, 4, 2, 'dark')], ...up(12) },
    { shapes: [...box(8, 8, 2, 2, 2, 14, 'light'), ...cyl(9, 9, 16, 3, 11, 'purple')], ...up(42), delay: 0.08, reveal: true },
    { shapes: [...box(30, 10, 2, 8, 1.6, 18, 'light'), ...box(28, 9, 20, 12, 3.6, 4, 'light')], ...up(36), delay: 0.14, reveal: true },
  ],

  // Corporate IT: server rack, drawers slide out to the front
  it: [
    { shapes: box(0, 0, 0, 34, 30, 64, 'dark') },
    { shapes: [...box(2, 1, 6, 30, 30, 9, 'purple'), dotFront(26, 31, 10.5, 1.3, '#F07840'), dotFront(22, 31, 10.5, 1.3, '#9CF2B4')], ...alongY(10), delay: 0.12 },
    { shapes: [...box(2, 1, 19, 30, 30, 9, 'purple'), dotFront(26, 31, 23.5, 1.3, '#F07840'), dotFront(22, 31, 23.5, 1.3, '#9CF2B4')], ...alongY(20), delay: 0.06 },
    { shapes: [...box(2, 1, 32, 30, 30, 9, 'purple'), dotFront(26, 31, 36.5, 1.3, '#F07840'), dotFront(22, 31, 36.5, 1.3, '#9CF2B4')], ...alongY(6), delay: 0.18 },
    { shapes: [...box(2, 1, 45, 30, 30, 9, 'purple'), dotFront(26, 31, 49.5, 1.3, '#F07840'), dotFront(22, 31, 49.5, 1.3, '#9CF2B4')], ...alongY(15), delay: 0 },
    { shapes: box(-1, -1, 64, 36, 32, 3, 'orange'), ...up(14) },
  ],

  // Office appliances: printer, lid lifts, paper feeds in and out
  office: [
    { shapes: box(8, 3, 22, 30, 1, 18, 'paper'), ...up(14), delay: 0.1 },
    { shapes: box(0, 0, 0, 46, 32, 20, 'light') },
    { shapes: [...box(0, 0, 20, 46, 32, 5, 'light'), ...box(30, 26, 25, 12, 5, 1.5, 'dark')], ...up(16) },
    { shapes: box(6, 32, 9, 34, 10, 1.6, 'purple'), ...alongY(8), delay: 0.05 },
    { shapes: box(9, 30, 11, 28, 14, 0.8, 'paper'), ...alongY(18), delay: 0.12 },
  ],

  // Stationery: paper reams fan apart, pen floats off
  stationery: [
    { shapes: [...box(0, 0, 0, 40, 28, 8, 'paper'), ...box(14, -0.3, -0.1, 12, 28.6, 8.2, 'orange')] },
    { shapes: [...box(0, 0, 8, 40, 28, 8, 'paper'), ...box(14, -0.3, 7.9, 12, 28.6, 8.2, 'purple')], ...up(9), delay: 0.05 },
    { shapes: [...box(0, 0, 16, 40, 28, 8, 'paper'), ...box(14, -0.3, 15.9, 12, 28.6, 8.2, 'orange')], ...up(18), delay: 0.1 },
    { shapes: [...box(8, 12, 24, 26, 3, 3, 'purple'), ...box(34, 12, 24, 4, 3, 3, 'orange')], ...up(30), delay: 0.16 },
  ],

  // Hardware & electrical: cable spool comes apart, plug pulls away
  electrical: [
    { shapes: cyl(16, 16, 0, 18, 4, 'purple'), ...up(-8) },
    { shapes: cyl(16, 16, 4, 14, 16, 'orange') },
    { shapes: [...cyl(16, 16, 20, 18, 4, 'purple'), ...cyl(16, 16, 24, 4, 0.01, 'dark', '#1A1840')], ...up(16), delay: 0.05 },
    { shapes: [...box(40, 18, 0, 12, 10, 10, 'light'), ...box(52, 20, 3, 6, 1.4, 1.4, 'dark'), ...box(52, 25, 3, 6, 1.4, 1.4, 'dark')], ...alongX(14), delay: 0.1 },
  ],

  // Facility care: bucket and spray bottle, trigger head lifts off
  janitorial: [
    { shapes: [...cyl(-10, 18, 0, 16, 18, 'purple', '#2D2A6E'), ...cyl(-10, 18, 14, 13, 0.01, 'light', '#BFE4FF')], ...alongY(6) },
    { shapes: cyl(24, -4, 0, 10, 28, 'orange') },
    { shapes: cyl(24, -4, 28, 4.5, 6, 'purple'), ...up(10), delay: 0.05 },
    { shapes: [...box(18, -9, 34, 13, 10, 8, 'dark'), ...box(31, -6, 37, 7, 4, 4, 'purple'), ...box(21, -1, 25, 4, 4, 9, 'dark')], ...up(22), delay: 0.1 },
  ],
};

/** Bounds of every part in both the assembled and exploded positions, so nothing clips */
function viewBoxFor(parts: Part[]) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of parts) {
    for (const off of [[0, 0], [p.dx ?? 0, p.dy ?? 0]]) {
      for (const s of p.shapes) {
        const pts = s.t === 'poly' ? s.pts : s.t === 'cylSide' ? s.bounds : [[s.cx - s.rx, s.cy - s.ry], [s.cx + s.rx, s.cy + s.ry]] as [number, number][];
        for (const [x, y] of pts) {
          x0 = Math.min(x0, x + off[0]); x1 = Math.max(x1, x + off[0]);
          y0 = Math.min(y0, y + off[1]); y1 = Math.max(y1, y + off[1]);
        }
      }
    }
  }
  const pad = 3;
  return `${(x0 - pad).toFixed(1)} ${(y0 - pad).toFixed(1)} ${(x1 - x0 + pad * 2).toFixed(1)} ${(y1 - y0 + pad * 2).toFixed(1)}`;
}
const VIEWBOXES = Object.fromEntries(Object.entries(ART).map(([k, v]) => [k, viewBoxFor(v)]));

export type IsoName = keyof typeof ART;

export default function IsoIllustration({ name }: { name: IsoName }) {
  const uid = useId().replace(/:/g, '');
  const parts = ART[name];
  const usedMats = new Set<MatName>();
  parts.forEach(p => p.shapes.forEach(s => { if (s.t === 'cylSide') usedMats.add(s.mat); }));

  return (
    <svg className="iso-art" viewBox={VIEWBOXES[name]} preserveAspectRatio="xMinYMax meet" aria-hidden="true">
      <defs>
        {[...usedMats].map(m => (
          <linearGradient key={m} id={`${uid}-${m}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={M[m].left} />
            <stop offset="0.55" stopColor={M[m].left} />
            <stop offset="1" stopColor={M[m].right} />
          </linearGradient>
        ))}
      </defs>
      {parts.map((p, i) => (
        <g
          key={i}
          className={`iso-part${p.reveal ? ' is-reveal' : ''}`}
          style={{ '--dx': `${(p.dx ?? 0).toFixed(1)}px`, '--dy': `${(p.dy ?? 0).toFixed(1)}px`, '--d': `${p.delay ?? 0}s` } as CSSProperties}
        >
          {p.shapes.map((s, j) =>
            s.t === 'poly' ? <polygon key={j} points={s.pts.map(pt => pt.map(n => n.toFixed(1)).join(',')).join(' ')} fill={s.fill} />
            : s.t === 'cylSide' ? <path key={j} d={s.d} fill={`url(#${uid}-${s.mat})`} />
            : <ellipse key={j} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.fill} />
          )}
        </g>
      ))}
    </svg>
  );
}
