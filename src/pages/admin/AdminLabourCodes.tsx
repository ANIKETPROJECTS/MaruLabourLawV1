import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, Pencil, X, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type { LabourCodeContent, LabourCodesPageContent } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

const EMPTY: Omit<LabourCodeContent, '_id'> = {
  slug: '', codeNumber: '', title: '', subtitle: '', intro: '', body: '',
  coveringAreas: [], ctaLabel: '', img: '',
};

const PAGE_EMPTY: LabourCodesPageContent = {
  heroLabel:   'Labour Codes Advisory',
  heroHeading: "Navigating India's New Labour Law Framework",
  heroSubtext: 'India has consolidated 29 Central labour laws into four Labour Codes. MCS helps employers understand the business impact and implement compliant, workable processes.',
  gridLabel:   'The four codes',
  gridHeading: 'From interpretation to implementation.',
  gridSubtext: 'Our Labour Codes readiness review can cover wage structures, payroll, social security, gratuity, bonus, appointment letters, HR policies, standing orders, contractor management, working conditions and related processes.',
  ctaLabel:      'MCS Labour Codes Readiness Review',
  ctaHeading:    'Is your organisation Labour Codes ready?',
  ctaSteps:      ['Compliance Status', 'Gap Analysis', 'Risk Classification', 'Corrective Actions', 'Implementation Roadmap'],
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

export default function AdminLabourCodes() {
  const [codes, setCodes] = useState<LabourCodeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LabourCodeContent | (Omit<LabourCodeContent, '_id'> & { _id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Page content state
  const [page, setPage] = useState<LabourCodesPageContent>(PAGE_EMPTY);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageDirty, setPageDirty] = useState(false);
  const [pageNotice, setPageNotice] = useState('');
  const [pageError, setPageError] = useState('');

  const load = () => api.get<LabourCodeContent[]>('/labour-codes').then(setCodes);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get<LabourCodesPageContent>('/labour-codes-page')
      .then(d => setPage({ ...PAGE_EMPTY, ...d }))
      .catch(err => setPageError(err instanceof Error ? err.message : 'Failed to load page content'))
      .finally(() => setPageLoading(false));
  }, []);

  const setP = <K extends keyof LabourCodesPageContent>(key: K, value: LabourCodesPageContent[K]) => {
    setPageDirty(true);
    setPage(p => ({ ...p, [key]: value }));
  };

  const savePage = async () => {
    setPageSaving(true); setPageError('');
    try {
      const saved = await api.put<LabourCodesPageContent>('/labour-codes-page', page);
      setPage({ ...PAGE_EMPTY, ...saved });
      setPageDirty(false);
      setPageNotice('Saved — page content is live on the site.');
      setTimeout(() => setPageNotice(''), 2500);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to save page content');
    } finally {
      setPageSaving(false);
    }
  };

  const startCreate = () => { setError(''); setDirty(false); setEditing({ ...EMPTY, coveringAreas: [] }); };
  const startEdit = (c: LabourCodeContent) => { setError(''); setDirty(false); setEditing({ ...c, coveringAreas: c.coveringAreas || [] }); };
  const cancel = () => { setEditing(null); setDirty(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError('');
    try {
      let saved: LabourCodeContent;
      if ('_id' in editing && editing._id) {
        saved = await api.put<LabourCodeContent>(`/labour-codes/${editing._id}`, editing);
      } else {
        saved = await api.post<LabourCodeContent>('/labour-codes', editing);
      }
      await load(); setEditing(saved); setDirty(false);
      setNotice('Saved — changes are live on the site.');
      setTimeout(() => setNotice(''), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this labour code? This cannot be undone.')) return;
    try {
      const c = codes.find((x) => x._id === id);
      await api.del(`/labour-codes/${id}`);
      if (c?.img) deleteCloudinaryAsset(c.img).catch(() => {});
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to delete'); }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= codes.length) return;
    const next = [...codes];
    [next[index], next[target]] = [next[target], next[index]];
    setCodes(next.map((c, i) => ({ ...c, order: i })));
    try {
      await Promise.all(next.map((c, i) => api.put(`/labour-codes/${c._id}`, { ...c, order: i })));
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to reorder'); await load(); }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  if (editing) {
    const areas = (editing as LabourCodeContent & { coveringAreas: string[] }).coveringAreas || [];
    const set = <K extends keyof typeof editing>(key: K, value: (typeof editing)[K]) => {
      setDirty(true);
      setEditing((e) => (e ? { ...e, [key]: value } : e));
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            {'_id' in editing && editing._id ? 'Edit Labour Code' : 'New Labour Code'}
          </h1>
          <div className="flex items-center gap-3">
            <SecondaryButton onClick={cancel}><X size={13} /> Cancel</SecondaryButton>
            <PrimaryButton onClick={save} disabled={saving || !editing.title || !editing.slug}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save'}
            </PrimaryButton>
          </div>
        </div>

        {dirty && !saving && (
          <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
            style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
            <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
            <button onClick={save} disabled={!editing.title || !editing.slug}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#fda102', color: '#111' }}>
              <Save size={13} /> Save now
            </button>
          </div>
        )}

        {notice && !dirty && (
          <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <CheckCircle2 size={15} /> {notice}
          </div>
        )}
        {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

        <Section title="Card Details" description="Shown on the Labour Codes listing page.">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Code Number (e.g. 01)">
              <TextInput value={editing.codeNumber ?? ''} onChange={(e) => set('codeNumber', e.target.value)} placeholder="01" />
            </Field>
            <Field label="Slug (URL)">
              <TextInput value={editing.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
            </Field>
            <Field label="CTA Button Label">
              <TextInput value={editing.ctaLabel ?? ''} onChange={(e) => set('ctaLabel', e.target.value)} placeholder="Request a Review" />
            </Field>
          </div>
          <Field label="Title"><TextInput value={editing.title} onChange={(e) => set('title', e.target.value)} /></Field>
          <Field label="Subtitle (shown on card)">
            <TextArea rows={2} value={editing.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} />
          </Field>
          <ImageUploader label="Banner image" value={editing.img ?? ''} onChange={(v) => set('img', v)} section="labour-codes"
            hint="Landscape 16:9, min 1200 × 500 px" />
        </Section>

        <Section title="Detail Page" description="Shown on the code's dedicated page.">
          <Field label="Intro (shown under the title in the hero)">
            <TextArea rows={2} value={editing.intro ?? ''} onChange={(e) => set('intro', e.target.value)} />
          </Field>
          <Field label="Body (blank line = new paragraph)">
            <TextArea rows={6} value={editing.body ?? ''} onChange={(e) => set('body', e.target.value)} />
          </Field>
          <Field label="Covering Areas (one per line)">
            <TextArea
              rows={10}
              placeholder={"Definition and computation of wages\nReview of inclusions and exclusions\n50% exclusion-threshold analysis"}
              value={areas.join('\n')}
              onChange={(e) => set('coveringAreas', e.target.value.split('\n'))}
            />
            <p className="text-xs text-gray-400 mt-1.5">Enter each bullet point on a separate line.</p>
          </Field>
        </Section>

        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={cancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={save} disabled={saving || !editing.title || !editing.slug}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Labour Codes</h1>
          <p className="text-gray-400 text-sm mt-1">Add, edit, or remove the four Labour Codes and their detail pages.</p>
        </div>
        <PrimaryButton onClick={startCreate}><Plus size={15} /> New Code</PrimaryButton>
      </div>

      {notice && (
        <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <CheckCircle2 size={15} /> {notice}
        </div>
      )}
      {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

      <div className="space-y-3 mb-10">
        {codes.map((c, i) => (
          <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move up">
                <ChevronUp size={16} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === codes.length - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move down">
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
              {c.img ? (
                <img src={c.img} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-xl font-bold" style={{ color: '#fda102', fontFamily: PP }}>{c.codeNumber}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>{c.title}</p>
              <p className="text-gray-400 text-xs truncate">/labour-codes/{c.slug}</p>
            </div>
            <SecondaryButton onClick={() => startEdit(c)}><Pencil size={13} /> Edit</SecondaryButton>
            <DangerButton onClick={() => remove(c._id)}><Trash2 size={13} /></DangerButton>
          </div>
        ))}
        {codes.length === 0 && (
          <p className="text-gray-400 text-sm">No labour codes yet. Click "New Code" to add one.</p>
        )}
      </div>

      {/* ── Page Content Editor ── */}
      {!pageLoading && (
        <div>
          {pageError && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{pageError}</div>}

          {pageDirty && !pageSaving && (
            <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
              style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
              <span className="text-sm font-semibold text-white">You have unsaved page content changes.</span>
              <button onClick={savePage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#fda102', color: '#111' }}>
                <Save size={13} /> Save now
              </button>
            </div>
          )}
          {pageNotice && !pageDirty && (
            <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <CheckCircle2 size={15} /> {pageNotice}
            </div>
          )}

          <Section title="Hero Section" description="The banner at the top of the Labour Codes listing page.">
            <Field label="Eyebrow label">
              <TextInput value={page.heroLabel} onChange={e => setP('heroLabel', e.target.value)} placeholder="Labour Codes Advisory" />
            </Field>
            <Field label="Heading">
              <TextInput value={page.heroHeading} onChange={e => setP('heroHeading', e.target.value)} />
            </Field>
            <Field label="Subtext">
              <TextArea rows={3} value={page.heroSubtext} onChange={e => setP('heroSubtext', e.target.value)} />
            </Field>
            <div className="flex justify-end">
              <PrimaryButton onClick={savePage} disabled={pageSaving}>
                {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pageSaving ? 'Saving…' : 'Save Page Content'}
              </PrimaryButton>
            </div>
          </Section>

          <Section title="Grid Section" description="Labels and copy above the four-code grid.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Section label (eyebrow)">
                <TextInput value={page.gridLabel} onChange={e => setP('gridLabel', e.target.value)} placeholder="The four codes" />
              </Field>
              <Field label="Section heading">
                <TextInput value={page.gridHeading} onChange={e => setP('gridHeading', e.target.value)} />
              </Field>
            </div>
            <Field label="Section subtext">
              <TextArea rows={3} value={page.gridSubtext} onChange={e => setP('gridSubtext', e.target.value)} />
            </Field>
            <div className="flex justify-end">
              <PrimaryButton onClick={savePage} disabled={pageSaving}>
                {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pageSaving ? 'Saving…' : 'Save Page Content'}
              </PrimaryButton>
            </div>
          </Section>

          <Section title="CTA Strip" description="The call-to-action band shown below the codes grid.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="CTA eyebrow label">
                <TextInput value={page.ctaLabel} onChange={e => setP('ctaLabel', e.target.value)} />
              </Field>
              <Field label="CTA button text">
                <TextInput value={page.ctaButtonText} onChange={e => setP('ctaButtonText', e.target.value)} />
              </Field>
            </div>
            <Field label="CTA heading">
              <TextInput value={page.ctaHeading} onChange={e => setP('ctaHeading', e.target.value)} />
            </Field>
            <Field label="CTA steps (one per line — shown as badge pills)">
              <TextArea rows={6} value={page.ctaSteps.join('\n')} onChange={e => setP('ctaSteps', e.target.value.split('\n'))} />
            </Field>
            <div className="flex justify-end">
              <PrimaryButton onClick={savePage} disabled={pageSaving}>
                {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pageSaving ? 'Saving…' : 'Save Page Content'}
              </PrimaryButton>
            </div>
          </Section>

          <Section title="Disclaimer" description="Legal disclaimer shown at the bottom of the listing and detail pages.">
            <Field label="Disclaimer text">
              <TextArea rows={4} value={page.disclaimer} onChange={e => setP('disclaimer', e.target.value)} />
            </Field>
            <div className="flex justify-end">
              <PrimaryButton onClick={savePage} disabled={pageSaving}>
                {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pageSaving ? 'Saving…' : 'Save Page Content'}
              </PrimaryButton>
            </div>
          </Section>

          <Section title="Detail Page Labels" description="Section headings and navigation labels on individual code detail pages.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Breadcrumb text">
                <TextInput value={page.detailBreadcrumb} onChange={e => setP('detailBreadcrumb', e.target.value)} />
              </Field>
              <Field label='"About This Code" heading'>
                <TextInput value={page.detailAboutHeading} onChange={e => setP('detailAboutHeading', e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label='"What We Cover" heading'>
                <TextInput value={page.detailCoveringHeading} onChange={e => setP('detailCoveringHeading', e.target.value)} />
              </Field>
              <Field label='"What We Cover" subtext'>
                <TextInput value={page.detailCoveringSubtext} onChange={e => setP('detailCoveringSubtext', e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label='"Other Labour Codes" heading'>
                <TextInput value={page.detailOtherCodes} onChange={e => setP('detailOtherCodes', e.target.value)} />
              </Field>
              <Field label='"All Four Labour Codes" link label'>
                <TextInput value={page.detailAllCodes} onChange={e => setP('detailAllCodes', e.target.value)} />
              </Field>
            </div>
            <div className="flex justify-end">
              <PrimaryButton onClick={savePage} disabled={pageSaving}>
                {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pageSaving ? 'Saving…' : 'Save Page Content'}
              </PrimaryButton>
            </div>
          </Section>

          <Section title="Detail Page Sidebar" description="The contact/CTA sidebar shown on each code's detail page.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sidebar tag/eyebrow">
                <TextInput value={page.sidebarTag} onChange={e => setP('sidebarTag', e.target.value)} placeholder="Get Expert Advice" />
              </Field>
              <Field label="Phone number">
                <TextInput value={page.sidebarPhone} onChange={e => setP('sidebarPhone', e.target.value)} placeholder="+919876543210" />
              </Field>
            </div>
            <Field label="Sidebar heading">
              <TextInput value={page.sidebarHeading} onChange={e => setP('sidebarHeading', e.target.value)} />
            </Field>
            <Field label="Sidebar body text">
              <TextArea rows={3} value={page.sidebarBody} onChange={e => setP('sidebarBody', e.target.value)} />
            </Field>
            <Field label="Call button text">
              <TextInput value={page.sidebarCallText} onChange={e => setP('sidebarCallText', e.target.value)} placeholder="Call Now" />
            </Field>
            <div className="flex justify-end mb-8">
              <PrimaryButton onClick={savePage} disabled={pageSaving}>
                {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pageSaving ? 'Saving…' : 'Save Page Content'}
              </PrimaryButton>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
