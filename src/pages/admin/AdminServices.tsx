import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, Pencil, X, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type { ServiceContent, ServicesPageContent, InsightCard } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const PP = 'Poppins, sans-serif';

const EMPTY_SERVICE: Omit<ServiceContent, '_id'> = {
  slug: '', title: '', img: '', desc: '',
  headline: '', subhead: '', intro: '', body: '', deliverables: [],
};

const EMPTY_PAGE: ServicesPageContent = {
  heroVideoUrl: '/assets/services-hero.mp4',
  heroTitle: 'Our Consultancy Services',
  heroSubtitle: 'Precision-crafted compliance solutions that protect your workforce, your business, and your future.',
  ctaLabel: 'Get Started',
  ctaHeading: 'Need a custom compliance structure?',
  ctaBody: 'We understand every business has unique operational needs. Contact us for a bespoke audit and advisory package tailored to your industry.',
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

type Tab = 'list' | 'page';

export default function AdminServices() {
  const [tab, setTab] = useState<Tab>('list');

  // ── Services list state ───────────────────────────────────────────────────
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceContent | (Omit<ServiceContent, '_id'> & { _id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // ── Page settings state ───────────────────────────────────────────────────
  const [pageData, setPageData] = useState<ServicesPageContent>(EMPTY_PAGE);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageDirty, setPageDirty] = useState(false);
  const [pageError, setPageError] = useState('');
  const [pageNotice, setPageNotice] = useState('');

  // ── Load services ─────────────────────────────────────────────────────────
  const load = () => api.get<ServiceContent[]>('/services').then(setServices);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load')).finally(() => setListLoading(false));
  }, []);

  // ── Load page settings ────────────────────────────────────────────────────
  useEffect(() => {
    api.get<ServicesPageContent>('/services-page')
      .then((data) => setPageData(data))
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, []);

  // ── Service CRUD handlers ─────────────────────────────────────────────────
  const startCreate = () => { setError(''); setDirty(false); setEditing({ ...EMPTY_SERVICE }); };
  const startEdit = (s: ServiceContent) => { setError(''); setDirty(false); setEditing({ ...s, deliverables: s.deliverables || [] }); };
  const cancel = () => { setEditing(null); setDirty(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      let saved: ServiceContent;
      if ('_id' in editing && editing._id) {
        saved = await api.put<ServiceContent>(`/services/${editing._id}`, editing);
      } else {
        saved = await api.post<ServiceContent>('/services', editing);
      }
      await load();
      setEditing(saved);
      setDirty(false);
      setNotice('Saved — changes are live on the site.');
      setTimeout(() => setNotice(''), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setDeleteBusy(true);
    try {
      const svc = services.find(s => s._id === id);
      await api.del(`/services/${id}`);
      if (svc?.img) deleteCloudinaryAsset(svc.img).catch(() => {});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleteBusy(false);
      setDeleteTarget(null);
    }
  };

  const requestRemove = (id: string, label: string) => setDeleteTarget({ id, label });

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const next = [...services];
    [next[index], next[target]] = [next[target], next[index]];
    setServices(next.map((s, i) => ({ ...s, order: i })));
    try {
      await Promise.all(next.map((s, i) => api.put(`/services/${s._id}`, { ...s, order: i })));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder');
      await load();
    }
  };

  // ── Page settings handlers ────────────────────────────────────────────────
  const setPage = <K extends keyof ServicesPageContent>(key: K, value: ServicesPageContent[K]) => {
    setPageDirty(true);
    setPageData((prev) => ({ ...prev, [key]: value }));
  };

  const savePage = async () => {
    setPageSaving(true);
    setPageError('');
    try {
      const saved = await api.put<ServicesPageContent>('/services-page', pageData);
      setPageData(saved);
      setPageDirty(false);
      setPageNotice('Saved — changes are live on the site.');
      setTimeout(() => setPageNotice(''), 2500);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setPageSaving(false);
    }
  };

  const setInsight = (i: number, key: keyof InsightCard, value: string) => {
    const next = [...(pageData.latestInsights || [])];
    next[i] = { ...next[i], [key]: value };
    setPage('latestInsights', next);
  };

  const addInsight = () => {
    setPage('latestInsights', [
      ...(pageData.latestInsights || []),
      { category: '', title: '', desc: '', img: '', date: '', articleUrl: '/resources' },
    ]);
  };

  const removeInsight = (i: number) => {
    setPage('latestInsights', (pageData.latestInsights || []).filter((_, j) => j !== i));
  };

  // ── Render: service edit form ─────────────────────────────────────────────
  if (editing) {
    const deliverables = editing.deliverables || [];
    const set = <K extends keyof typeof editing>(key: K, value: (typeof editing)[K]) => {
      setDirty(true);
      setEditing((e) => (e ? { ...e, [key]: value } : e));
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            {'_id' in editing && editing._id ? 'Edit Service' : 'New Service'}
          </h1>
          <div className="flex items-center gap-3">
            <SecondaryButton onClick={cancel}><X size={13} /> Cancel</SecondaryButton>
            <PrimaryButton onClick={save} disabled={saving || !editing.title || !editing.slug}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Service'}
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

        <Section title="Listing Details" description="Shown on the Services grid and homepage preview.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title"><TextInput value={editing.title} onChange={(e) => set('title', e.target.value)} /></Field>
            <Field label="Slug (URL)"><TextInput value={editing.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} /></Field>
          </div>
            <Field label="Short description"><TextArea rows={2} value={editing.desc} onChange={(e) => set('desc', e.target.value)} /></Field>
            <Field label="Parent category (optional)">
              <select
                value={editing.parentSlug || ''}
                onChange={(e) => set('parentSlug', e.target.value || undefined)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]">
                <option value="">This is a parent service</option>
                {services.filter((service) => !service.parentSlug && service.slug !== editing.slug).map((service) => (
                  <option key={service.slug} value={service.slug}>{service.title}</option>
                ))}
              </select>
            </Field>
          <ImageUploader label="Card image" value={editing.img} onChange={(v) => set('img', v)} section="services" hint="Landscape 16:9, min 1200 × 500 px — also used as full-width banner on the service detail page" />
        </Section>

        <Section title="Detail Page" description="Shown on this service's dedicated page.">
          <Field label="Headline"><TextInput value={editing.headline} onChange={(e) => set('headline', e.target.value)} /></Field>
          <Field label="Subheading"><TextInput value={editing.subhead} onChange={(e) => set('subhead', e.target.value)} /></Field>
          <Field label="Intro"><TextArea rows={2} value={editing.intro} onChange={(e) => set('intro', e.target.value)} /></Field>
          <Field label="Body (use a blank line for a new paragraph)"><TextArea rows={6} value={editing.body} onChange={(e) => set('body', e.target.value)} /></Field>
          <Field label="Deliverables / What You Get">
            <div className="space-y-3">
              {deliverables.map((d, i) => (
                <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-gray-100">
                  <div className="flex-1 space-y-2">
                    <TextInput placeholder="Title" value={d.title} onChange={(e) => {
                      const next = [...deliverables]; next[i] = { ...d, title: e.target.value }; set('deliverables', next);
                    }} />
                    <TextArea rows={2} placeholder="Description" value={d.desc} onChange={(e) => {
                      const next = [...deliverables]; next[i] = { ...d, desc: e.target.value }; set('deliverables', next);
                    }} />
                  </div>
                  <DangerButton type="button" onClick={() => set('deliverables', deliverables.filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
                </div>
              ))}
              <SecondaryButton type="button" onClick={() => set('deliverables', [...deliverables, { title: '', desc: '' }])}><Plus size={13} /> Add deliverable</SecondaryButton>
            </div>
          </Field>
        </Section>

        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={cancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={save} disabled={saving || !editing.title || !editing.slug}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Service'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // ── Render: tabs ──────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Services</h1>
          <p className="text-gray-400 text-sm mt-1">Manage service records and all text/images on the Services pages.</p>
        </div>
        {tab === 'list' && <PrimaryButton onClick={startCreate}><Plus size={15} /> New Service</PrimaryButton>}
        {tab === 'page' && (
          <PrimaryButton onClick={savePage} disabled={pageSaving || !pageDirty}>
            {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {pageSaving ? 'Saving…' : 'Save Page Settings'}
          </PrimaryButton>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {(['list', 'page'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              fontFamily: PP,
              backgroundColor: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--primary)' : '#666',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
            {t === 'list' ? 'Services List' : 'Page Settings'}
          </button>
        ))}
      </div>

      {/* ── Tab: Services List ── */}
      {tab === 'list' && (
        <>
          {notice && (
            <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <CheckCircle2 size={15} /> {notice}
            </div>
          )}
          {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

          {listLoading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : (
            <div className="space-y-3">
              {services.map((s, i) => (
                <div key={s._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <button onClick={() => move(i, -1)} disabled={i === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move up">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === services.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move down">
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    {s.img && <img src={s.img} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>
                      {s.parentSlug ? '↳ ' : ''}{s.title}
                    </p>
                    <p className="text-gray-400 text-xs truncate">/services/{s.slug}</p>
                  </div>
                  <SecondaryButton onClick={() => startEdit(s)}><Pencil size={13} /> Edit</SecondaryButton>
                  <DangerButton onClick={() => requestRemove(s._id, s.title)}><Trash2 size={13} /></DangerButton>
                </div>
              ))}
              {services.length === 0 && <p className="text-gray-400 text-sm">No services yet.</p>}
            </div>
          )}
        </>
      )}

      {/* ── Tab: Page Settings ── */}
      {tab === 'page' && (
        <>
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
              {pageNotice && !pageDirty && (
                <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  <CheckCircle2 size={15} /> {pageNotice}
                </div>
              )}
              {pageError && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{pageError}</div>}

              {/* Hero Section */}
              <Section title="Services Page Hero" description="The video banner and headline at the top of the /services page.">
                <Field label="Hero video URL">
                  <TextInput
                    value={pageData.heroVideoUrl}
                    onChange={(e) => setPage('heroVideoUrl', e.target.value)}
                    placeholder="/assets/services-hero.mp4 or a Cloudinary video URL"
                  />
                </Field>
                <Field label="Hero title">
                  <TextInput value={pageData.heroTitle} onChange={(e) => setPage('heroTitle', e.target.value)} />
                </Field>
                <Field label="Hero subtitle">
                  <TextArea rows={2} value={pageData.heroSubtitle} onChange={(e) => setPage('heroSubtitle', e.target.value)} />
                </Field>
              </Section>

              {/* CTA Section */}
              <Section title="Services Page CTA Banner" description="The coloured call-to-action strip at the bottom of the /services page.">
                <Field label="Label (small text above heading)">
                  <TextInput value={pageData.ctaLabel} onChange={(e) => setPage('ctaLabel', e.target.value)} />
                </Field>
                <Field label="Heading">
                  <TextInput value={pageData.ctaHeading} onChange={(e) => setPage('ctaHeading', e.target.value)} />
                </Field>
                <Field label="Body text">
                  <TextArea rows={3} value={pageData.ctaBody} onChange={(e) => setPage('ctaBody', e.target.value)} />
                </Field>
                <Field label="Button text">
                  <TextInput value={pageData.ctaButtonText} onChange={(e) => setPage('ctaButtonText', e.target.value)} />
                </Field>
              </Section>

              {/* Sidebar */}
              <Section title="Service Detail Sidebar" description="The sticky CTA card on the right side of every service detail page.">
                <Field label="Tag text (small accent above heading)">
                  <TextInput value={pageData.sidebarCtaTag} onChange={(e) => setPage('sidebarCtaTag', e.target.value)} />
                </Field>
                <Field label="Heading">
                  <TextInput value={pageData.sidebarCtaHeading} onChange={(e) => setPage('sidebarCtaHeading', e.target.value)} />
                </Field>
                <Field label="Body text">
                  <TextArea rows={3} value={pageData.sidebarCtaBody} onChange={(e) => setPage('sidebarCtaBody', e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Primary button text">
                    <TextInput value={pageData.sidebarCtaButton1} onChange={(e) => setPage('sidebarCtaButton1', e.target.value)} />
                  </Field>
                  <Field label="Secondary button text">
                    <TextInput value={pageData.sidebarCtaButton2} onChange={(e) => setPage('sidebarCtaButton2', e.target.value)} />
                  </Field>
                </div>
                <Field label="Phone number (leave blank to hide the Call Now button)">
                  <TextInput value={pageData.sidebarPhone} onChange={(e) => setPage('sidebarPhone', e.target.value)} placeholder="+919876543210" />
                </Field>
              </Section>

              {/* Latest Insights */}
              <Section title="Latest Insights Section" description="The 3 insight cards shown at the bottom of every service detail page. Leave empty to hide the section.">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field label="Section label">
                    <TextInput value={pageData.insightsLabel} onChange={(e) => setPage('insightsLabel', e.target.value)} />
                  </Field>
                  <Field label="Section heading">
                    <TextInput value={pageData.insightsHeading} onChange={(e) => setPage('insightsHeading', e.target.value)} />
                  </Field>
                </div>

                <div className="space-y-4">
                  {(pageData.latestInsights || []).map((insight, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ fontFamily: PP, color: '#333' }}>Insight card {i + 1}</span>
                        <DangerButton type="button" onClick={() => removeInsight(i)}><Trash2 size={13} /> Remove</DangerButton>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Category tag">
                          <TextInput value={insight.category} onChange={(e) => setInsight(i, 'category', e.target.value)} placeholder="e.g. New Labour Codes" />
                        </Field>
                        <Field label="Date">
                          <TextInput value={insight.date} onChange={(e) => setInsight(i, 'date', e.target.value)} placeholder="e.g. Oct 15, 2024" />
                        </Field>
                      </div>
                      <Field label="Title">
                        <TextInput value={insight.title} onChange={(e) => setInsight(i, 'title', e.target.value)} />
                      </Field>
                      <Field label="Description">
                        <TextArea rows={2} value={insight.desc} onChange={(e) => setInsight(i, 'desc', e.target.value)} />
                      </Field>
                      <Field label="Article URL (link for 'Read Article')">
                        <TextInput value={insight.articleUrl} onChange={(e) => setInsight(i, 'articleUrl', e.target.value)} placeholder="/resources or a full path" />
                      </Field>
                      <ImageUploader
                        label="Card image"
                        value={insight.img}
                        onChange={(v) => setInsight(i, 'img', v)}
                        section="services"
                        hint="Landscape, min 800 × 500 px"
                      />
                    </div>
                  ))}
                </div>
                {(pageData.latestInsights || []).length < 6 && (
                  <div className="mt-3">
                    <SecondaryButton type="button" onClick={addInsight}><Plus size={13} /> Add insight card</SecondaryButton>
                  </div>
                )}
              </Section>

              <div className="flex justify-end">
                <PrimaryButton onClick={savePage} disabled={pageSaving || !pageDirty}>
                  {pageSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {pageSaving ? 'Saving…' : 'Save Page Settings'}
                </PrimaryButton>
              </div>
            </>
          )}
        </>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete service?"
        message={deleteTarget ? `Delete “${deleteTarget.label}”? This action cannot be undone.` : ''}
        busy={deleteBusy}
        onCancel={() => { if (!deleteBusy) setDeleteTarget(null); }}
        onConfirm={() => deleteTarget ? remove(deleteTarget.id) : undefined}
      />
    </div>
  );
}
