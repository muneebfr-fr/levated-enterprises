import { useEffect } from 'react';
import ScrollProgress from '../components/ScrollProgress';
import WaFloat from '../components/WaFloat';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MarqueeStrip from '../components/MarqueeStrip';
import Mission from '../components/Mission';
import Services from '../components/Services';
import Cities from '../components/Cities';
import WhyUs from '../components/WhyUs';
import HowItWorks from '../components/HowItWorks';
import Cta from '../components/Cta';
import Footer from '../components/Footer';

export default function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <ScrollProgress />
      <WaFloat />
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <Mission />
      <Services />
      <Cities />
      <WhyUs />
      <HowItWorks />
      <Cta />
      <Footer />
    </>
  );
}
