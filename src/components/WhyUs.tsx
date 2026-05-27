import { useReveal } from '../hooks/useReveal';
import { LOGO, WA_BULK } from '../constants';

const CARDS = [
  { icon: '⏱️', title: 'Reliability', desc: 'We guarantee fulfillment on time and to your exact specifications, minimizing your operational risk across every order we handle in Pakistan.' },
  { icon: '📋', title: 'Full Transparency', desc: 'No hidden costs. Clear pricing, proper invoicing, and full visibility into our sourcing and quality standards, every single time.' },
  { icon: '📦', title: 'Bulk Capacity', desc: 'Whether it\'s 100 units or 10,000, we have a proven track record of handling complex, large-scale purchase orders with ease.' },
  { icon: '🧾', title: 'Tax Compliance', desc: 'NTN registered, STRN verified, GST compliant. Your invoicing and documentation is as solid as the supplies we deliver.' },
];

export default function WhyUs() {
  const r0 = useReveal();
  const r1 = useReveal();

  return (
    <section id="why">
      <div className="section-wrap">
        <div className="reveal" ref={r0}>
          <div className="eyebrow">Why Choose Us</div>
          <h2 className="section-h2">The Levated difference</h2>
          <p className="section-sub">We operate with a deep understanding of the local B2B landscape. Every order is handled with precision, transparency, and full compliance.</p>
        </div>

        <div className="why-grid">
          <div className="why-cards">
            {CARDS.map((card, i) => (
              <div key={card.title} className={`why-card reveal reveal-delay-${i + 1}`}>
                <div className="why-card-icon">{card.icon}</div>
                <div>
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="why-visual reveal reveal-delay-2" ref={r1}>
            <div className="why-logo-section">
              <img src={LOGO} alt="Levated Enterprises" />
            </div>
            <div className="why-quote">
              <p>"We consolidate your sourcing while you reduce vendor management costs and guarantee consistency across all your Pakistani operations."</p>
            </div>
            <a href={WA_BULK} target="_blank" rel="noopener noreferrer" className="why-cta-wa">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div className="why-cta-wa-text">
                <span>Chat with us now</span>
                <strong>WhatsApp Enquiry</strong>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
