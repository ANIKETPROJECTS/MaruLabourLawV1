import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { ContactContent } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';

const PP = 'Poppins, sans-serif';

const EMPTY: ContactContent = {
  heroEyebrow:    'Get In Touch',
  heroHeading:    'Ready to Put Your Worries to Rest?',
  heroSubtext:    'Our experts are ready to analyse your compliance situation and build a clear roadmap for you.',
  formTitle:      'Send Us a Message',
  formSubtext:    "We'll get back to you within 1 business day.",
  phone1:         '+91 98765 43210',
  phone2:         '022 4567 8900',
  whatsapp1:      '+91-8169800969',
  whatsapp2:      '+91-9819420371',
  phone3:         '+91-8104031092',
  email1:         'contact@maruconsultancy.in',
  email2:         'support@maruconsultancy.in',
  website:        'www.labourlaws.co.in',
  partner1Name:   'Mr. Pankhil Maru',
  partner1Role:   'Managing Partner',
  partner1Phone:  '+91-9819405423',
  partner1Email:  'pankhil.maru@labourlaws.co.in',
  partner2Name:   'Mr. Nishit Maru',
  partner2Role:   'Managing Partner',
  partner2Phone:  '+91-9833872761',
  partner2Email:  'nishit.maru@labourlaws.co.in',
  addressLine1:   '15th Floor, Nariman Point,',
  addressLine2:   'Mumbai, Maharashtra 400021',
  addressLine3:   'India',
  hoursWeekdays:  'Monday – Friday: 9:30 AM – 6:30 PM',
  hoursWeekend:   'Saturday & Sunday: Closed',
  serviceOptions: [
    'Labour Law Compliance',
    'Payroll & Salary Structuring',
    'Statutory Compliance & Filings',
    'Audits & Governance',
    'Contract Staffing',
    'Registrations & Licensing',
    'HR Policy & Advisory',
    'Legal Representation',
    'Training & Workshops',
    'Other / General Inquiry',
  ],
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.9!2d72.8232!3d18.9256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c6cfb3b99b%3A0x4a5a3a6d7e5f4f1a!2sNariman%20Point%2C%20Mumbai%2C%20Maharashtra%20400021!5e0!3m2!1sen!2sin!4v1700000000000',
};

export default function AdminContact() {
  const [data, setData]     = useState<ContactContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [dirty, setDirty]     = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get<ContactContent>('/contact')
      .then(res => setData({
        heroEyebrow:    res.heroEyebrow    ?? EMPTY.heroEyebrow,
        heroHeading:    res.heroHeading    ?? EMPTY.heroHeading,
        heroSubtext:    res.heroSubtext    ?? EMPTY.heroSubtext,
        formTitle:      res.formTitle      ?? EMPTY.formTitle,
        formSubtext:    res.formSubtext    ?? EMPTY.formSubtext,
        phone1:         res.phone1         ?? EMPTY.phone1,
        phone2:         res.phone2         ?? EMPTY.phone2,
        whatsapp1:      res.whatsapp1      ?? EMPTY.whatsapp1,
        whatsapp2:      res.whatsapp2      ?? EMPTY.whatsapp2,
        phone3:         res.phone3         ?? EMPTY.phone3,
        email1:         res.email1         ?? EMPTY.email1,
        email2:         res.email2         ?? EMPTY.email2,
        website:        res.website        ?? EMPTY.website,
        partner1Name:   res.partner1Name   ?? EMPTY.partner1Name,
        partner1Role:   res.partner1Role   ?? EMPTY.partner1Role,
        partner1Phone:  res.partner1Phone  ?? EMPTY.partner1Phone,
        partner1Email:  res.partner1Email  ?? EMPTY.partner1Email,
        partner2Name:   res.partner2Name   ?? EMPTY.partner2Name,
        partner2Role:   res.partner2Role   ?? EMPTY.partner2Role,
        partner2Phone:  res.partner2Phone  ?? EMPTY.partner2Phone,
        partner2Email:  res.partner2Email  ?? EMPTY.partner2Email,
        addressLine1:   res.addressLine1   ?? EMPTY.addressLine1,
        addressLine2:   res.addressLine2   ?? EMPTY.addressLine2,
        addressLine3:   res.addressLine3   ?? EMPTY.addressLine3,
        hoursWeekdays:  res.hoursWeekdays  ?? EMPTY.hoursWeekdays,
        hoursWeekend:   res.hoursWeekend   ?? EMPTY.hoursWeekend,
        serviceOptions: res.serviceOptions?.length ? res.serviceOptions : EMPTY.serviceOptions,
        mapEmbedUrl:    res.mapEmbedUrl    ?? EMPTY.mapEmbedUrl,
      }))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof ContactContent>(key: K, val: ContactContent[K]) => {
    setDirty(true);
    setData(d => ({ ...d, [key]: val }));
  };

  const save = async () => {
    setSaving(true); setSaved(false); setError('');
    try {
      await api.put('/contact', data);
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Contact</h1>
          <p className="text-gray-400 text-sm mt-1">Manage the Contact Us page — details, form, and map.</p>
        </div>
        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
        </PrimaryButton>
      </div>

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

      {error && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </div>
      )}

      {/* ── Hero ── */}
      <Section title="Hero Section" description="The full-width banner with background video at the top of the page.">
        <Field label="Eyebrow text (small uppercase line above heading)">
          <TextInput value={data.heroEyebrow} onChange={e => set('heroEyebrow', e.target.value)}
            placeholder="Get In Touch" />
        </Field>
        <Field label="Heading">
          <TextInput value={data.heroHeading} onChange={e => set('heroHeading', e.target.value)}
            placeholder="Ready to Put Your Worries to Rest?" />
        </Field>
        <Field label="Subtext">
          <TextArea rows={2} value={data.heroSubtext} onChange={e => set('heroSubtext', e.target.value)}
            placeholder="Our experts are ready to analyse your compliance situation…" />
        </Field>
      </Section>

      {/* ── Partners ── */}
      <Section title="Partners" description="Managing partners shown at the top of the contact details card.">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: PP, color: 'var(--primary)' }}>Partner 1</p>
            <Field label="Name"><TextInput value={data.partner1Name} onChange={e => set('partner1Name', e.target.value)} placeholder="Mr. Pankhil Maru" /></Field>
            <Field label="Role"><TextInput value={data.partner1Role} onChange={e => set('partner1Role', e.target.value)} placeholder="Managing Partner" /></Field>
            <Field label="Mobile"><TextInput value={data.partner1Phone} onChange={e => set('partner1Phone', e.target.value)} placeholder="+91-9819405423" /></Field>
            <Field label="Email"><TextInput value={data.partner1Email} onChange={e => set('partner1Email', e.target.value)} placeholder="pankhil.maru@labourlaws.co.in" /></Field>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: PP, color: 'var(--primary)' }}>Partner 2</p>
            <Field label="Name"><TextInput value={data.partner2Name} onChange={e => set('partner2Name', e.target.value)} placeholder="Mr. Nishit Maru" /></Field>
            <Field label="Role"><TextInput value={data.partner2Role} onChange={e => set('partner2Role', e.target.value)} placeholder="Managing Partner" /></Field>
            <Field label="Mobile"><TextInput value={data.partner2Phone} onChange={e => set('partner2Phone', e.target.value)} placeholder="+91-9833872761" /></Field>
            <Field label="Email"><TextInput value={data.partner2Email} onChange={e => set('partner2Email', e.target.value)} placeholder="nishit.maru@labourlaws.co.in" /></Field>
          </div>
        </div>
      </Section>

      {/* ── Contact Details ── */}
      <Section title="Contact Details" description="Phone numbers, WhatsApp, email, and website shown in the info sidebar.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telephone 1">
            <TextInput value={data.phone1} onChange={e => set('phone1', e.target.value)}
              placeholder="022-35725001" />
          </Field>
          <Field label="Telephone 2 (optional)">
            <TextInput value={data.phone2 ?? ''} onChange={e => set('phone2', e.target.value)}
              placeholder="+91-XXXXXXXXXX" />
          </Field>
          <Field label="Telephone 3 (optional)">
            <TextInput value={data.phone3 ?? ''} onChange={e => set('phone3', e.target.value)}
              placeholder="+91-8104031092" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Field label="WhatsApp 1">
            <TextInput value={data.whatsapp1 ?? ''} onChange={e => set('whatsapp1', e.target.value)}
              placeholder="+91-8169800969" />
          </Field>
          <Field label="WhatsApp 2 (optional)">
            <TextInput value={data.whatsapp2 ?? ''} onChange={e => set('whatsapp2', e.target.value)}
              placeholder="+91-9819420371" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Field label="Primary email">
            <TextInput value={data.email1} onChange={e => set('email1', e.target.value)}
              placeholder="info@labourlaws.co.in" />
          </Field>
          <Field label="Secondary email">
            <TextInput value={data.email2} onChange={e => set('email2', e.target.value)}
              placeholder="maru.labourlaw@gmail.com" />
          </Field>
        </div>
        <Field label="Website">
          <TextInput value={data.website ?? ''} onChange={e => set('website', e.target.value)}
            placeholder="www.labourlaws.co.in" />
        </Field>
      </Section>

      {/* ── Office Address ── */}
      <Section title="Office Address" description="Three lines shown in the contact details sidebar.">
        <Field label="Address line 1">
          <TextInput value={data.addressLine1} onChange={e => set('addressLine1', e.target.value)}
            placeholder="15th Floor, Nariman Point," />
        </Field>
        <Field label="Address line 2">
          <TextInput value={data.addressLine2} onChange={e => set('addressLine2', e.target.value)}
            placeholder="Mumbai, Maharashtra 400021" />
        </Field>
        <Field label="Address line 3">
          <TextInput value={data.addressLine3} onChange={e => set('addressLine3', e.target.value)}
            placeholder="India" />
        </Field>
      </Section>

      {/* ── Working Hours ── */}
      <Section title="Working Hours" description="Shown at the bottom of the contact details card.">
        <Field label="Weekdays">
          <TextInput value={data.hoursWeekdays} onChange={e => set('hoursWeekdays', e.target.value)}
            placeholder="Monday – Friday: 9:30 AM – 6:30 PM" />
        </Field>
        <Field label="Weekend">
          <TextInput value={data.hoursWeekend} onChange={e => set('hoursWeekend', e.target.value)}
            placeholder="Saturday & Sunday: Closed" />
        </Field>
      </Section>

      {/* ── Enquiry Form Card ── */}
      <Section title="Enquiry Form Card" description="The heading and subtext at the top of the contact form card.">
        <Field label="Form card title">
          <TextInput value={data.formTitle} onChange={e => set('formTitle', e.target.value)}
            placeholder="Send Us a Message" />
        </Field>
        <Field label="Form card subtext">
          <TextInput value={data.formSubtext} onChange={e => set('formSubtext', e.target.value)}
            placeholder="We'll get back to you within 1 business day." />
        </Field>
      </Section>

      {/* ── Service Options ── */}
      <Section title="Service Dropdown Options" description="The options shown in the 'Service Interest' dropdown on the enquiry form.">
        <div className="space-y-2">
          {data.serviceOptions.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center">
              <TextInput
                value={opt}
                onChange={e => {
                  const n = [...data.serviceOptions]; n[i] = e.target.value; set('serviceOptions', n);
                }}
                placeholder="Service name"
              />
              <DangerButton type="button"
                onClick={() => set('serviceOptions', data.serviceOptions.filter((_, j) => j !== i))}>
                <Trash2 size={13} />
              </DangerButton>
            </div>
          ))}
          <SecondaryButton type="button"
            onClick={() => set('serviceOptions', [...data.serviceOptions, ''])}>
            <Plus size={13} /> Add option
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Map ── */}
      <Section title="Map Embed" description="Paste a Google Maps embed URL. Get it from Google Maps → Share → Embed a map → copy the src URL.">
        <Field label="Google Maps embed URL">
          <TextArea rows={3} value={data.mapEmbedUrl} onChange={e => set('mapEmbedUrl', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=…" />
        </Field>
        {data.mapEmbedUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-gray-100" style={{ height: 220 }}>
            <iframe src={data.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Map preview" />
          </div>
        )}
      </Section>

      {/* Bottom save */}
      <div className="flex justify-end mt-2 mb-8">
        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
        </PrimaryButton>
      </div>
    </div>
  );
}
