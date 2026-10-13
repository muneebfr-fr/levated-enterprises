import { useRef } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';
import WaButton from './WaButton';

/**
 * pk.svg (Simplemaps) is a Mercator projection. Its three georeferenced
 * points (the #points group in the file) fit these constants to within 0.03px:
 *   (24.3625 N, 61.6546 E) -> (90.9, 874.7)
 *   (29.7065 N, 69.7569 E) -> (545.5, 537.9)
 *   (36.3865 N, 76.2387 E) -> (909.1, 90.4)
 */
const project = (lat: number, lon: number) => {
  const merc = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return { x: -3368.05 + 56.1023 * lon, y: 2284.57 - 3214.29 * merc };
};

// Label offsets are relative to each dot; Rawalpindi has no label (it sits on Islamabad)
const MAP_CITIES = [
  { name: 'Karachi',    lat: 24.8607, lon: 67.0011, hq: true,  delay: 0.0, label: { dx: 12,  dy: -8, anchor: 'start' as const } },
  { name: 'Lahore',     lat: 31.5204, lon: 74.3587, hq: false, delay: 0.4, label: { dx: 12,  dy: 7,  anchor: 'start' as const } },
  { name: 'Islamabad',  lat: 33.6844, lon: 73.0479, hq: false, delay: 0.8, label: { dx: -12, dy: -8, anchor: 'end'   as const } },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350, hq: false, delay: 1.2, label: { dx: -12, dy: 14, anchor: 'end'   as const } },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169, hq: false, delay: 1.6, label: null },
].map(c => ({ ...c, ...project(c.lat, c.lon) }));

/** Sidebar city list */
const PANEL_CITIES = [
  { name: 'Karachi',    tag: 'HQ · Office & Dispatch', hq: true  },
  { name: 'Lahore',     tag: 'Delivery'                           },
  { name: 'Islamabad',  tag: 'Delivery'                           },
  { name: 'Faisalabad', tag: 'Delivery'                           },
  { name: 'Rawalpindi', tag: 'Delivery'                           },
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
            <p>Our office and dispatch hub is based in Karachi. The cities shown on this map are our delivery destinations — we ship bulk orders to every major business hub across Pakistan, from Lahore's industrial zones to Islamabad's corporate offices and Faisalabad's textile mills.</p>
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
                  {city.label && (
                    <text
                      x={city.x + city.label.dx} y={city.y + city.label.dy}
                      fontSize={city.hq ? 26 : 22}
                      fontFamily="var(--font-display)"
                      fontWeight="700"
                      fill={city.hq ? 'var(--orange-dark)' : 'var(--purple-dark)'}
                      textAnchor={city.label.anchor}
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
          <p>Don't see your city? <strong>No problem.</strong> We deliver anywhere in Pakistan. WhatsApp us your delivery location and requirements to get started.</p>
          <WaButton className="nationwide-badge">
            <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
            Enquire for Your City
          </WaButton>
        </motion.div>
      </div>
    </section>
  );
}
