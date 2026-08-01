import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { FooterContent, FooterBottomLink } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton } from '../../components/admin/FormBits';

const PP = 'Poppins, sans-serif';

const DEFAULTS: FooterContent = {
  tagline: '',
  whatsappUrl: '', instagramUrl: '', linkedinUrl: '', facebookUrl: '', twitterUrl: '',
  address: '',
  phone1: '', phone1Href: '',
  phone2: '', phone2Href: '',
  email: '',
  newsletterText: '',
  mapEmbedUrl: '',
  copyrightName: '',
  devByText: '', devByUrl: '',
  bottomLinks: [],
};

export default function AdminFooter() {
  const [data, setData] = useState<FooterContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get<FooterContent>('/footer')
      .then((d) => setData({ ...DEFAULTS, ...d, bottomLinks: d.bottomLinks ?? [] }))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof FooterContent>(key: K, value: FooterContent[K]) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: value }));
  };

  const save = async () => {
    setSaving(true); setError('');
    try {
      const saved = await api.put<FooterContent>('/footer', data);
      setData({ ...DEFAULTS, ...saved, bottomLinks: saved.bottomLinks ?? [] });
      setDirty(false);
      setNotice('Saved — footer is live on the site.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally { setSaving(false); }
  };

  const updateLink = (i: number, field: keyof FooterBottomLink, value: string) => {
    const next = data.bottomLinks.map((l, idx) => idx === i ? { ...l, [field]: value } : l);
    set('bottomLinks', next);
  };
  const addLink = () => set('bottomLinks', [...data.bottomLinks, { label: '', href: '#' }]);
  const removeLink = (i: number) => set('bottomLinks', data.bottomLinks.filter((_, idx) => idx !== i));

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Footer</h1>
          <p className="text-gray-400 text-sm mt-1">Edit all footer content — contact info, social links, newsletter, map and bottom bar.</p>
        </div>
        <PrimaryButton onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save'}
        </PrimaryButton>
      </div>

      {/* Sticky unsaved-changes banner */}
      {dirty && !saving && (
        <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
          style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
          <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
          <button onClick={save}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
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
      {error && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>
      )}

      {/* ── Brand ── */}
      <Section title="Brand" description="Tagline shown under the logo in the footer.">
        <Field label="Tagline">
          <TextArea rows={2} value={data.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </Field>
      </Section>

      {/* ── Social Links ── */}
      <Section title="Social Links" description="URLs for each social platform icon in the footer.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              ['whatsappUrl',  'WhatsApp URL (wa.me/…)'],
              ['instagramUrl', 'Instagram URL'],
              ['linkedinUrl',  'LinkedIn URL'],
              ['facebookUrl',  'Facebook URL'],
              ['twitterUrl',   'Twitter / X URL'],
            ] as [keyof FooterContent, string][]
          ).map(([field, label]) => (
            <Field key={field} label={label}>
              <TextInput
                value={(data[field] as string) ?? ''}
                onChange={(e) => set(field, e.target.value)}
                placeholder="https://"
              />
            </Field>
          ))}
        </div>
      </Section>

      {/* ── Contact ── */}
      <Section title="Contact Details" description="Address, phone numbers and email shown in the footer Contact column.">
        <Field label="Address">
          <TextArea rows={2} value={data.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Phone 1 (display text)">
            <TextInput value={data.phone1} onChange={(e) => set('phone1', e.target.value)} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Phone 1 (href, e.g. tel:+919876543210)">
            <TextInput value={data.phone1Href} onChange={(e) => set('phone1Href', e.target.value)} placeholder="tel:+919876543210" />
          </Field>
          <Field label="Phone 2 (display text)">
            <TextInput value={data.phone2} onChange={(e) => set('phone2', e.target.value)} placeholder="022 4567 8900" />
          </Field>
          <Field label="Phone 2 (href, e.g. tel:02245678900)">
            <TextInput value={data.phone2Href} onChange={(e) => set('phone2Href', e.target.value)} placeholder="tel:02245678900" />
          </Field>
        </div>
        <Field label="Email address">
          <TextInput value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="contact@example.com" />
        </Field>
      </Section>

      {/* ── Newsletter ── */}
      <Section title="Newsletter" description="Description text shown above the subscribe form.">
        <Field label="Newsletter description">
          <TextArea rows={2} value={data.newsletterText} onChange={(e) => set('newsletterText', e.target.value)} />
        </Field>
      </Section>

      {/* ── Map ── */}
      <Section title="Google Maps" description="Paste the full embed URL from Google Maps (Share → Embed a map → copy the src value).">
        <Field label="Map embed URL">
          <TextArea rows={3} value={data.mapEmbedUrl} onChange={(e) => set('mapEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=…" />
        </Field>
      </Section>

      {/* ── Bottom bar ── */}
      <Section title="Bottom Bar" description="Copyright line, developer credit, and footer navigation links.">
        <Field label="Copyright entity name (e.g. Maru Consultancy Services Pvt. Ltd.)">
          <TextInput value={data.copyrightName} onChange={(e) => set('copyrightName', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Developer credit name">
            <TextInput value={data.devByText} onChange={(e) => set('devByText', e.target.value)} />
          </Field>
          <Field label="Developer credit URL">
            <TextInput value={data.devByUrl} onChange={(e) => set('devByUrl', e.target.value)} placeholder="https://" />
          </Field>
        </div>

        {/* Bottom links */}
        <Field label="Footer navigation links (Privacy Policy, Terms, etc.)">
          <div className="space-y-2">
            {data.bottomLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <TextInput
                  value={link.label}
                  onChange={(e) => updateLink(i, 'label', e.target.value)}
                  placeholder="Label (e.g. Privacy Policy)"
                  style={{ flex: 1 }}
                />
                <TextInput
                  value={link.href}
                  onChange={(e) => updateLink(i, 'href', e.target.value)}
                  placeholder="URL (e.g. /privacy)"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => removeLink(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors shrink-0"
                  title="Remove link"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <SecondaryButton onClick={addLink} style={{ marginTop: '8px' }}>
            <Plus size={13} /> Add link
          </SecondaryButton>
        </Field>
      </Section>

      {/* Bottom save */}
      <div className="flex justify-end gap-3 mt-2">
        <PrimaryButton onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save changes'}
        </PrimaryButton>
      </div>
    </div>
  );
}
