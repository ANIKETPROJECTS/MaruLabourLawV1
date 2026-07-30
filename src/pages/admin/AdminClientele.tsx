import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type { ClienteleContent, ClienteleStat, ClienteleIndustry, ClienteleTestimonial, PortfolioSector } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

const EMPTY: ClienteleContent = {
  heroEyebrow:  'Trusted Partners',
  heroHeadline: 'Our Esteemed Clientele',
  heroSubtext:  'Trusted by 500+ corporations across India to navigate complex labour law and stay fully compliant.',
  portfolio: [
    { sector: 'Manufacturing & Conglomerates', clients: [
      { name: 'Tata', logoUrl: '' }, { name: 'Mahindra', logoUrl: '' }, { name: 'L&T', logoUrl: '' },
      { name: 'Reliance', logoUrl: '' }, { name: 'ITC', logoUrl: '' }, { name: 'Godrej', logoUrl: '' },
    ]},
    { sector: 'Banking & Finance', clients: [
      { name: 'HDFC Bank', logoUrl: '' }, { name: 'Bajaj', logoUrl: '' },
    ]},
    { sector: 'Information Technology', clients: [
      { name: 'Infosys', logoUrl: '' }, { name: 'Wipro', logoUrl: '' },
    ]},
  ],
  stats: [
    { target: 500, suffix: '+', decimals: 0, label: 'Clients Served' },
    { target: 15,  suffix: '+', decimals: 0, label: 'Years of Expertise' },
    { target: 8,   suffix: '+', decimals: 0, label: 'Industries' },
    { target: 98,  suffix: '%', decimals: 0, label: 'Retention Rate' },
  ],
  industries: [
    { name: 'Manufacturing',              count: '120+', image: '' },
    { name: 'Banking & Finance',          count: '85+',  image: '' },
    { name: 'Information Technology',     count: '95+',  image: '' },
    { name: 'Retail & FMCG',             count: '70+',  image: '' },
    { name: 'Healthcare & Pharma',        count: '55+',  image: '' },
    { name: 'Hospitality',               count: '45+',  image: '' },
    { name: 'Logistics & Infrastructure', count: '60+',  image: '' },
    { name: 'Others',                    count: '70+',  image: '' },
  ],
  testimonials: [
    { text: "Maru Consultancy transformed our chaotic compliance process into a streamlined, risk-free system. Their expertise in the New Wage Code is unmatched in the industry.", author: 'Rajesh Sharma', role: 'HR Director, TechNova' },
    { text: "Their proactive approach to statutory audits saved us from significant penalties. They don't just consult — they become an extension of your team.", author: 'Meera Reddy', role: 'CEO, Manufacturing Corp' },
    { text: "The contract staffing solutions allowed us to scale rapidly during our peak season without any compliance headaches whatsoever.", author: 'Vikram Singh', role: 'VP Operations, Retail Giant' },
    { text: "Maru Consultancy's compliance framework saved us lakhs in potential penalties. Their team anticipates regulatory changes before they even happen.", author: 'Priya Kapoor', role: 'CFO, Apex Industries' },
    { text: "We have expanded to 6 states and Maru handled every state-specific compliance requirement seamlessly. Truly a pan-India expert partner.", author: 'Arun Nair', role: 'MD, Sunrise Textiles' },
    { text: "The statutory filing support is impeccable — PF, ESIC, PT all managed without a single deadline miss in over three years.", author: 'Sneha Joshi', role: 'Head HR, BuildRight Infra' },
    { text: "Outstanding legal representation before the labour tribunal. The case was resolved in our favour and the whole process was stress-free.", author: 'Deepak Mehta', role: 'Director, Meridian Logistics' },
    { text: "Their HR policy advisory helped us modernise our standing orders in line with the new codes. Employees and management are both happy.", author: 'Kavitha Rao', role: 'CHRO, NovaMed Healthcare' },
  ],
};

export default function AdminClientele() {
  const [data, setData] = useState<ClienteleContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<ClienteleContent>('/industries')
      .then(res => {
        setData({
          heroEyebrow:  res.heroEyebrow  ?? EMPTY.heroEyebrow,
          heroHeadline: res.heroHeadline ?? EMPTY.heroHeadline,
          heroSubtext:  res.heroSubtext  ?? EMPTY.heroSubtext,
          portfolio:    (res.portfolio?.length ? res.portfolio : EMPTY.portfolio).map(sector => ({
            ...sector,
            clients: Array.isArray(sector.clients) ? sector.clients : [],
          })),
          stats:        res.stats?.length        ? res.stats        : EMPTY.stats,
          industries:   res.industries?.length   ? res.industries   : EMPTY.industries,
          testimonials: res.testimonials?.length ? res.testimonials : EMPTY.testimonials,
        });
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      await api.put<ClienteleContent>('/industries', data);
      setDirty(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof ClienteleContent>(key: K, value: ClienteleContent[K]) => {
    setDirty(true);
    setData(d => ({ ...d, [key]: value }));
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Clientele Page</h1>
          <p className="text-gray-400 text-sm mt-1">Edit stats, industries, and testimonials shown on the Clientele page.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600"><CheckCircle2 size={15} /> Saved</span>}
          <PrimaryButton onClick={save} disabled={saving}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </PrimaryButton>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

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

      {/* ── Hero Content ── */}
      <Section title="Hero Content" description="The text shown in the brand-colour hero section at the top of the Clientele page.">
        <Field label="Eyebrow (small caps above the headline)">
          <TextInput value={data.heroEyebrow} onChange={e => set('heroEyebrow', e.target.value)}
            placeholder="e.g. Trusted Partners" />
        </Field>
        <Field label="Headline">
          <TextInput value={data.heroHeadline} onChange={e => set('heroHeadline', e.target.value)}
            placeholder="e.g. Our Esteemed Clientele" />
        </Field>
        <Field label="Subtext paragraph">
          <TextArea rows={2} value={data.heroSubtext} onChange={e => set('heroSubtext', e.target.value)}
            placeholder="Trusted by 500+ corporations across India..." />
        </Field>
      </Section>

      {/* ── Stats ── */}
      <Section title="Stats Bar" description="The four animated count-up numbers shown at the top of the page.">
        <div className="space-y-3">
          {data.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <Field label="Target number">
                <input
                  type="number" value={stat.target}
                  onChange={e => { const n = [...data.stats]; n[i] = { ...stat, target: Number(e.target.value) }; set('stats', n); }}
                  className="w-24 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[var(--primary)]"
                  style={{ borderColor: '#e5e7eb', fontFamily: PP }}
                />
              </Field>
              <Field label="Suffix">
                <input
                  type="text" value={stat.suffix} placeholder="e.g. +"
                  onChange={e => { const n = [...data.stats]; n[i] = { ...stat, suffix: e.target.value }; set('stats', n); }}
                  className="w-16 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[var(--primary)]"
                  style={{ borderColor: '#e5e7eb', fontFamily: PP }}
                />
              </Field>
              <Field label="Decimal places">
                <input
                  type="number" value={stat.decimals} min={0} max={2}
                  onChange={e => { const n = [...data.stats]; n[i] = { ...stat, decimals: Number(e.target.value) }; set('stats', n); }}
                  className="w-16 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[var(--primary)]"
                  style={{ borderColor: '#e5e7eb', fontFamily: PP }}
                />
              </Field>
              <Field label="Label">
                <TextInput value={stat.label} placeholder="e.g. Clients Served"
                  onChange={e => { const n = [...data.stats]; n[i] = { ...stat, label: e.target.value }; set('stats', n); }}
                  className="w-48"
                />
              </Field>
              <div className="mt-6">
                <DangerButton type="button" onClick={() => set('stats', data.stats.filter((_, j) => j !== i))}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
            </div>
          ))}
          <SecondaryButton type="button"
            onClick={() => set('stats', [...data.stats, { target: 0, suffix: '+', decimals: 0, label: '' } as ClienteleStat])}>
            <Plus size={13} /> Add stat
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Industries ── */}
      <Section title="Industries We Serve" description="The eight sector cards. Leave the image blank to use the bundled default photo.">
        <div className="space-y-3">
          {data.industries.map((ind, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 space-y-2">
              <div className="flex gap-2">
                <TextInput placeholder="Industry name" value={ind.name}
                  onChange={e => { const n = [...data.industries]; n[i] = { ...ind, name: e.target.value }; set('industries', n); }} />
                <TextInput placeholder="Count (e.g. 120+)" value={ind.count} className="w-24"
                  onChange={e => { const n = [...data.industries]; n[i] = { ...ind, count: e.target.value }; set('industries', n); }} />
                <DangerButton type="button"
                  onClick={() => {
                    if (ind.image) deleteCloudinaryAsset(ind.image).catch(() => {});
                    set('industries', data.industries.filter((_, j) => j !== i));
                  }}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
              <ImageUploader label="Card image (optional — leave blank to use built-in photo)" value={ind.image}
                onChange={url => { const n = [...data.industries]; n[i] = { ...ind, image: url }; set('industries', n); }} section="clientele" hint="Landscape 4:3, e.g. 800 × 600 px — fills the industry card" />
            </div>
          ))}
          <SecondaryButton type="button"
            onClick={() => set('industries', [...data.industries, { name: '', count: '', image: '' } as ClienteleIndustry])}>
            <Plus size={13} /> Add industry
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Testimonials ── */}
      <Section title="Testimonials" description="The scrolling testimonial cards shown on the brand-colour band.">
        <div className="space-y-3">
          {data.testimonials.map((test, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 space-y-2">
              <TextArea rows={3} placeholder="Testimonial text" value={test.text}
                onChange={e => { const n = [...data.testimonials]; n[i] = { ...test, text: e.target.value }; set('testimonials', n); }} />
              <div className="flex gap-2">
                <TextInput placeholder="Author name" value={test.author}
                  onChange={e => { const n = [...data.testimonials]; n[i] = { ...test, author: e.target.value }; set('testimonials', n); }} />
                <TextInput placeholder="Role (e.g. HR Director, TechNova)" value={test.role}
                  onChange={e => { const n = [...data.testimonials]; n[i] = { ...test, role: e.target.value }; set('testimonials', n); }} />
                <DangerButton type="button"
                  onClick={() => set('testimonials', data.testimonials.filter((_, j) => j !== i))}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
            </div>
          ))}
          <SecondaryButton type="button"
            onClick={() => set('testimonials', [...data.testimonials, { text: '', author: '', role: '' } as ClienteleTestimonial])}>
            <Plus size={13} /> Add testimonial
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Our Portfolio ── */}
      <Section title="Our Portfolio" description="The sector tabs and client logos grid. For built-in logos (Tata, HDFC Bank, etc.) the name alone is enough — leave Logo URL blank. For other clients paste a logo image URL.">
        <div className="space-y-4">
          {data.portfolio.map((sector, si) => (
            <div key={si} className="p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex gap-2 items-center">
                <TextInput placeholder="Sector name (e.g. Manufacturing & Conglomerates)" value={sector.sector}
                  onChange={e => {
                    const n = [...data.portfolio]; n[si] = { ...sector, sector: e.target.value }; set('portfolio', n);
                  }} />
                <DangerButton type="button" onClick={() => {
                  // Delete any Cloudinary logo assets belonging to this sector's clients
                  sector.clients.forEach(c => { if (c.logoUrl) deleteCloudinaryAsset(c.logoUrl).catch(() => {}); });
                  set('portfolio', data.portfolio.filter((_, j) => j !== si));
                }}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
              <div className="space-y-2 pl-3 border-l-2 border-gray-100">
                {sector.clients.map((client, ci) => (
                  <div key={ci} className="flex gap-2 items-center">
                    <TextInput placeholder="Client name" value={client.name}
                      onChange={e => {
                        const n = [...data.portfolio]; const cs = [...n[si].clients];
                        cs[ci] = { ...client, name: e.target.value }; n[si] = { ...n[si], clients: cs }; set('portfolio', n);
                      }} />
                    <TextInput placeholder="Logo URL (blank = built-in SVG)" value={client.logoUrl}
                      onChange={e => {
                        const n = [...data.portfolio]; const cs = [...n[si].clients];
                        cs[ci] = { ...client, logoUrl: e.target.value }; n[si] = { ...n[si], clients: cs }; set('portfolio', n);
                      }} />
                    <DangerButton type="button" onClick={() => {
                      if (client.logoUrl) deleteCloudinaryAsset(client.logoUrl).catch(() => {});
                      const n = [...data.portfolio];
                      n[si] = { ...n[si], clients: sector.clients.filter((_, j) => j !== ci) };
                      set('portfolio', n);
                    }}>
                      <Trash2 size={13} />
                    </DangerButton>
                  </div>
                ))}
                <SecondaryButton type="button" onClick={() => {
                  const n = [...data.portfolio];
                  n[si] = { ...n[si], clients: [...sector.clients, { name: '', logoUrl: '' }] };
                  set('portfolio', n);
                }}>
                  <Plus size={13} /> Add client
                </SecondaryButton>
              </div>
            </div>
          ))}
          <SecondaryButton type="button"
            onClick={() => set('portfolio', [...data.portfolio, { sector: '', clients: [] } as PortfolioSector])}>
            <Plus size={13} /> Add sector
          </SecondaryButton>
        </div>
      </Section>
    </div>
  );
}
