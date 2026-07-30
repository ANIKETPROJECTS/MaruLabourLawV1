import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2, ChevronDown, ChevronUp, Edit2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { KnowledgeCentrePageContent, KnowledgeArticleType, KnowledgeFAQ } from '../../types/content';
import { KNOWLEDGE_CATEGORIES } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

/* ── Defaults ─────────────────────────────── */
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

const ARTICLE_EMPTY: Omit<KnowledgeArticleType, '_id'> = {
  category:   'labour-codes',
  title:      '',
  slug:       '',
  excerpt:    '',
  date:       '',
  readTime:   '',
  author:     'MCS Team',
  img:        '',
  featured:   false,
  order:      0,
  sections:   [],
  keyTakeaways: [],
  fileUrl:    '',
  fileFormat: '',
  fileSize:   '',
};

/* ── Article Editor Modal ──────────────────── */
function ArticleEditor({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: Omit<KnowledgeArticleType, '_id'> & { _id?: string };
  onSave: (a: typeof initial) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [data, setData] = useState({ ...initial });
  const set = <K extends keyof typeof data>(k: K, v: typeof data[K]) =>
    setData(d => ({ ...d, [k]: v }));
  const isDownload = data.category === 'downloads';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 className="font-bold text-lg" style={{ fontFamily: PP, color: '#111' }}>
            {initial._id ? 'Edit Article' : 'New Article'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-4">
          {/* Category */}
          <Field label="Category">
            <select value={data.category}
              onChange={e => set('category', e.target.value as KnowledgeArticleType['category'])}
              className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
              style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
              {KNOWLEDGE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Title *">
            <TextInput value={data.title} onChange={e => set('title', e.target.value)}
              placeholder="Article title" />
          </Field>

          <Field label="Slug (URL-friendly, auto-generated if left blank)">
            <TextInput value={data.slug ?? ''} onChange={e => set('slug', e.target.value)}
              placeholder="my-article-slug" />
          </Field>

          <Field label="Excerpt / Description">
            <TextArea rows={3} value={data.excerpt ?? ''} onChange={e => set('excerpt', e.target.value)}
              placeholder="Brief description shown on the card" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <TextInput value={data.date ?? ''} onChange={e => set('date', e.target.value)}
                placeholder="e.g. July 2026" />
            </Field>
            {!isDownload && (
              <Field label="Read Time">
                <TextInput value={data.readTime ?? ''} onChange={e => set('readTime', e.target.value)}
                  placeholder="5 min read" />
              </Field>
            )}
          </div>

          {!isDownload && (
            <Field label="Author">
              <TextInput value={data.author ?? ''} onChange={e => set('author', e.target.value)}
                placeholder="MCS Team" />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Display Order">
              <TextInput type="number" value={String(data.order ?? 0)}
                onChange={e => set('order', Number(e.target.value))} placeholder="0" />
            </Field>
            <Field label="">
              <label className="flex items-center gap-2 cursor-pointer mt-6" style={{ fontFamily: PP }}>
                <input type="checkbox" checked={!!data.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-[var(--primary)]" />
                <span className="text-sm font-semibold text-gray-600">Featured article</span>
              </label>
            </Field>
          </div>

          {/* Cover image */}
          {!isDownload && (
            <ImageUploader
              label="Cover image"
              value={data.img ?? ''}
              onChange={v => set('img', v)}
              accept="image/*"
              section="knowledge"
              hint="Landscape, min 1200×500 px"
            />
          )}

          {/* Download fields */}
          {isDownload && (
            <>
              <Field label="File URL">
                <TextInput value={data.fileUrl ?? ''} onChange={e => set('fileUrl', e.target.value)}
                  placeholder="https://…" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Format">
                  <TextInput value={data.fileFormat ?? ''} onChange={e => set('fileFormat', e.target.value)}
                    placeholder="PDF" />
                </Field>
                <Field label="File size">
                  <TextInput value={data.fileSize ?? ''} onChange={e => set('fileSize', e.target.value)}
                    placeholder="2.4 MB" />
                </Field>
              </div>
            </>
          )}

          {/* Sections */}
          {!isDownload && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ fontFamily: PP, color: '#111' }}>Article Body Sections</p>
              <div className="space-y-3">
                {(data.sections ?? []).map((sec, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
                    <TextInput value={sec.heading ?? ''} placeholder="Section heading"
                      onChange={e => {
                        const n = [...(data.sections ?? [])];
                        n[i] = { ...n[i], heading: e.target.value };
                        set('sections', n);
                      }} />
                    <TextArea rows={4} value={sec.body ?? ''} placeholder="Section body"
                      onChange={e => {
                        const n = [...(data.sections ?? [])];
                        n[i] = { ...n[i], body: e.target.value };
                        set('sections', n);
                      }} />
                    <DangerButton type="button" onClick={() =>
                      set('sections', (data.sections ?? []).filter((_, j) => j !== i))}>
                      <Trash2 size={12} /> Remove
                    </DangerButton>
                  </div>
                ))}
              </div>
              <SecondaryButton type="button" className="mt-2"
                onClick={() => set('sections', [...(data.sections ?? []), { heading: '', body: '' }])}>
                <Plus size={13} /> Add Section
              </SecondaryButton>
            </div>
          )}

          {/* Key Takeaways */}
          {!isDownload && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ fontFamily: PP, color: '#111' }}>Key Takeaways</p>
              <div className="space-y-2">
                {(data.keyTakeaways ?? []).map((kt, i) => (
                  <div key={i} className="flex gap-2">
                    <TextInput value={kt} placeholder="Key takeaway"
                      onChange={e => {
                        const n = [...(data.keyTakeaways ?? [])];
                        n[i] = e.target.value;
                        set('keyTakeaways', n);
                      }} />
                    <DangerButton type="button"
                      onClick={() => set('keyTakeaways', (data.keyTakeaways ?? []).filter((_, j) => j !== i))}>
                      <Trash2 size={13} />
                    </DangerButton>
                  </div>
                ))}
              </div>
              <SecondaryButton type="button" className="mt-2"
                onClick={() => set('keyTakeaways', [...(data.keyTakeaways ?? []), ''])}>
                <Plus size={13} /> Add Takeaway
              </SecondaryButton>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gray-100 flex justify-end gap-3">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={() => onSave(data)} disabled={saving || !data.title.trim()}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Article'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Component ──────────────────── */
export default function AdminKnowledgeCentre() {
  const [tab, setTab] = useState<'page' | 'articles'>('articles');

  // Page content state
  const [page, setPage]       = useState<KnowledgeCentrePageContent>(PAGE_EMPTY);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageSaving, setPageSaving]   = useState(false);
  const [pageSaved, setPageSaved]     = useState(false);
  const [pageDirty, setPageDirty]     = useState(false);
  const [pageError, setPageError]     = useState('');

  // Articles state
  const [articles, setArticles]   = useState<KnowledgeArticleType[]>([]);
  const [artLoading, setArtLoading] = useState(true);
  const [artError, setArtError]   = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');

  // Editor state
  const [editing, setEditing] = useState<(Omit<KnowledgeArticleType, '_id'> & { _id?: string }) | null>(null);
  const [artSaving, setArtSaving] = useState(false);

  /* ── Load ── */
  useEffect(() => {
    api.get<KnowledgeCentrePageContent>('/knowledge-centre/page')
      .then(res => setPage({ ...PAGE_EMPTY, ...res }))
      .catch(e => setPageError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setPageLoading(false));

    api.get<KnowledgeArticleType[]>('/knowledge-centre/articles')
      .then(setArticles)
      .catch(e => setArtError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setArtLoading(false));
  }, []);

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
  const saveArticle = async (data: Omit<KnowledgeArticleType, '_id'> & { _id?: string }) => {
    setArtSaving(true); setArtError('');
    try {
      if (data._id) {
        const updated = await api.put<KnowledgeArticleType>(`/knowledge-centre/articles/${data._id}`, data);
        setArticles(a => a.map(x => x._id === updated._id ? updated : x));
      } else {
        const created = await api.post<KnowledgeArticleType>('/knowledge-centre/articles', data);
        setArticles(a => [created, ...a]);
      }
      setEditing(null);
    } catch (e) {
      setArtError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setArtSaving(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      await api.del(`/knowledge-centre/articles/${id}`);
      setArticles(a => a.filter(x => x._id !== id));
    } catch (e) {
      setArtError(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  const filteredArticles = catFilter === 'all' ? articles
    : articles.filter(a => a.category === catFilter);

  /* ── Render ── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            Knowledge Centre
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage the Knowledge Centre page content, articles and FAQs.
          </p>
        </div>
        {tab === 'page' && (
          <PrimaryButton onClick={savePage} disabled={pageSaving}>
            {pageSaving ? <Loader2 size={15} className="animate-spin" /> : pageSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
            {pageSaving ? 'Saving…' : pageSaved ? 'Saved!' : 'Save'}
          </PrimaryButton>
        )}
        {tab === 'articles' && (
          <PrimaryButton onClick={() => setEditing({ ...ARTICLE_EMPTY })}>
            <Plus size={15} /> New Article
          </PrimaryButton>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl border border-gray-100 bg-gray-50 w-fit">
        {(['articles', 'page'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              fontFamily: PP,
              backgroundColor: tab === t ? '#fff' : 'transparent',
              color: tab === t ? 'var(--primary)' : '#6b7280',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t === 'articles' ? 'Articles & Downloads' : 'Page Content & FAQs'}
          </button>
        ))}
      </div>

      {/* Global error */}
      {(pageError || artError) && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {pageError || artError}
        </div>
      )}

      {/* ── ARTICLES TAB ── */}
      {tab === 'articles' && (
        <div>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setCatFilter('all')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                fontFamily: PP,
                backgroundColor: catFilter === 'all' ? 'var(--primary)' : '#fff',
                color:           catFilter === 'all' ? '#fff' : '#555',
                borderColor:     catFilter === 'all' ? 'var(--primary)' : '#e5e7eb',
              }}>All</button>
            {KNOWLEDGE_CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCatFilter(c.value)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  fontFamily: PP,
                  backgroundColor: catFilter === c.value ? 'var(--primary)' : '#fff',
                  color:           catFilter === c.value ? '#fff' : '#555',
                  borderColor:     catFilter === c.value ? 'var(--primary)' : '#e5e7eb',
                }}>{c.label}</button>
            ))}
          </div>

          {artLoading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm mb-3" style={{ fontFamily: PP }}>No articles yet.</p>
              <SecondaryButton onClick={() => setEditing({ ...ARTICLE_EMPTY })}>
                <Plus size={13} /> Create first article
              </SecondaryButton>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredArticles.map(a => {
                const catLabel = KNOWLEDGE_CATEGORIES.find(c => c.value === a.category)?.label ?? a.category;
                return (
                  <div key={a._id}
                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: 'var(--primary)', fontFamily: PP }}>{catLabel}</span>
                        {a.featured && (
                          <span className="text-xs px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: '#fef3c7', color: '#d97706', fontFamily: PP }}>
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>
                        {a.title}
                      </p>
                      {a.date && (
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: PP }}>{a.date}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setEditing({ ...a })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors hover:bg-gray-50"
                        style={{ fontFamily: PP, borderColor: '#e5e7eb', color: '#374151' }}>
                        <Edit2 size={12} /> Edit
                      </button>
                      <DangerButton type="button" onClick={() => deleteArticle(a._id)}>
                        <Trash2 size={13} />
                      </DangerButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PAGE CONTENT TAB ── */}
      {tab === 'page' && (
        <div>
          {pageLoading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : (
            <>
              {pageDirty && !pageSaving && (
                <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
                  style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
                  <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
                  <button onClick={savePage}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#fda102', color: '#111' }}>
                    <Save size={13} /> Save now
                  </button>
                </div>
              )}

              {/* Hero */}
              <Section title="Hero Section" description="The full-width banner at the top of the Knowledge Centre page.">
                <Field label="Eyebrow text">
                  <TextInput value={page.heroEyebrow} onChange={e => setP('heroEyebrow', e.target.value)}
                    placeholder="Compliance Knowledge That Helps You Act" />
                </Field>
                <Field label="Heading">
                  <TextInput value={page.heroHeading} onChange={e => setP('heroHeading', e.target.value)}
                    placeholder="MCS Knowledge Centre" />
                </Field>
                <Field label="Subtext">
                  <TextArea rows={2} value={page.heroSubtext} onChange={e => setP('heroSubtext', e.target.value)}
                    placeholder="A practical resource for employers…" />
                </Field>

                <Field label="Background type">
                  <div className="flex gap-3">
                    {(['color', 'video', 'image'] as const).map(type => (
                      <button key={type} type="button"
                        onClick={() => setP('heroBgType', type)}
                        className="px-4 py-2 rounded-lg border text-sm font-semibold transition-colors capitalize"
                        style={{
                          fontFamily: PP,
                          backgroundColor: page.heroBgType === type ? 'var(--primary)' : '#fff',
                          color: page.heroBgType === type ? '#fff' : '#555',
                          borderColor: page.heroBgType === type ? 'var(--primary)' : '#e5e7eb',
                        }}>
                        {type === 'color' ? '🎨 Dark' : type === 'video' ? '🎬 Video' : '🖼 Image'}
                      </button>
                    ))}
                  </div>
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
              </Section>

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
                  {pageSaving ? 'Saving…' : pageSaved ? 'Saved!' : 'Save'}
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      )}

      {/* Article editor modal */}
      {editing && (
        <ArticleEditor
          initial={editing}
          onSave={saveArticle}
          onClose={() => setEditing(null)}
          saving={artSaving}
        />
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
