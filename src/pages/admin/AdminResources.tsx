import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, Pencil, X, CheckCircle2, BookOpen, FileText } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type { ResourceItem, ResourceSection, ResourcesPageContent } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const PP = 'Poppins, sans-serif';

const ARTICLE_CATS = ['New Labour Codes', 'Compliance', 'Labour Audit', 'POSH', 'ESI & PF', 'Payroll'];

const HERO_EMPTY: ResourcesPageContent = {
  heroEyebrow: 'Downloads & Templates',
  heroHeading: 'Compliance Resources',
  heroSubtext: 'Practical compliance templates, checklists and reference documents — free to download.',
  heroBgType: 'color',
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

const EMPTY_ARTICLE: Omit<ResourceItem, '_id'> = {
  tab: 'articles', title: '', category: 'New Labour Codes', order: 0,
  slug: '', excerpt: '', date: '', readTime: '', author: 'Maru Consultancy Team',
  img: '', sections: [], keyTakeaways: [],
};

const EMPTY_DOWNLOAD: Omit<ResourceItem, '_id'> = {
  tab: 'downloads', title: '', order: 0,
  desc: '', size: '', format: 'PDF', downloadType: 'Download', fileUrl: '',
};

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

export default function AdminResources() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ResourceItem | Omit<ResourceItem, '_id'> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [hero, setHero] = useState<ResourcesPageContent>(HERO_EMPTY);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroDirty, setHeroDirty] = useState(false);
  const [heroNotice, setHeroNotice] = useState('');
  const [heroError, setHeroError] = useState('');

  const load = () => api.get<ResourceItem[]>('/resources').then(setResources);

  useEffect(() => {
    load()
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get<ResourcesPageContent>('/resources-page')
      .then(d => setHero({ ...HERO_EMPTY, ...d }))
      .catch(err => setHeroError(err instanceof Error ? err.message : 'Failed to load page content'))
      .finally(() => setHeroLoading(false));
  }, []);

  const updateHero = <K extends keyof ResourcesPageContent>(key: K, value: ResourcesPageContent[K]) => {
    setHeroDirty(true);
    setHero(h => ({ ...h, [key]: value }));
  };

  const saveHero = async () => {
    setHeroSaving(true); setHeroError('');
    try {
      const saved = await api.put<ResourcesPageContent>('/resources-page', hero);
      setHero({ ...HERO_EMPTY, ...saved });
      setHeroDirty(false);
      setHeroNotice('Saved — page content is live on the site.');
      setTimeout(() => setHeroNotice(''), 2500);
    } catch (err) {
      setHeroError(err instanceof Error ? err.message : 'Failed to save page content');
    } finally {
      setHeroSaving(false);
    }
  };

  const startCreate = (tab: 'articles' | 'downloads') => {
    setError(''); setDirty(false);
    setEditing(tab === 'articles' ? { ...EMPTY_ARTICLE } : { ...EMPTY_DOWNLOAD });
  };
  const startEdit = (r: ResourceItem) => { setError(''); setDirty(false); setEditing({ ...r }); };
  const cancel = () => { setEditing(null); setDirty(false); };

  const set = <K extends keyof ResourceItem>(key: K, value: ResourceItem[K]) => {
    setDirty(true);
    setEditing(e => e ? { ...e, [key]: value } : e);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError('');
    try {
      let saved: ResourceItem;
      if ('_id' in editing && editing._id) {
        saved = await api.put<ResourceItem>(`/resources/${editing._id}`, editing);
      } else {
        saved = await api.post<ResourceItem>('/resources', editing);
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
      const res = resources.find(r => r._id === id);
      await api.del(`/resources/${id}`);
      if (res?.img) deleteCloudinaryAsset(res.img).catch(() => {});
      if (res?.fileUrl) deleteCloudinaryAsset(res.fileUrl).catch(() => {});
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to delete'); }
    finally {
      setDeleteBusy(false);
      setDeleteTarget(null);
    }
  };

  const requestRemove = (id: string, label: string) => setDeleteTarget({ id, label });

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  /* ── Edit / Create form ── */
  if (editing) {
    const isArticle = editing.tab === 'articles';
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            {'_id' in editing && editing._id
              ? `Edit ${isArticle ? 'Article' : 'Download'}`
              : `New ${isArticle ? 'Article' : 'Download'}`}
          </h1>
          <div className="flex items-center gap-3">
            <SecondaryButton onClick={cancel}><X size={13} /> Cancel</SecondaryButton>
            <PrimaryButton onClick={save} disabled={saving || !editing.title}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save'}
            </PrimaryButton>
          </div>
        </div>

        {dirty && !saving && (
          <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
            style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
            <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
            <button onClick={save} disabled={!editing.title}
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

        {isArticle ? (
          <>
            <Section title="Basics">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title"><TextInput value={editing.title} onChange={e => set('title', e.target.value)} /></Field>
                <Field label="Slug (URL)">
                  <TextInput value={editing.slug ?? ''} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={editing.category ?? ''} onChange={e => set('category', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
                    {ARTICLE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Author"><TextInput value={editing.author ?? ''} onChange={e => set('author', e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date"><TextInput placeholder="Oct 15, 2024" value={editing.date ?? ''} onChange={e => set('date', e.target.value)} /></Field>
                <Field label="Read time"><TextInput placeholder="7 min read" value={editing.readTime ?? ''} onChange={e => set('readTime', e.target.value)} /></Field>
              </div>
              <Field label="Excerpt"><TextArea rows={3} value={editing.excerpt ?? ''} onChange={e => set('excerpt', e.target.value)} /></Field>
              <ImageUploader label="Cover image" value={editing.img ?? ''} onChange={v => set('img', v)} section="resources" hint="Landscape 16:9, min 800 × 450 px — shown as article thumbnail and featured banner" />
            </Section>
            <Section title="Article Body">
              <SectionsEditor sections={editing.sections ?? []} onChange={v => set('sections', v)} />
            </Section>
            <Section title="Key Takeaways">
              <BulletEditor label="Takeaways" items={editing.keyTakeaways ?? []} onChange={v => set('keyTakeaways', v)} />
            </Section>
          </>
        ) : (
          <Section title="Download Details">
            <Field label="Title"><TextInput value={editing.title} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Description"><TextArea rows={3} value={editing.desc ?? ''} onChange={e => set('desc', e.target.value)} /></Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Format"><TextInput placeholder="PDF / XLSX / DOCX" value={editing.format ?? ''} onChange={e => set('format', e.target.value)} /></Field>
              <Field label="File size"><TextInput placeholder="2 MB" value={editing.size ?? ''} onChange={e => set('size', e.target.value)} /></Field>
              <Field label="Type">
                <select value={editing.downloadType ?? 'Download'} onChange={e => set('downloadType', e.target.value as 'Download' | 'Resource')}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
                  <option value="Download">Download</option>
                  <option value="Resource">Resource</option>
                </select>
              </Field>
            </div>
            <ImageUploader label="Upload file (PDF / XLSX / DOCX)" value={editing.fileUrl ?? ''} onChange={v => set('fileUrl', v)} accept="*/*" section="resources" />
          </Section>
        )}

        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={cancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={save} disabled={saving || !editing.title}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  /* ── List view ── */
  const articles = resources.filter(r => r.tab === 'articles');
  const downloads = resources.filter(r => r.tab === 'downloads');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Resources</h1>
          <p className="text-gray-400 text-sm mt-1">Manage articles, insights, and downloadable templates.</p>
        </div>
        <div className="flex gap-2">
          <SecondaryButton onClick={() => startCreate('articles')}><Plus size={15} /> New Article</SecondaryButton>
          <SecondaryButton onClick={() => startCreate('downloads')}><Plus size={15} /> New Download</SecondaryButton>
        </div>
      </div>

      {notice && (
        <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <CheckCircle2 size={15} /> {notice}
        </div>
      )}
      {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

      {/* Articles */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: 'var(--p-a08)', color: 'var(--primary)', fontFamily: PP }}>
            <BookOpen size={12} /> Articles &amp; Insights
          </span>
          <span className="text-xs text-gray-400">{articles.length} item{articles.length !== 1 ? 's' : ''}</span>
          <div className="flex-1 border-t border-gray-100" />
          <SecondaryButton onClick={() => startCreate('articles')}><Plus size={13} /> New Article</SecondaryButton>
        </div>
        <div className="space-y-3">
          {articles.map(r => (
            <div key={r._id} className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4"
              style={{ borderColor: 'var(--p-a12)' }}>
              {r.img && <img src={r.img} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
              {!r.img && (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--p-a08)' }}>
                  <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>{r.title}</p>
                <p className="text-gray-400 text-xs truncate">{r.category} · {r.date}</p>
              </div>
              <SecondaryButton onClick={() => startEdit(r)}><Pencil size={13} /> Edit</SecondaryButton>
              <DangerButton onClick={() => requestRemove(r._id, r.title)}><Trash2 size={13} /></DangerButton>
            </div>
          ))}
          {articles.length === 0 && <p className="text-gray-400 text-sm">No articles yet. Click "New Article" to add one.</p>}
        </div>
      </div>

      {/* Downloads */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(253,161,2,0.10)', color: '#c07a00', fontFamily: PP }}>
            <FileText size={12} /> Downloads &amp; Templates
          </span>
          <span className="text-xs text-gray-400">{downloads.length} item{downloads.length !== 1 ? 's' : ''}</span>
          <div className="flex-1 border-t border-gray-100" />
          <SecondaryButton onClick={() => startCreate('downloads')}><Plus size={13} /> New Download</SecondaryButton>
        </div>
        <div className="space-y-3">
          {downloads.map(r => (
            <div key={r._id} className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4"
              style={{ borderColor: 'rgba(253,161,2,0.18)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--p-a08)' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>{r.title}</p>
                <p className="text-gray-400 text-xs truncate">{r.format} · {r.size} · {r.downloadType}</p>
              </div>
              <SecondaryButton onClick={() => startEdit(r)}><Pencil size={13} /> Edit</SecondaryButton>
              <DangerButton onClick={() => requestRemove(r._id, r.title)}><Trash2 size={13} /></DangerButton>
            </div>
          ))}
          {downloads.length === 0 && <p className="text-gray-400 text-sm">No downloads yet.</p>}
        </div>
      </div>

      {/* ── Page Content Editor ── */}
      {!heroLoading && (
        <div>
          {heroError && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{heroError}</div>}

          {heroDirty && !heroSaving && (
            <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
              style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
              <span className="text-sm font-semibold text-white">You have unsaved page content changes.</span>
              <button onClick={saveHero}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#fda102', color: '#111' }}>
                <Save size={13} /> Save now
              </button>
            </div>
          )}
          {heroNotice && !heroDirty && (
            <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <CheckCircle2 size={15} /> {heroNotice}
            </div>
          )}

          <Section title="Hero Section" description="The banner shown at the top of the public Resources page.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Eyebrow text"><TextInput value={hero.heroEyebrow} onChange={e => updateHero('heroEyebrow', e.target.value)} /></Field>
              <Field label="Heading"><TextInput value={hero.heroHeading} onChange={e => updateHero('heroHeading', e.target.value)} /></Field>
            </div>
            <Field label="Subtext"><TextArea rows={2} value={hero.heroSubtext} onChange={e => updateHero('heroSubtext', e.target.value)} /></Field>
            <Field label="Background type">
              <select value={hero.heroBgType}
                onChange={e => updateHero('heroBgType', e.target.value as ResourcesPageContent['heroBgType'])}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
                <option value="color">Solid color (default)</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </Field>
            {hero.heroBgType === 'image' && (
              <ImageUploader label="Hero image" value={hero.heroImageUrl} onChange={v => updateHero('heroImageUrl', v)}
                section="resources" hint="Landscape, min 1600 × 600 px — shown full-width behind the hero text." />
            )}
            {hero.heroBgType === 'video' && (
              <ImageUploader label="Hero video" value={hero.heroVideoUrl} onChange={v => updateHero('heroVideoUrl', v)}
                accept="video/*" section="resources" />
            )}
            <div className="flex justify-end">
              <PrimaryButton onClick={saveHero} disabled={heroSaving}>
                {heroSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {heroSaving ? 'Saving…' : 'Save Hero'}
              </PrimaryButton>
            </div>
          </Section>

          <Section title="Downloads Section" description="Labels and headings above the downloadable files grid.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Section eyebrow label">
                <TextInput value={hero.downloadsLabel ?? ''} onChange={e => updateHero('downloadsLabel', e.target.value)} placeholder="Free Resources" />
              </Field>
              <Field label="Section heading">
                <TextInput value={hero.downloadsHeading ?? ''} onChange={e => updateHero('downloadsHeading', e.target.value)} placeholder="Templates & Downloads" />
              </Field>
            </div>
            <Field label="Section subtext">
              <TextArea rows={2} value={hero.downloadsSubtext ?? ''} onChange={e => updateHero('downloadsSubtext', e.target.value)} />
            </Field>
            <div className="flex justify-end">
              <PrimaryButton onClick={saveHero} disabled={heroSaving}>
                {heroSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {heroSaving ? 'Saving…' : 'Save'}
              </PrimaryButton>
            </div>
          </Section>

          <Section title="Newsletter Section" description="The email subscription band at the bottom of the Resources page.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Eyebrow label">
                <TextInput value={hero.newsletterLabel ?? ''} onChange={e => updateHero('newsletterLabel', e.target.value)} placeholder="Stay Updated" />
              </Field>
              <Field label="Heading">
                <TextInput value={hero.newsletterHeading ?? ''} onChange={e => updateHero('newsletterHeading', e.target.value)} placeholder="Never miss a compliance update" />
              </Field>
            </div>
            <Field label="Body text">
              <TextArea rows={3} value={hero.newsletterBody ?? ''} onChange={e => updateHero('newsletterBody', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Button text">
                <TextInput value={hero.newsletterButtonText ?? ''} onChange={e => updateHero('newsletterButtonText', e.target.value)} placeholder="Subscribe" />
              </Field>
              <Field label="Input placeholder">
                <TextInput value={hero.newsletterPlaceholder ?? ''} onChange={e => updateHero('newsletterPlaceholder', e.target.value)} placeholder="Your business email" />
              </Field>
            </div>
            <div className="flex justify-end mb-8">
              <PrimaryButton onClick={saveHero} disabled={heroSaving}>
                {heroSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {heroSaving ? 'Saving…' : 'Save Newsletter'}
              </PrimaryButton>
            </div>
          </Section>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete resource?"
        message={deleteTarget ? `Delete “${deleteTarget.label}”? This action cannot be undone.` : ''}
        busy={deleteBusy}
        onCancel={() => { if (!deleteBusy) setDeleteTarget(null); }}
        onConfirm={() => deleteTarget ? remove(deleteTarget.id) : undefined}
      />
    </div>
  );
}
