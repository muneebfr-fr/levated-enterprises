import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LiquidLogo from './LiquidLogo';
import { LOGO } from '../constants';

// Unsplash photo ids, served from their CDN at the size we need
const img = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;

type Slide =
  | { kind: 'photo'; id: string; category: string; title: string; tag: string; alt: string }
  | { kind: 'logo' };

const SLIDES: Slide[] = [
  { kind: 'photo', id: '1558494949-ef010cbdcc31', category: 'Corporate IT',        title: 'Servers & Data Hardware',  tag: 'Racks · Servers · Storage',          alt: 'Server racks in a data centre' },
  { kind: 'photo', id: '1544197150-b99a580bb7a8', category: 'Networking',          title: 'Structured Cabling',       tag: 'Patch Panels · Cat6 · Switches',     alt: 'Network cables plugged into a patch panel' },
  { kind: 'photo', id: '1530124566582-a618bc2615dc', category: 'Industrial & MRO', title: 'Tools & Maintenance',      tag: 'Hand Tools · Power Tools · Spares',  alt: 'Rows of pliers and hand tools on display' },
  { kind: 'photo', id: '1621905251189-08b45d6a269e', category: 'Electrical & PPE', title: 'Safety & Electrical',      tag: 'Helmets · Gloves · Fittings',        alt: 'Electrician in a hard hat working on a panel' },
  { kind: 'photo', id: '1557597774-9d273605dfa9', category: 'Security Systems',    title: 'CCTV & Surveillance',      tag: 'Cameras · NVRs · Access Control',    alt: 'Wall of security cameras' },
  { kind: 'photo', id: '1612815154858-60aa4c59eaa6', category: 'Office Appliances', title: 'Printers & Electronics',  tag: 'Printers · Shredders · Appliances',  alt: 'Office laser printer' },
  { kind: 'photo', id: '1456735190827-d1262f71b8a3', category: 'Stationery',       title: 'Office Supplies',          tag: 'Paper · Pens · Filing',              alt: 'Organiser full of pens, markers and sticky notes' },
  { kind: 'photo', id: '1563453392212-326f5e854473', category: 'Facility Care',    title: 'Janitorial Supplies',      tag: 'Cleaning · Hygiene · Sanitation',    alt: 'Gloved hand holding a cleaning spray bottle' },
  { kind: 'logo' },
];

const PHOTO_MS = 4200;
const LOGO_MS  = 6500;
const PHOTO_COUNT = SLIDES.filter(s => s.kind === 'photo').length;

const N = SLIDES.length;
// Shortest signed distance from the active slide, so the loop wraps both ways
const offsetOf = (i: number, index: number) => {
  const d = (i - index + N) % N;
  return d > N / 2 ? d - N : d;
};

export default function ProductSlideshow() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; t: number; axis: 'x' | 'y' | null; id: number } | null>(null);

  // The liquid logo does a heavy one-off setup (shape solve + WebGL). It is the last
  // slide, so only build it once the show gets close, keeping page load light on phones.
  const [logoReady, setLogoReady] = useState(false);
  useEffect(() => { if (index >= N - 3) setLogoReady(true); }, [index]);

  const current = SLIDES[index];
  const duration = current.kind === 'logo' ? LOGO_MS : PHOTO_MS;

  // Any navigation (auto or manual) re-keys the active progress bar,
  // so the timer always restarts from zero on the new slide.
  const go = (i: number) => {
    const next = (i + N) % N;
    if (next === index) return;
    setPrev(index);
    setIndex(next);
  };

  // Freeze the timer while the tab is in the background
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    drag.current = { x: e.clientX, y: e.clientY, t: performance.now(), axis: null, id: e.pointerId };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'y') { drag.current = null; return; } // let the page scroll
      rootRef.current?.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    setDragX(dx);
  };
  const endDrag = (e: ReactPointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.axis !== 'x') return;
    const dx = e.clientX - d.x;
    const width = rootRef.current?.offsetWidth ?? 1;
    const velocity = Math.abs(dx) / Math.max(1, performance.now() - d.t);
    setDragging(false);
    setDragX(0);
    if (Math.abs(dx) > width * 0.18 || (Math.abs(dx) > 30 && velocity > 0.5)) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      ref={rootRef}
      className={`slideshow${current.kind === 'logo' ? ' on-logo' : ''}${dragging || hidden ? ' is-paused' : ''}${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Products we supply"
    >
      {SLIDES.map((s, i) => {
        const off = offsetOf(i, index);
        const near = Math.abs(off) <= 1;
        // Park every non-active slide just off the edge on its side of the loop.
        // Only the incoming and outgoing slides animate, so nothing sweeps across.
        const pos = Math.max(-1, Math.min(1, off));
        const animate = !dragging && (i === index || i === prev);
        return (
          <div
            key={i}
            className={`slide slide-${s.kind}${i === index ? ' is-active' : ''}${near || i === prev ? ' is-near' : ''}${animate ? ' is-moving' : ''}`}
            style={{ transform: `translate3d(calc(${pos * 100}% + ${dragX}px), 0, 0)` }}
            aria-hidden={i !== index}
          >
            {s.kind === 'photo' ? (
              <>
                <img
                  src={img(s.id, 900)}
                  srcSet={`${img(s.id, 640)} 640w, ${img(s.id, 900)} 900w, ${img(s.id, 1400)} 1400w`}
                  sizes="(max-width: 900px) 90vw, 45vw"
                  alt={s.alt}
                  loading={near ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
                <div className="slide-shade" />
                <div className="slide-caption">
                  <span className="slide-eyebrow">
                    <span className="slide-count">{String(i + 1).padStart(2, '0')}/{String(PHOTO_COUNT).padStart(2, '0')}</span>
                    {s.category}
                  </span>
                  <h3 className="slide-title">{s.title}</h3>
                  <span className="slide-tag">{s.tag}</span>
                </div>
              </>
            ) : (
              <>
                <div className="slide-logo-inner">
                  {logoReady ? <LiquidLogo /> : <img className="slide-logo-static" src={LOGO} alt="" />}
                </div>
                <div className="slide-caption">
                  <span className="slide-eyebrow">Levated Enterprises</span>
                  <h3 className="slide-title">One supplier. Every category.</h3>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button className="slide-arrow slide-arrow-prev" onClick={() => go(index - 1)} aria-label="Previous slide">
        <ChevronLeft size={20} />
      </button>
      <button className="slide-arrow slide-arrow-next" onClick={() => go(index + 1)} aria-label="Next slide">
        <ChevronRight size={20} />
      </button>

      <div className="slide-progress" role="tablist">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={s.kind === 'logo' ? 'Levated Enterprises' : s.title}
            className={`slide-seg${i < index ? ' done' : ''}${i === index ? ' active' : ''}`}
            onClick={() => go(i)}
          >
            <span
              key={i === index ? `a${index}` : 'idle'}
              className="slide-seg-fill"
              style={i === index ? ({ '--seg-ms': `${duration}ms` } as CSSProperties) : undefined}
              onAnimationEnd={i === index ? () => go(index + 1) : undefined}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
