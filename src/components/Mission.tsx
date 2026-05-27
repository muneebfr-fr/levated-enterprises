import { useReveal } from '../hooks/useReveal';
import { LOGO } from '../constants';

export default function Mission() {
  const r0 = useReveal();
  const r1 = useReveal();
  const r2 = useReveal();

  return (
    <section id="mission">
      <div className="section-wrap">
        <div className="reveal" ref={r0}>
          <div className="eyebrow">Who We Are</div>
          <h2 className="section-h2">
            Solving supply chain complexity<br />
            for <span className="accent">Pakistan</span>
          </h2>
        </div>

        <div className="mission-grid">
          <div className="mission-visual reveal reveal-delay-1" ref={r1}>
            <div className="mission-logo-display">
              <img src={LOGO} alt="Levated Enterprises" />
            </div>
            <div className="mission-tag-row">
              <span className="m-tag">Industrial MRO</span>
              <span className="m-tag orange">Bulk Orders</span>
              <span className="m-tag">Corporate IT</span>
              <span className="m-tag orange">NTN Verified</span>
              <span className="m-tag">Nationwide</span>
            </div>
            <div className="mission-metric">
              <div className="mission-metric-num">98<span>%</span></div>
              <div className="mission-metric-text">On-time delivery rate across all bulk orders in Pakistan</div>
            </div>
          </div>

          <div className="mission-text reveal reveal-delay-2" ref={r2}>
            <p>Levated Enterprises was established to bridge the gap between disjointed vendors and the needs of a modern Pakistani business. In a market where reliability can be unpredictable, we offer a high-confidence alternative.</p>
            <p>We believe that professional supply management is a strategic function, not just another line item on a budget. Our team understands the depth of procurement cycles, quality assurance, and the demanding logistics of bulk B2B delivery across Pakistan.</p>
            <div className="mission-feature-list">
              <div className="mission-feature">
                <div className="mission-feature-icon">🏭</div>
                <div>
                  <h4>Industrial & MRO Supplies</h4>
                  <p>Keep your facility running with high-grade PPE, workshop tools and machinery consumables.</p>
                </div>
              </div>
              <div className="mission-feature">
                <div className="mission-feature-icon">💻</div>
                <div>
                  <h4>Corporate IT & Networking</h4>
                  <p>High-quality communication cables, hardware, and office peripherals for a connected workspace.</p>
                </div>
              </div>
              <div className="mission-feature">
                <div className="mission-feature-icon">📄</div>
                <div>
                  <h4>Office & Stationery</h4>
                  <p>Bulk paper products and essential stationery designed for high-volume organizational needs.</p>
                </div>
              </div>
              <div className="mission-feature">
                <div className="mission-feature-icon">🧹</div>
                <div>
                  <h4>Facility Management</h4>
                  <p>Professional-grade janitorial supplies, electrical fittings, and hardware essentials.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
