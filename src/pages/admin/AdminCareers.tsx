import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, Pencil, X, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { api } from '../../lib/api';
import type { JobContent, CareersPageContent } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const HERO_EMPTY: CareersPageContent = {
  heroEyebrow: 'Join Our Team',
  heroHeading: 'Build a Career That Matters',
  heroSubtext: "Channel your passion for labour and industrial law into a meaningful career at India's premier compliance advisory firm.",
  heroBgType: 'video',
  heroVideoUrl: '',
  heroImageUrl: '',
};

const PP = 'Poppins, sans-serif';

const EMPTY: Omit<JobContent, '_id'> = {
  slug: '', title: '', location: '', type: 'Full-time', department: '', experience: '',
  category: 'internal', about: '', responsibilities: [], requirements: [], niceToHave: [],
  ctc: '', postedOn: '',
};

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={item} onChange={(e) => {
              const next = [...items]; next[i] = e.target.value; onChange(next);
            }} />
            <DangerButton type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
          </div>
        ))}
        <SecondaryButton type="button" onClick={() => onChange([...items, ''])}><Plus size={13} /> Add item</SecondaryButton>
      </div>
    </Field>
  );
}

export default function AdminCareers() {
  const [jobs, setJobs] = useState<JobContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<JobContent | (Omit<JobContent, '_id'> & { _id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [hero, setHero] = useState<CareersPageContent>(HERO_EMPTY);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroDirty, setHeroDirty] = useState(false);
  const [heroNotice, setHeroNotice] = useState('');
  const [heroError, setHeroError] = useState('');

  const load = () => api.get<JobContent[]>('/careers').then(setJobs);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get<CareersPageContent>('/careers-page')
      .then(setHero)
      .catch((err) => setHeroError(err instanceof Error ? err.message : 'Failed to load hero content'))
      .finally(() => setHeroLoading(false));
  }, []);

  const updateHero = <K extends keyof CareersPageContent>(key: K, value: CareersPageContent[K]) => {
    setHeroDirty(true);
    setHero((h) => ({ ...h, [key]: value }));
  };

  const saveHero = async () => {
    setHeroSaving(true); setHeroError('');
    try {
      const saved = await api.put<CareersPageContent>('/careers-page', hero);
      setHero(saved);
      setHeroDirty(false);
      setHeroNotice('Saved — hero is live on the site.');
      setTimeout(() => setHeroNotice(''), 2500);
    } catch (err) {
      setHeroError(err instanceof Error ? err.message : 'Failed to save hero content');
    } finally {
      setHeroSaving(false);
    }
  };

  const startCreate = () => { setError(''); setDirty(false); setEditing({ ...EMPTY }); };
  const startEdit = (j: JobContent) => { setError(''); setDirty(false); setEditing({ ...j }); };
  const cancel = () => { setEditing(null); setDirty(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      let saved: JobContent;
      if ('_id' in editing && editing._id) {
        saved = await api.put<JobContent>(`/careers/${editing._id}`, editing);
      } else {
        saved = await api.post<JobContent>('/careers', editing);
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
      await api.del(`/careers/${id}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleteBusy(false);
      setDeleteTarget(null);
    }
  };

  const requestRemove = (id: string, label: string) => setDeleteTarget({ id, label });

  // Reorder within a category group. `groupIndex` is the position of the job inside its
  // filtered (internal/client) list, not the raw `jobs` array.
  // Renumbers every item in the group (not just the two swapped) so a group that starts
  // with duplicate/stale `order` values (e.g. all 0) still ends up in a stable, correct order.
  const move = async (category: JobContent['category'], groupIndex: number, direction: -1 | 1) => {
    const group = jobs.filter(j => j.category === category);
    const target = groupIndex + direction;
    if (target < 0 || target >= group.length) return;
    const nextGroup = [...group];
    [nextGroup[groupIndex], nextGroup[target]] = [nextGroup[target], nextGroup[groupIndex]];
    setJobs(prev => {
      const others = prev.filter(j => j.category !== category);
      return [...others, ...nextGroup.map((j, i) => ({ ...j, order: i }))];
    });
    try {
      await Promise.all(nextGroup.map((j, i) => api.put(`/careers/${j._id}`, { ...j, order: i })));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder');
      await load();
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  if (editing) {
    const set = <K extends keyof typeof editing>(key: K, value: (typeof editing)[K]) => {
      setDirty(true);
      setEditing((e) => (e ? { ...e, [key]: value } : e));
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            {'_id' in editing && editing._id ? 'Edit Job Posting' : 'New Job Posting'}
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

        <Section title="Basics">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Job title"><TextInput value={editing.title} onChange={(e) => set('title', e.target.value)} /></Field>
            <Field label="Slug (URL)"><TextInput value={editing.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location"><TextInput value={editing.location} onChange={(e) => set('location', e.target.value)} /></Field>
            <Field label="Employment type"><TextInput value={editing.type} onChange={(e) => set('type', e.target.value)} placeholder="Full-time / Contract" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department"><TextInput value={editing.department} onChange={(e) => set('department', e.target.value)} /></Field>
            <Field label="Experience"><TextInput value={editing.experience} onChange={(e) => set('experience', e.target.value)} placeholder="e.g. 5–8 years" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTC range"><TextInput value={editing.ctc} onChange={(e) => set('ctc', e.target.value)} placeholder="₹12–18 LPA" /></Field>
            <Field label="Posted on"><TextInput value={editing.postedOn} onChange={(e) => set('postedOn', e.target.value)} placeholder="July 05, 2025" /></Field>
          </div>
          <Field label="Category">
            <select
              value={editing.category}
              onChange={(e) => set('category', e.target.value as 'internal' | 'client')}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ fontFamily: PP, borderColor: '#e5e7eb' }}
            >
              <option value="internal">In-house (Maru Consultancy)</option>
              <option value="client">Client Posting</option>
            </select>
          </Field>
        </Section>

        <Section title="Job Description">
          <Field label="About the role"><TextArea rows={4} value={editing.about} onChange={(e) => set('about', e.target.value)} /></Field>
          <ListEditor label="Responsibilities" items={editing.responsibilities} onChange={(v) => set('responsibilities', v)} />
          <ListEditor label="Requirements" items={editing.requirements} onChange={(v) => set('requirements', v)} />
          <ListEditor label="Nice to have" items={editing.niceToHave} onChange={(v) => set('niceToHave', v)} />
        </Section>

        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={cancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={save} disabled={saving || !editing.title || !editing.slug}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Job Posting'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Careers</h1>
          <p className="text-gray-400 text-sm mt-1">Add, edit, or remove job postings.</p>
        </div>
        <PrimaryButton onClick={startCreate}><Plus size={15} /> New Job Posting</PrimaryButton>
      </div>

      {!heroLoading && (
        <Section title="Hero Section" description="The banner shown at the top of the public Careers page.">
          {heroDirty && !heroSaving && (
            <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-sm -mt-2 mb-2"
              style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
              <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
              <button onClick={saveHero}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#fda102', color: '#111' }}>
                <Save size={13} /> Save now
              </button>
            </div>
          )}
          {heroNotice && !heroDirty && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <CheckCircle2 size={15} /> {heroNotice}
            </div>
          )}
          {heroError && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{heroError}</div>}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow text"><TextInput value={hero.heroEyebrow} onChange={(e) => updateHero('heroEyebrow', e.target.value)} /></Field>
            <Field label="Heading"><TextInput value={hero.heroHeading} onChange={(e) => updateHero('heroHeading', e.target.value)} /></Field>
          </div>
          <Field label="Subtext"><TextArea rows={2} value={hero.heroSubtext} onChange={(e) => updateHero('heroSubtext', e.target.value)} /></Field>

          <Field label="Background type">
            <select
              value={hero.heroBgType}
              onChange={(e) => updateHero('heroBgType', e.target.value as CareersPageContent['heroBgType'])}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ fontFamily: PP, borderColor: '#e5e7eb' }}
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
          </Field>

          {hero.heroBgType === 'video' ? (
            <ImageUploader label="Hero video" value={hero.heroVideoUrl} onChange={(v) => updateHero('heroVideoUrl', v)}
              accept="video/*" section="careers" hint="Leave blank to keep the default background video." />
          ) : (
            <ImageUploader label="Hero image" value={hero.heroImageUrl} onChange={(v) => updateHero('heroImageUrl', v)}
              section="careers" hint="Landscape, min 1600 × 900 px — shown full-width behind the hero text." />
          )}

          <div className="flex justify-end">
            <PrimaryButton onClick={saveHero} disabled={heroSaving}>
              {heroSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {heroSaving ? 'Saving…' : 'Save Hero'}
            </PrimaryButton>
          </div>
        </Section>
      )}

      {notice && (
        <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <CheckCircle2 size={15} /> {notice}
        </div>
      )}
      {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

      {jobs.length === 0 && <p className="text-gray-400 text-sm">No job postings yet.</p>}

      {(['internal', 'client'] as const).map((cat) => {
        const group = jobs.filter(j => j.category === cat);
        if (group.length === 0) return null;
        const label = cat === 'internal' ? 'At Maru Consultancy' : 'Client Postings';
        const accent = cat === 'internal' ? 'var(--primary)' : '#c07a00';
        const bg = cat === 'internal' ? 'var(--p-a08)' : 'rgba(253,161,2,0.10)';
        return (
          <div key={cat} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: bg, color: accent, fontFamily: PP }}>
                {label}
              </span>
              <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: PP }}>
                {group.length} posting{group.length !== 1 ? 's' : ''}
              </span>
              <div className="flex-1 border-t border-gray-100" />
            </div>
            <div className="space-y-3">
              {group.map((j, i) => (
                <div key={j._id} className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4"
                  style={{ borderColor: cat === 'internal' ? 'var(--p-a12)' : 'rgba(253,161,2,0.18)' }}>
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <button onClick={() => move(cat, i, -1)} disabled={i === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move up">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => move(cat, i, 1)} disabled={i === group.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move down">
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>{j.title}</p>
                    <p className="text-gray-400 text-xs truncate">{j.location} · {j.type}</p>
                  </div>
                  <SecondaryButton onClick={() => startEdit(j)}><Pencil size={13} /> Edit</SecondaryButton>
                  <DangerButton onClick={() => requestRemove(j._id, j.title)}><Trash2 size={13} /></DangerButton>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete job posting?"
        message={deleteTarget ? `Delete “${deleteTarget.label}”? This action cannot be undone.` : ''}
        busy={deleteBusy}
        onCancel={() => { if (!deleteBusy) setDeleteTarget(null); }}
        onConfirm={() => deleteTarget ? remove(deleteTarget.id) : undefined}
      />
    </div>
  );
}
