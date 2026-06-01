import { useRef } from 'react';
import { MessageSquare, SearchCheck, Truck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';

const STEPS = [
  {
    Icon: MessageSquare,
    title: 'Enquire & Get a Quote',
    desc: 'WhatsApp us your product and quantity needs — we\'ll clarify details and follow up with a formal quote by email. No obligation, just a clear price.',
  },
  {
    Icon: SearchCheck,
    title: 'Quality-Controlled Sourcing',
    desc: 'Once you confirm the quote, we source from verified Pakistani and international suppliers, inspect for quality, and consolidate into a single managed order.',
  },
  {
    Icon: Truck,
    title: 'On-Time Delivery',
    desc: 'Full NTN/GST-compliant documentation, tracked dispatch, and reliable delivery to Karachi or anywhere across Pakistan — wherever your operations are.',
  },
];

export default function HowItWorks() {
  const r0 = useReveal();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'center center'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="route" ref={sectionRef}>
      <div className="section-wrap">
        <div className="route-header reveal" ref={r0}>
          <div className="eyebrow">The Levated Route</div>
          <h2 className="section-h2">
            Simple process.<br /><span className="accent">Guaranteed results.</span>
          </h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
            WhatsApp us to enquire. We quote by email. Then we source, pack, and deliver — simple, transparent, and accountable.
          </p>
        </div>

        <div className="route-steps">
          {/* Animated connector SVG — replaces the CSS ::before static line */}
          <svg
            className="route-connector"
            viewBox="0 0 6 1"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#2D2A6E" />
                <stop offset="100%" stopColor="#F07840" />
              </linearGradient>
            </defs>
            {/* Faint static track */}
            <line x1="1" y1="0.5" x2="5" y2="0.5"
              stroke="rgba(45,42,110,0.12)" strokeWidth="0.08" />
            {/* Animated gradient fill */}
            <motion.line
              x1="1" y1="0.5" x2="5" y2="0.5"
              stroke="url(#line-grad)"
              strokeWidth="0.12"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className={`route-step reveal reveal-delay-${i + 1}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="route-step-num"
                whileInView={{ scale: [0.8, 1.1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              >
                <step.Icon size={28} />
              </motion.div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
