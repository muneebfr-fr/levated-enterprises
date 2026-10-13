import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import IsoIllustration, { type IsoName } from './IsoIllustration';
import { useReveal } from '../hooks/useReveal';
import CircuitMesh from './ui/CircuitMesh';
import { CIRCUIT_PATTERNS } from './ui/circuitPatterns';

const SERVICES = [
  {
    num: '01', art: 'industrial' as IsoName,   title: 'Industrial Supplies & MRO',
    desc: 'We source essential maintenance, repair, and operating (MRO) consumables, including safety equipment and specialized tools for plant operations.',
    tag: 'PPE · Tools · Machinery Consumables', featured: true,
  },
  {
    num: '02', art: 'it' as IsoName,   title: 'Corporate IT & Communications',
    desc: 'Reliable bulk provisioning of networking gear, high-quality cables and professional-grade office electronics to keep your team online.',
    tag: 'Cables · Switches · Peripherals',
  },
  {
    num: '03', art: 'office' as IsoName,   title: 'Office Electronic Appliances',
    desc: 'We handle bulk orders for all essential corporate appliances, from printers and shredders to kitchen units for the breakroom.',
    tag: 'Printers · Shredders · Appliances',
  },
  {
    num: '04', art: 'stationery' as IsoName,  title: 'Stationery & Paper Products',
    desc: 'A complete inventory of printing paper, filing systems and presentation materials to keep your office fully stocked.',
    tag: 'Paper · Filing · Presentation',
  },
  {
    num: '05', art: 'electrical' as IsoName,       title: 'Hardware & Electrical',
    desc: 'Quality sourcing for electrical fittings, wiring and general repair hardware required for facility maintenance.',
    tag: 'Fittings · Wiring · Hardware',
  },
  {
    num: '06', art: 'janitorial' as IsoName,  title: 'Janitorial & Facility Care',
    desc: 'A comprehensive range of cleaning supplies, bulk cotton rags and sanitary products to maintain a safe, professional workspace.',
    tag: 'Cleaning · Hygiene · Sanitation',
  },
];

export default function Services() {
  const r0 = useReveal();
  const gridRef = useRef<HTMLDivElement>(null);
  const touch = useRef(false);

  // Touch screens have no hover: burst each card apart while it crosses the
  // middle of the screen, and let a tap toggle it. The class is toggled on the
  // element directly (no React state), so cards never re-render and the
  // imperatively added .visible reveal class is left alone.
  useEffect(() => {
    touch.current = window.matchMedia('(hover: none)').matches;
    if (!touch.current || !gridRef.current) return;
    const io = new IntersectionObserver(entries => {
      for (const e of entries) e.target.classList.toggle('is-exploded', e.isIntersecting);
    }, { rootMargin: '-38% 0px -38% 0px' });
    gridRef.current.querySelectorAll('.service-card').forEach(c => io.observe(c));
    return () => io.disconnect();
  }, []);

  const toggle = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (touch.current) e.currentTarget.classList.toggle('is-exploded');
  };

  return (
    <section id="services">
      <div className="section-wrap">
        <div className="reveal" ref={r0}>
          <div className="eyebrow">What We Supply</div>
          <h2 className="section-h2">
            Tailored Procurement Solutions<br />
            for <span className="accent">Businesses in Pakistan</span>
          </h2>
          <p className="section-sub">
            Levated Enterprises provides the breadth of supply your business requires without the headache of logistics. We focus on bulk fulfillment across the industrial, corporate, and facility management sectors.
          </p>
        </div>

        <div className="services-grid" ref={gridRef}>
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              className={`service-card reveal reveal-delay-${(i % 4) + 1}${s.featured ? ' featured' : ''}`}
              onClick={toggle}
            >
              <div className="service-num">{s.num}</div>
              <div className="service-art">
                <IsoIllustration name={s.art} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="service-tag">{s.tag}</span>
              <CircuitMesh
                {...CIRCUIT_PATTERNS[s.featured ? 3 : i % 3]}
                inverted={s.featured}
                pulse={s.featured}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
