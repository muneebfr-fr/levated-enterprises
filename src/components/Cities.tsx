import { useRef } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';
import { WA_CITY } from '../constants';

/**
 * City positions calculated from real lat/lon.
 * Projected onto viewBox "0 0 1000 959" (pk.svg coordinate space).
 * Scale: lon 60.9–77.2 (16.3°) → 1000px | lat 23.6–37.1 (13.5°) → 959px
 * x = (lon - 60.9) / 16.3 * 1000
 * y = (37.1 - lat)  / 13.5 * 959
 */
const MAP_CITIES = [
  { name: 'Karachi',    x: 410, y: 868, hq: true,  delay: 0.0, lx: 418,  ly: 860,  anchor: 'start' as const },
  { name: 'Lahore',     x: 822, y: 398, hq: false, delay: 0.4, lx: 813,  ly: 390,  anchor: 'end'   as const },
  { name: 'Islamabad',  x: 747, y: 240, hq: false, delay: 0.8, lx: 738,  ly: 232,  anchor: 'end'   as const },
  { name: 'Faisalabad', x: 749, y: 404, hq: false, delay: 1.2, lx: 740,  ly: 418,  anchor: 'end'   as const },
  { name: 'Rawalpindi', x: 747, y: 249, hq: false, delay: 1.6, lx: null, ly: null, anchor: 'end'   as const },
];

/** Sidebar city list */
const PANEL_CITIES = [
  { name: 'Karachi',    tag: 'HQ · Main Hub', hq: true  },
  { name: 'Lahore',     tag: 'Industrial'                },
  { name: 'Islamabad',  tag: 'Corporate'                 },
  { name: 'Faisalabad', tag: 'Textile Hub'               },
  { name: 'Rawalpindi', tag: 'Commercial'                },
];

export default function Cities() {
  const r0 = useReveal();
  const r1 = useReveal();
  const r2 = useReveal();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Map drifts up slowly — feels like background layer
  const mapY      = useTransform(scrollYProgress, [0, 1], [40, -40]);
  // Panel moves faster — feels like foreground layer
  const panelY    = useTransform(scrollYProgress, [0, 1], [10, -60]);
  // Header columns offset from each other for depth
  const headerLY  = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const headerRY  = useTransform(scrollYProgress, [0, 1], [35, -10]);
  // Nationwide bar — subtle trailing motion
  const barY      = useTransform(scrollYProgress, [0, 1], [15, -25]);
  // Per-row stagger for city panel rows (pre-computed — no hooks in callbacks)
  const row0Y = useTransform(scrollYProgress, [0, 1], [0,   0]);
  const row1Y = useTransform(scrollYProgress, [0, 1], [6,  -4]);
  const row2Y = useTransform(scrollYProgress, [0, 1], [12, -8]);
  const row3Y = useTransform(scrollYProgress, [0, 1], [18, -12]);
  const row4Y = useTransform(scrollYProgress, [0, 1], [24, -16]);
  const rowAllY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const rowYValues = [row0Y, row1Y, row2Y, row3Y, row4Y];

  return (
    <section id="cities" ref={sectionRef}>
      <div className="section-wrap">
        <div className="cities-header">
          <motion.div className="reveal" ref={r0} style={{ y: headerLY }}>
            <div className="eyebrow">Nationwide Coverage</div>
            <h2 className="section-h2">
              We deliver across<br /><span className="accent">all of Pakistan</span>
            </h2>
          </motion.div>
          <motion.div className="cities-sub-right reveal reveal-delay-1" ref={r1} style={{ y: headerRY }}>
            <p>From Karachi port to Lahore's industrial zones, from Islamabad's corporate offices to Faisalabad's textile mills. Levated Enterprises delivers bulk orders to every major business hub in Pakistan.</p>
          </motion.div>
        </div>

        {/* Pakistan map + city panel */}
        <div className="cities-map-layout reveal" ref={r2}>
          <motion.div className="pak-map-wrap" style={{ y: mapY }}>
            {/* Real Simplemaps SVG — hue-shifted to purple palette */}
            <img
              src="/pk.svg"
              alt="Pakistan map"
              className="pak-map-img"
            />

            {/* City dot overlay — same viewBox as pk.svg */}
            <svg
              viewBox="0 0 1000 959"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pak-map-overlay"
              aria-hidden="true"
            >
              {MAP_CITIES.map((city) => (
                <g key={city.name}>
                  {/* Pulse ring */}
                  <motion.circle
                    cx={city.x} cy={city.y} r={8}
                    fill={city.hq ? 'rgba(240,120,64,0.3)' : 'rgba(45,42,110,0.25)'}
                    animate={{ r: [8, 22, 8], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: city.delay }}
                  />
                  {/* Core dot */}
                  <circle
                    cx={city.x} cy={city.y}
                    r={city.hq ? 7 : 5}
                    fill={city.hq ? 'var(--orange)' : 'var(--purple)'}
                    stroke="white" strokeWidth="2"
                  />
                  {/* Label (skip Rawalpindi — too close to Islamabad) */}
                  {city.lx !== null && (
                    <text
                      x={city.lx} y={city.ly!}
                      fontSize={city.hq ? 26 : 22}
                      fontFamily="var(--font-display)"
                      fontWeight="700"
                      fill={city.hq ? 'var(--orange-dark)' : 'var(--purple-dark)'}
                      textAnchor={city.anchor}
                    >
                      {city.name}
                    </text>
                  )}
                </g>
              ))}

              {/* Subtle watermark */}
              <text
                x="130" y="600" fontSize="11"
                fontFamily="var(--font-display)"
                fill="rgba(45,42,110,0.18)"
                letterSpacing="8"
                transform="rotate(-72,130,600)"
              >
                NATIONWIDE
              </text>
            </svg>
          </motion.div>

          {/* City sidebar */}
          <motion.div className="cities-panel" style={{ y: panelY }}>
            {PANEL_CITIES.map((city, i) => (
              <motion.div
                key={city.name}
                className={`city-row${city.hq ? ' hq' : ''}`}
                style={{ y: rowYValues[i] }}
              >
                <div className={`city-row-dot${city.hq ? ' hq-dot' : ''}`} />
                <div>
                  <div className="city-row-name">{city.name}</div>
                  <div className="city-row-tag">{city.tag}</div>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="city-row all-pak"
              style={{ y: rowAllY }}
            >
              <Globe size={16} />
              <div>
                <div className="city-row-name">All Pakistan</div>
                <div className="city-row-tag">Nationwide delivery</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="nationwide-bar reveal" style={{ y: barY }}>
          <p>Don't see your city? <strong>No problem.</strong> We deliver to any location across Pakistan. Just WhatsApp us your requirements and delivery address.</p>
          <a href={WA_CITY} target="_blank" rel="noopener noreferrer" className="nationwide-badge">
            <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
            Enquire for Your City
          </a>
        </motion.div>
      </div>
    </section>
  );
}
