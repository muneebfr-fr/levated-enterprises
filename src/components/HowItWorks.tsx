import { MessageSquare, SearchCheck, Truck } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const STEPS = [
  {
    Icon: MessageSquare,
    title: 'Share Your Requirements',
    desc: 'Send us your requirements via WhatsApp or email: product specs, quantity, delivery location. We respond within 24 hours with a detailed quote.',
  },
  {
    Icon: SearchCheck,
    title: 'Quality-Controlled Sourcing',
    desc: 'We source from verified Pakistani and international suppliers, inspect for quality, and consolidate everything into a single managed order on your behalf.',
  },
  {
    Icon: Truck,
    title: 'On-Time Delivery',
    desc: 'Full NTN/GST-compliant documentation, tracked dispatch, and guaranteed delivery to Karachi, Lahore, Islamabad, or wherever your operations are.',
  },
];

export default function HowItWorks() {
  const r0 = useReveal();

  return (
    <section id="route">
      <div className="section-wrap">
        <div className="route-header reveal" ref={r0}>
          <div className="eyebrow">The Levated Route</div>
          <h2 className="section-h2">
            Simple process.<br /><span className="accent">Guaranteed results.</span>
          </h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
            From your first WhatsApp message to delivery at your door. Simple, transparent, and accountable.
          </p>
        </div>

        <div className="route-steps">
          {STEPS.map((step, i) => (
            <div key={step.title} className={`route-step reveal reveal-delay-${i + 1}`}>
              <div className="route-step-num">
                <step.Icon size={28} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
