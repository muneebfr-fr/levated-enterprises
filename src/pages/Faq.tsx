import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WaFloat from '../components/WaFloat';
import WaButton from '../components/WaButton';
import { EMAIL_MAILTO, LOGO } from '../constants';
import { setPageMeta } from '../utils/setPageMeta';

const CATEGORIES = [
  {
    label: 'General',
    items: [
      {
        q: 'Do you deliver outside Karachi?',
        a: 'Yes. While our office and dispatch hub is based in Karachi, we deliver to businesses across Pakistan including Lahore, Islamabad, Faisalabad, Rawalpindi, and beyond. WhatsApp us your delivery address and we\'ll confirm coverage and lead time.',
      },
      {
        q: 'How do I get a quote?',
        a: 'Email us at info@levatedenterprises.com.pk with your product name, quantity, specifications, and delivery location. We\'ll respond with a formal, itemised quote within 24 hours. For general questions before you\'re ready to request a quote, you can reach us on WhatsApp at +92 333 3122898.',
      },
      {
        q: 'Can you source a product that isn\'t listed on your website?',
        a: 'Yes, frequently. Our listed categories are a guide, not a ceiling. WhatsApp us with a description of what you need and we\'ll confirm sourcing feasibility. Once confirmed, email us the full spec to receive a formal quote.',
      },
      {
        q: 'How long does it take to receive a quote after enquiring?',
        a: 'We aim to respond to all quote requests within 24 hours on business days. For straightforward items we stock regularly, quotes often come back the same day.',
      },
      {
        q: 'What information do I need to provide when requesting a quote?',
        a: 'The more specific you can be, the faster we can quote. Ideally: product name or description, quantity required, any relevant specifications (brand, rating, size, certification), and your delivery location.',
      },
    ],
  },
  {
    label: 'Products',
    items: [
      {
        q: 'Do you supply PPE and safety equipment?',
        a: 'Yes. Our PPE range includes safety shoes and spectacles, safety helmets, medical gloves, medicated masks, safety harnesses and vests, and particulate respirators. All items are available in bulk and sourced to meet workplace safety and compliance requirements. WhatsApp us to check availability, or email to request a quote.',
      },
      {
        q: 'Do you supply instrumentation and industrial measurement equipment?',
        a: 'Yes. We supply a comprehensive range including pressure gauges, transmitters, flow meters, circuit breakers, panel lights, sensors, multimeters, insulation testers, and control valves. WhatsApp us to check availability, or email to request a quote.',
      },
      {
        q: 'Do you supply CCTV, access control, and security systems?',
        a: 'Yes. Our security and surveillance range covers IP and analogue surveillance systems, access control solutions, public addressing systems, security control rooms, handheld metal detectors, under-vehicle search mirrors, and electronic gates and barriers. WhatsApp us to check availability, or email to request a quote.',
      },
      {
        q: 'Do you supply structured cabling and IT infrastructure?',
        a: 'Yes. We supply and support structured cabling and electronics infrastructure including computer systems, laptops and tablets, network cabling, wireless solutions, IP phones, PABX systems, video conferencing systems, network racks, and fibre optic cables. WhatsApp us to check availability, or email to request a quote.',
      },
    ],
  },
  {
    label: 'Compliance',
    items: [
      {
        q: 'Are you NTN registered?',
        a: 'Yes. Levated Enterprises is NTN registered, STRN verified, and fully GST compliant. All invoices are tax-compliant and suitable for corporate accounting, audit, and procurement records.',
      },
      {
        q: 'Do you issue GST-compliant invoices?',
        a: 'Yes, every order comes with full NTN/GST-compliant documentation. Our invoices are structured for corporate finance and are suitable for tax filing, audits, and procurement records.',
      },
      {
        q: 'Are your products certified or compliant with Pakistani safety standards?',
        a: 'Where applicable, yes. We source from verified suppliers and can provide product certifications, safety datasheets, or compliance documentation on request, particularly for PPE and electrical items. Mention any specific compliance requirement in your email when requesting a quote.',
      },
    ],
  },
];

function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`faq-item${open ? ' faq-item-open' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="faq-question" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-icon">
          <AnimatePresence mode="wait" initial={false}>
            {open
              ? <motion.span key="minus" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><Minus size={16} /></motion.span>
              : <motion.span key="plus"  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Plus size={16} /></motion.span>
            }
          </AnimatePresence>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({
      title: 'Industrial Supplies FAQ | Levated Enterprises Pakistan',
      description: 'Answers to common questions about Levated Enterprises — delivery coverage, how to get a quote, NTN registration, PPE, instrumentation, IT infrastructure, and GST compliance.',
      canonical: 'https://www.levatedenterprises.com.pk/faq',
    });
    return () => {
      setPageMeta({
        title: 'B2B Industrial Supplies & Procurement | Levated Enterprises',
        description: 'Karachi-based B2B supplier of industrial MRO, PPE, IT hardware, office supplies, security systems and structured cabling. NTN registered. Delivering across Pakistan.',
        canonical: 'https://www.levatedenterprises.com.pk/',
      });
    };
  }, []);

  return (
    <>
      <WaFloat />
      <Navbar />

      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Support</div>
            <h1 className="faq-h1">Frequently Asked<br /><span className="accent">Questions</span></h1>
            <p className="faq-sub">Everything you need to know about working with Levated Enterprises.</p>
            <div className="faq-hero-ctas">
              <WaButton className="btn-orange">
                WhatsApp for Info
              </WaButton>
              <a href={EMAIL_MAILTO} className="btn-wa-hero">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email for a Quote
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="faq-body">
        <div className="faq-wrap">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="faq-category">
              <div className="faq-category-label">
                <span>{cat.label}</span>
              </div>
              <div className="faq-list">
                {cat.items.map((item, i) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="faq-cta">
        <motion.div
          className="faq-cta-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={LOGO} alt="Levated Enterprises" className="faq-cta-logo" />
          <h2 className="faq-cta-h2">Still have a question?</h2>
          <p className="faq-cta-p">WhatsApp us for general information. Email us when you're ready for a formal quote.</p>
          <div className="faq-cta-btns">
            <WaButton className="nav-wa">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp for Info
            </WaButton>
            <a href={EMAIL_MAILTO} className="nav-email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email for a Quote
            </a>
          </div>
          <Link to="/" className="faq-back">Back to main site</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
