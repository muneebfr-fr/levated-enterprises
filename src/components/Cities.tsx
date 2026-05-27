import { Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';
import { WA_CITY } from '../constants';

/**
 * Pakistan border path calculated from real geographic coordinates.
 * viewBox 0 0 510 460
 * Scale: lon 60.9–77.2 (16.3°) → 510px | lat 23.6–37.1 (13.5°) → 460px
 * x = (lon - 60.9) * 31.29   y = (37.1 - lat) * 34.07
 */
const PAK_PATH =
  'M 34.4,245.3 L 97,228.3 L 175.2,211.3 L 222.1,190.8 ' +
  'L 272.2,163.6 L 284.7,143.1 L 306.6,112.4 L 319.1,105.6 ' +
  'L 331.7,64.7 L 347.3,37.5 L 378.6,6.8 L 425.5,3.4 ' +
  'L 466.2,6.8 L 491.2,20.4 ' +
  'L 506.9,68.1 L 425.5,92 L 428.7,156.7 L 431.8,211.3 ' +
  'L 309.8,316.9 L 284.7,381.6 L 244,453.2 ' +
  'L 206.5,439.6 L 190.9,415.7 L 143.9,412.3 ' +
  'L 115.8,405.5 L 65.7,398.7 L 43.8,408.9 L 25,408.9 ' +
  'L 15.6,361.2 L 12.5,310.1 L 21.9,276 Z';

/** City dots — positions from real lat/lon, same scale as path above */
const MAP_CITIES = [
  { name: 'Karachi',    x: 190.9, y: 415.7, hq: true,  delay: 0.0, lx: 198,  ly: 407,  anchor: 'start' as const },
  { name: 'Lahore',     x: 419.3, y: 190.8, hq: false, delay: 0.4, lx: 412,  ly: 183,  anchor: 'end'   as const },
  { name: 'Islamabad',  x: 381.7, y: 115.9, hq: false, delay: 0.8, lx: 372,  ly: 108,  anchor: 'end'   as const },
  { name: 'Faisalabad', x: 381.7, y: 194.2, hq: false, delay: 1.2, lx: 372,  ly: 206,  anchor: 'end'   as const },
  { name: 'Rawalpindi', x: 381.7, y: 119.3, hq: false, delay: 1.6, lx: null, ly: null, anchor: 'end'   as const }, // dot only, too close to Isb
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

  return (
    <section id="cities">
      <div className="section-wrap">
        <div className="cities-header">
          <div className="reveal" ref={r0}>
            <div className="eyebrow">Nationwide Coverage</div>
            <h2 className="section-h2">
              We deliver across<br /><span className="accent">all of Pakistan</span>
            </h2>
          </div>
          <div className="cities-sub-right reveal reveal-delay-1" ref={r1}>
            <p>From Karachi port to Lahore's industrial zones, from Islamabad's corporate offices to Faisalabad's textile mills. Levated Enterprises delivers bulk orders to every major business hub in Pakistan.</p>
          </div>
        </div>

        {/* Pakistan map + city panel */}
        <div className="cities-map-layout reveal" ref={r2}>
          <div className="pak-map-wrap">
            <svg viewBox="0 0 510 460" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="pak-grad" cx="65%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="rgba(45,42,110,0.10)" />
                  <stop offset="100%" stopColor="rgba(45,42,110,0.03)" />
                </radialGradient>
              </defs>

              {/* Country fill */}
              <path d={PAK_PATH} fill="url(#pak-grad)" stroke="rgba(45,42,110,0.35)" strokeWidth="1.5" strokeLinejoin="round" />

              {/* City dots */}
              {MAP_CITIES.map((city) => (
                <g key={city.name}>
                  {/* Pulse ring */}
                  <motion.circle
                    cx={city.x} cy={city.y} r={5}
                    fill={city.hq ? 'rgba(240,120,64,0.3)' : 'rgba(45,42,110,0.2)'}
                    animate={{ r: [5, 14, 5], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: city.delay }}
                  />
                  {/* Core dot */}
                  <circle
                    cx={city.x} cy={city.y}
                    r={city.hq ? 5 : 3.5}
                    fill={city.hq ? 'var(--orange)' : 'var(--purple)'}
                    stroke="white" strokeWidth="1.5"
                  />
                  {/* Label (skip Rawalpindi — too close to Islamabad) */}
                  {city.lx !== null && (
                    <text
                      x={city.lx} y={city.ly!}
                      fontSize={city.hq ? 9 : 8}
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
                x="90" y="300" fontSize="7"
                fontFamily="var(--font-mono)"
                fill="rgba(45,42,110,0.22)"
                letterSpacing="5"
                transform="rotate(-72,90,300)"
              >
                NATIONWIDE
              </text>
            </svg>
          </div>

          {/* City sidebar */}
          <div className="cities-panel">
            {PANEL_CITIES.map((city) => (
              <div key={city.name} className={`city-row${city.hq ? ' hq' : ''}`}>
                <div className={`city-row-dot${city.hq ? ' hq-dot' : ''}`} />
                <div>
                  <div className="city-row-name">{city.name}</div>
                  <div className="city-row-tag">{city.tag}</div>
                </div>
              </div>
            ))}
            <div className="city-row all-pak">
              <Globe size={16} />
              <div>
                <div className="city-row-name">All Pakistan</div>
                <div className="city-row-tag">Nationwide delivery</div>
              </div>
            </div>
          </div>
        </div>

        <div className="nationwide-bar reveal">
          <p>Don't see your city? <strong>No problem.</strong> We deliver to any location across Pakistan. Just WhatsApp us your requirements and delivery address.</p>
          <a href={WA_CITY} target="_blank" rel="noopener noreferrer" className="nationwide-badge">
            <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
            Enquire for Your City
          </a>
        </div>
      </div>
    </section>
  );
}
