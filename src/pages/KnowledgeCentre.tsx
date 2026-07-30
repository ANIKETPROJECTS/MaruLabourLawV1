import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, BookOpen, Download,
  Clock, Calendar, User, ArrowRight, ChevronRight, FileText,
} from 'lucide-react';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type {
  KnowledgeCentrePageContent,
  KnowledgeArticleType,
  ResourceItem,
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
  faqTitle:     'Frequently Asked Questions',
  faqSubtext:   "Common questions from employers and HR professionals about India's Labour Codes and MCS services.",
  faqs: [],
};

const ARTICLE_CATEGORIES = ['All', 'New Labour Codes', 'Compliance', 'Labour Audit', 'POSH', 'ESI & PF', 'Payroll'];

const CATEGORY_ICONS: Record<string, string> = {
  'labour-codes':      '⚖️',
  'compliance-alerts': '🔔',
  'minimum-wages':     '💰',
  'epfo-esic':         '🏛️',
  'compliance-guides': '📋',
  'mcs-insights':      '💡',
  'downloads':         '📥',
};

/* ── KB Article card (for the lower section) ── */
function KBArticleCard({ article }: { article: KnowledgeArticleType }) {
  const isDownload = article.category === 'downloads';
  const catLabel = KNOWLEDGE_CATEGORIES.find(c => c.value === article.category)?.label ?? article.category;

  if (isDownload) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--p-a09)' }}>
            <Download size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider mb-1 block"
              style={{ color: 'var(--primary)', fontFamily: PP }}>{catLabel}</span>
            <h3 className="font-bold text-base leading-snug" style={{ fontFamily: PP, color: '#111' }}>
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-sm text-gray-500 mt-1 leading-relaxed" style={{ fontFamily: PP }}>
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {article.fileFormat && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#f0fdf4', color: '#16a34a', fontFamily: PP }}>
                  {article.fileFormat}
                </span>
              )}
              {article.fileSize && (
                <span className="text-xs text-gray-400" style={{ fontFamily: PP }}>{article.fileSize}</span>
              )}
            </div>
          </div>
        </div>
        {article.fileUrl && (
          <a href={article.fileUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--primary)', color: '#fff', fontFamily: PP }}>
            <Download size={14} /> Download
          </a>
        )}
      </motion.div>
    );
  }

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
      {article.img ? (
        <div className="aspect-[16/7] overflow-hidden">
          <img src={article.img} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="aspect-[16/7] flex items-center justify-center text-4xl"
          style={{ backgroundColor: 'var(--p-a09)' }}>
          {CATEGORY_ICONS[article.category] ?? '📄'}
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--primary)', fontFamily: PP }}>{catLabel}</span>
          {article.featured && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#fef3c7', color: '#d97706', fontFamily: PP }}>Featured</span>
          )}
        </div>
        <h3 className="font-bold text-base leading-snug mb-2 flex-1"
          style={{ fontFamily: PP, color: '#111' }}>{article.title}</h3>
        {article.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: PP }}>
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap mt-auto pt-3 border-t border-gray-50">
          {article.date && (
            <span className="flex items-center gap-1 text-xs text-gray-400" style={{ fontFamily: PP }}>
              <Calendar size={11} /> {article.date}
            </span>
          )}
          {article.readTime && (
            <span className="flex items-center gap-1 text-xs text-gray-400" style={{ fontFamily: PP }}>
              <Clock size={11} /> {article.readTime}
            </span>
          )}
          {article.author && (
            <span className="flex items-center gap-1 text-xs text-gray-400" style={{ fontFamily: PP }}>
              <User size={11} /> {article.author}
            </span>
          )}
          {article.slug && (
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: 'var(--primary)', fontFamily: PP }}>
              Read <ArrowRight size={11} />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (article.slug) {
    return <Link to={`/knowledge-centre/${article.slug}`}>{inner}</Link>;
  }
  return inner;
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
  const [page, setPage]             = useState<KnowledgeCentrePageContent>(PAGE_DEFAULTS);
  const [kbArticles, setKbArticles] = useState<KnowledgeArticleType[]>([]);
  const [blogPosts, setBlogPosts]   = useState<ResourceItem[]>([]);

  // Articles & Insights UI state
  const [catFilter, setCatFilter] = useState('All');

  // Knowledge section tab
  const [kbTab, setKbTab] = useState<string>('all');

  const fetchPage = () => {
    api.get<KnowledgeCentrePageContent>('/knowledge-centre/page')
      .then(res => setPage({ ...PAGE_DEFAULTS, ...res }))
      .catch(() => {});
  };
  const fetchKbArticles = () => {
    api.get<KnowledgeArticleType[]>('/knowledge-centre/articles')
      .then(setKbArticles)
      .catch(() => {});
  };
  const fetchBlogPosts = () => {
    api.get<ResourceItem[]>('/resources')
      .then(data => setBlogPosts(data.filter(r => r.tab === 'articles').sort((a, b) => (a.order ?? 0) - (b.order ?? 0))))
      .catch(() => {});
  };

  useEffect(() => { fetchPage(); fetchKbArticles(); fetchBlogPosts(); }, []);
  useLiveContent(() => { fetchPage(); fetchKbArticles(); fetchBlogPosts(); });

  const filteredBlogs = catFilter === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === catFilter);

  const kbTabs = [
    { value: 'all', label: 'All' },
    ...KNOWLEDGE_CATEGORIES,
  ];
  const filteredKb = kbTab === 'all' ? kbArticles : kbArticles.filter(a => a.category === kbTab);

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

          {/* Section heading */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <BookOpen size={22} style={{ color: 'var(--primary)' }} />
            <div>
              <p className="font-bold tracking-[0.2em] uppercase text-xs"
                style={{ fontFamily: PP, color: 'var(--primary)' }}>Knowledge Base</p>
              <h2 className="font-bold" style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#111' }}>
                Articles &amp; Insights
              </h2>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8 lg:mb-12">
            {ARTICLE_CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setCatFilter(cat)}
                className="px-3.5 lg:px-5 py-1.5 lg:py-2 rounded-full font-semibold text-xs lg:text-sm transition-all border"
                style={{
                  fontFamily: PP,
                  backgroundColor: catFilter === cat ? 'var(--primary)' : '#fff',
                  color: catFilter === cat ? '#fff' : 'var(--primary)',
                  borderColor: catFilter === cat ? 'var(--primary)' : 'var(--p-a25)',
                }}>
                {cat}
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
                <Link to={`/resources/${filteredBlogs[0].slug}`} className="group block">
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
                          {filteredBlogs[0].category}
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
                    <Link to={`/resources/${post.slug}`}
                      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                      <div className="relative overflow-hidden" style={{ height: '200px' }}>
                        <img src={post.img} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: 'var(--primary)', color: '#fff', fontFamily: PP }}>
                          {post.category}
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

      {/* ── Compliance Knowledge (KB articles with category tabs) ── */}
      {kbArticles.length > 0 && (
        <section className="py-14" style={{ backgroundColor: '#fff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

            <div className="flex items-center gap-3 mb-6">
              <FileText size={22} style={{ color: 'var(--primary)' }} />
              <div>
                <p className="font-bold tracking-[0.2em] uppercase text-xs"
                  style={{ fontFamily: PP, color: 'var(--primary)' }}>Compliance Knowledge</p>
                <h2 className="font-bold" style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#111' }}>
                  Guides, Alerts &amp; Downloads
                </h2>
              </div>
            </div>

            {page.introText && (
              <p className="text-base leading-relaxed mb-6 max-w-3xl text-gray-600" style={{ fontFamily: PP }}>
                {page.introText}
              </p>
            )}

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {kbTabs.map(tab => (
                <button key={tab.value}
                  onClick={() => setKbTab(tab.value)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border"
                  style={{
                    fontFamily: PP,
                    backgroundColor: kbTab === tab.value ? 'var(--primary)' : '#fff',
                    color:           kbTab === tab.value ? '#fff' : '#555',
                    borderColor:     kbTab === tab.value ? 'var(--primary)' : '#e5e7eb',
                  }}>
                  {tab.value !== 'all' && (CATEGORY_ICONS[tab.value] ?? '')} {tab.label}
                </button>
              ))}
            </div>

            {filteredKb.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BookOpen size={40} className="mb-4 text-gray-300" />
                <p className="text-gray-400 text-sm" style={{ fontFamily: PP }}>
                  No articles in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKb.map(a => <KBArticleCard key={a._id} article={a} />)}
              </div>
            )}
          </div>
        </section>
      )}

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
