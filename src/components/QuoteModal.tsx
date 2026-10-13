import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Trash2, Copy, Check, Mail } from 'lucide-react';
import { EMAIL } from '../constants';

const CATEGORIES = [
  'Industrial & MRO', 'PPE & Safety', 'IT & Networking', 'Office Appliances',
  'Stationery', 'Hardware & Electrical', 'Security Systems', 'Facility Care', 'Other',
];
const TIMELINES = ['As soon as possible', 'Within a week', 'Within a month', 'Flexible'];
const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot'];

type Item = { desc: string; qty: string };
type Form = {
  name: string; company: string; phone: string; city: string;
  timeline: string; notes: string; categories: string[]; items: Item[];
};

const EMPTY: Form = {
  name: '', company: '', phone: '', city: '', timeline: TIMELINES[0], notes: '',
  categories: [], items: [{ desc: '', qty: '' }],
};

const makeRef = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `LE-Q-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
};

function buildEmail(f: Form, ref: string) {
  const items = f.items.filter(i => i.desc.trim());
  const subject = `Quote Request ${ref} | ${f.company.trim()}${f.categories.length ? ` | ${f.categories.join(', ')}` : ''}`;
  const lines = [
    `QUOTE REQUEST ${ref}`,
    '',
    `Name: ${f.name.trim()}`,
    `Company: ${f.company.trim()}`,
    ...(f.phone.trim() ? [`Phone: ${f.phone.trim()}`] : []),
    `Delivery city: ${f.city.trim()}`,
    `Needed by: ${f.timeline}`,
    ...(f.categories.length ? [`Categories: ${f.categories.join(', ')}`] : []),
    '',
    'ITEMS',
    ...items.map((it, n) => `${n + 1}. ${it.desc.trim()}${it.qty.trim() ? `  x ${it.qty.trim()}` : ''}`),
    ...(f.notes.trim() ? ['', 'NOTES', f.notes.trim()] : []),
    '',
    'Sent from levatedenterprises.com.pk',
  ];
  return { subject, body: lines.join('\n') };
}

export default function QuoteModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ ref: string; subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-quote-form', onOpen);
    return () => window.removeEventListener('open-quote-form', onOpen);
  }, []);

  // A sent request starts fresh next time; an unsent draft is kept
  useEffect(() => {
    if (!open && sent) { setSent(null); setForm(EMPTY); setErrors({}); }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstField.current?.focus(), 250);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open]);

  // Every update derives from the latest state, so quick successive taps don't drop changes
  const update = <K extends keyof Form>(k: K, fn: (prev: Form[K]) => Form[K]) => {
    setForm(f => ({ ...f, [k]: fn(f[k]) }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };
  const set = <K extends keyof Form>(k: K, v: Form[K]) => update(k, () => v);
  const setItem = (i: number, patch: Partial<Item>) =>
    update('items', items => items.map((it, n) => (n === i ? { ...it, ...patch } : it)));
  const toggleCat = (c: string) =>
    update('categories', cats => (cats.includes(c) ? cats.filter(x => x !== c) : [...cats, c]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Please add your name';
    if (!form.company.trim()) errs.company = 'Please add your company';
    if (!form.city.trim()) errs.city = 'Where should we deliver?';
    if (!form.items.some(i => i.desc.trim())) errs.items = 'Add at least one item you need';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const ref = makeRef();
    const { subject, body } = buildEmail(form, ref);
    setSent({ ref, subject, body });
    setCopied(false);
    const a = document.createElement('a');
    a.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    a.click();
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${EMAIL}\nSubject: ${sent.subject}\n\n${sent.body}`);
      setCopied(true);
    } catch { /* clipboard blocked; the text is still visible to select by hand */ }
  };

  const close = () => setOpen(false);
  const startOver = () => { setSent(null); setForm(EMPTY); setErrors({}); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="quote-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={e => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            className="quote-panel"
            role="dialog" aria-modal="true" aria-labelledby="quote-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" className="quote-close" onClick={close} aria-label="Close">
              <X size={20} />
            </button>

            {!sent ? (
              <form onSubmit={submit} noValidate>
                <div className="quote-head">
                  <span className="quote-eyebrow">Request a Quote</span>
                  <h2 id="quote-title" className="quote-title">Tell us what you need</h2>
                  <p className="quote-sub">Fill this in and we'll build the email for you. We reply with a formal, itemised quote within 24 hours.</p>
                </div>

                <div className="quote-section">
                  <span className="quote-label">What are you looking for? <em>Pick any that apply</em></span>
                  <div className="quote-chips">
                    {CATEGORIES.map(c => (
                      <button
                        type="button" key={c}
                        className={`quote-chip${form.categories.includes(c) ? ' on' : ''}`}
                        aria-pressed={form.categories.includes(c)}
                        onClick={() => toggleCat(c)}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                <div className="quote-section">
                  <span className="quote-label">Items &amp; quantities</span>
                  <div className="quote-items">
                    {form.items.map((it, i) => (
                      <div className="quote-item" key={i}>
                        <span className="quote-item-num">{i + 1}</span>
                        <input
                          className="quote-input" placeholder="Item, brand or spec, e.g. Safety helmets, white"
                          value={it.desc} onChange={e => setItem(i, { desc: e.target.value })}
                          aria-label={`Item ${i + 1} description`}
                        />
                        <input
                          className="quote-input quote-qty" placeholder="Qty"
                          value={it.qty} onChange={e => setItem(i, { qty: e.target.value })}
                          aria-label={`Item ${i + 1} quantity`}
                        />
                        {form.items.length > 1 && (
                          <button
                            type="button" className="quote-item-remove" aria-label={`Remove item ${i + 1}`}
                            onClick={() => update('items', items => items.filter((_, n) => n !== i))}
                          ><Trash2 size={15} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                  {form.items.length < 15 && (
                    <button type="button" className="quote-add" onClick={() => update('items', items => [...items, { desc: '', qty: '' }])}>
                      <Plus size={15} /> Add another item
                    </button>
                  )}
                  {errors.items && <span className="quote-error">{errors.items}</span>}
                </div>

                <div className="quote-grid">
                  <label className="quote-field">
                    <span className="quote-label">Your name</span>
                    <input ref={firstField} className={`quote-input${errors.name ? ' invalid' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
                    {errors.name && <span className="quote-error">{errors.name}</span>}
                  </label>
                  <label className="quote-field">
                    <span className="quote-label">Company</span>
                    <input className={`quote-input${errors.company ? ' invalid' : ''}`} value={form.company} onChange={e => set('company', e.target.value)} autoComplete="organization" />
                    {errors.company && <span className="quote-error">{errors.company}</span>}
                  </label>
                  <label className="quote-field">
                    <span className="quote-label">Delivery city</span>
                    <input className={`quote-input${errors.city ? ' invalid' : ''}`} value={form.city} onChange={e => set('city', e.target.value)} list="quote-cities" autoComplete="address-level2" />
                    <datalist id="quote-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                    {errors.city && <span className="quote-error">{errors.city}</span>}
                  </label>
                  <label className="quote-field">
                    <span className="quote-label">Phone <em>Optional</em></span>
                    <input className="quote-input" value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" autoComplete="tel" placeholder="For quick clarifications" />
                  </label>
                  <div className="quote-field quote-field-wide">
                    <span className="quote-label" id="quote-timeline">Needed by</span>
                    <div className="quote-segment" role="radiogroup" aria-labelledby="quote-timeline">
                      {TIMELINES.map(t => (
                        <button type="button" key={t} role="radio" aria-checked={form.timeline === t} className={form.timeline === t ? 'on' : ''} onClick={() => set('timeline', t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <label className="quote-field quote-field-wide">
                    <span className="quote-label">Anything else? <em>Optional</em></span>
                    <textarea className="quote-input quote-notes" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Preferred brands, specs, delivery address, PO requirements..." />
                  </label>
                </div>

                <div className="quote-footer">
                  <p className="quote-footnote">This opens your email app with everything filled in. Just hit send.</p>
                  <button type="submit" className="btn-orange quote-submit">
                    <Mail size={17} /> Create Quote Email
                  </button>
                </div>
              </form>
            ) : (
              <div className="quote-done">
                <div className="quote-done-icon"><Check size={28} /></div>
                <span className="quote-eyebrow">Reference {sent.ref}</span>
                <h2 id="quote-title" className="quote-title">Your quote email is ready</h2>
                <p className="quote-sub">Your email app should have opened with everything filled in. Hit send and we'll reply with a formal quote within 24 hours.</p>

                <div className="quote-fallback">
                  <p><strong>Email app didn't open?</strong> Copy the details below and send them to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
                  <pre className="quote-preview">{`Subject: ${sent.subject}\n\n${sent.body}`}</pre>
                  <button type="button" className="quote-copy" onClick={copy}>
                    {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy details</>}
                  </button>
                </div>

                <div className="quote-done-actions">
                  <button type="button" className="quote-link" onClick={startOver}>Request another quote</button>
                  <button type="button" className="btn-orange" onClick={close}>Done</button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
