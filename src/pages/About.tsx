import { useEffect, useRef, useState } from 'react';
import { useLiveContent } from '../hooks/useLiveContent';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { AboutContent } from '../types/content';
import heroVideo from '@assets/7552418-hd_1080_1920_25fps_1783420764090.mp4';
import ctaVideo from '@assets/7691594-hd_1920_1080_25fps_1783493752065.mp4';
import heroImage from '@assets/pexels-vlada-karpovich-7433855_1783420874088.jpg';

const PP = 'Poppins, sans-serif';

/* ── inline keyframes injected once ── */
const STYLES = `
@keyframes marquee { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }
@keyframes fadeUp  { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
  will-change: transform;
  backface-visibility: hidden;
}
`;

const DEFAULT_MARQUEE_SERVICES = [
  'Labour Law Compliance',
  'Payroll & Salary Structuring',
  'Statutory Compliance & Filings',
  'People Outsourcing & Staffing',
  'Audits & Governance',
  'Registrations & Licensing',
  'HR Policy & Advisory',
  'Legal Representation',
  'Training & Workshops',
];

const DEFAULT_STORY_SLIDES = [
  { heading: 'Four decades of', headingHighlight: 'labour law expertise.', body: "For over four decades, MCS has worked alongside organisations to interpret labour legislation, manage statutory compliances, address regulatory issues and establish practical systems for workforce compliance." },
  { heading: 'Navigating India\'s', headingHighlight: 'new Labour Codes.', body: "As India transitions to a consolidated framework under the four Labour Codes, MCS combines decades of practical experience with a contemporary approach to compliance management." },
  { heading: 'Beyond routine', headingHighlight: 'filings.', body: "Our services extend beyond routine filings. We work across the employment compliance lifecycle — from establishment registrations, payroll and social security compliance to audits, contractor governance, inspections, industrial relations and Labour Codes implementation." },
  { heading: 'Experienced professionals,', headingHighlight: 'customised solutions.', body: "Supported by experienced professionals and a dedicated compliance team, MCS focuses on practical, responsive and customised solutions aligned with each client's industry, workforce structure and business requirements." },
];

const DEFAULT_HERO_STATS = [
  { value: '1979', label: 'Established' },
  { value: '45+',  label: 'Years of Experience' },
  { value: '4',    label: 'Labour Codes' },
];

const DEFAULT_CORE_VALUES = [
  { title: 'Professional Integrity',    img: '/assets/service-legal.png' },
  { title: 'Responsiveness',            img: '/assets/service-labour.png' },
  { title: 'Practical Interpretation',  img: '/assets/service-statutory.png' },
  { title: 'Process Excellence',        img: '/assets/service-audits.png' },
  { title: 'Customised Solutions',      img: '/assets/service-payroll.png' },
  { title: 'Continuous Learning',       img: '/assets/service-hr.png' },
];

const DEFAULT_JOURNEY = [
  { year: '1979', event: 'Founded',        img: '/assets/service-statutory.png', description: 'Established in Mumbai as a specialised Labour Law and statutory compliance advisory for employers.' },
  { year: '1995', event: 'Expanded',       img: '/assets/service-payroll.png',   description: 'Broadened practice to cover Industrial Relations, payroll advisory and multi-state compliance.' },
  { year: '2010', event: 'Modernised',     img: '/assets/service-training.png',  description: 'Expanded service lines to include Contract Labour management, HR advisory and compliance due diligence.' },
  { year: '2024', event: 'Labour Codes',   img: '/assets/service-hr.png',        description: "Leading implementation of India's four consolidated Labour Codes across industries and geographies." },
];

const DEFAULT_WHY_CHOOSE = [
  { point: 'Experience Since 1979',         sub: 'Decades of practical exposure to labour laws, statutory compliance and workforce-related regulatory matters.' },
  { point: 'Multi-Disciplinary Expertise',  sub: 'Leadership combining legal, HR, technology, corporate compliance and business-management perspectives.' },
  { point: 'Practical Compliance Solutions', sub: 'We help translate legislation and regulatory requirements into implementable HR, payroll and compliance processes.' },
  { point: 'Customised Advisory',           sub: "Solutions are aligned to the client's industry, establishment type, workforce structure, geography and risk profile." },
  { point: 'Responsive Support',            sub: 'A dedicated team supporting time-sensitive compliance, inspections and regulatory matters.' },
  { point: 'End-to-End Capability',         sub: 'From registrations and monthly compliance to audits, due diligence, notices, industrial relations and strategic advisory.' },
  { point: 'Risk-Based Approach',           sub: 'We examine whether compliance can be demonstrated through reliable records and processes, not merely whether a document exists.' },
  { point: 'Labour Codes Focus',            sub: "Legacy labour-law experience combined with advisory for India's consolidated Labour Codes framework." },
];

const DEFAULT_TEAM = [
  { name: 'Deepak Maru',  qualification: 'B.Com (Hons), LL.B',  role: 'Advocate\nFounder & Managing Partner', img: '/assets/service-legal.png' },
  { name: 'Sanjeev Maru', qualification: 'B.Com, LL.B',         role: 'Co-founder & Managing Partner',        img: '/assets/service-staffing.png' },
  { name: 'Pankhil Maru', qualification: 'B.E (I.T), MBA (HR)', role: 'Managing Partner',                     img: '/assets/service-hr.png' },
  { name: 'Nishit Maru',  qualification: 'BLS, LL.B, CS',       role: 'Managing Partner',                     img: '/assets/service-audits.png' },
];

const CountUpStat = ({ value, label }: { value: string; label: string }) => {
  const numeric = parseInt(value, 10);
  const suffix = value.replace(/^[0-9]+/, '');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numeric));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numeric]);

  return (
    <div>
      <p className="font-medium text-3xl text-white" style={{ fontFamily: PP }}>{count}{suffix}</p>
      <p className="text-[10px] uppercase tracking-widest mt-0.5"
        style={{ fontFamily: PP, color: 'rgba(255,255,255,0.55)' }}>{label}</p>
    </div>
  );
};

const DEFAULT_OFFICE_IMAGES = [
  '/assets/hero-office.png',
  '/assets/service-audits.png',
  '/assets/service-legal.png',
];

const OfficeImageCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  const officeImages = images.length ? images : DEFAULT_OFFICE_IMAGES;

  useEffect(() => {
    setIndex(0);
    if (officeImages.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % officeImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [officeImages.length]);

  return (
    <div className="absolute inset-0">
      <AnimatePresence>
        {officeImages.map((src, i) => (
          i === index && (
            <motion.img key={src} src={src} alt="Our office"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1 }} />
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

type SlideData = { heading: string; headingHighlight: string; body: string };

const StoryCarousel = ({ slides }: { slides: SlideData[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <div className="relative h-full flex flex-col justify-between overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={index}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}>
          <h2 className="font-bold leading-[1.2] mb-4"
            style={{ fontFamily: PP, fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)', color: '#111' }}>
            {slide.heading}<br />
            <span style={{ color: 'var(--primary)' }}>{slide.headingHighlight}</span>
          </h2>
          <p className="text-sm leading-relaxed mb-4 text-justify" style={{ fontFamily: PP, color: '#666', lineHeight: 1.8 }}>
            {slide.body}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <a href="#journey"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all w-fit cursor-pointer"
          style={{ fontFamily: PP, color: 'var(--primary)' }}>
          Our full story <ArrowRight size={15} />
        </a>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === index ? '28px' : '8px', backgroundColor: 'var(--p-a18)' }}>
              {i === index && (
                <motion.div key={index} className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: 'var(--primary)', transformOrigin: 'left' }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [apiData, setApiData] = useState<AboutContent | null>(null);
  const fetchAbout = () => {
    api.get<AboutContent>('/about').then(setApiData).catch(() => {/* use hardcoded defaults */});
  };
  useEffect(fetchAbout, []);
  useLiveContent(fetchAbout);

  const heroStats      = apiData?.heroStats?.length       ? apiData.heroStats       : DEFAULT_HERO_STATS;
  const marqueeServices= apiData?.marqueeServices?.length ? apiData.marqueeServices : DEFAULT_MARQUEE_SERVICES;
  const marqueeItems   = (() => { const m = marqueeServices.flatMap(s => [s, '|']); m.pop(); return m; })();
  const storySlides    = apiData?.storySlides?.length     ? apiData.storySlides     : DEFAULT_STORY_SLIDES;
  const pullQuoteLine1 = apiData?.pullQuoteLine1       ?? 'Compliance is not a checkbox';
  const pullQuoteLine2 = apiData?.pullQuoteLine2       ?? "It's the foundation on which";
  const pullQuoteLine3 = apiData?.pullQuoteLine3       ?? 'every great business is built';
  const pullQuoteAttribution = apiData?.pullQuoteAttribution ?? 'Deepak Maru, Founder & Managing Partner';
  const coreValues     = apiData?.coreValues?.length      ? apiData.coreValues      : DEFAULT_CORE_VALUES;
  const journeyMilestones = apiData?.journeyMilestones?.length ? apiData.journeyMilestones : DEFAULT_JOURNEY;
  const whyChooseItems = apiData?.whyChooseItems?.length  ? apiData.whyChooseItems  : DEFAULT_WHY_CHOOSE;
  const teamMembers    = apiData?.teamMembers?.length     ? apiData.teamMembers     : DEFAULT_TEAM;

  const heroEyebrow           = apiData?.heroEyebrow           ?? '';
  const heroHeadlineTop       = apiData?.heroHeadlineTop       ?? "Over Four\nDecades of";
  const heroHeadlineHighlight = apiData?.heroHeadlineHighlight ?? 'Labour Law';
  const heroHeadlineBottom    = apiData?.heroHeadlineBottom    ?? 'Expertise.';
  const heroSubtext           = apiData?.heroSubtext           ?? "Established in 1979 in Mumbai, MCS is a specialised Labour Law, Industrial Relations and Statutory Compliance consultancy supporting employers in managing India's evolving employment regulatory framework.";
  const videoUrl              = apiData?.videoUrl              ?? '';
  const heroVideoUrl          = apiData?.heroVideoUrl          ?? '';
  const VIDEO_EMBED_ALLOWLIST = ['www.youtube.com', 'youtube.com', 'player.vimeo.com', 'www.youtube-nocookie.com'];
  const sanitizeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') return '';
      if (!VIDEO_EMBED_ALLOWLIST.includes(parsed.hostname)) return '';
      return parsed.toString();
    } catch {
      return '';
    }
  };
  const safeVideoUrl = sanitizeEmbedUrl(videoUrl);
  const safeHeroVideoUrl = sanitizeEmbedUrl(heroVideoUrl);
  // Directly-uploaded video files (e.g. Cloudinary mp4s) play via <video>, not an <iframe> embed.
  const isDirectVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || /res\.cloudinary\.com\/.*\/video\/upload\//i.test(url);
  const directVideoUrl = isDirectVideoUrl(videoUrl) ? videoUrl : '';
  const directHeroVideoUrl = isDirectVideoUrl(heroVideoUrl) ? heroVideoUrl : '';

  // Hero right-panel image
  const heroImageUrl = apiData?.heroImageUrl || '';

  // Story bento
  const estYear = apiData?.estYear ?? '1979';

  // Our Approach
  const approachLabel       = apiData?.approachLabel       ?? 'How We Work';
  const approachHeading     = apiData?.approachHeading     ?? 'Our Approach';
  const approachDescription = apiData?.approachDescription ?? 'A structured, end-to-end methodology that ensures every client engagement is practical, measurable and aligned to their business reality.';
  const approachSteps       = apiData?.approachSteps?.length ? apiData.approachSteps : ['Understand', 'Assess', 'Advise', 'Implement', 'Monitor', 'Update'];

  // Why MCS
  const whyMcsLabel            = apiData?.whyMcsLabel            ?? 'Why MCS';
  const whyMcsHeading          = apiData?.whyMcsHeading          ?? 'Experience.';
  const whyMcsHeadingHighlight = apiData?.whyMcsHeadingHighlight ?? 'Interpretation.';
  const whyMcsHeadingEnd       = apiData?.whyMcsHeadingEnd       ?? 'Execution.';
  const whyMcsBadge1Value      = apiData?.whyMcsBadge1Value      ?? '98%';
  const whyMcsBadge1Label      = apiData?.whyMcsBadge1Label      ?? 'Client Retention';
  const whyMcsBadge2Value      = apiData?.whyMcsBadge2Value      ?? '500+';
  const whyMcsBadge2Label      = apiData?.whyMcsBadge2Label      ?? 'Clients Served';
  const whyMcsImageUrl         = apiData?.whyMcsImageUrl         || '';

  // Journey
  const journeyLabel   = apiData?.journeyLabel   ?? 'Our Journey';
  const journeyHeading = apiData?.journeyHeading ?? "Three decades of building India's compliance backbone";

  // Management Visibility
  const mgmtLabel     = apiData?.mgmtLabel     ?? 'Management Visibility';
  const mgmtHeading   = apiData?.mgmtHeading   ?? 'Our objective is to help management answer five questions clearly.';
  const mgmtQuestions = apiData?.mgmtQuestions?.length ? apiData.mgmtQuestions : [
    'Where are we compliant?',
    'Where are the gaps?',
    'What is the risk?',
    'What must be corrected?',
    'By when?',
  ];

  // Team
  const teamHeading = apiData?.teamHeading ?? 'Meet the Experts Behind Your Success';
  const teamSubtext = apiData?.teamSubtext ?? 'Our experienced team of labour law, payroll, HR, and compliance professionals is committed to delivering practical solutions that help your business stay compliant and grow with confidence.';

  // Video CTA
  const ctaLabel        = apiData?.ctaLabel        ?? 'Ready to Get Compliant?';
  const ctaHeadingLine1 = apiData?.ctaHeadingLine1 ?? "Let's build your compliance";
  const ctaHeadingLine2 = apiData?.ctaHeadingLine2 ?? 'framework together';
  const ctaVideoSrc     = (apiData?.ctaVideoUrl && isDirectVideoUrl(apiData.ctaVideoUrl)) ? apiData.ctaVideoUrl : ctaVideo;
  const ctaButton1Text  = apiData?.ctaButton1Text  ?? 'Schedule a Consultation';
  const ctaButton2Text  = apiData?.ctaButton2Text  ?? 'Join Our Team';

  const styleInjected = useRef(false);
  useEffect(() => {
    if (styleInjected.current) return;
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    styleInjected.current = true;
  }, []);

  return (
    <div className="w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          1. HERO — Hard two-panel split
         ══════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden grid grid-cols-1 lg:grid-cols-[48%_52%] lg:h-[calc(100vh-76px)] lg:max-h-[620px] lg:min-h-[460px]">

        {/* ── LEFT PANEL: solid brand colour ── */}
        <div className="relative flex flex-col justify-center z-10 px-6 pt-10 pb-16 lg:px-14 lg:pb-12"
          style={{ backgroundColor: 'var(--primary)' }}>

          {/* Subtle dot texture */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

          {/* Main headline */}
          <div className="relative flex flex-col justify-center">
            {heroEyebrow && (
              <motion.p className="font-bold text-xs uppercase tracking-[0.28em] mb-3 lg:mb-5"
                style={{ fontFamily: PP, color: '#ffffff' }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}>
                {heroEyebrow}
              </motion.p>
            )}

            <motion.h1
              className="font-bold text-white leading-[1.12] lg:leading-[1.08] mb-4 lg:mb-7"
              style={{ fontFamily: PP, fontSize: 'clamp(2rem, 4.5vw, 4.4rem)' }}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}>
              {heroHeadlineTop.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}<br />
              <em className="not-italic" style={{ color: '#fda102' }}>{heroHeadlineHighlight}</em><br />
              {heroHeadlineBottom}
            </motion.h1>

            <motion.p className="text-sm lg:text-base leading-[1.7] lg:leading-[1.85] max-w-[460px] mb-6 lg:mb-8 text-justify"
              style={{ fontFamily: PP, color: '#ffffff' }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}>
              {heroSubtext}
            </motion.p>
          </div>

          {/* Bottom stats strip */}
          <motion.div
            className="relative grid grid-cols-3 gap-px overflow-hidden rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}>
            {heroStats.map(({value, label}, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-4 lg:py-5 px-1 lg:px-2"
                style={{ backgroundColor: i === 1 ? 'rgba(253,161,2,0.20)' : 'rgba(0,0,0,0.15)' }}>
                <CountUpStat value={value} label={label} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT PANEL: image bg + video on top ── */}
        <div className="relative overflow-hidden h-[320px] lg:h-auto"
          style={{ backgroundImage: `url(${heroImageUrl || heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {/* Video overlays the image once loaded */}
          {directHeroVideoUrl ? (
            <video src={directHeroVideoUrl} autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover" />
          ) : safeHeroVideoUrl ? (
            <iframe
              src={safeHeroVideoUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
              referrerPolicy="no-referrer"
              title="About hero video"
            />
          ) : (
            <video src={heroVideo} autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>

        {/* Bottom amber line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20"
          style={{ backgroundColor: '#fda102' }} />
      </section>

      {/* ══════════════════════════════════════════════════════
          2. MARQUEE STRIP
         ══════════════════════════════════════════════════════ */}
      <div className="overflow-hidden py-3" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-light text-xl mx-6 whitespace-nowrap"
              style={{ fontFamily: PP, color: '#ffffff' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          3. BENTO IMAGE GRID — Our Story
         ══════════════════════════════════════════════════════ */}
      <section id="our-story" className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-4 lg:h-[580px]">

            {/* Large left cell */}
            <motion.div className="order-2 lg:order-none col-span-1 lg:col-span-5 lg:row-span-2 rounded-3xl overflow-hidden relative group h-[280px] lg:h-auto"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65 }}>
              <OfficeImageCarousel images={apiData?.storyImages ?? []} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
              <div className="absolute bottom-0 left-0 p-5 lg:p-8">
                <p className="font-bold text-2xl lg:text-4xl text-white mb-1" style={{ fontFamily: PP }}>Est.</p>
                <p className="font-bold text-white" style={{ fontFamily: PP, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, color: '#fda102' }}>{estYear}</p>
              </div>
            </motion.div>

            {/* Top-right: combined horizontal card — stats + video */}
            <motion.div className="order-3 lg:order-none col-span-1 lg:col-span-7 lg:row-span-1 rounded-3xl overflow-hidden flex flex-col sm:flex-row"
              initial={{ opacity: 0, y: -24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}>
              {/* Stats side */}
              <div className="flex-1 flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-7"
                style={{ backgroundColor: 'var(--primary)' }}>
                <p className="font-bold text-xs uppercase tracking-[0.2em] mb-3" style={{ fontFamily: PP, color: '#fda102' }}>By the Numbers</p>
                <div className="grid grid-cols-3 gap-2 lg:gap-4">
                  {heroStats.map(({value, label}) => (
                    <div key={label}>
                      <p className="font-bold text-xl lg:text-2xl text-white" style={{ fontFamily: PP }}>{value}</p>
                      <p className="text-[10px] lg:text-xs text-white/60 uppercase tracking-wide" style={{ fontFamily: PP }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Video side */}
              <div className="relative flex-1 flex items-center justify-center min-h-[160px] lg:min-h-[140px] overflow-hidden"
                style={{ backgroundColor: '#1a1a1a' }}>
                {directVideoUrl ? (
                  <video src={directVideoUrl} autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover" />
                ) : safeVideoUrl ? (
                  <iframe
                    src={safeVideoUrl}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    referrerPolicy="no-referrer"
                    title="About video"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-40"
                      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#fda102' }}>
                        <Play size={16} style={{ color: '#fff' }} fill="#fff" />
                      </div>
                      <p className="text-[11px] uppercase tracking-widest" style={{ fontFamily: PP, color: 'rgba(255,255,255,0.55)' }}>Video coming soon</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Bottom-right: story carousel */}
            <motion.div className="order-1 lg:order-none col-span-1 lg:col-span-7 lg:row-span-1 rounded-3xl p-5 lg:p-8"
              style={{ backgroundColor: '#f9f5f2' }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.2 }}>
              <StoryCarousel slides={storySlides} />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. BIG PULL QUOTE
         ══════════════════════════════════════════════════════ */}
      <section id="pull-quote" className="py-10 relative overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden px-3 lg:px-4">
          <p className="font-bold text-white opacity-[0.14] text-center whitespace-nowrap"
            style={{ fontFamily: PP, fontSize: 'clamp(2.2rem, 9vw, 10.5rem)', lineHeight: 1.05, letterSpacing: '0.01em' }}>
            MARU CONSULTANCY<br />SERVICES
          </p>
        </div>
        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-20 text-center overflow-x-auto">
          {/* Mobile: 4-line stacked treatment (quote lines + attribution) */}
          <motion.div className="flex lg:hidden flex-col items-center justify-center font-bold text-white mb-2"
            style={{ fontFamily: PP, fontSize: 'clamp(1rem, 4.8vw, 1.5rem)' }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span style={{ lineHeight: 1.3 }}>{pullQuoteLine1}</span>
            <span style={{ lineHeight: 1.3 }}>{pullQuoteLine2}</span>
            <span style={{ lineHeight: 1.3, color: '#fda102' }}>{pullQuoteLine3}</span>
          </motion.div>
          <motion.p className="lg:hidden font-semibold uppercase tracking-widest text-[11px]"
            style={{ fontFamily: PP, color: 'rgba(255,255,255,0.85)' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            {pullQuoteAttribution}
          </motion.p>

          {/* Desktop: original stacked treatment */}
          <motion.div className="hidden lg:flex font-bold text-white mb-8 flex-col items-center"
            style={{ fontFamily: PP, fontSize: 'clamp(2rem, 5vw, 4.2rem)' }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span style={{ lineHeight: 1.2 }}>{pullQuoteLine1}</span>
            <span style={{ lineHeight: 1.2 }}>{pullQuoteLine2}</span>
            <span style={{ lineHeight: 1.2, color: '#fda102' }}>{pullQuoteLine3}</span>
          </motion.div>
          <motion.p className="hidden lg:block font-semibold uppercase tracking-widest"
            style={{ fontFamily: PP, color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            {pullQuoteAttribution}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4b. OUR APPROACH — Step flow
         ══════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="w-full px-4 lg:px-10">
          <motion.div className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-bold uppercase tracking-[0.25em] mb-2" style={{ fontFamily: PP, color: '#fda102', fontSize: '0.78rem' }}>{approachLabel}</p>
            <h2 className="font-bold" style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', color: '#111' }}>{approachHeading}</h2>
          </motion.div>

          {/* Single scrollable row on mobile, naturally spaced on desktop */}
          <div className="flex flex-nowrap overflow-x-auto lg:overflow-visible justify-start lg:justify-center gap-0 pb-2 lg:pb-0 scrollbar-none">
            {approachSteps.map((step, i, arr) => (
              <motion.div key={step} className="flex items-center shrink-0"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <div className="flex flex-col items-center px-3 py-2 lg:px-5 lg:py-3">
                  <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-full flex items-center justify-center font-bold text-white mb-2 text-sm lg:text-base shrink-0"
                    style={{ backgroundColor: 'var(--primary)', fontFamily: PP }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="font-semibold text-center text-xs lg:text-sm whitespace-nowrap" style={{ fontFamily: PP, color: '#111' }}>{step}</p>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-lg lg:text-2xl font-bold mb-4 shrink-0" style={{ color: '#fda102' }}>→</span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p className="text-center mt-6 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: PP, color: '#666' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            {approachDescription}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. CORE VALUES — Poster image cards with overlays
         ══════════════════════════════════════════════════════ */}
      <section id="core-values" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div className="flex justify-center mb-1"
            initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-4">
              <div className="w-8 h-0.5" style={{ backgroundColor: '#fda102' }} />
              <p className="font-bold uppercase tracking-[0.25em]" style={{ fontFamily: PP, color: 'var(--primary)', fontSize: '1.25rem' }}>What Drives Us</p>
              <div className="w-8 h-0.5" style={{ backgroundColor: '#fda102' }} />
            </div>
          </motion.div>
          <motion.h2 className="font-bold text-center mb-8" style={{ fontFamily: PP, fontSize: 'clamp(2rem, 3.6vw, 3.1rem)', color: '#111' }}
            initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.1 }}>
            Our Core Values
          </motion.h2>

          {/* 6 image-backed poster cards — 3 cols mobile, 6 cols desktop (one horizontal row) */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {coreValues.map((v, i) => (
              <motion.div key={i}
                className="relative rounded-2xl overflow-hidden group cursor-default h-[140px] lg:h-[320px]"
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.1 }}>
                {/* Background photo */}
                <img src={v.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {/* Permanent gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.15) 100%)' }} />
                {/* Hover tint */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: 'var(--primary)' }} />
                {/* Content */}
                <div className="absolute inset-0 p-3 lg:p-7 flex flex-col justify-between">
                  <p className="font-bold text-xl lg:text-5xl opacity-30 text-white" style={{ fontFamily: PP }}>{String(i + 1).padStart(2, '0')}</p>
                  <h4 className="font-bold text-white leading-tight text-center" style={{ fontFamily: PP, fontSize: 'clamp(0.72rem, 3.4vw, 1.125rem)' }}>{v.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. OUR JOURNEY — Horizontal 30-year animated timeline
         ══════════════════════════════════════════════════════ */}
      <section id="journey" className="py-8 sm:py-12 relative overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        {/* Subtle dot texture, consistent with hero */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-16">
          <motion.div className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }}>
            <p className="font-bold uppercase tracking-[0.3em]" style={{ fontFamily: PP, color: '#fda102', fontSize: '1rem' }}>{journeyLabel}</p>
          </motion.div>
          <motion.h2 className="font-bold text-white text-center leading-[1.15] mb-6 sm:mb-10 mx-auto sm:whitespace-nowrap"
            style={{ fontFamily: PP, fontSize: 'clamp(1.3rem, 2.6vw, 2.4rem)' }}
            initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.1 }}>
            {journeyHeading}
          </motion.h2>

          {/* ── Horizontal timeline ── */}
          {/* Zone-1 height (image height) + its bottom margin + half the circle = exact vertical centre of every circle */}
          {(() => {
            const zoneH = 176; // image/zone-1 height in px (matches sm:h-44 image + sm:min-h)
            const zoneMargin = 20; // mb-5
            const circleHalf = 40; // w-20/h-20 → 80px / 2
            const lineTop = zoneH + zoneMargin + circleHalf;
            return (
              <div className="relative">
                {/* Track (background) — passes through circle centres only */}
                <div className="absolute left-0 right-0 hidden sm:block"
                  style={{ top: `${lineTop}px`, height: '2px', backgroundColor: 'rgba(255,255,255,0.18)' }} />
                {/* Animated fill line — draws left to right */}
                <motion.div className="absolute left-0 hidden sm:block"
                  style={{ top: `${lineTop}px`, height: '2px', backgroundColor: '#fda102', transformOrigin: 'left' }}
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }} transition={{ duration: 1.6, ease: 'easeInOut' }} />

                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-10">
                  {journeyMilestones.map((m, i) => {
                    const down = i % 2 === 0; // even index: image above the circle, text below. odd: reversed.
                    const Image = (
                      <div className="w-full rounded-xl overflow-hidden shadow-lg h-28 sm:h-44">
                        <img src={m.img} alt="" className="w-full h-full object-cover" />
                      </div>
                    );
                    const Text = (
                      <div>
                        <p className="font-bold uppercase tracking-widest mb-1.5 sm:mb-3 text-center text-[10px] sm:text-[0.95rem]"
                          style={{ fontFamily: PP, color: '#fda102' }}>{m.event}</p>
                        <p className="max-w-full sm:max-w-[280px] mx-auto text-[10px] sm:text-[0.95rem]"
                          style={{ fontFamily: PP, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, textAlign: 'justify', textAlignLast: 'center' }}>
                          {m.description}
                        </p>
                      </div>
                    );

                    // Whichever zone lands "before the circle" at sm+ must get the same fixed
                    // height + bottom alignment, regardless of whether it holds the image or the
                    // text — otherwise the circles drift out of line depending on up/down.
                    const imgZoneClass = down
                      ? 'order-1 items-end mb-3 sm:order-1 sm:items-end sm:mb-5'
                      : 'order-1 items-end mb-3 sm:order-3 sm:items-start sm:mt-5 sm:mb-0';
                    // NOTE: `sm:min-h-[176px]` below must be a literal string (not built from the
                    // `zoneH` variable) — Tailwind's compiler only picks up arbitrary-value classes
                    // that appear verbatim in the source text, so an interpolated class here would
                    // silently never be generated. Keep this literal in sync with `zoneH` above.
                    const textZoneClass = down
                      ? 'order-3 items-start mt-3 sm:order-3 sm:items-start sm:mt-5'
                      : 'order-3 items-start mt-3 sm:order-1 sm:items-end sm:mb-5 sm:mt-0 sm:min-h-[176px]';

                    return (
                      <motion.div key={i} className="flex flex-col items-center text-center w-full"
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: i * 0.1 }}>

                        {/* Image zone — always first on mobile; alternates before/after the circle on sm+ */}
                        <div className={`w-full flex justify-center ${imgZoneClass} min-h-[112px] sm:min-h-[176px]`}>
                          {Image}
                        </div>

                        {/* Circle node */}
                        <motion.div
                          className="relative z-10 w-9 h-9 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shrink-0 font-bold shadow-lg order-2 text-[10px] sm:text-[1.15rem]"
                          style={{ backgroundColor: '#fda102', color: '#ffffff', fontFamily: PP }}
                          initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.05 + i * 0.1, type: 'spring', stiffness: 260, damping: 18 }}>
                          {m.year}
                        </motion.div>

                        {/* Text zone — always last on mobile; alternates before/after the circle on sm+.
                            Gets the same fixed height as the image zone when it moves in front of the circle. */}
                        <div className={`w-full flex justify-center ${textZoneClass}`}>
                          {Text}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. WHY CHOOSE MARU — Checklist + big image
         ══════════════════════════════════════════════════════ */}
      <section id="why-choose" className="pt-10 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Full-width section heading */}
          <motion.div className="text-center mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <p className="font-bold uppercase tracking-[0.3em] mb-4" style={{ fontFamily: PP, fontSize: '1.1rem', color: '#fda102' }}>{whyMcsLabel}</p>
            <h2 className="font-bold leading-[1.1]" style={{ fontFamily: PP, fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', color: '#111' }}>
              {whyMcsHeading}{' '}
              <span style={{ color: 'var(--primary)' }}>{whyMcsHeadingHighlight}</span>{' '}
              {whyMcsHeadingEnd}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: image with floating cards */}
            <motion.div className="relative"
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65 }}>
              <div className="rounded-3xl overflow-hidden h-[340px] lg:h-[680px]">
                <img src={whyMcsImageUrl || heroImage} alt="" className="w-full h-full object-cover" />
              </div>
              {/* Floating amber badge */}
              <div className="absolute -bottom-4 -right-2 lg:-bottom-6 lg:-right-4 rounded-2xl p-3 lg:p-6 shadow-2xl"
                style={{ backgroundColor: '#fda102' }}>
                <p className="font-bold text-white text-lg lg:text-3xl" style={{ fontFamily: PP }}>{whyMcsBadge1Value}</p>
                <p className="font-semibold text-white/80 text-[9px] lg:text-xs uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: PP }}>{whyMcsBadge1Label}</p>
              </div>
              {/* Floating dark badge */}
              <div className="absolute -top-3 -left-2 lg:-top-5 lg:-left-4 rounded-2xl px-3 py-2 lg:px-6 lg:py-4 shadow-xl"
                style={{ backgroundColor: '#111111' }}>
                <p className="font-bold text-sm lg:text-xl" style={{ fontFamily: PP, color: '#fda102' }}>{whyMcsBadge2Value}</p>
                <p className="text-[9px] lg:text-xs text-white/60 uppercase tracking-wide whitespace-nowrap" style={{ fontFamily: PP }}>{whyMcsBadge2Label}</p>
              </div>
            </motion.div>

            {/* Right: checklist */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}>
              <div className="space-y-6">
                {whyChooseItems.map((item, i) => (
                  <motion.div key={i} className="flex gap-4 items-start"
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: '#fda102' }}>
                      <CheckCircle size={16} color="#fff" />
                    </div>
                    <div>
                      <p className="font-semibold text-base text-justify lg:text-left" style={{ fontFamily: PP, color: '#111' }}>{item.point}</p>
                      <p className="text-sm leading-relaxed mt-1 text-justify lg:text-left" style={{ fontFamily: PP, color: '#777' }}>{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7b. MANAGEMENT VISIBILITY — 5 questions callout
         ══════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Dot texture */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

          <motion.div className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-bold uppercase tracking-[0.25em] mb-2" style={{ fontFamily: PP, color: '#fda102', fontSize: '0.78rem' }}>{mgmtLabel}</p>
            <h2 className="font-bold text-white leading-[1.2]" style={{ fontFamily: PP, fontSize: 'clamp(1.4rem, 3vw, 2.4rem)' }}>
              {mgmtHeading}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {mgmtQuestions.map((q, i) => {
              const n = String(i + 1).padStart(2, '0');
              return (
              <motion.div key={n}
                className="rounded-2xl p-5 lg:p-6 flex flex-col gap-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <span className="font-bold text-2xl lg:text-3xl" style={{ fontFamily: PP, color: '#fda102' }}>{n}</span>
                <p className="font-semibold text-white leading-snug text-sm lg:text-base" style={{ fontFamily: PP }}>{q}</p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. TEAM — 4 white cards on brand-colour band
         ══════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-16 lg:overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="w-full px-3 lg:px-10">

          {/* Section header */}
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="overflow-x-auto lg:overflow-visible">
              <h2 className="font-bold text-white leading-[1.15] mb-4 whitespace-nowrap lg:whitespace-normal w-fit mx-auto"
                style={{ fontFamily: PP, fontSize: 'clamp(0.7rem, 4.6vw, 2.4rem)' }}>
                {teamHeading}
              </h2>
            </div>
            <p className="px-4 sm:px-12 lg:px-32 text-justify lg:text-center"
              style={{ fontFamily: PP, color: '#fda102', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', lineHeight: 1.6 }}>
              {teamSubtext}
            </p>
          </motion.div>

          {/* 4-card grid — 2x2 on mobile, single row on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
            {teamMembers.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl overflow-hidden flex flex-col group cursor-default"
                style={{ backgroundColor: '#ffffff' }}>

                {/* Photo */}
                <div className="relative overflow-hidden h-[220px] lg:h-[360px]">
                  <img src={m.img} alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-400"
                    style={{ backgroundColor: 'var(--primary)' }} />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col items-center text-center px-3 py-3 lg:px-6 lg:py-7">
                  <h4 className="font-bold text-sm lg:text-lg mb-1" style={{ fontFamily: PP, color: '#111' }}>{m.name}</h4>
                  <p className="text-[10px] lg:text-xs mb-2" style={{ fontFamily: PP, color: '#999' }}>{m.qualification}</p>
                  <p className="font-semibold text-[9px] lg:text-xs uppercase tracking-wide whitespace-pre-line leading-relaxed"
                    style={{ fontFamily: PP, color: 'var(--primary)' }}>{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. VIDEO CTA — Video background, bold overlay
         ══════════════════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center lg:overflow-hidden min-h-[320px] lg:min-h-[440px]">
        <video src={ctaVideoSrc} autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />

        <div className="relative w-full max-w-5xl mx-auto px-5 py-10 lg:px-8 lg:py-24 text-center overflow-x-auto">
          <motion.p className="font-bold uppercase tracking-[0.3em] mb-5 whitespace-nowrap"
            style={{ fontFamily: PP, color: '#fda102', fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}>
            {ctaLabel}
          </motion.p>
          <motion.h2 className="font-bold text-white leading-[1.1] mb-8"
            style={{ fontFamily: PP, fontSize: 'clamp(1rem, 5.5vw, 4rem)' }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }}>
            <span className="whitespace-nowrap">{ctaHeadingLine1}</span><br /><span style={{ color: '#fda102' }}>{ctaHeadingLine2}</span>
          </motion.h2>
          <motion.div className="flex flex-wrap gap-3 lg:gap-4 justify-center w-full px-2"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.18 }}>
            <Link to="/contact"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 lg:px-10 lg:py-4 font-semibold text-xs lg:text-sm transition-all hover:scale-[1.04] shadow-xl whitespace-nowrap"
              style={{ backgroundColor: '#fda102', color: '#fff', fontFamily: PP }}>
              {ctaButton1Text} <ArrowRight size={16} />
            </Link>
            <Link to="/careers"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 lg:px-10 lg:py-4 font-semibold text-xs lg:text-sm border transition-all hover:scale-[1.04] whitespace-nowrap"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', fontFamily: PP }}>
              {ctaButton2Text}
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
