import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, Pencil, X, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type { ServiceContent } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

const EMPTY: Omit<ServiceContent, '_id'> = {
  slug: '', title: '', img: '', desc: '',
  headline: '', subhead: '', intro: '', body: '', deliverables: [],
};

export default function AdminServices() {
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceContent | (Omit<ServiceContent, '_id'> & { _id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => api.get<ServiceContent[]>('/services').then(setServices);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load')).finally(() => setLoading(false));
  }, []);

  const startCreate = () => { setError(''); setDirty(false); setEditing({ ...EMPTY }); };
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
    if (!confirm('Delete this service? This cannot be undone.')) return;
    try {
      const svc = services.find(s => s._id === id);
      await api.del(`/services/${id}`);
      if (svc?.img) deleteCloudinaryAsset(svc.img).catch(() => {});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  // Renumbers every service (not just the two swapped) so the list still ends up in a
  // stable, correct order even if `order` values were stale/duplicated beforehand.
  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const next = [...services];
    [next[index], next[target]] = [next[target], next[index]];
    // Optimistically reorder locally so the UI responds immediately
    setServices(next.map((s, i) => ({ ...s, order: i })));
    try {
      await Promise.all(next.map((s, i) => api.put(`/services/${s._id}`, { ...s, order: i })));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder');
      await load();
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Services</h1>
          <p className="text-gray-400 text-sm mt-1">Add, edit, or remove the services listed on your site.</p>
        </div>
        <PrimaryButton onClick={startCreate}><Plus size={15} /> New Service</PrimaryButton>
      </div>

      {notice && (
        <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <CheckCircle2 size={15} /> {notice}
        </div>
      )}
      {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

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
            <DangerButton onClick={() => remove(s._id)}><Trash2 size={13} /></DangerButton>
          </div>
        ))}
        {services.length === 0 && <p className="text-gray-400 text-sm">No services yet.</p>}
      </div>
    </div>
  );
}
