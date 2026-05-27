const ITEMS = [
  'Industrial Supplies', 'MRO Consumables', 'Corporate IT', 'Networking Gear',
  'Office Appliances', 'Stationery & Paper', 'Electrical Fittings', 'Janitorial Supplies',
  'Bulk Procurement', 'On-Time Delivery', 'NTN Registered', 'Nationwide Pakistan',
  'Karachi HQ', 'Tax Compliant Invoicing',
];

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div className="marquee-item" key={i}>
            <span className="m-dot" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
