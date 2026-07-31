import { useState, useRef, useEffect } from 'react';
import heroVideoDefault from '@assets/7552418-hd_1080_1920_25fps_1783420764090.mp4';
import heroImageDefault from '@assets/pexels-vlada-karpovich-7433855_1783420874088.jpg';
import customerReviewIcon from '@assets/customer-review_1783487769231.png';
const maruLogoDefault = '/assets/maru-logo-new.png';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_CLIENTS } from '../components/ClientLogos';
import lottie from 'lottie-web';
import animStatutory from '../assets/animations/anim-statutory.json';
import animLabourActs from '../assets/animations/anim-labour-acts.json';
import animEstablishment from '../assets/animations/anim-establishment.json';
import animPayrollPlanning from '../assets/animations/anim-payroll-planning.json';
import animPayrollRecords from '../assets/animations/anim-payroll-records.json';
import animHr from '../assets/animations/anim-hr.json';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { HomeContent, ServiceContent } from '../types/content';

/* ── Lottie player wrapper (uses lottie-web directly, no duplicate-React risk) ── */
function LottieAnim({ animationData, className }: { animationData: unknown; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      animationData: animationData as any,
    });
    return () => anim.destroy();
  }, [animationData]);
  return <div ref={containerRef} className={className} />;
}

/* ── Typewriter effect ────────────────────────────────────── */
function useTypewriter(phrases: string[], typingSpeed = 75, deletingSpeed = 38, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx] ?? '';
    if (!isDeleting && displayed === current) {
      const t = setTimeout(() => setIsDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setPhraseIdx((p) => (p + 1) % phrases.length);
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(isDeleting
        ? current.slice(0, displayed.length - 1)
        : current.slice(0, displayed.length + 1));
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(t);
  }, [displayed, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return displayed;
}

/* ── Animated count-up stat ───────────────────────────────── */
function StatCounter({ target, decimals = 0, suffix = '' }: { target: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, decimals]);

  return <span ref={ref}>{display}{suffix}</span>;
}


const defaultPhrases = [
  'Labour Laws',
  'Labour Codes',
  'Industrial Relations',
  'Statutory Compliance',
];

const defaultTestimonials = [
  { text: "Labour Law transformed our chaotic compliance process into a streamlined, risk-free system. Their expertise in the New Wage Code is unmatched.", author: "Rajesh Sharma", role: "HR Director, TechNova" },
  { text: "Their proactive approach to statutory audits saved us from significant penalties. They don't just consult — they partner with you for the long haul.", author: "Meera Reddy", role: "CEO, Manufacturing Corp" },
  { text: "The contract staffing solutions provided by LC allowed us to scale rapidly during peak season without any compliance headaches.", author: "Vikram Singh", role: "VP Operations, Retail Giant" },
  { text: "Maru Consultancy's compliance framework saved us lakhs in potential penalties. Their team anticipates regulatory changes before they even happen.", author: "Priya Kapoor", role: "CFO, Apex Industries" },
  { text: "We have expanded to 6 states and Maru handled every state-specific compliance requirement seamlessly. Truly a pan-India expert partner.", author: "Arun Nair", role: "MD, Sunrise Textiles" },
  { text: "The statutory filing support is impeccable — PF, ESIC, PT all managed without a single deadline miss in over three years.", author: "Sneha Joshi", role: "Head HR, BuildRight Infra" },
  { text: "Outstanding legal representation before the labour tribunal. The case was resolved in our favour and the whole process was stress-free.", author: "Deepak Mehta", role: "Director, Meridian Logistics" },
  { text: "Their HR policy advisory helped us modernise our standing orders in line with the new codes. Employees and management are both happy.", author: "Kavitha Rao", role: "CHRO, NovaMed Healthcare" },
];

const defaultWhyUs = [
  { title: "Experience Since 1979", desc: "Decades of practical exposure to labour laws, statutory compliance and workforce-related regulatory matters." },
  { title: "Practical Compliance Solutions", desc: "We translate legislation and regulatory requirements into implementable HR, payroll and compliance processes." },
  { title: "Risk-Based Approach", desc: "We examine whether compliance can be demonstrated through reliable records and processes, not merely whether a document exists." },
];

const defaultOneStopCards = [
  { anim: animStatutory, title: 'Statutory Registrations', desc: 'ESI, EPF, Professional Tax' },
  { anim: animLabourActs, title: 'Core Labour Law Acts', desc: 'Contract Labour, Gratuity, Bonus' },
  { anim: animEstablishment, title: 'Establishment & Factory', desc: 'MLWF, Shops & Factories Act' },
  { anim: animPayrollPlanning, title: 'Payroll Processing', desc: 'Planning, salary structuring' },
  { anim: animPayrollRecords, title: 'Payroll Reports & Records', desc: 'MIS, salary register, FNF' },
  { anim: animHr, title: 'HR Related Matters', desc: 'Advisory day-to-day support' },
];
const oneStopAnims = [animStatutory, animLabourActs, animEstablishment, animPayrollPlanning, animPayrollRecords, animHr];

const defaultStats = [
  { target: 1979, decimals: 0, suffix: '', label: 'Serving Since' },
  { target: 45, decimals: 0, suffix: '+', label: 'Years of Experience' },
  { target: 4, decimals: 0, suffix: '', label: 'Labour Codes' },
  { target: 300, decimals: 0, suffix: '+', label: 'Clients Served' },
];

const Home = () => {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [previewServices, setPreviewServices] = useState<ServiceContent[]>([]);

  const fetchHome = () => {
    Promise.all([
      api.get<HomeContent>('/home'),
      api.get<ServiceContent[]>('/services'),
    ]).then(([home, services]) => {
      const parentServices = services.filter((service) => !service.parentSlug);
      setContent(home);
      if (home.featuredServiceSlugs?.length) {
        const map = new Map(parentServices.map(s => [s.slug, s]));
        const ordered = home.featuredServiceSlugs
          .map(slug => map.get(slug))
          .filter(Boolean) as ServiceContent[];
        setPreviewServices(ordered.slice(0, 8));
      } else {
        setPreviewServices(parentServices.slice(0, 8));
      }
    }).catch(() => {});
  };
  useEffect(fetchHome, []);
  useLiveContent(fetchHome);

  const phrases = content?.heroPhrases?.length ? content.heroPhrases : defaultPhrases;
  const typewriterText = useTypewriter(phrases);

  const testimonials = content?.testimonials?.length ? content.testimonials : defaultTestimonials;
  const whyUs = content?.whyUsItems?.length ? content.whyUsItems : defaultWhyUs;
  const oneStopCards = (content?.oneStopCards?.length ? content.oneStopCards : defaultOneStopCards).map((c, i) => ({
    ...c,
    anim: oneStopAnims[i % oneStopAnims.length],
  }));
  const stats = content?.stats?.length ? content.stats : defaultStats;
  const heroVideo = content?.heroVideoUrl || heroVideoDefault;
  const heroImage1 = content?.heroImage1Url || heroImageDefault;
  const heroImage2 = content?.heroImage2Url || heroImageDefault;
  const maruLogo = content?.whyUsLogoUrl || maruLogoDefault;
  // Expertise section collage — falls back to hero media if not set separately
  const expertiseVideo = content?.whyUsVideoUrl || heroVideo;
  const expertiseImage1 = content?.whyUsImage1Url || heroImage1;
  const expertiseImage2 = content?.whyUsImage2Url || heroImage2;

  return (
    <div className="w-full">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative flex flex-col overflow-hidden" style={{ minHeight: '78vh', backgroundColor: '#172632' }}>

        {/* Full-bleed background */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={heroImage1}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.38 }}
          />
          {/* Gradient: heavy navy left + bottom, lightens toward right */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(105deg, #172632 0%, rgba(23,38,50,0.92) 40%, rgba(23,38,50,0.55) 70%, rgba(23,38,50,0.25) 100%)',
          }} />
          {/* Subtle texture dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-4 lg:px-10 w-full py-14 lg:py-20">
          <div className="max-w-3xl w-full">

            {/* Brand name label */}
            <motion.p
              className="uppercase tracking-[0.22em] font-bold mb-4 lg:mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.62rem, 1.4vw, 0.78rem)', color: '#fda102' }}>
              Maru Consultancy Services
            </motion.p>

            {/* Pipe-separated category strip */}
            <motion.div
              className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 lg:mb-7"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}>
              {['Labour Laws', 'Labour Codes', 'Industrial Relations', 'Statutory Compliance'].map((cat, i, arr) => (
                <span key={cat} className="flex items-center gap-2">
                  <span
                    className="font-semibold text-white/90"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.72rem, 1.6vw, 0.92rem)' }}>
                    {cat}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="w-[1px] h-3 inline-block" style={{ backgroundColor: '#fda102', opacity: 0.7 }} />
                  )}
                </span>
              ))}
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="font-bold text-white mb-6 lg:mb-7"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14 }}
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(2.1rem, 4.8vw, 4rem)', lineHeight: 1.1 }}>
              Five Decades of Experience.{' '}
              <span style={{ color: '#fda102' }}>A New Era of Labour Laws.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mb-9 lg:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(0.88rem, 1.6vw, 1.05rem)',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.78)',
                maxWidth: '38rem',
              }}>
              Established in Mumbai in 1979, Maru Consultancy Services provides specialised advisory, compliance, audit and representation support to organisations navigating India's labour and employment regulatory framework.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 lg:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 whitespace-nowrap"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)', backgroundColor: '#fda102', color: '#111111', padding: '0.9rem 2.1rem' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fda102'; }}>
                Talk to Our Experts
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full font-bold border-2 border-white text-white transition-all duration-200 whitespace-nowrap"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)', padding: '0.9rem 2.1rem' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                Request a Compliance Review
              </Link>
            </motion.div>

          </div>
        </div>


      </section>

      {/* ── One Stop Consultancy Partner ─────────────────── */}
      {/* overflow-visible so the credibility card can bleed up into the hero */}
      <section className="pb-10 lg:pb-16 pt-0 overflow-visible" style={{ backgroundColor: 'var(--primary)' }}>

        {/* ── Credibility card — lives inside this section, negative margin pulls it into hero ── */}
        <div className="relative z-20 px-4 lg:px-10" style={{ marginTop: '-3.5rem', marginBottom: '2.5rem' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 16px 48px rgba(23,38,50,0.28)',
                backgroundColor: '#ffffff',
                border: '2px solid #fda102',
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}>

              <div className="grid grid-cols-2 lg:grid-cols-4">
                {[
                  { target: 1979, suffix: '',  decimals: 0, label: 'Established Since'   },
                  { target: 45,   suffix: '+', decimals: 0, label: 'Years of Experience' },
                  { target: 300,  suffix: '+', decimals: 0, label: 'Clients Served'      },
                  { target: 4,    suffix: '',  decimals: 0, label: 'Labour Codes'        },
                ].map(({ target, suffix, decimals, label }, i, arr) => (
                  <div
                    key={label}
                    className={`flex flex-col items-center justify-center text-center px-4 py-6 lg:py-7
                      ${i < arr.length - 1 ? 'border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100' : ''}
                      ${i === 1 ? 'border-r-2 border-gray-100' : ''}
                    `}>
                    <span
                      className="font-bold leading-none mb-1.5"
                      style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', color: '#172632' }}>
                      <StatCounter target={target} suffix={suffix} decimals={decimals} />
                    </span>
                    <span
                      className="font-medium leading-snug"
                      style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.65rem, 1vw, 0.78rem)', color: '#6b7280', letterSpacing: '0.04em' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>

        <div className="w-full px-4 lg:px-10">

          {/* Section header */}
          <motion.div className="text-center mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-bold uppercase mb-2 lg:mb-3 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.72rem, 2.5vw, 0.875rem)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>
              {content?.oneStopLabel ?? 'Your Complete HR & Compliance Partner'}
            </p>
            <h2 className="font-bold text-white leading-[1.15]"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.3rem, 2.8vw, 2.4rem)' }}>
              {content?.oneStopTitle ?? 'One Stop Consultancy Partner'}
            </h2>
          </motion.div>

          {/* 6-card grid — 2 cols mobile, 3 cols tablet, 6 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {oneStopCards.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex flex-col items-center text-center rounded-xl lg:rounded-2xl p-3 lg:p-10 xl:p-12"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>

                {/* Lottie animation */}
                <LottieAnim
                  animationData={item.anim}
                  className="w-20 h-20 lg:w-36 lg:h-36 xl:w-40 xl:h-40 mb-2.5 lg:mb-6 shrink-0"
                />

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-1 lg:mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.82rem, 2.4vw, 1rem)', lineHeight: 1.3 }}>
                  {item.title}
                </h3>

                {/* Desc */}
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.72rem, 2vw, 0.83rem)', fontWeight: 400, color: '#6b7280', lineHeight: 1.4 }}>
                  {item.desc}
                </p>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Why Labour Law ────────────────────────────────── */}
      <section className="py-8 lg:py-16" style={{ backgroundColor: '#f9f5f2' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-stretch">

            {/* ── Left: collage (same as hero) ── */}
            <motion.div
              className="w-full lg:w-[48%] shrink-0 flex flex-col"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <div className="flex gap-2.5 h-[280px] sm:h-[340px] lg:h-full">

                {/* Left column: tall video */}
                <div className="flex flex-col" style={{ width: '58%' }}>
                  <div className="rounded-2xl overflow-hidden shadow-md" style={{ flex: 1 }}>
                    <video
                      src={expertiseVideo}
                      autoPlay loop muted playsInline aria-hidden="true"
                      className="w-full h-full object-cover"
                      style={{ display: 'block' }}
                    />
                  </div>
                </div>

                {/* Right column: two stacked images */}
                <div className="flex flex-col gap-3" style={{ width: '42%' }}>
                  <div className="rounded-2xl overflow-hidden shadow-md" style={{ flex: '0 0 42%' }}>
                    <img src={expertiseImage1} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md" style={{ flex: 1 }}>
                    <img src={expertiseImage2} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                  </div>
                </div>

              </div>
            </motion.div>

            {/* ── Right: white card with text + numbered list ── */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <div className="bg-white rounded-2xl pt-4 pb-6 px-4 lg:pt-6 lg:pb-12 lg:px-12 shadow-xl">

                <img src={maruLogo} alt="Maru Consultancy Services" className="h-14 lg:h-20 w-auto object-contain mb-3 lg:mb-5 mx-auto block" />
                <h2 className="font-bold leading-[1.2] mb-3 lg:mb-5 line-clamp-2 lg:line-clamp-none"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.85rem, 2.4vw, 2rem)', color: '#111111' }}>
                  {content?.whyUsHeading ?? "Expertise that protects your business & empowers your workforce."}
                </h2>
                <p className="leading-relaxed text-xs lg:text-sm mb-4 lg:mb-8 text-justify"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#555555' }}>
                  {content?.whyUsBody ?? "We don't just file paperwork — we architect robust compliance frameworks. With India's labour law landscape shifting under the New Codes, you need a partner who anticipates regulatory changes before they impact your bottom line."}
                </p>

                {/* Numbered rows */}
                <div className="divide-y divide-gray-100">
                  {whyUs.map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex gap-4 py-3 lg:py-5 first:pt-0 last:pb-0">
                      <span className="font-bold shrink-0 text-base lg:text-xl leading-none mt-0.5"
                        style={{ fontFamily: 'Poppins, sans-serif', color: '#fda102' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="font-semibold mb-1 text-xs lg:text-sm"
                          style={{ fontFamily: 'Poppins, sans-serif', color: '#111111' }}>{item.title}</h4>
                        <p className="text-[0.68rem] lg:text-xs leading-relaxed text-justify"
                          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#666666' }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Services Preview ──────────────────────────────── */}
      <section className="py-10 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">

          {/* Header */}
          <motion.div className="text-center mb-8 lg:mb-12 mx-auto"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-bold text-sm lg:text-base uppercase tracking-wider mb-2 lg:mb-3"
              style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--primary)' }}>{content?.servicesPreviewLabel ?? 'Our Expertise'}</p>
            <h2 className="font-bold text-navy-900 mb-2 lg:mb-3 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.9rem, 2.8vw, 2.2rem)' }}>
              {content?.servicesPreviewTitle ?? 'Comprehensive Compliance Solutions'}
            </h2>
            <p className="text-gray-500 text-xs lg:text-sm leading-relaxed line-clamp-2 lg:line-clamp-none text-justify lg:text-center"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
              {content?.servicesPreviewDescription ?? 'Strategic guidance across the entire spectrum of Indian labour laws and human resource management.'}
            </p>
          </motion.div>

          {/* 8-card grid — 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {previewServices.map((service, i) => (
              <motion.div key={service._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">

                {/* Image */}
                <div className="h-36 lg:h-40 overflow-hidden relative shrink-0">
                  <img src={service.img} alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Body */}
                <div className="p-2.5 lg:p-5 flex-grow flex flex-col">
                  <h3 className="font-semibold text-navy-900 mb-2 leading-snug text-[0.72rem] lg:text-[0.9rem]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}>{service.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed flex-grow mb-3 hidden lg:block"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>{service.desc}</p>
                  <Link to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-[0.68rem] lg:text-xs font-semibold mt-auto group-hover:gap-2 transition-all"
                    style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--primary)' }}>
                    Explore Details <ChevronRight size={12} />
                  </Link>
                </div>

              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link to="/services"
              className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
              style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--primary)' }}>
              View All Services <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="py-8 lg:py-10 relative overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>

        {/* Decorative ambient glow — dark only, no yellow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: '#7a2900' }} />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="text-center mb-4 px-6">
            <img src={customerReviewIcon} alt="" aria-hidden="true"
              className="mx-auto mb-4"
              style={{ width: '56px', height: '56px', filter: 'brightness(0) saturate(100%) invert(68%) sepia(86%) saturate(607%) hue-rotate(1deg) brightness(101%) contrast(106%)' }} />
            <h2 className="font-bold text-white mb-0 whitespace-nowrap"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.15rem, 3.2vw, 2.8rem)' }}>
              {content?.testimonialsHeading ?? 'Trusted by Industry Leaders'}
            </h2>
          </motion.div>

          {/* ── Stats bar — count-up on scroll-into-view ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center flex-nowrap gap-2.5 sm:gap-8 md:gap-16 mb-8 px-3 sm:px-6">
            {stats.map(({ target, decimals, suffix, label }) => (
              <div key={label} className="text-center flex-1 sm:flex-initial min-w-0">
                <p className="font-bold text-base sm:text-xl lg:text-3xl mb-1 whitespace-nowrap"
                  style={{ fontFamily: 'Poppins, sans-serif', color: '#fda102', WebkitTextFillColor: '#fda102', background: 'none' }}>
                  <StatCounter target={target} decimals={decimals} suffix={suffix} />
                </p>
                <p className="text-[7px] sm:text-[9px] lg:text-xs uppercase tracking-widest leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif', color: '#ffffff' }}>{label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Scrolling card strip ── */}
          <div className="overflow-hidden relative">

            <div className="animate-marquee-testimonials pb-2">
              {[...testimonials, ...testimonials].map((test, i) => (
                <div key={i}
                  className="shrink-0 mx-2.5 rounded-xl flex flex-col relative overflow-hidden bg-white"
                  style={{
                    width: '260px',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                  }}>
                  {/* Solid amber top accent bar */}
                  <div className="h-[3px] w-full"
                    style={{ backgroundColor: '#fda102' }} />

                  <div className="p-4 flex flex-col flex-grow">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={11} fill="#fda102" color="#fda102" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <p className="text-xs leading-relaxed mb-4 flex-grow"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#333333' }}>
                      {test.text}
                    </p>

                    {/* Divider */}
                    <div className="h-px mb-3" style={{ backgroundColor: '#f0f0f0' }} />

                    {/* Author row */}
                    <div className="flex items-center gap-2.5">
                      {/* Avatar with amber ring */}
                      <div className="p-[2px] rounded-full shrink-0"
                        style={{ background: 'linear-gradient(135deg, #fda102, var(--primary))' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: '#fff7ed', color: 'var(--primary)', fontFamily: 'Poppins, sans-serif' }}>
                          {test.author.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-xs leading-none mb-0.5"
                          style={{ fontFamily: 'Poppins, sans-serif', color: '#111111' }}>{test.author}</p>
                        <p className="text-[10px]"
                          style={{ fontFamily: 'Poppins, sans-serif', color: '#888888' }}>{test.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Scrolling Client Logos — two rows, opposite directions ── */}
      <section className="py-8 lg:py-14 bg-white border-y border-gray-100 overflow-hidden">
        {/* Section label — one line, tighter tracking */}
        <motion.p className="text-center font-semibold uppercase whitespace-nowrap mb-6 lg:mb-10"
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(9.5px, 2.2vw, 11px)', letterSpacing: '0.10em', color: 'var(--primary)' }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}>
          Serving 500+ Corporations Across India
        </motion.p>

        {/* Row 1 — scrolls LEFT */}
        <div className="overflow-hidden relative mb-5 lg:mb-8">
          <div className="animate-marquee">
            {[...ALL_CLIENTS, ...ALL_CLIENTS].map(({ name, Logo }, i) => (
              <div key={i} title={name}
                className="flex items-center justify-center mx-6 lg:mx-12 shrink-0 h-14 lg:h-20 cursor-default opacity-75 hover:opacity-100 transition-opacity duration-300">
                <Logo />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls RIGHT */}
        <div className="overflow-hidden relative">
          <div className="animate-marquee-reverse">
            {[...[...ALL_CLIENTS].reverse(), ...[...ALL_CLIENTS].reverse()].map(({ name, Logo }, i) => (
              <div key={i} title={name}
                className="flex items-center justify-center mx-6 lg:mx-12 shrink-0 h-14 lg:h-20 cursor-default opacity-75 hover:opacity-100 transition-opacity duration-300">
                <Logo />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Insights ───────────────────────────────── */}
      <section className="py-10 lg:py-20 bg-[#f8fafb]">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <motion.div className="flex justify-between items-end mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div>
              <p className="font-bold tracking-[0.12em] lg:tracking-[0.18em] uppercase text-[10px] lg:text-xs mb-1.5 lg:mb-2 whitespace-nowrap"
                style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--primary)' }}>Latest Insights</p>
              <h2 className="font-bold text-navy-900 whitespace-nowrap"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.05rem, 4vw, 2.25rem)' }}>Stay informed with expert guidance</h2>
            </div>
            <Link to="/resources"
              className="hidden md:flex items-center gap-2 text-navy-900 font-semibold text-sm hover:text-teal-600 transition-colors border-b border-navy-900 hover:border-teal-600 pb-0.5">
              View All <ArrowRight size={15} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {(content?.latestInsights?.length ? content.latestInsights : [
              { category: 'New Labour Codes', title: 'Understanding the New Wage Code', desc: 'A comprehensive guide to how the new definitions of wages impact your salary structure and PF contributions.', img: '/assets/service-payroll.png', date: 'Oct 15, 2024', articleUrl: '/resources' },
              { category: 'Compliance', title: 'Navigating State-Specific Leave Policies', desc: 'Analyzing the variations in sick, casual, and earned leaves across different Indian states.', img: '/assets/service-hr.png', date: 'Oct 02, 2024', articleUrl: '/resources' },
              { category: 'Labour Audit', title: 'Preparing for Labour Inspections', desc: 'Key documents and statutory registers you must have updated before an unexpected factory inspection.', img: '/assets/service-audits.png', date: 'Sep 28, 2024', articleUrl: '/resources' },
            ]).map((post, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                <div className="relative overflow-hidden h-48">
                  <img src={post.img} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-[11px] text-teal-500 font-semibold mb-2 uppercase tracking-wider">{post.date}</p>
                  <h3 className="text-base font-display font-bold text-navy-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 flex-grow leading-relaxed">{post.desc}</p>
                  <Link to={post.articleUrl || '/resources'}
                    className="text-teal-600 font-bold text-sm flex items-center gap-1.5 hover:text-navy-900 transition-colors mt-auto">
                    Read Article <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="py-0 overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="w-full flex flex-col md:flex-row items-stretch">

          {/* Left — text content */}
          <motion.div
            initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 py-10 lg:px-16 lg:py-20">
            <h2
              className="font-bold text-white mb-3 lg:mb-5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.92rem, 3.5vw, 3rem)' }}>
              Ready to secure your compliance?
            </h2>
            <p
              className="text-xs lg:text-base leading-relaxed mb-5 lg:mb-8 text-justify"
              style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(255,255,255,0.85)' }}>
              Schedule a detailed consultation with our legal experts to audit your current HR practices and identify risks before they become liabilities.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 lg:gap-2 px-5 py-2.5 lg:px-8 lg:py-3.5 rounded-full font-bold text-white text-xs lg:text-base shadow-lg transition-all duration-200"
                style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fda102' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#e8920a';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#fda102';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}>
                Schedule Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>

          {/* Right — image, flush to edge; full, uncropped on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
            className="flex-1 md:min-h-0 relative flex items-center bg-black/5">
            <img
              src="/assets/cta-gavel.png"
              alt="Labour law compliance gavel"
              className="w-full h-auto object-contain md:h-full md:object-cover object-center md:min-h-[320px] md:max-h-[480px]"
              style={{ display: 'block' }}
            />
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Home;
