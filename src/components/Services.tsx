import { useReveal } from '../hooks/useReveal';

const SERVICES = [
  { num: '01', icon: '🏭', title: 'Industrial Supplies & MRO', desc: 'We source essential maintenance, repair, and operating (MRO) consumables, including safety equipment and specialized tools for plant operations.', tag: 'PPE · Tools · Machinery Consumables', featured: true },
  { num: '02', icon: '💻', title: 'Corporate IT & Communications', desc: 'Reliable bulk provisioning of networking gear, high-quality cables and professional-grade office electronics to keep your team online.', tag: 'Cables · Switches · Peripherals' },
  { num: '03', icon: '🖨️', title: 'Office Electronic Appliances', desc: 'We handle bulk orders for all essential corporate appliances, from printers and shredders to kitchen units for the breakroom.', tag: 'Printers · Shredders · Appliances' },
  { num: '04', icon: '📄', title: 'Stationery & Paper Products', desc: 'A complete inventory of printing paper, filing systems and presentation materials to keep your office fully stocked.', tag: 'Paper · Filing · Presentation' },
  { num: '05', icon: '⚡', title: 'Hardware & Electrical', desc: 'Quality sourcing for electrical fittings, wiring and general repair hardware required for facility maintenance.', tag: 'Fittings · Wiring · Hardware' },
  { num: '06', icon: '🧹', title: 'Janitorial & Facility Care', desc: 'A comprehensive range of cleaning supplies, bulk cotton rags and sanitary products to maintain a safe, professional workspace.', tag: 'Cleaning · Hygiene · Sanitation' },
];

export default function Services() {
  const r0 = useReveal();

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
            Levated Enterprises provides the breadth of supply your business requires without the headache of logistics. We focus on bulk fulfillment across the industrial, corporate, and facility management sectors. Choose a category below to see how we can optimize your procurement cycle.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              className={`service-card reveal reveal-delay-${(i % 4) + 1}${s.featured ? ' featured' : ''}`}
            >
              <div className="service-num">{s.num}</div>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="service-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
