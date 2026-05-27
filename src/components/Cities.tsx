import { useReveal } from '../hooks/useReveal';
import { WA_CITY } from '../constants';

const CITIES = [
  { flag: '🏙️', name: 'Karachi', tag: 'HQ · Main Hub', hq: true },
  { flag: '🏢', name: 'Lahore', tag: 'Industrial' },
  { flag: '🏛️', name: 'Islamabad', tag: 'Corporate' },
  { flag: '🏭', name: 'Faisalabad', tag: 'Textile Hub' },
  { flag: '🌆', name: 'Rawalpindi', tag: 'Commercial' },
  { flag: '🌍', name: 'All Pakistan', tag: 'Nationwide' },
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

        <div className="cities-grid">
          {CITIES.map((city, i) => (
            <div
              key={city.name}
              className={`city-card reveal reveal-delay-${(i % 3) + 1}${city.hq ? ' hq' : ''}`}
            >
              <div className="city-flag">{city.flag}</div>
              <div className="city-name">{city.name}</div>
              <div className="city-tag">{city.tag}</div>
            </div>
          ))}
        </div>

        <div className="nationwide-bar reveal" ref={r2}>
          <p>Don't see your city? <strong>No problem.</strong> We deliver to any location across Pakistan. Just WhatsApp us your requirements and delivery address.</p>
          <a href={WA_CITY} target="_blank" rel="noopener noreferrer" className="nationwide-badge">
            📍 Enquire for Your City
          </a>
        </div>
      </div>
    </section>
  );
}
