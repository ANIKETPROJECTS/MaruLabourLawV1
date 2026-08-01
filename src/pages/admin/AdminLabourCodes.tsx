import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, Pencil, X, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type { LabourCodeContent } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

const EMPTY: Omit<LabourCodeContent, '_id'> = {
  slug: '', codeNumber: '', title: '', subtitle: '', intro: '', body: '',
  coveringAreas: [], ctaLabel: '', img: '',
};

export default function AdminLabourCodes() {
  const [codes, setCodes] = useState<LabourCodeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LabourCodeContent | (Omit<LabourCodeContent, '_id'> & { _id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => api.get<LabourCodeContent[]>('/labour-codes').then(setCodes);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load')).finally(() => setLoading(false));
  }, []);

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

      <div className="space-y-3">
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
    </div>
  );
}
