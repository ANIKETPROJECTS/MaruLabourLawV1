import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, FileText, Phone, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { LabourCodeContent, LabourCodesPageContent } from '../types/content';

const PP = 'Poppins, sans-serif';

const codeAccentColors: Record<string, string> = {
  '01': '#fda102',
  '02': '#0ea5e9',
  '03': '#10b981',
  '04': '#8b5cf6',
};

const PAGE_DEFAULTS: LabourCodesPageContent = {
  heroLabel:   'Labour Codes Advisory',
  heroHeading: "Navigating India's New Labour Law Framework",
  heroSubtext: '',
  gridLabel:   'The four codes',
  gridHeading: 'From interpretation to implementation.',
  gridSubtext: '',
  ctaLabel:      'MCS Labour Codes Readiness Review',
  ctaHeading:    'Is your organisation Labour Codes ready?',
  ctaSteps:      [],
  ctaButtonText: 'Request a Readiness Assessment',
  disclaimer: 'The information on this page is for general informational purposes and is not a substitute for advice based on the facts of a specific matter. Requirements may vary by establishment, workforce, location and applicable Central and State provisions.',
  detailBreadcrumb:      'Labour Codes Advisory',
  detailAboutHeading:    'About This Code',
  detailCoveringHeading: 'What We Cover',
  detailCoveringSubtext: 'Key areas addressed under this Code.',
  detailOtherCodes:      'Other Labour Codes',
  detailAllCodes:        'All Four Labour Codes',
  sidebarTag:      'Get Expert Advice',
  sidebarHeading:  'Ready to assess your compliance?',
  sidebarBody:     'Speak with our experts to understand how this Code impacts your organisation.',
  sidebarPhone:    '+919876543210',
  sidebarCallText: 'Call Now',
};

const LabourCodeDetail = () => {
  const { slug } = useParams();
  const [detail, setDetail] = useState<LabourCodeContent | null>(null);
  const [allCodes, setAllCodes] = useState<LabourCodeContent[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');
  const [page, setPage] = useState<LabourCodesPageContent>(PAGE_DEFAULTS);

  const reqRef = useRef(0);
  const fetchDetail = () => {
    const reqId = ++reqRef.current;
    api.get<LabourCodeContent>(`/labour-codes/${slug}`)
      .then((data) => { if (reqId !== reqRef.current) return; setDetail(data); setStatus('ready'); })
      .catch((err) => { if (reqId !== reqRef.current) return; setStatus(err?.status === 404 ? 'not-found' : 'error'); });
  };
  useEffect(() => { setDetail(null); setStatus('loading'); fetchDetail(); }, [slug]);
  useLiveContent(fetchDetail);

  const fetchAll = () => { api.get<LabourCodeContent[]>('/labour-codes').then(setAllCodes).catch(() => {}); };
  const fetchPage = () => { api.get<LabourCodesPageContent>('/labour-codes-page').then(d => setPage({ ...PAGE_DEFAULTS, ...d })).catch(() => {}); };
  useEffect(() => { fetchAll(); fetchPage(); }, []);
  useLiveContent(() => { fetchAll(); fetchPage(); });

  if (status === 'loading') return <div className="min-h-screen" style={{ fontFamily: PP }} />;

  if (status === 'not-found' || status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ fontFamily: PP }}>
        <p className="text-gray-500 mb-4">{status === 'not-found' ? 'Labour code not found.' : 'Unable to load this page right now.'}</p>
        <Link to="/labour-codes" className="font-semibold" style={{ color: 'var(--primary)' }}>← Back to Labour Codes</Link>
      </div>
    );
  }

  const accent = codeAccentColors[detail?.codeNumber ?? ''] ?? '#fda102';
  const otherCodes = allCodes.filter((c) => c.slug !== slug);
  const ctaLabel = detail?.ctaLabel || 'Request a Compliance Review';

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section
        className="flex items-center justify-center overflow-hidden min-h-[190px] max-h-[300px] h-[42vh] lg:min-h-[220px] lg:max-h-[320px] lg:h-[40vh]"
        style={{ backgroundColor: 'var(--primary)' }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-5 lg:px-8 w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span
              className="text-4xl lg:text-5xl font-bold"
              style={{ color: accent, fontFamily: PP }}>
              {detail?.codeNumber}
            </span>
            <ShieldCheck size={28} style={{ color: accent }} />
          </div>
          <p className="uppercase tracking-[0.24em] font-semibold mb-2"
            style={{ fontFamily: PP, fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)', color: 'rgba(255,255,255,0.6)' }}>
            {page.detailBreadcrumb}
          </p>
          <h1
            className="leading-[1.15] mb-3"
            style={{
              fontFamily: PP,
              fontSize: 'clamp(1.15rem, 5vw, 2.4rem)',
              fontWeight: 700,
              color: '#ffffff',
            }}>
            {detail?.title}
          </h1>
          {detail?.intro && (
            <p style={{
              fontFamily: PP, fontSize: 'clamp(0.8rem, 1.6vw, 1rem)',
              fontWeight: 300, color: 'rgba(255,255,255,0.78)',
              maxWidth: '640px', margin: '0 auto', lineHeight: 1.6,
            }}>
              {detail.intro}
            </p>
          )}
        </motion.div>
      </section>

      {/* ── Banner image ── */}
      {detail?.img && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full overflow-hidden"
          style={{ height: 'clamp(160px, 48vw, 440px)' }}>
          <img src={detail.img} alt={detail.title} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
        </motion.div>
      )}

      {/* ── Main content ── */}
      <section className="py-10 lg:py-16 bg-[#f8fafb]">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* ── Body column ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:w-2/3 space-y-5 lg:space-y-8">

            {/* About */}
            {detail?.body && (
              <div className="bg-white rounded-2xl p-5 lg:p-12 shadow-sm border border-gray-100">
                <h2 className="font-bold mb-4 lg:mb-6"
                  style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#111', lineHeight: 1.25 }}>
                  {page.detailAboutHeading}
                </h2>
                {detail.body.split('\n\n').map((para, i) => (
                  <motion.p key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="text-gray-600 mb-4 text-sm lg:text-base"
                    style={{ fontFamily: PP, fontWeight: 400, lineHeight: 1.8, textAlign: 'justify' }}>
                    {para}
                  </motion.p>
                ))}
              </div>
            )}

            {/* Covering areas */}
            {(detail?.coveringAreas?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl p-5 lg:p-12 shadow-sm border border-gray-100">
                <h2 className="font-bold mb-2"
                  style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#111' }}>
                  {page.detailCoveringHeading}
                </h2>
                <p className="text-gray-400 mb-6 lg:mb-8 text-sm" style={{ fontFamily: PP }}>
                  {page.detailCoveringSubtext}
                </p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
                  {(detail?.coveringAreas ?? []).map((area, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: accent }} />
                      <span className="text-gray-700 text-sm lg:text-[0.93rem]" style={{ fontFamily: PP }}>
                        {area}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Other codes */}
            {otherCodes.length > 0 && (
              <div className="bg-white rounded-2xl p-5 lg:p-12 shadow-sm border border-gray-100">
                <h2 className="font-bold mb-5 lg:mb-6"
                  style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#111' }}>
                  {page.detailOtherCodes}
                </h2>
                <div className="flex flex-wrap gap-2.5 lg:gap-3">
                  {otherCodes.map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.07 }}>
                      <Link to={`/labour-codes/${c.slug}`}
                        className="inline-flex items-center gap-2 font-medium px-4 lg:px-5 py-2.5 lg:py-3 rounded-full border hover:shadow-md transition-all text-xs lg:text-[0.92rem]"
                        style={{ fontFamily: PP, color: 'var(--primary)', backgroundColor: 'var(--p-a06)', borderColor: 'var(--p-a20)' }}>
                        <ArrowRight size={14} /> {c.title}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Sidebar ── */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-28 space-y-6">

              {/* CTA card */}
              <motion.div
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <div className="p-2" style={{ backgroundColor: 'var(--primary)' }}>
                  <p className="text-center text-xs font-semibold uppercase tracking-widest"
                    style={{ color: '#fda102', fontFamily: PP }}>{page.sidebarTag}</p>
                </div>
                <div className="bg-white p-6 lg:p-8">
                  <h3 className="font-bold mb-3 text-lg lg:text-[1.35rem]"
                    style={{ fontFamily: PP, color: '#111', lineHeight: 1.3 }}>
                    {page.sidebarHeading}
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed text-sm lg:text-[0.93rem]"
                    style={{ fontFamily: PP, lineHeight: 1.7 }}>
                    {page.sidebarBody}
                  </p>
                  <div className="space-y-3">
                    <Link to="/contact"
                      className="w-full text-white py-3.5 lg:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-opacity hover:opacity-90 text-sm lg:text-[0.95rem]"
                      style={{ backgroundColor: 'var(--primary)', fontFamily: PP }}>
                      <FileText size={16} /> {ctaLabel}
                    </Link>
                    <a href={`tel:${page.sidebarPhone}`}
                      className="w-full py-3.5 lg:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all hover:bg-[var(--primary)] hover:text-white text-sm lg:text-[0.95rem]"
                      style={{ fontFamily: PP, color: 'var(--primary)', borderColor: 'var(--primary)', backgroundColor: 'transparent' }}>
                      <Phone size={16} /> {page.sidebarCallText}
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* All four codes nav */}
              {allCodes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white p-5 lg:p-7 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold mb-4 lg:mb-5 uppercase tracking-widest text-xs"
                    style={{ fontFamily: PP, color: 'var(--primary)' }}>
                    {page.detailAllCodes}
                  </h4>
                  <ul className="space-y-0.5">
                    {allCodes.map((c) => (
                      <li key={c._id}>
                        <Link to={`/labour-codes/${c.slug}`}
                          className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 group transition-colors hover:text-[var(--primary)] text-sm lg:text-[0.9rem]"
                          style={{ fontFamily: PP, color: c.slug === slug ? 'var(--primary)' : '#333', fontWeight: c.slug === slug ? 700 : 500 }}>
                          <span className="font-bold text-xs shrink-0 w-5" style={{ color: codeAccentColors[c.codeNumber] ?? '#fda102' }}>
                            {c.codeNumber}
                          </span>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-[var(--primary)] transition-colors shrink-0" />
                          <span className="leading-snug">{c.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-8 bg-white border-t border-gray-100">
        <p className="max-w-5xl mx-auto px-5 lg:px-10 text-xs text-gray-500 leading-relaxed">
          {page.disclaimer}
        </p>
      </section>
    </div>
  );
};

export default LabourCodeDetail;
