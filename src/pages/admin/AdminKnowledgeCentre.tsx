import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../lib/api';
import type { KnowledgeCentrePageContent, KnowledgeFAQ } from '../../types/content';
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

/* ── Main Admin Component ──────────────────── */
export default function AdminKnowledgeCentre() {
  // Page content state
  const [page, setPage]       = useState<KnowledgeCentrePageContent>(PAGE_EMPTY);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageSaving, setPageSaving]   = useState(false);
  const [pageSaved, setPageSaved]     = useState(false);
  const [pageDirty, setPageDirty]     = useState(false);
  const [pageError, setPageError]     = useState('');

  /* ── Load ── */
  useEffect(() => {
    api.get<KnowledgeCentrePageContent>('/knowledge-centre/page')
      .then(res => setPage({ ...PAGE_EMPTY, ...res }))
      .catch(e => setPageError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setPageLoading(false));
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
            Manage the Knowledge Centre page hero, intro text and FAQs.
          </p>
        </div>
        <PrimaryButton onClick={savePage} disabled={pageSaving}>
          {pageSaving ? <Loader2 size={15} className="animate-spin" /> : pageSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {pageSaving ? 'Saving…' : pageSaved ? 'Saved!' : 'Save'}
        </PrimaryButton>
      </div>

      {/* Global error */}
      {pageError && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {pageError}
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      {(
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
