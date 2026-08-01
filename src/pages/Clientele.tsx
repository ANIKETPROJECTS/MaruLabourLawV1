import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { ClienteleContent } from '../types/content';
import { ALL_CLIENTS, HdfcLogo, TataLogo, RelianceLogo, InfosysLogo, WiproLogo, MahindraLogo, LandTLogo, ItcLogo, GodrejLogo, BajajLogo } from '../components/ClientLogos';
import { useInView } from 'framer-motion';
import customerReviewIcon from '@assets/customer-review_1783487769231.png';
import manufacturingImg from '../assets/sectors/manufacturing.jpg';
import bankingImg from '../assets/sectors/banking.jpg';
import itImg from '../assets/sectors/it.jpg';
import retailImg from '../assets/sectors/retail.jpg';
import healthcareImg from '../assets/sectors/healthcare.jpg';
import hospitalityImg from '../assets/sectors/hospitality.jpg';
import logisticsImg from '../assets/sectors/logistics.jpg';
import othersImg from '../assets/sectors/others.jpg';

const PP = 'Poppins, sans-serif';

/* ── Animated count-up ── */
function StatCounter({ target, decimals = 0, suffix = '' }: { target: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState('0');
  // Clamp decimals to 0–3 to prevent toFixed() from throwing on malformed CMS values
  const safeDecimals = Math.max(0, Math.min(3, Number.isFinite(decimals) ? decimals : 0));
  const safeTarget = Number.isFinite(target) ? target : 0;
  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const eased = 1 - Math.pow(1 - Math.min((now - start) / duration, 1), 3);
      setDisplay((eased * safeTarget).toFixed(safeDecimals));
      if (eased < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, safeTarget, safeDecimals]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Fallback industry images (bundled) — used when DB has no override ── */
const FALLBACK_IMAGES = [
  manufacturingImg, bankingImg, itImg, retailImg,
  healthcareImg, hospitalityImg, logisticsImg, othersImg,
];

const DEFAULT_STATS = [
  { target: 500, suffix: '+', decimals: 0, label: 'Clients Served' },
  { target: 15,  suffix: '+', decimals: 0, label: 'Years of Expertise' },
  { target: 8,   suffix: '+', decimals: 0, label: 'Industries' },
  { target: 98,  suffix: '%', decimals: 0, label: 'Retention Rate' },
];

const DEFAULT_INDUSTRIES = [
  { name: 'Manufacturing',              count: '120+', image: '' },
  { name: 'Banking & Finance',          count: '85+',  image: '' },
  { name: 'Information Technology',     count: '95+',  image: '' },
  { name: 'Retail & FMCG',             count: '70+',  image: '' },
  { name: 'Healthcare & Pharma',        count: '55+',  image: '' },
  { name: 'Hospitality',               count: '45+',  image: '' },
  { name: 'Logistics & Infrastructure', count: '60+',  image: '' },
  { name: 'Others',                    count: '70+',  image: '' },
];

const DEFAULT_TESTIMONIALS = [
  { text: "Maru Consultancy transformed our chaotic compliance process into a streamlined, risk-free system. Their expertise in the New Wage Code is unmatched in the industry.", author: "Rajesh Sharma", role: "HR Director, TechNova" },
  { text: "Their proactive approach to statutory audits saved us from significant penalties. They don't just consult — they become an extension of your team.", author: "Meera Reddy", role: "CEO, Manufacturing Corp" },
  { text: "The contract staffing solutions allowed us to scale rapidly during our peak season without any compliance headaches whatsoever.", author: "Vikram Singh", role: "VP Operations, Retail Giant" },
  { text: "Maru Consultancy's compliance framework saved us lakhs in potential penalties. Their team anticipates regulatory changes before they even happen.", author: "Priya Kapoor", role: "CFO, Apex Industries" },
  { text: "We have expanded to 6 states and Maru handled every state-specific compliance requirement seamlessly. Truly a pan-India expert partner.", author: "Arun Nair", role: "MD, Sunrise Textiles" },
  { text: "The statutory filing support is impeccable — PF, ESIC, PT all managed without a single deadline miss in over three years.", author: "Sneha Joshi", role: "Head HR, BuildRight Infra" },
  { text: "Outstanding legal representation before the labour tribunal. The case was resolved in our favour and the whole process was stress-free.", author: "Deepak Mehta", role: "Director, Meridian Logistics" },
  { text: "Their HR policy advisory helped us modernise our standing orders in line with the new codes. Employees and management are both happy.", author: "Kavitha Rao", role: "CHRO, NovaMed Healthcare" },
];

/* ── Built-in SVG logo map (name → component) ── */
const BUILTIN_LOGOS: Record<string, () => React.JSX.Element> = {
  'Tata': TataLogo, 'Mahindra': MahindraLogo, 'L&T': LandTLogo,
  'Reliance': RelianceLogo, 'ITC': ItcLogo, 'Godrej': GodrejLogo,
  'HDFC Bank': HdfcLogo, 'Bajaj': BajajLogo,
  'Infosys': InfosysLogo, 'Wipro': WiproLogo,
};

/* ── Default portfolio (fallback when DB is empty) ── */
const DEFAULT_PORTFOLIO = [
  { sector: 'Manufacturing & Conglomerates', clients: [
    { name: 'Tata', logoUrl: '' }, { name: 'Mahindra', logoUrl: '' }, { name: 'L&T', logoUrl: '' },
    { name: 'Reliance', logoUrl: '' }, { name: 'ITC', logoUrl: '' }, { name: 'Godrej', logoUrl: '' },
  ]},
  { sector: 'Banking & Finance', clients: [
    { name: 'HDFC Bank', logoUrl: '' }, { name: 'Bajaj', logoUrl: '' },
  ]},
  { sector: 'Information Technology', clients: [
    { name: 'Infosys', logoUrl: '' }, { name: 'Wipro', logoUrl: '' },
  ]},
];

const Clientele = () => {
  const [apiData, setApiData] = useState<ClienteleContent | null>(null);
  const fetchClientele = () => {
    api.get<ClienteleContent>('/industries').then(setApiData).catch(() => {/* use hardcoded defaults */});
  };
  useEffect(fetchClientele, []);
  useLiveContent(fetchClientele);

  const stats        = apiData?.stats?.length        ? apiData.stats        : DEFAULT_STATS;
  const industries   = apiData?.industries?.length   ? apiData.industries   : DEFAULT_INDUSTRIES;
  const testimonials = apiData?.testimonials?.length ? apiData.testimonials : DEFAULT_TESTIMONIALS;
  const portfolio    = apiData?.portfolio?.length    ? apiData.portfolio    : DEFAULT_PORTFOLIO;

  const heroEyebrow  = apiData?.heroEyebrow  ?? 'Trusted Partners';
  const heroHeadline = apiData?.heroHeadline ?? 'Our Esteemed Clientele';
  const heroSubtext  = apiData?.heroSubtext  ?? 'Trusted by 500+ corporations across India to navigate complex labour law and stay fully compliant.';

  const sectionIndustryLabel   = apiData?.sectionIndustryLabel   ?? 'Industry Spread';
  const sectionIndustryHeading = apiData?.sectionIndustryHeading ?? 'Sectors We Serve';
  const sectionIndustrySubtext = apiData?.sectionIndustrySubtext ?? 'Our compliance expertise spans every major sector of the Indian economy — from factory floors to fintech offices.';

  const sectionPortfolioLabel   = apiData?.sectionPortfolioLabel   ?? 'Our Portfolio';
  const sectionPortfolioHeading = apiData?.sectionPortfolioHeading ?? "Companies We've Served";
  const sectionPortfolioSubtext = apiData?.sectionPortfolioSubtext ?? 'From nimble startups to Fortune 500 conglomerates — our expertise spans every scale of Indian industry.';

  const marqueeText          = apiData?.marqueeText          ?? 'Serving 500+ Corporations Across India';
  const testimonialsHeading  = apiData?.testimonialsHeading  ?? 'Trusted by Industry Leaders';
  const testimonialsStats    = apiData?.testimonialsStats?.length ? apiData.testimonialsStats : [
    { target: 500, decimals: 0, suffix: '+',  label: 'Clients Served' },
    { target: 4.9, decimals: 1, suffix: '★', label: 'Average Rating' },
    { target: 15,  decimals: 0, suffix: '+',  label: 'Years of Expertise' },
    { target: 98,  decimals: 0, suffix: '%',  label: 'Retention Rate' },
  ];

  const ctaLabel      = apiData?.ctaLabel      ?? 'Join Our Clientele';
  const ctaHeading    = apiData?.ctaHeading    ?? 'Join Industry Leaders Who Trust Maru Consultancy';
  const ctaBody       = apiData?.ctaBody       ?? "Let's discuss how we can support your compliance and HR requirements across every state you operate in.";
  const ctaButtonText = apiData?.ctaButtonText ?? 'Discuss Your Requirements';

  const [activeSector, setActiveSector] = useState('');
  const sectors = portfolio.map(p => p.sector);
  const effectiveSector = activeSector && sectors.includes(activeSector) ? activeSector : (sectors[0] ?? '');

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section className="flex items-center justify-center overflow-hidden relative"
        style={{ backgroundColor: 'var(--primary)', minHeight: '200px', maxHeight: '300px', height: '38vh' }}>
        <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: '#fda102' }} />
        <div className="absolute bottom-[-80px] left-[-40px] w-[240px] h-[240px] rounded-full opacity-8 pointer-events-none"
          style={{ backgroundColor: '#7a2900' }} />
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4 lg:px-8 w-full max-w-4xl mx-auto relative z-10">
          <p className="uppercase tracking-[0.3em] font-semibold mb-2"
            style={{ fontFamily: PP, fontSize: '0.9rem', color: '#fda102' }}>
            {heroEyebrow}
          </p>
          <h1 className="font-bold mb-3"
            style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.6rem)', color: '#fff' }}>
            {heroHeadline}
          </h1>
          <p style={{
            fontFamily: PP, fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            color: 'rgba(255,255,255,0.82)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7,
          }}>
            {heroSubtext}
          </p>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white border-b border-gray-100 py-6 lg:py-8">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 flex flex-nowrap justify-center gap-2.5 sm:gap-8 lg:gap-x-20">
          {stats.map(({ target, suffix, decimals, label }, i) => (
            <motion.div key={label} className="text-center flex-1 sm:flex-initial min-w-0"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <p className="font-bold text-base sm:text-xl lg:text-3xl mb-1 whitespace-nowrap"
                style={{ fontFamily: PP, color: 'var(--primary)' }}>
                <StatCounter target={target} suffix={suffix} decimals={decimals} />
              </p>
              <p className="text-[7px] sm:text-[9px] lg:text-xs uppercase tracking-widest text-gray-400 font-semibold leading-tight"
                style={{ fontFamily: PP }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Industries We Serve ── */}
      <section className="py-10 lg:py-16" style={{ backgroundColor: '#f8fafb' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <motion.div className="text-center mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-bold tracking-[0.25em] uppercase text-xs mb-2"
              style={{ fontFamily: PP, color: 'var(--primary)' }}>{sectionIndustryLabel}</p>
            <h2 className="font-bold mb-3"
              style={{ fontFamily: PP, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#111' }}>
              {sectionIndustryHeading}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto"
              style={{ fontFamily: PP, fontSize: '1rem', lineHeight: 1.7 }}>
              {sectionIndustrySubtext}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {industries.map((ind, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-[var(--p-a20)] transition-all group">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img src={ind.image || FALLBACK_IMAGES[i] || ''} alt={ind.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-2 right-2 lg:top-3 lg:right-3 font-medium text-xs lg:text-sm px-2 lg:px-3 py-0.5 lg:py-1 rounded-full"
                    style={{ fontFamily: PP, backgroundColor: 'rgba(255,255,255,0.92)', color: 'var(--primary)' }}>
                    {ind.count}
                  </span>
                </div>
                <div className="px-3 lg:px-5 py-3 lg:py-4 text-center">
                  <h3 className="font-medium" style={{ fontFamily: PP, fontSize: 'clamp(0.82rem, 2.2vw, 1.15rem)', fontWeight: 500, color: '#111' }}>
                    {ind.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sector-wise Clients ── */}
      <section className="py-10 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="text-center mb-8 lg:mb-10">
            <p className="font-bold tracking-[0.25em] uppercase text-xs mb-2"
              style={{ fontFamily: PP, color: 'var(--primary)' }}>{sectionPortfolioLabel}</p>
            <h2 className="font-bold mb-3"
              style={{ fontFamily: PP, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#111' }}>
              {sectionPortfolioHeading}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto"
              style={{ fontFamily: PP, fontSize: '1rem', lineHeight: 1.7 }}>
              {sectionPortfolioSubtext}
            </p>
          </div>

          {/* Sector tabs */}
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mb-8 lg:mb-12">
            {sectors.map(sector => (
              <button key={sector}
                onClick={() => setActiveSector(sector)}
                className="px-3.5 lg:px-5 py-2 lg:py-2.5 rounded-full font-semibold text-xs lg:text-sm transition-all border"
                style={{
                  fontFamily: PP,
                  backgroundColor: effectiveSector === sector ? 'var(--primary)' : '#fff',
                  color: effectiveSector === sector ? '#fff' : 'var(--primary)',
                  borderColor: effectiveSector === sector ? 'var(--primary)' : 'var(--p-a25)',
                }}>
                {sector}
              </button>
            ))}
          </div>

          {/* Logos grid */}
          <motion.div
            key={effectiveSector}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
            {(portfolio.find(p => p.sector === effectiveSector)?.clients ?? []).map((client, i) => {
              const LogoComp = BUILTIN_LOGOS[client.name];
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-[#f8fafb] border border-gray-100 aspect-[3/2] rounded-2xl flex items-center justify-center px-4 lg:px-8 shadow-sm hover:shadow-md hover:border-[var(--p-a20)] transition-all"
                  title={client.name}>
                  {LogoComp ? <LogoComp /> : client.logoUrl
                    ? <img src={client.logoUrl} alt={client.name} className="max-h-12 max-w-full object-contain" />
                    : <span className="font-semibold text-sm text-center" style={{ fontFamily: PP, color: 'var(--primary)' }}>{client.name}</span>
                  }
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scrolling all-client strip */}
          <div className="mt-10 lg:mt-14 pt-8 lg:pt-10 border-t border-gray-100">
            <p className="text-center font-semibold uppercase tracking-[0.2em] lg:tracking-[0.25em] mb-6 lg:mb-8 text-[10px] lg:text-xs px-4"
              style={{ fontFamily: PP, color: 'var(--primary)' }}>
              {marqueeText}
            </p>
            <div className="overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, #fff, transparent)' }} />
              <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, #fff, transparent)' }} />
              <div className="animate-marquee pb-2">
                {[...ALL_CLIENTS, ...ALL_CLIENTS].map(({ name, Logo }, i) => (
                  <div key={i} title={name}
                    className="shrink-0 mx-4 bg-[#f8fafb] border border-gray-100 rounded-xl px-8 flex items-center justify-center hover:border-[var(--p-a20)] transition-all"
                    style={{ width: '180px', height: '80px' }}>
                    <Logo />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials (same marquee as Home) ── */}
      <section className="py-8 lg:py-10 relative overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: '#7a2900' }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: '#fda102' }} />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="text-center mb-4 px-6">
            <img src={customerReviewIcon} alt="" aria-hidden="true"
              className="mx-auto mb-4"
              style={{ width: '56px', height: '56px', filter: 'brightness(0) saturate(100%) invert(68%) sepia(86%) saturate(607%) hue-rotate(1deg) brightness(101%) contrast(106%)' }} />
            <h2 className="font-bold text-white mb-0"
              style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3.2vw, 2.8rem)' }}>
              {testimonialsHeading}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center gap-x-5 gap-y-4 md:gap-16 mb-8 px-4 flex-wrap">
            {testimonialsStats.map(({ target, decimals, suffix, label }) => (
              <div key={label} className="text-center">
                <p className="font-bold text-2xl lg:text-3xl mb-1"
                  style={{ fontFamily: PP, color: '#fda102' }}>
                  <StatCounter target={target} decimals={decimals} suffix={suffix} />
                </p>
                <p className="text-[10px] lg:text-xs uppercase tracking-widest text-white" style={{ fontFamily: PP }}>{label}</p>
              </div>
            ))}
          </motion.div>

          <div className="overflow-hidden relative">
            <div className="animate-marquee-testimonials pb-2">
              {[...testimonials, ...testimonials].map((test, i) => (
                <div key={i}
                  className="shrink-0 mx-4 rounded-2xl flex flex-col relative overflow-hidden bg-white"
                  style={{ width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                  <div className="h-[4px] w-full" style={{ backgroundColor: '#fda102' }} />
                  <div className="p-7 flex flex-col flex-grow">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} fill="#fda102" color="#fda102" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-7 flex-grow"
                      style={{ fontFamily: PP, color: '#333' }}>
                      "{test.text}"
                    </p>
                    <div className="h-px mb-5" style={{ backgroundColor: '#f0f0f0' }} />
                    <div className="flex items-center gap-3.5">
                      <div className="p-[2.5px] rounded-full shrink-0"
                        style={{ background: 'linear-gradient(135deg, #fda102, var(--primary))' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ backgroundColor: '#fff7ed', color: 'var(--primary)', fontFamily: PP }}>
                          {test.author.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-none mb-1"
                          style={{ fontFamily: PP, color: '#111' }}>{test.author}</p>
                        <p className="text-xs" style={{ fontFamily: PP, color: '#888' }}>{test.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 lg:py-16 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4 lg:px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="font-bold uppercase tracking-[0.2em] lg:tracking-[0.25em] text-xs mb-3"
            style={{ fontFamily: PP, color: 'var(--primary)' }}>
            {ctaLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.07 }}
            className="font-bold mb-4"
            style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.6rem)', color: '#111' }}>
            {ctaHeading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.14 }}
            className="text-gray-500 mb-8 leading-relaxed"
            style={{ fontFamily: PP, fontSize: '1rem' }}>
            {ctaBody}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.2 }}>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm shadow-lg transition-opacity hover:opacity-90"
              style={{ fontFamily: PP, backgroundColor: 'var(--primary)', color: '#fff' }}>
              {ctaButtonText} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Clientele;
