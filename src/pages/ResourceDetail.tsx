import { useParams, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, CheckCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { ResourceItem } from '../types/content';

const PP = 'Poppins, sans-serif';

const ResourceDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const fromKC = (location.state as { from?: string } | null)?.from === 'knowledge-centre';
  const [post, setPost] = useState<ResourceItem | null>(null);
  const [allArticles, setAllArticles] = useState<ResourceItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');

  const reqRef = useRef(0);
  const fetchArticle = () => {
    const reqId = ++reqRef.current;
    const currentSlug = slug;
    Promise.all([
      api.get<ResourceItem>(`/resources/slug/${currentSlug}`),
      api.get<ResourceItem[]>('/resources?tab=articles'),
    ])
      .then(([article, articles]) => {
        if (reqId !== reqRef.current) return; // superseded by a newer request
        setPost(article);
        setAllArticles(articles.filter(a => a.slug !== currentSlug));
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (reqId !== reqRef.current) return;
        const status = (err as { status?: number }).status;
        setStatus(status === 404 ? 'not-found' : 'error');
      });
  };
  useLiveContent(fetchArticle);
  useEffect(() => {
    setStatus('loading');
    fetchArticle();
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: PP }}>
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (status === 'not-found' || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ fontFamily: PP }}>
        <p className="text-gray-500 mb-4">Article not found.</p>
        <Link to={fromKC ? '/knowledge-centre' : '/resources'} className="font-semibold" style={{ color: 'var(--primary)' }}>
          ← Back to {fromKC ? 'Knowledge Centre' : 'Resources'}
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ fontFamily: PP }}>
        <p className="text-gray-500 mb-4">Failed to load article. Please try again.</p>
        <Link to={fromKC ? '/knowledge-centre' : '/resources'} className="font-semibold" style={{ color: 'var(--primary)' }}>
          ← Back to {fromKC ? 'Knowledge Centre' : 'Resources'}
        </Link>
      </div>
    );
  }

  const related = allArticles.slice(0, 3);

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section className="flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--primary)', minHeight: '200px', maxHeight: '300px', height: '40vh' }}>
        <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: '#fda102' }} />

        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-5 lg:px-8 w-full max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.25em] lg:tracking-[0.3em] font-semibold mb-2"
            style={{ fontFamily: PP, fontSize: '0.78rem', color: '#fda102' }}>
            {post.category}
          </p>
          <h1 className="font-bold mb-3 leading-tight"
            style={{ fontFamily: PP, fontSize: 'clamp(1.2rem, 2.8vw, 2.2rem)', color: '#fff', maxWidth: '780px', margin: '0 auto 12px' }}>
            {post.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 text-xs lg:text-sm"
            style={{ color: 'rgba(255,255,255,0.75)' }}>
            <span className="flex items-center gap-1.5"><Calendar size={13} style={{ color: '#fda102' }} /> {post.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} style={{ color: '#fda102' }} /> {post.readTime}</span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>By {post.author}</span>
          </div>
        </motion.div>
      </section>

      {/* ── Full-Width Image ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full overflow-hidden"
        style={{ height: 'clamp(180px, 45vw, 440px)' }}>
        <img src={post.img} alt={post.title}
          className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
      </motion.div>

      {/* ── Content ── */}
      <section className="py-8 lg:py-14" style={{ backgroundColor: '#f8fafb' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-10">

          {/* Back link */}
          <Link to={fromKC ? '/knowledge-centre' : '/resources'}
            className="inline-flex items-center gap-2 text-sm font-semibold mb-6 lg:mb-8 transition-opacity hover:opacity-70"
            style={{ fontFamily: PP, color: 'var(--primary)' }}>
            <ArrowLeft size={15} /> Back to {fromKC ? 'Knowledge Centre' : 'Resources'}
          </Link>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

            {/* ── Article Body ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/3 space-y-5 lg:space-y-7">

              {/* Excerpt */}
              <div className="rounded-2xl p-5 lg:p-7 border-l-4"
                style={{ backgroundColor: 'var(--p-a05)', borderColor: 'var(--primary)' }}>
                <p className="leading-relaxed font-medium"
                  style={{ fontFamily: PP, fontSize: '0.98rem', color: '#333', fontStyle: 'italic' }}>
                  {post.excerpt}
                </p>
              </div>

              {/* Article Sections */}
              <div className="bg-white rounded-2xl p-5 md:p-12 border border-gray-100 shadow-sm space-y-7 lg:space-y-10">
                {(post.sections ?? []).map((section, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                    <h2 className="font-bold mb-4"
                      style={{ fontFamily: PP, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#111' }}>
                      {section.heading}
                    </h2>
                    {section.body.split('\n\n').map((para, j) => (
                      <p key={j} className="text-gray-600 leading-relaxed mb-4 last:mb-0"
                        style={{ fontFamily: PP, fontSize: '0.92rem', lineHeight: 1.9, textAlign: 'justify' }}>
                        {para}
                      </p>
                    ))}
                  </motion.div>
                ))}
              </div>

              {/* Key Takeaways */}
              <div className="bg-white rounded-2xl p-5 md:p-10 border border-gray-100 shadow-sm">
                <h2 className="font-bold mb-6"
                  style={{ fontFamily: PP, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#111' }}>
                  Key Takeaways
                </h2>
                <ul className="space-y-4">
                  {(post.keyTakeaways ?? []).map((item, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3">
                      <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                      <span style={{ fontFamily: PP, fontSize: '0.9rem', color: '#333', lineHeight: 1.7 }}>
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Related Articles */}
              <div className="bg-white rounded-2xl p-5 md:p-10 border border-gray-100 shadow-sm">
                <h2 className="font-bold mb-6"
                  style={{ fontFamily: PP, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#111' }}>
                  Related Articles
                </h2>
                <div className="space-y-4">
                  {related.map((r, i) => (
                    <Link key={i} to={`/resources/${r.slug}`}
                      className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl border border-gray-100 hover:border-[var(--p-a30)] hover:shadow-sm transition-all group">
                      <img src={r.img} alt={r.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: 'var(--primary)', fontFamily: PP }}>{r.category}</span>
                        <p className="font-semibold mt-0.5 line-clamp-2"
                          style={{ fontFamily: PP, fontSize: '0.95rem', color: '#111' }}>{r.title}</p>
                      </div>
                      <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Sidebar ── */}
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-28 space-y-5 lg:space-y-6">

                {/* Article Info */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-2 text-center text-xs font-bold uppercase tracking-widest"
                    style={{ backgroundColor: 'var(--primary)', color: '#fda102', fontFamily: PP }}>
                    Article Info
                  </div>
                  <div className="p-5 lg:p-7 space-y-4">
                    {[
                      { label: 'Category', value: post.category },
                      { label: 'Published', value: post.date },
                      { label: 'Read Time', value: post.readTime },
                      { label: 'Author', value: post.author },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <span className="text-gray-400 text-sm" style={{ fontFamily: PP }}>{row.label}</span>
                        <span className="font-semibold text-sm text-right" style={{ fontFamily: PP, color: '#222', maxWidth: '60%' }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="p-2 text-center text-xs font-bold uppercase tracking-widest"
                    style={{ backgroundColor: 'var(--primary)', color: '#fda102', fontFamily: PP }}>
                    Need Expert Help?
                  </div>
                  <div className="bg-white p-5 lg:p-7">
                    <h3 className="font-bold mb-2"
                      style={{ fontFamily: PP, fontSize: '1.1rem', color: '#111' }}>
                      Talk to a Compliance Expert
                    </h3>
                    <p className="text-gray-500 text-sm mb-5 leading-relaxed" style={{ fontFamily: PP }}>
                      Have questions about this topic? Our team is ready to help you stay fully compliant.
                    </p>
                    <Link to="/contact"
                      className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-opacity hover:opacity-90 mb-3"
                      style={{ fontFamily: PP, backgroundColor: 'var(--primary)', color: '#fff' }}>
                      Book a Consultation <ArrowRight size={14} />
                    </Link>
                    <Link to={fromKC ? '/knowledge-centre' : '/resources'}
                      className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-all hover:bg-[var(--primary)] hover:text-white"
                      style={{ fontFamily: PP, color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                      {fromKC ? 'Back to Knowledge Centre' : 'More Articles'}
                    </Link>
                  </div>
                </motion.div>

                {/* All articles list */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-7">
                  <h4 className="font-bold mb-5 uppercase tracking-widest text-xs"
                    style={{ fontFamily: PP, color: 'var(--primary)' }}>
                    All Articles
                  </h4>
                  <ul className="space-y-0.5">
                    {allArticles.map((p, i) => (
                      <li key={i}>
                        <Link to={`/resources/${p.slug}`}
                          state={fromKC ? { from: 'knowledge-centre' } : undefined}
                          className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 group transition-colors hover:text-[var(--primary)]"
                          style={{ fontFamily: PP, color: '#333', fontSize: '0.88rem', fontWeight: 500 }}>
                          <ChevronRight size={13} className="text-gray-300 group-hover:text-[var(--primary)] transition-colors shrink-0" />
                          <span className="line-clamp-2">{p.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourceDetail;
