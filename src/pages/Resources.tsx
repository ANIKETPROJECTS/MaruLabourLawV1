import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { ResourceItem, ResourcesPageContent } from '../types/content';

const PP = 'Poppins, sans-serif';

// Cloudinary force-download helper
function forceDownloadUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'res.cloudinary.com') return url;
    if (parsed.pathname.includes('/fl_attachment')) return url;
    const uploadMarker = '/upload/';
    const idx = parsed.pathname.indexOf(uploadMarker);
    if (idx === -1) return url;
    const insertAt = idx + uploadMarker.length;
    parsed.pathname = `${parsed.pathname.slice(0, insertAt)}fl_attachment/${parsed.pathname.slice(insertAt)}`;
    return parsed.toString();
  } catch {
    return url;
  }
}

const HERO_DEFAULTS: ResourcesPageContent = {
  heroEyebrow:  'Downloads & Templates',
  heroHeading:  'Compliance Resources',
  heroSubtext:  'Practical compliance templates, checklists and reference documents — free to download.',
  heroBgType:   'color',
  heroImageUrl: '',
  heroVideoUrl: '',
  downloadsLabel:        'Free Resources',
  downloadsHeading:      'Templates & Downloads',
  downloadsSubtext:      'Practical compliance templates, checklists, and reference documents — free to download.',
  newsletterLabel:       'Stay Updated',
  newsletterHeading:     'Never miss a compliance update',
  newsletterBody:        'Subscribe for critical regulatory alerts, new circulars, and expert analysis delivered directly to your inbox.',
  newsletterButtonText:  'Subscribe',
  newsletterPlaceholder: 'Your business email',
};

const Resources = () => {
  const [downloads, setDownloads] = useState<ResourceItem[]>([]);
  const [hero, setHero] = useState<ResourcesPageContent>(HERO_DEFAULTS);

  const fetchResources = () => {
    api.get<ResourceItem[]>('/resources')
      .then(data => setDownloads(data.filter(r => r.tab === 'downloads')))
      .catch(() => {});
  };
  useEffect(fetchResources, []);
  useLiveContent(fetchResources);

  const fetchHero = () => {
    api.get<ResourcesPageContent>('/resources-page').then(setHero).catch(() => {});
  };
  useEffect(fetchHero, []);
  useLiveContent(fetchHero);

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--primary)', minHeight: '190px', maxHeight: '300px', height: '36vh' }}>

        {hero.heroBgType === 'image' && hero.heroImageUrl && (
          <img src={hero.heroImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
        )}
        {hero.heroBgType === 'video' && hero.heroVideoUrl && (
          <video key={hero.heroVideoUrl} autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }}>
            <source src={hero.heroVideoUrl} type="video/mp4" />
          </video>
        )}
        {hero.heroBgType !== 'color' && (hero.heroImageUrl || hero.heroVideoUrl) && (
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1 }} />
        )}

        <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: '#fda102', zIndex: 1 }} />

        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center px-5 lg:px-8 w-full max-w-4xl mx-auto"
          style={{ zIndex: 2 }}>
          <p className="uppercase tracking-[0.25em] lg:tracking-[0.3em] font-semibold mb-2"
            style={{ fontFamily: PP, fontSize: '0.85rem', color: '#fda102' }}>
            {hero.heroEyebrow}
          </p>
          <h1 className="font-bold mb-3"
            style={{ fontFamily: PP, fontSize: 'clamp(1.35rem, 4vw, 2.3rem)', fontWeight: 700, letterSpacing: '0.02em', color: '#fff' }}>
            {hero.heroHeading}
          </h1>
          <p style={{
            fontFamily: PP, fontSize: 'clamp(0.82rem, 1.3vw, 1rem)', fontWeight: 300,
            color: 'rgba(255,255,255,0.82)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6,
          }}>
            {hero.heroSubtext}
          </p>
        </motion.div>
      </section>

      {/* ── Downloads ── */}
      <section className="py-8 lg:py-14" style={{ backgroundColor: '#f8fafb' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <motion.div className="mb-6 lg:mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="font-bold tracking-[0.2em] uppercase text-xs mb-2"
              style={{ fontFamily: PP, color: 'var(--primary)' }}>{hero.downloadsLabel}</p>
            <h2 className="font-bold" style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', color: '#111' }}>
              {hero.downloadsHeading}
            </h2>
            <p className="text-gray-500 mt-2" style={{ fontFamily: PP, fontSize: '0.9rem' }}>
              {hero.downloadsSubtext}
            </p>
          </motion.div>

          {downloads.length === 0 ? (
            <div className="text-center py-20 text-gray-400" style={{ fontFamily: PP }}>
              No downloads available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {downloads.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 lg:p-7 flex flex-col">

                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'var(--p-a09)' }}>
                      <FileText size={22} style={{ color: 'var(--primary)' }} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: item.downloadType === 'Resource' ? 'rgba(253,161,2,0.12)' : 'var(--p-a08)',
                        color: item.downloadType === 'Resource' ? '#b07000' : 'var(--primary)',
                        fontFamily: PP,
                      }}>
                      {item.downloadType ?? 'Download'}
                    </span>
                  </div>

                  <h3 className="font-bold mb-2 leading-snug flex-grow"
                    style={{ fontFamily: PP, fontSize: '1rem', color: '#111' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5" style={{ fontFamily: PP }}>
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: PP }}>
                      {item.format} · {item.size}
                    </span>
                    {item.fileUrl ? (
                      <a
                        href={forceDownloadUrl(item.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full transition-all hover:opacity-80"
                        style={{ fontFamily: PP, backgroundColor: 'var(--p-a09)', color: 'var(--primary)' }}>
                        <Download size={13} /> Download
                      </a>
                    ) : (
                      <span
                        title="File not uploaded yet"
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full cursor-not-allowed"
                        style={{ fontFamily: PP, backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}>
                        <Download size={13} /> Unavailable
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-10 lg:py-16" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-2xl mx-auto px-4 lg:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="font-bold uppercase tracking-[0.2em] text-xs mb-4"
            style={{ fontFamily: PP, color: '#fda102' }}>
            {hero.newsletterLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.07 }}
            className="font-bold mb-4 text-white"
            style={{ fontFamily: PP, fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
            {hero.newsletterHeading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.14 }}
            className="mb-8 leading-relaxed"
            style={{ fontFamily: PP, fontSize: '1rem', color: 'rgba(255,255,255,0.75)' }}>
            {hero.newsletterBody}
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder={hero.newsletterPlaceholder}
              className="flex-1 rounded-xl px-5 py-3.5 text-sm outline-none border-0"
              style={{ fontFamily: PP, backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }} />
            <button type="submit"
              className="px-7 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ fontFamily: PP, backgroundColor: '#fda102', color: '#111' }}>
              {hero.newsletterButtonText}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Resources;
