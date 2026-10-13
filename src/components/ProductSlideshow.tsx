import { useEffect, useRef, useState, type CSSProperties } from 'react';
import LiquidLogo from './LiquidLogo';

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

export default function ProductSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const current = SLIDES[index];
  const duration = current.kind === 'logo' ? LOGO_MS : PHOTO_MS;
  const go = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);

  // Advancing is driven by the active progress bar's CSS animation ending,
  // so pausing (hover, hidden tab) freezes the bar and the timer together.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div
      className={`slideshow${current.kind === 'logo' ? ' on-logo' : ''}${paused || hidden ? ' is-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      aria-roledescription="carousel"
      aria-label="Products we supply"
    >
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`slide slide-${s.kind}${i === index ? ' is-active' : ''}`}
          aria-hidden={i !== index}
        >
          {s.kind === 'photo' ? (
            <>
              <img
                src={img(s.id, 900)}
                srcSet={`${img(s.id, 640)} 640w, ${img(s.id, 900)} 900w, ${img(s.id, 1400)} 1400w`}
                sizes="(max-width: 900px) 90vw, 45vw"
                alt={s.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
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
                <LiquidLogo />
              </div>
              <div className="slide-caption">
                <span className="slide-eyebrow">Levated Enterprises</span>
                <h3 className="slide-title">One supplier. Every category.</h3>
              </div>
            </>
          )}
        </div>
      ))}

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
