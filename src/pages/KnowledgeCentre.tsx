import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, BookOpen,
  Clock, Calendar, ArrowLeft, ArrowRight, ChevronRight,
} from 'lucide-react';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type {
  KnowledgeCentrePageContent,
  KnowledgeArticleType,
} from '../types/content';
import { KNOWLEDGE_CATEGORIES } from '../types/content';
import heroVideo from '@assets/7683053-hd_1920_1080_24fps_1783584828907.mp4';

const PP = 'Poppins, sans-serif';

const PAGE_DEFAULTS: KnowledgeCentrePageContent = {
  heroEyebrow:  'Compliance Knowledge That Helps You Act',
  heroHeading:  'MCS Knowledge Centre',
  heroSubtext:  "A practical resource for employers, HR professionals, payroll teams and management — staying current with India's evolving labour and compliance framework.",
  heroBgType:   'color',
  heroVideoUrl: '',
  heroImageUrl: '',
  introText:    '',
  articlesLabel:   'Knowledge Base',
  articlesHeading: 'Articles & Insights',
  faqTitle:     'Frequently Asked Questions',
  faqSubtext:   "Common questions from employers and HR professionals about India's Labour Codes and MCS services.",
  faqs: [],
};

const ARTICLE_CATEGORIES = [
  { value: 'all', label: 'All' },
  ...KNOWLEDGE_CATEGORIES.filter(category => category.value !== 'downloads'),
];

function categoryLabel(category: string) {
  return KNOWLEDGE_CATEGORIES.find(item => item.value === category)?.label ?? category;
}

/* ── FAQ Item ── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-gray-50"
        style={{ fontFamily: PP }}>
        <span className="font-semibold text-sm md:text-base" style={{ color: '#111' }}>{question}</span>
        <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: open ? 'var(--primary)' : 'var(--p-a09)', color: open ? '#fff' : 'var(--primary)' }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600" style={{ fontFamily: PP }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main page ── */
export default function KnowledgeCentre() {
  const [page, setPage]           = useState<KnowledgeCentrePageContent>(PAGE_DEFAULTS);
  const [blogPosts, setBlogPosts] = useState<KnowledgeArticleType[]>([]);

  // Articles & Insights UI state
  const [catFilter, setCatFilter] = useState('all');

  const fetchPage = () => {
    api.get<KnowledgeCentrePageContent>('/knowledge-centre/page')
      .then(res => setPage({ ...PAGE_DEFAULTS, ...res }))
      .catch(() => {});
  };
  const fetchBlogPosts = () => {
    api.get<KnowledgeArticleType[]>('/knowledge-centre/articles')
      .then(data => setBlogPosts(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))))
      .catch(() => {});
  };

  useEffect(() => { fetchPage(); fetchBlogPosts(); }, []);
  useLiveContent(() => { fetchPage(); fetchBlogPosts(); });

  const filteredBlogs = catFilter === 'all'
    ? blogPosts
    : blogPosts.filter(p => p.category === catFilter);

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '280px', maxHeight: '440px', height: '50vh' }}>
        {page.heroBgType === 'image' && page.heroImageUrl ? (
          <img src={page.heroImageUrl} alt=""
            className="absolute inset-0 w-full h-full object-cover" />
        ) : page.heroBgType === 'video' ? (
          <video autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={page.heroVideoUrl || heroVideo} />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: '#172632' }} />
        )}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(23,38,50,0.72)' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.28em] font-light mb-3"
            style={{ fontFamily: PP, fontSize: '1rem', color: '#fda102' }}>
            {page.heroEyebrow}
          </p>
          <h1 className="font-semibold mb-4"
            style={{ fontFamily: PP, fontSize: 'min(5.5vw, 3.4rem)', color: '#fff', lineHeight: 1.15 }}>
            {page.heroHeading}
          </h1>
          <p style={{ fontFamily: PP, fontWeight: 300, fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
            color: 'rgba(255,255,255,0.86)', maxWidth: '760px', margin: '0 auto', lineHeight: 1.75 }}>
            {page.heroSubtext}
          </p>
        </motion.div>
      </section>

      {/* ── Articles & Insights (Resources UI) ── */}
      <section className="py-8 lg:py-14" style={{ backgroundColor: '#f8fafb' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-10">

          <Link
            to="/resources"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all hover:bg-white mb-6 lg:mb-8"
            style={{ fontFamily: PP, color: 'var(--primary)', borderColor: 'var(--p-a25)' }}>
            <ArrowLeft size={13} /> Back to Resources
          </Link>

          {/* Section heading */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <BookOpen size={22} style={{ color: 'var(--primary)' }} />
            <div>
              <p className="font-bold tracking-[0.2em] uppercase text-xs"
                style={{ fontFamily: PP, color: 'var(--primary)' }}>{page.articlesLabel || 'Knowledge Base'}</p>
              <h2 className="font-bold" style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#111' }}>
                {page.articlesHeading || 'Articles & Insights'}
              </h2>
            </div>
          </div>

          {page.introText && (
            <p className="max-w-3xl text-gray-500 text-sm leading-relaxed mb-6 lg:mb-8"
              style={{ fontFamily: PP }}>
              {page.introText}
            </p>
          )}

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8 lg:mb-12">
            {ARTICLE_CATEGORIES.map(cat => (
              <button key={cat.value}
                onClick={() => setCatFilter(cat.value)}
                className="px-3.5 lg:px-5 py-1.5 lg:py-2 rounded-full font-semibold text-xs lg:text-sm transition-all border"
                style={{
                  fontFamily: PP,
                  backgroundColor: catFilter === cat.value ? 'var(--primary)' : '#fff',
                  color: catFilter === cat.value ? '#fff' : 'var(--primary)',
                  borderColor: catFilter === cat.value ? 'var(--primary)' : 'var(--p-a25)',
                }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured post — first item full-width */}
          <AnimatePresence mode="wait">
            {filteredBlogs.length > 0 && (
              <motion.div key={filteredBlogs[0].slug}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                className="mb-10">
                <Link to={`/knowledge-centre/${filteredBlogs[0].slug}`} className="group block">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 overflow-hidden" style={{ minHeight: '200px' }}>
                      <img src={filteredBlogs[0].img} alt={filteredBlogs[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                        style={{ minHeight: '200px' }} />
                    </div>
                    <div className="lg:w-1/2 p-6 lg:p-14 flex flex-col justify-center">
                      <div className="flex items-center gap-2 lg:gap-3 mb-4 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                          style={{ backgroundColor: 'var(--p-a10)', color: 'var(--primary)', fontFamily: PP }}>
                           {categoryLabel(filteredBlogs[0].category)}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: PP }}>
                          <Calendar size={11} /> {filteredBlogs[0].date}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: PP }}>
                          <Clock size={11} /> {filteredBlogs[0].readTime}
                        </span>
                      </div>
                      <h2 className="font-bold mb-4 leading-tight"
                        style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: '#111' }}>
                        {filteredBlogs[0].title}
                      </h2>
                      <p className="text-gray-500 leading-relaxed mb-6"
                        style={{ fontFamily: PP, fontSize: '0.92rem', lineHeight: 1.8 }}>
                        {filteredBlogs[0].excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 font-bold text-sm transition-opacity group-hover:opacity-70"
                        style={{ color: 'var(--primary)', fontFamily: PP }}>
                        Read Full Article <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remaining posts grid */}
          {filteredBlogs.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
              <AnimatePresence mode="popLayout">
                {filteredBlogs.slice(1).map((post, i) => (
                  <motion.div key={post.slug}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, delay: i * 0.06 }}>
                    <Link to={`/knowledge-centre/${post.slug}`}
                      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                      <div className="relative overflow-hidden" style={{ height: '200px' }}>
                        <img src={post.img} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: 'var(--primary)', color: '#fff', fontFamily: PP }}>
                           {categoryLabel(post.category)}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                        </div>
                        <h3 className="font-bold mb-3 leading-snug"
                          style={{ fontFamily: PP, fontSize: '1.08rem', color: '#111' }}>
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-5" style={{ fontFamily: PP }}>
                          {post.excerpt}
                        </p>
                        <span className="flex items-center gap-1.5 font-bold text-sm transition-opacity group-hover:opacity-70 mt-auto"
                          style={{ color: 'var(--primary)', fontFamily: PP }}>
                          Read Article <ChevronRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20 text-gray-400" style={{ fontFamily: PP }}>
              No articles found for this category.
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      {page.faqs.length > 0 && (
        <section className="py-16" style={{ backgroundColor: '#f8fafb' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10">
              <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ fontFamily: PP, color: '#111' }}>
                {page.faqTitle}
              </h2>
              {page.faqSubtext && (
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: PP }}>
                  {page.faqSubtext}
                </p>
              )}
            </div>
            <div className="space-y-3">
              {page.faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
