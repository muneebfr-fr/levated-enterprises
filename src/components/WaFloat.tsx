import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WA_BASE, WA_CHIPS } from '../constants';

const WaSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WaFloat() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-wa-widget', handler);
    return () => window.removeEventListener('open-wa-widget', handler);
  }, []);

  return (
    <div className="wa-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            className="wa-widget-panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="wa-widget-header">
              <div className="wa-widget-header-top">
                <div className="wa-widget-avatar">
                  <WaSvg />
                </div>
                <div>
                  <div className="wa-widget-name">Levated Enterprises</div>
                  <div className="wa-widget-status"><span className="wa-status-dot" />Online</div>
                </div>
                <button className="wa-widget-close" onClick={() => setOpen(false)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="wa-widget-body">
              <div className="wa-widget-bubble">
                👋 Hi! What are you looking for?
              </div>
              <div className="wa-chips">
                {WA_CHIPS.map((chip) => (
                  <a
                    key={chip.label}
                    href={chip.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-chip"
                  >
                    <span className="wa-chip-icon">{chip.icon}</span>
                    {chip.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="wa-widget-footer">
              <a href={WA_BASE} target="_blank" rel="noopener noreferrer" className="wa-widget-open">
                Open WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`wa-float${open ? ' active' : ''}`}
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={24} /></motion.span>
            : <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><WaSvg /></motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
