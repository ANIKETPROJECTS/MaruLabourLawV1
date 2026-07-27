
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { ServiceContent } from '../types/content';

const PP = 'Poppins, sans-serif';

const Services = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const fetchServices = () => {
    api.get<ServiceContent[]>('/services')
      .then((data) => { setServices(data.filter((service) => !service.parentSlug)); setStatus('ready'); })
      .catch(() => setStatus('error'));
  };
  useEffect(fetchServices, []);
  useLiveContent(fetchServices);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
    }
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) videoRef.current?.pause();
      else videoRef.current?.play();
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Page Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[220px] max-h-[320px] h-[46vh] lg:min-h-[240px] lg:max-h-[380px] lg:h-[50vh]">
        {/* Background video — decorative, hidden from screen readers */}
        <video
          ref={videoRef}
          src="/assets/services-hero.mp4"
          autoPlay muted loop playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center center' }}
        />
        {/* Dark tint overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.52)' }} />
        {/* Centered text */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-5 lg:px-6">
          <h1
            className="uppercase leading-[1.15] lg:leading-[1.1] mb-3 lg:mb-4 whitespace-nowrap"
            style={{
              fontFamily: PP,
              fontSize: 'clamp(1.5rem, 6.4vw, 4.4rem)',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}>
            <span style={{ color: '#ffffff' }}>Our </span>
            <span style={{ color: '#fda102' }}>Consultancy Services</span>
          </h1>
          <p className="leading-relaxed mx-auto" style={{ fontFamily: PP, fontSize: 'clamp(0.85rem, 2.4vw, 1.35rem)', fontWeight: 300, color: 'rgba(255,255,255,0.82)', maxWidth: '560px' }}>
            Precision-crafted compliance solutions that protect your workforce, your business, and your future.
          </p>
        </motion.div>
      </section>

      {/* ── Services Grid ─────────────────────────────────── */}
      <section className="pt-8 lg:pt-10 pb-12 lg:pb-16 bg-[#f8fafb]">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          {status === 'loading' && (
            <p className="text-center text-gray-400 py-12" style={{ fontFamily: PP }}>Loading services…</p>
          )}
          {status === 'error' && (
            <p className="text-center text-gray-400 py-12" style={{ fontFamily: PP }}>
              Unable to load services right now. Please try again shortly.
            </p>
          )}
          {status === 'ready' && services.length === 0 && (
            <p className="text-center text-gray-400 py-12" style={{ fontFamily: PP }}>No services available yet.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {services.map((service, i) => (
              <motion.div key={service._id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border border-gray-100 group">
                <div className="h-40 lg:h-52 relative overflow-hidden">
                  <img src={service.img} alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--p-a35), transparent)' }} />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ backgroundColor: '#fda102' }}>
                    <ArrowRight size={13} className="text-white" />
                  </div>
                </div>
                <div className="p-5 lg:p-7 flex flex-col flex-grow">
                  <h3 className="font-medium mb-2 lg:mb-3 text-base lg:text-[1.2rem]" style={{ fontFamily: PP, color: '#111' }}>{service.title}</h3>
                  <p className="text-gray-500 mb-4 lg:mb-6 flex-grow leading-relaxed font-light text-sm lg:text-base" style={{ fontFamily: PP }}>{service.desc}</p>
                  <Link to={`/services/${service.slug}`}
                    className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4 lg:pt-5 group/link">
                    <span className="font-medium text-sm lg:text-base transition-colors" style={{ fontFamily: PP, color: 'var(--primary)' }}>Explore Details</span>
                    <span className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-all shrink-0"
                      style={{ backgroundColor: 'rgba(253,161,2,0.12)', color: 'var(--primary)' }}>
                      <ChevronRight size={15} />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-10 lg:py-10 text-white text-center" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-4xl mx-auto px-5 lg:px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="font-bold text-xs lg:text-sm uppercase tracking-[0.2em] lg:tracking-[0.28em] mb-3" style={{ fontFamily: PP, color: '#fda102' }}>Get Started</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.07 }}
            className="font-bold mb-4 leading-[1.2] whitespace-nowrap" style={{ fontFamily: PP, fontSize: 'clamp(1.05rem, 4.6vw, 2.8rem)' }}>Need a custom compliance structure?</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.14 }}
            className="text-white/80 mb-7 lg:mb-8 font-light leading-relaxed" style={{ fontFamily: PP, fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)' }}>We understand every business has unique operational needs. Contact us for a bespoke audit and advisory package tailored to your industry.</motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
            <Link to="/contact"
              className="inline-flex items-center gap-2 text-white px-6 lg:px-10 py-3.5 lg:py-4 rounded-full font-medium transition-colors shadow-xl text-sm lg:text-base whitespace-nowrap"
              style={{ backgroundColor: '#fda102', fontFamily: PP }}>
              Request Custom Consultation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
