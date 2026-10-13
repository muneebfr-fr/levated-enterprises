import { useEffect, useRef, type CSSProperties } from 'react';
import {
  Factory, Wrench, Monitor, Network, Printer,
  FileText, Zap, Sparkles, Package, Truck,
  ShieldCheck, Globe, MapPin, Receipt,
} from 'lucide-react';

const ITEMS = [
  { Icon: Factory,     label: 'Industrial Supplies'     },
  { Icon: Wrench,      label: 'MRO Consumables'         },
  { Icon: Monitor,     label: 'Corporate IT'            },
  { Icon: Network,     label: 'Networking Gear'         },
  { Icon: Printer,     label: 'Office Appliances'       },
  { Icon: FileText,    label: 'Stationery & Paper'      },
  { Icon: Zap,         label: 'Electrical Fittings'     },
  { Icon: Sparkles,    label: 'Janitorial Supplies'     },
  { Icon: Package,     label: 'Bulk Procurement'        },
  { Icon: Truck,       label: 'On-Time Delivery'        },
  { Icon: ShieldCheck, label: 'NTN Registered'          },
  { Icon: Globe,       label: 'Nationwide Pakistan'     },
  { Icon: MapPin,      label: 'Karachi HQ'              },
  { Icon: Receipt,     label: 'Tax Compliant Invoicing' },
];

const doubled = [...ITEMS, ...ITEMS];
const SPEED = 46;       // px per second, shared by the boxes and the belt tread
const TREAD = 28;       // px between tread ridges

export default function MarqueeStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Match the box loop duration to the belt speed, and pause when off-screen
  useEffect(() => {
    const wrap = wrapRef.current, track = trackRef.current;
    if (!wrap || !track) return;
    const setDuration = () => {
      wrap.style.setProperty('--belt-loop', `${track.scrollWidth / 2 / SPEED}s`);
    };
    setDuration();
    const ro = new ResizeObserver(setDuration);
    ro.observe(track);
    const io = new IntersectionObserver(([e]) => wrap.classList.toggle('is-offscreen', !e.isIntersecting));
    io.observe(wrap);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <div
      className="belt-wrap"
      ref={wrapRef}
      style={{ '--tread': `${TREAD}px`, '--tread-time': `${TREAD / SPEED}s` } as CSSProperties}
      aria-label="What we supply"
    >
      <div className="belt-track" ref={trackRef}>
        {doubled.map(({ Icon, label }, i) => (
          <div className={`belt-box size-${i % 3}`} key={i} aria-hidden={i >= ITEMS.length}>
            <span className="belt-box-top" />
            <span className="belt-box-side" />
            <span className="belt-box-tape" />
            <span className="belt-box-label">
              <Icon size={12} />
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="belt" aria-hidden="true">
        <div className="belt-surface"><span className="belt-tread" /></div>
        <div className="belt-edge" />
      </div>
    </div>
  );
}
