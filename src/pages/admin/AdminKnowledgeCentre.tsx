import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2, ChevronDown, ChevronUp, Pencil, X, BookOpen } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type { KnowledgeCentrePageContent, KnowledgeFAQ, KnowledgeArticleType, ResourceSection } from '../../types/content';
import { KNOWLEDGE_CATEGORIES as KCAT } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

/* ── Page defaults ─────────────────────────── */
const PAGE_EMPTY: KnowledgeCentrePageContent = {
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

const EMPTY_ARTICLE: Omit<KnowledgeArticleType, '_id'> = {
  category: 'labour-codes',
  title: '',
  slug: '',
  excerpt: '',
  date: '',
  readTime: '',
  author: 'MCS Team',
  img: '',
  featured: false,
  order: 0,
  sections: [],
  keyTakeaways: [],
};

/* ── Sections editor ── */
function SectionsEditor({ sections, onChange }: { sections: ResourceSection[]; onChange: (s: ResourceSection[]) => void }) {
  return (
    <Field label="Article sections">
      <div className="space-y-3">
        {sections.map((sec, i) => (
          <div key={i} className="p-3 rounded-xl border border-gray-100 space-y-2">
            <div className="flex gap-2">
              <TextInput placeholder="Section heading" value={sec.heading}
                onChange={e => { const n = [...sections]; n[i] = { ...sec, heading: e.target.value }; onChange(n); }} />
              <DangerButton type="button" onClick={() => onChange(sections.filter((_, j) => j !== i))}>
                <Trash2 size={13} />
              </DangerButton>
            </div>
            <TextArea rows={4} placeholder="Section body (blank line = new paragraph)"
              value={sec.body}
              onChange={e => { const n = [...sections]; n[i] = { ...sec, body: e.target.value }; onChange(n); }} />
          </div>
        ))}
        <SecondaryButton type="button" onClick={() => onChange([...sections, { heading: '', body: '' }])}>
          <Plus size={13} /> Add section
        </SecondaryButton>
      </div>
    </Field>
  );
}

function BulletEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }} />
            <DangerButton type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 size={13} />
            </DangerButton>
          </div>
        ))}
        <SecondaryButton type="button" onClick={() => onChange([...items, ''])}>
          <Plus size={13} /> Add item
        </SecondaryButton>
      </div>
    </Field>
  );
}

/* ── Main Admin Component ──────────────────── */
export default function AdminKnowledgeCentre() {
  /* ── Page content state ── */
  const [page, setPage]             = useState<KnowledgeCentrePageContent>(PAGE_EMPTY);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageSaving, setPageSaving]   = useState(false);
  const [pageSaved, setPageSaved]     = useState(false);
  const [pageDirty, setPageDirty]     = useState(false);
  const [pageError, setPageError]     = useState('');

  /* ── Articles state ── */
  const [articles, setArticles]       = useState<KnowledgeArticleType[]>([]);
  const [artLoading, setArtLoading]   = useState(true);
  const [artError, setArtError]       = useState('');
  const [artNotice, setArtNotice]     = useState('');
  const [editing, setEditing]         = useState<KnowledgeArticleType | Omit<KnowledgeArticleType, '_id'> | null>(null);
  const [artSaving, setArtSaving]     = useState(false);
  const [artDirty, setArtDirty]       = useState(false);

  /* ── Load page ── */
  useEffect(() => {
    api.get<KnowledgeCentrePageContent>('/knowledge-centre/page')
      .then(res => setPage({ ...PAGE_EMPTY, ...res }))
      .catch(e => setPageError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setPageLoading(false));
  }, []);

  /* ── Load articles ── */
  const loadArticles = () =>
    api.get<KnowledgeArticleType[]>('/knowledge-centre/articles')
      .then(setArticles)
      .catch(e => setArtError(e instanceof Error ? e.message : 'Failed to load articles'))
      .finally(() => setArtLoading(false));

  useEffect(() => { loadArticles(); }, []);

  /* ── Page setters ── */
  const setP = <K extends keyof KnowledgeCentrePageContent>(k: K, v: KnowledgeCentrePageContent[K]) => {
    setPageDirty(true);
    setPage(d => ({ ...d, [k]: v }));
  };

  const savePage = async () => {
    setPageSaving(true); setPageSaved(false); setPageError('');
    try {
      await api.put('/knowledge-centre/page', page);
      setPageDirty(false); setPageSaved(true);
      setTimeout(() => setPageSaved(false), 3000);
    } catch (e) {
      setPageError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setPageSaving(false);
    }
  };

  /* ── Article CRUD ── */
  const startCreate = () => { setArtError(''); setArtDirty(false); setEditing({ ...EMPTY_ARTICLE }); };
  const startEdit   = (a: KnowledgeArticleType) => { setArtError(''); setArtDirty(false); setEditing({ ...a }); };
  const cancelEdit  = () => { setEditing(null); setArtDirty(false); };

  const setArt = <K extends keyof KnowledgeArticleType>(key: K, value: KnowledgeArticleType[K]) => {
    setArtDirty(true);
    setEditing(e => e ? { ...e, [key]: value } : e);
  };

  const saveArticle = async () => {
    if (!editing) return;
    setArtSaving(true); setArtError('');
    try {
      let saved: KnowledgeArticleType;
      if ('_id' in editing && editing._id) {
        saved = await api.put<KnowledgeArticleType>(`/knowledge-centre/articles/${editing._id}`, editing);
      } else {
        saved = await api.post<KnowledgeArticleType>('/knowledge-centre/articles', editing);
      }
      await loadArticles();
      setEditing(saved);
      setArtDirty(false);
      setArtNotice('Saved — changes are live on the site.');
      setTimeout(() => setArtNotice(''), 2500);
    } catch (err) {
      setArtError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setArtSaving(false);
    }
  };

  const removeArticle = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      const art = articles.find(a => a._id === id);
      await api.del(`/knowledge-centre/articles/${id}`);
      if (art?.img) deleteCloudinaryAsset(art.img).catch(() => {});
      await loadArticles();
    } catch (err) {
      setArtError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  /* ── Article editor view ── */
  if (editing) {
    const catLabel = KCAT.find(c => c.value === (editing as KnowledgeArticleType).category)?.label ?? editing.category;
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            {'_id' in editing && editing._id ? 'Edit Article' : 'New Article'}
          </h1>
          <div className="flex items-center gap-3">
            <SecondaryButton onClick={cancelEdit}><X size={13} /> Cancel</SecondaryButton>
            <PrimaryButton onClick={saveArticle} disabled={artSaving || !editing.title}>
              {artSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {artSaving ? 'Saving…' : 'Save'}
            </PrimaryButton>
          </div>
        </div>

        {artDirty && !artSaving && (
          <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
            style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
            <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
            <button onClick={saveArticle} disabled={!editing.title}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#fda102', color: '#111' }}>
              <Save size={13} /> Save now
            </button>
          </div>
        )}

        {artNotice && !artDirty && (
          <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <CheckCircle2 size={15} /> {artNotice}
          </div>
        )}
        {artError && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{artError}</div>}

        <Section title="Basics">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title"><TextInput value={editing.title} onChange={e => setArt('title', e.target.value)} /></Field>
            <Field label="Slug (URL)">
              <TextInput value={editing.slug ?? ''} onChange={e => setArt('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={editing.category ?? 'labour-codes'} onChange={e => setArt('category', e.target.value as KnowledgeArticleType['category'])}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
                {KCAT.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Author"><TextInput value={editing.author ?? ''} onChange={e => setArt('author', e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date"><TextInput placeholder="Oct 15, 2024" value={editing.date ?? ''} onChange={e => setArt('date', e.target.value)} /></Field>
            <Field label="Read time"><TextInput placeholder="7 min read" value={editing.readTime ?? ''} onChange={e => setArt('readTime', e.target.value)} /></Field>
          </div>
          <Field label="Excerpt"><TextArea rows={3} value={editing.excerpt ?? ''} onChange={e => setArt('excerpt', e.target.value)} /></Field>
          <Field label="Featured">
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ fontFamily: PP }}>
              <input type="checkbox" checked={!!editing.featured} onChange={e => setArt('featured', e.target.checked)} />
              Show as featured article
            </label>
          </Field>
          <ImageUploader label="Cover image" value={editing.img ?? ''} onChange={v => setArt('img', v)}
            section="knowledge" hint="Landscape 16:9, min 800 × 450 px" />
        </Section>

        <Section title="Article Body">
          <SectionsEditor sections={editing.sections ?? []} onChange={v => setArt('sections', v)} />
        </Section>

        <Section title="Key Takeaways">
          <BulletEditor label="Takeaways" items={editing.keyTakeaways ?? []} onChange={v => setArt('keyTakeaways', v)} />
        </Section>

        <div className="flex justify-end gap-3 mb-8">
          <SecondaryButton onClick={cancelEdit}>Cancel</SecondaryButton>
          <PrimaryButton onClick={saveArticle} disabled={artSaving || !editing.title}>
            {artSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {artSaving ? 'Saving…' : 'Save'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  /* ── Main list view ── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            Knowledge Centre
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage articles, FAQs, and the hero section.
          </p>
        </div>
        <div className="flex gap-2">
          <PrimaryButton onClick={startCreate}><Plus size={15} /> New Article</PrimaryButton>
        </div>
      </div>

      {/* Global error */}
      {pageError && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {pageError}
        </div>
      )}

      {/* ── Hero Section (top, matching Resources style) ── */}
      {!pageLoading && (
        <Section title="Hero Section" description="The banner shown at the top of the public Knowledge Centre page.">
          {pageDirty && !pageSaving && (
            <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-sm -mt-2 mb-2"
              style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
              <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
              <button onClick={savePage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#fda102', color: '#111' }}>
                <Save size={13} /> Save now
              </button>
            </div>
          )}
          {pageSaved && !pageDirty && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 -mt-2 mb-2">
              <CheckCircle2 size={15} /> Saved — hero is live on the site.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow text">
              <TextInput value={page.heroEyebrow} onChange={e => setP('heroEyebrow', e.target.value)}
                placeholder="Compliance Knowledge That Helps You Act" />
            </Field>
            <Field label="Heading">
              <TextInput value={page.heroHeading} onChange={e => setP('heroHeading', e.target.value)}
                placeholder="MCS Knowledge Centre" />
            </Field>
          </div>
          <Field label="Subtext">
            <TextArea rows={2} value={page.heroSubtext} onChange={e => setP('heroSubtext', e.target.value)}
              placeholder="A practical resource for employers…" />
          </Field>

          <Field label="Background type">
            <select
              value={page.heroBgType}
              onChange={e => setP('heroBgType', e.target.value as KnowledgeCentrePageContent['heroBgType'])}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
              <option value="color">Dark color (default)</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </Field>

          {page.heroBgType === 'video' && (
            <ImageUploader label="Hero background video" value={page.heroVideoUrl}
              onChange={v => setP('heroVideoUrl', v)} accept="video/*" section="misc"
              hint="MP4, max 50 MB" />
          )}
          {page.heroBgType === 'image' && (
            <ImageUploader label="Hero background image" value={page.heroImageUrl}
              onChange={v => setP('heroImageUrl', v)} accept="image/*" section="misc"
              hint="Landscape, min 1920×600 px" />
          )}

          <div className="flex justify-end">
            <PrimaryButton onClick={savePage} disabled={pageSaving}>
              {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {pageSaving ? 'Saving…' : 'Save Hero'}
            </PrimaryButton>
          </div>
        </Section>
      )}

      {/* ── Articles & Insights ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: 'var(--p-a08)', color: 'var(--primary)', fontFamily: PP }}>
            <BookOpen size={12} /> Articles &amp; Insights
          </span>
          <span className="text-xs text-gray-400">{articles.length} item{articles.length !== 1 ? 's' : ''}</span>
          <div className="flex-1 border-t border-gray-100" />
          <SecondaryButton onClick={startCreate}><Plus size={13} /> New Article</SecondaryButton>
        </div>

        {artError && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{artError}</div>}
        {artNotice && (
          <div className="mb-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <CheckCircle2 size={15} /> {artNotice}
          </div>
        )}

        {artLoading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : (
          <div className="space-y-3">
            {articles.map(a => {
              const catLabel = KCAT.find(c => c.value === a.category)?.label ?? a.category;
              return (
                <div key={a._id} className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4"
                  style={{ borderColor: 'var(--p-a12)' }}>
                  {a.img && <img src={a.img} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>{a.title}</p>
                    <p className="text-gray-400 text-xs truncate">{catLabel} · {a.date}</p>
                  </div>
                  {a.featured && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--p-a10)', color: 'var(--primary)', fontFamily: PP }}>
                      Featured
                    </span>
                  )}
                  <SecondaryButton onClick={() => startEdit(a)}><Pencil size={13} /> Edit</SecondaryButton>
                  <DangerButton onClick={() => removeArticle(a._id)}><Trash2 size={13} /></DangerButton>
                </div>
              );
            })}
            {articles.length === 0 && <p className="text-gray-400 text-sm">No articles yet. Click "New Article" to add one.</p>}
          </div>
        )}
      </div>

      {/* ── PAGE CONTENT (Intro + FAQs) ── */}
      {!pageLoading && (
        <div>

          {/* Intro text */}
          <Section title="Intro Text" description="Optional paragraph shown above the category tabs.">
            <Field label="Intro text">
              <TextArea rows={3} value={page.introText} onChange={e => setP('introText', e.target.value)}
                placeholder="Optional introductory text for the knowledge centre…" />
            </Field>
          </Section>

          {/* FAQ section */}
          <Section title="FAQ Section" description="Accordion FAQ shown at the bottom of the page.">
            <Field label="FAQ section title">
              <TextInput value={page.faqTitle} onChange={e => setP('faqTitle', e.target.value)}
                placeholder="Frequently Asked Questions" />
            </Field>
            <Field label="FAQ section subtext">
              <TextArea rows={2} value={page.faqSubtext} onChange={e => setP('faqSubtext', e.target.value)}
                placeholder="Common questions from employers and HR professionals…" />
            </Field>

            <div className="space-y-3 mt-1">
              {page.faqs.map((faq, i) => (
                <FAQRow key={i} faq={faq}
                  onChange={updated => {
                    const n = [...page.faqs]; n[i] = updated; setP('faqs', n);
                  }}
                  onDelete={() => setP('faqs', page.faqs.filter((_, j) => j !== i))}
                />
              ))}
            </div>

            <SecondaryButton type="button" className="mt-3"
              onClick={() => setP('faqs', [...page.faqs, { question: '', answer: '' }])}>
              <Plus size={13} /> Add FAQ
            </SecondaryButton>
          </Section>

          {/* Bottom save */}
          <div className="flex justify-end mt-2 mb-8">
            <PrimaryButton onClick={savePage} disabled={pageSaving}>
              {pageSaving ? <Loader2 size={15} className="animate-spin" /> : pageSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
              {pageSaving ? 'Saving…' : pageSaved ? 'Saved!' : 'Save Page'}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── FAQ Row sub-component ─────────────────── */
function FAQRow({ faq, onChange, onDelete }: {
  faq: KnowledgeFAQ;
  onChange: (f: KnowledgeFAQ) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => setOpen(o => !o)}>
        <span className="flex-1 text-sm font-semibold truncate" style={{ fontFamily: PP, color: '#111' }}>
          {faq.question || <span className="text-gray-400 font-normal">New FAQ</span>}
        </span>
        <DangerButton type="button" onClick={e => { e.stopPropagation(); onDelete(); }}>
          <Trash2 size={12} />
        </DangerButton>
        {open ? <ChevronUp size={15} className="text-gray-400 shrink-0" />
          : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
      </div>
      {open && (
        <div className="p-4 space-y-2">
          <TextInput value={faq.question} placeholder="Question"
            onChange={e => onChange({ ...faq, question: e.target.value })} />
          <TextArea rows={3} value={faq.answer} placeholder="Answer"
            onChange={e => onChange({ ...faq, answer: e.target.value })} />
        </div>
      )}
    </div>
  );
}
