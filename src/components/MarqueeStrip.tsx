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

export default function MarqueeStrip() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map(({ Icon, label }, i) => (
          <div className="marquee-item" key={i}>
            <Icon size={13} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
