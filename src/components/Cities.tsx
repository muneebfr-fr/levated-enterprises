import { useRef, useState } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';
import WaButton from './WaButton';
import PakistanMap3D, { type MapCity } from './PakistanMap3D';

// One list drives both the 3D map and the side panel. Positions are real coordinates.
const CITIES: MapCity[] = [
  { name: 'Karachi',    lat: 24.8607, lon: 67.0011, hq: true, tag: 'HQ · Office & Dispatch' },
  { name: 'Lahore',     lat: 31.5204, lon: 74.3587, tag: 'Delivery', side: 'right', height: 58 },
  { name: 'Islamabad',  lat: 33.6844, lon: 73.0479, tag: 'Delivery', height: 70 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350, tag: 'Delivery', side: 'left', height: 46 },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169, tag: 'Delivery', side: 'right', height: 40, quiet: true },
];

export default function Cities() {
  const r0 = useReveal();
  const r1 = useReveal();
  const r2 = useReveal();

  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
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
            <PakistanMap3D cities={CITIES} active={active} onActive={setActive} />
          </motion.div>

          {/* City sidebar */}
          <motion.div className="cities-panel" style={{ y: panelY }}>
            {CITIES.map((city, i) => (
              <motion.div
                key={city.name}
                className={`city-row${city.hq ? ' hq' : ''}${active === city.name ? ' is-active' : ''}`}
                style={{ y: rowYValues[i] }}
                onMouseEnter={() => setActive(city.name)}
                onMouseLeave={() => setActive(null)}
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
