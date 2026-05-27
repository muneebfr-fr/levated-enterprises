import { Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';
import { WA_CITY } from '../constants';

/* City data — positions calibrated for viewBox="0 0 400 460" Pakistan outline */
const CITIES = [
  { name: 'Karachi',    tag: 'HQ · Main Hub', hq: true,  x: 218, y: 422, delay: 0.0 },
  { name: 'Lahore',     tag: 'Industrial',               x: 350, y: 188, delay: 0.5 },
  { name: 'Islamabad',  tag: 'Corporate',                x: 280, y: 118, delay: 1.0 },
  { name: 'Faisalabad', tag: 'Textile Hub',              x: 305, y: 198, delay: 1.5 },
  { name: 'Rawalpindi', tag: 'Commercial',               x: 288, y: 133, delay: 0.8 },
];

/* Simplified Pakistan outline path, viewBox 0 0 400 460 */
const PAK_PATH = `
  M 330,5 L 390,12 L 396,62 L 382,122 L 375,178
  L 362,252 L 342,332 L 305,408 L 268,445
  L 215,455 L 155,438 L 100,418 L 35,420
  L 18,388 L 12,312 L 15,262 L 42,212
  L 100,192 L 145,170 L 200,142
  L 238,120 L 255,87 L 265,50 L 298,22 Z
`;

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
          {/* SVG map */}
          <div className="pak-map-wrap">
            <svg viewBox="0 0 400 460" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Country fill */}
              <path
                d={PAK_PATH}
                fill="rgba(45,42,110,0.06)"
                stroke="rgba(45,42,110,0.28)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* City dots */}
              {CITIES.map((city) => (
                <g key={city.name}>
                  {/* Pulse ring */}
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r={6}
                    fill={city.hq ? 'rgba(240,120,64,0.25)' : 'rgba(45,42,110,0.18)'}
                    animate={{ r: [6, 16, 6], opacity: [0.7, 0, 0.7] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: city.delay,
                    }}
                  />
                  {/* Core dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={city.hq ? 5 : 4}
                    fill={city.hq ? 'var(--orange)' : 'var(--purple)'}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </g>
              ))}

              {/* City labels — positioned to avoid overlap */}
              <text x={228} y={420} fontSize="9.5" fontFamily="var(--font-display)" fill="var(--orange-dark)" fontWeight="700">Karachi</text>
              <text x={358} y={186} fontSize="9.5" fontFamily="var(--font-display)" fill="var(--purple-dark)" fontWeight="700">Lahore</text>
              <text x={200} y={112} fontSize="9.5" fontFamily="var(--font-display)" fill="var(--purple-dark)" fontWeight="700">Isb</text>
              <text x={314} y={208} fontSize="9.5" fontFamily="var(--font-display)" fill="var(--purple-dark)" fontWeight="700">Faisalabad</text>
              <text x={297} y={133} fontSize="9.5" fontFamily="var(--font-display)" fill="var(--purple-dark)" fontWeight="700">RWP</text>

              {/* Subtle nationwide label */}
              <text
                x="108" y="310"
                fontSize="8" fontFamily="var(--font-mono)"
                fill="rgba(45,42,110,0.3)"
                letterSpacing="4"
                transform="rotate(-68,108,310)"
              >
                NATIONWIDE
              </text>
            </svg>
          </div>

          {/* City panel */}
          <div className="cities-panel">
            {CITIES.map((city) => (
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
            <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Enquire for Your City
          </a>
        </div>
      </div>
    </section>
  );
}
