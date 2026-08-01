
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Phone, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { ServiceContent, ServicesPageContent } from '../types/content';

const PP = 'Poppins, sans-serif';

const FALLBACK_PAGE: ServicesPageContent = {
  heroVideoUrl: '/assets/services-hero.mp4',
  heroTitle: 'Our Consultancy Services',
  heroSubtitle: '',
  ctaLabel: 'Get Started',
  ctaHeading: 'Need a custom compliance structure?',
  ctaBody: '',
  ctaButtonText: 'Request Custom Consultation',
  sidebarCtaTag: 'Get Expert Advice',
  sidebarCtaHeading: 'Ready to secure your compliance?',
  sidebarCtaBody: 'Speak directly with our legal experts to discuss how this service applies to your specific industry and workforce size.',
  sidebarCtaButton1: 'Request Proposal',
  sidebarCtaButton2: 'Call Now',
  sidebarPhone: '+919876543210',
  insightsLabel: 'Latest Insights',
  insightsHeading: 'Stay informed with expert guidance',
  latestInsights: [],
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const [detail, setDetail] = useState<ServiceContent | null>(null);
  const [allServices, setAllServices] = useState<ServiceContent[]>([]);
  const [page, setPage] = useState<ServicesPageContent>(FALLBACK_PAGE);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');

  const detailReqRef = useRef(0);
  const fetchDetail = () => {
    const reqId = ++detailReqRef.current;
    const currentSlug = slug;
    api.get<ServiceContent>(`/services/${currentSlug}`)
      .then((data) => {
        if (reqId !== detailReqRef.current) return;
        setDetail(data); setStatus('ready');
      })
      .catch((err) => {
        if (reqId !== detailReqRef.current) return;
        setStatus(err?.status === 404 ? 'not-found' : 'error');
      });
  };
  useEffect(() => {
    setDetail(null);
    setStatus('loading');
    fetchDetail();
  }, [slug]);
  useLiveContent(fetchDetail);

  const fetchAllServices = () => {
    api.get<ServiceContent[]>('/services').then(setAllServices).catch(() => {});
  };
  useEffect(fetchAllServices, []);
  useLiveContent(fetchAllServices);

  const fetchPage = () => {
    api.get<ServicesPageContent>('/services-page').then(setPage).catch(() => {});
  };
  useEffect(fetchPage, []);
  useLiveContent(fetchPage);

  const title = detail?.title || slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Service';
  const otherServices = allServices.filter((s) => s.slug !== slug);
  const related = otherServices.slice(0, 3).map((s) => ({ name: s.title, slug: s.slug }));
  const currentParentSlug = detail?.parentSlug || detail?.slug;
  const recommendedServices = allServices
    .filter((service) => !service.parentSlug && service.slug !== currentParentSlug)
    .slice(0, 4);

  if (status === 'loading') {
    return <div className="min-h-screen" style={{ fontFamily: PP }} />;
  }

  if (status === 'not-found' || status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ fontFamily: PP }}>
        <p className="text-gray-500 mb-4">
          {status === 'not-found' ? 'Service not found.' : 'Unable to load this service right now.'}
        </p>
        <Link to="/services" className="font-semibold" style={{ color: 'var(--primary)' }}>
          ← Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section
        className="flex items-center justify-center overflow-hidden min-h-[190px] max-h-[280px] h-[42vh] lg:min-h-[200px] lg:max-h-[300px] lg:h-[38vh]"
        style={{ backgroundColor: 'var(--primary)' }}>

        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-5 lg:px-8 w-full max-w-7xl mx-auto">

          <p
            className="uppercase tracking-[0.2em] lg:tracking-[0.3em] font-semibold mb-2 whitespace-nowrap"
            style={{ fontFamily: PP, fontSize: 'clamp(0.68rem, 2vw, 0.95rem)', color: '#fda102' }}>
            {detail?.subhead ?? 'Our Services'}
          </p>

          <h1
            className="uppercase leading-[1.15] lg:leading-none mb-3"
            style={{
              fontFamily: PP,
              fontSize: 'clamp(1.15rem, 5.5vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '0.03em',
              color: '#ffffff',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
            {detail?.headline || title}
          </h1>

          <p
            style={{
              fontFamily: PP,
              fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '680px',
              margin: '0 auto',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.55',
            }}>
            {detail?.intro}
          </p>
        </motion.div>
      </section>

      {/* ── Big Image Banner — true full-width ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full overflow-hidden"
        style={{ height: 'clamp(180px, 55vw, 500px)' }}>
        <img
          src={detail?.img || '/assets/service-labour.png'}
          alt={title}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
      </motion.div>

      {/* ── Main Content ── */}
      <section className="py-10 lg:py-16 bg-[#f8fafb]">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* ── Body Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:w-2/3 space-y-5 lg:space-y-8">

            {/* Body Text */}
            <div className="bg-white rounded-2xl p-5 lg:p-12 shadow-sm border border-gray-100">
              <h2
                className="font-bold mb-4 lg:mb-6"
                style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#111', lineHeight: 1.25 }}>
                About This Service
              </h2>
              {detail?.body?.split('\n\n').map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="text-gray-600 leading-relaxed mb-4 text-sm lg:text-base"
                  style={{ fontFamily: PP, fontWeight: 400, lineHeight: 1.8, textAlign: 'justify' }}>
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Key Deliverables — pointer format */}
            <div className="bg-white rounded-2xl p-5 lg:p-12 shadow-sm border border-gray-100">
              <h2
                className="font-bold mb-2"
                style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#111' }}>
                What You Get
              </h2>
              <p className="text-gray-400 mb-6 lg:mb-8 text-sm" style={{ fontFamily: PP }}>
                Everything included in this service — delivered end-to-end.
              </p>

              <div className="space-y-4">
                {(detail?.deliverables || []).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.38, delay: i * 0.07 }}
                    className="flex items-start gap-3 lg:gap-5 group">

                    {/* Number badge */}
                    <div
                      className="shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center font-bold text-xs lg:text-sm mt-0.5 transition-all group-hover:scale-110"
                      style={{ backgroundColor: 'var(--p-a08)', color: 'var(--primary)', fontFamily: PP }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                        <h4
                        className="font-semibold mb-1 text-sm lg:text-[1.05rem]"
                        style={{ fontFamily: PP, color: '#111' }}>
                          {item.slug ? (
                            <Link to={`/services/${item.slug}`} className="hover:text-[var(--primary)] transition-colors">
                              {item.title}
                            </Link>
                          ) : item.title}
                      </h4>
                      <p
                        className="text-gray-500 leading-relaxed text-xs lg:text-[0.92rem]"
                        style={{ fontFamily: PP, lineHeight: 1.7 }}>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Related Services */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl p-5 lg:p-12 shadow-sm border border-gray-100">
                <h2
                  className="font-bold mb-5 lg:mb-6"
                  style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#111' }}>
                  Related Services
                </h2>
                <div className="flex flex-wrap gap-2.5 lg:gap-3">
                  {related.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.07 }}>
                      <Link
                        to={`/services/${r.slug}`}
                        className="inline-flex items-center gap-2 font-medium px-4 lg:px-5 py-2.5 lg:py-3 rounded-full transition-all border hover:shadow-md text-xs lg:text-[0.92rem]"
                        style={{
                          fontFamily: PP,
                          color: 'var(--primary)',
                          backgroundColor: 'var(--p-a06)',
                          borderColor: 'var(--p-a20)',
                        }}>
                        <ArrowRight size={14} /> {r.name}
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

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">

                <div className="p-2" style={{ backgroundColor: 'var(--primary)' }}>
                  <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: '#fda102', fontFamily: PP }}>
                    {page.sidebarCtaTag}
                  </p>
                </div>

                <div className="bg-white p-6 lg:p-8">
                  <h3
                    className="font-bold mb-3 text-lg lg:text-[1.35rem]"
                    style={{ fontFamily: PP, color: '#111', lineHeight: 1.3 }}>
                    {page.sidebarCtaHeading}
                  </h3>
                  <p
                    className="text-gray-500 mb-6 lg:mb-7 leading-relaxed text-sm lg:text-[0.93rem]"
                    style={{ fontFamily: PP, lineHeight: 1.7 }}>
                    {page.sidebarCtaBody}
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/contact"
                      className="w-full text-white py-3.5 lg:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-opacity hover:opacity-90 text-sm lg:text-[0.95rem]"
                      style={{ backgroundColor: 'var(--primary)', fontFamily: PP }}>
                      <FileText size={16} /> {page.sidebarCtaButton1}
                    </Link>
                    {page.sidebarPhone && (
                      <a
                        href={`tel:${page.sidebarPhone}`}
                        className="w-full py-3.5 lg:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all hover:bg-[var(--primary)] hover:text-white text-sm lg:text-[0.95rem]"
                        style={{ fontFamily: PP, color: 'var(--primary)', borderColor: 'var(--primary)', backgroundColor: 'transparent' }}>
                        <Phone size={16} /> {page.sidebarCtaButton2}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Other Services */}
              <motion.div
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-5 lg:p-7 rounded-2xl border border-gray-100 shadow-sm">
                <h4
                  className="font-bold mb-4 lg:mb-5 uppercase tracking-widest text-xs"
                  style={{ fontFamily: PP, color: 'var(--primary)' }}>
                  Recommended Services
                </h4>
                <ul className="space-y-0.5">
                  {recommendedServices.map((s) => (
                    <li key={s._id}>
                      <Link
                        to={`/services/${s.slug}`}
                        className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 group transition-colors hover:text-[var(--primary)] text-sm lg:text-[0.9rem]"
                        style={{ fontFamily: PP, color: '#333', fontWeight: 500 }}>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-[var(--primary)] transition-colors shrink-0" />
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Insights ── */}
      {page.latestInsights && page.latestInsights.length > 0 && (
        <section className="py-12 lg:py-20 bg-[#f8fafb]">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="flex justify-between items-end mb-8 lg:mb-12">
              <div>
                <p className="font-bold tracking-[0.18em] uppercase text-xs mb-2"
                  style={{ fontFamily: PP, color: 'var(--primary)' }}>{page.insightsLabel}</p>
                <h2 className="text-xl lg:text-4xl font-bold leading-tight"
                  style={{ fontFamily: PP, color: '#111' }}>{page.insightsHeading}</h2>
              </div>
              <Link to="/resources"
                className="hidden md:flex items-center gap-2 font-semibold text-sm transition-colors border-b pb-0.5 hover:opacity-70 shrink-0"
                style={{ fontFamily: PP, color: '#111', borderColor: '#111' }}>
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
              {page.latestInsights.map((post, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                  <div className="relative overflow-hidden h-40 lg:h-48">
                    <img src={post.img} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider"
                      style={{ backgroundColor: 'var(--primary)' }}>
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5 lg:p-6 flex flex-col flex-grow">
                    <p className="text-[11px] font-semibold mb-2 uppercase tracking-wider"
                      style={{ color: 'var(--primary)', fontFamily: PP }}>{post.date}</p>
                    <h3 className="text-base font-bold mb-3 line-clamp-2"
                      style={{ fontFamily: PP, color: '#111' }}>{post.title}</h3>
                    <p className="text-gray-500 text-sm mb-5 flex-grow leading-relaxed"
                      style={{ fontFamily: PP }}>{post.desc}</p>
                    <Link to={post.articleUrl || '/resources'}
                      className="font-bold text-sm flex items-center gap-1.5 transition-colors mt-auto hover:opacity-70"
                      style={{ color: 'var(--primary)', fontFamily: PP }}>
                      Read Article <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetail;
