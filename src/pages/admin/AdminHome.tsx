import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { api } from '../../lib/api';
import type { HomeContent, ServiceContent, InsightCard, ResourceItem } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

const EMPTY: HomeContent = {
  heroLine1: '', heroLine2: '',
  heroPhrases: [], heroCategories: [],
  heroSlides: [], heroStats: [],
  heroDescription: '', heroVideoUrl: '', heroImage1Url: '', heroImage2Url: '',
  ctaPrimaryText: '', ctaSecondaryText: '',
  oneStopLabel: '', oneStopTitle: '', oneStopBody: '', oneStopCards: [],
  labourCodesCalloutHeading: '', labourCodesCalloutBody: '', labourCodesCalloutCta: '',
  whyUsLogoUrl: '', whyUsHeading: '', whyUsBody: '', whyUsItems: [],
  whyUsVideoUrl: '', whyUsImage1Url: '', whyUsImage2Url: '',
  servicesPreviewLabel: '', servicesPreviewTitle: '', servicesPreviewDescription: '',
  featuredServiceSlugs: [],
  clientsLabel: '',
  testimonialsHeading: '', testimonials: [], stats: [],
  insightsLabel: '', insightsHeading: '', latestInsights: [],
  ctaBannerHeading: '', ctaBannerBody: '', ctaBannerButtonText: '', ctaBannerImageUrl: '',
};

export default function AdminHome() {
  const [data, setData] = useState<HomeContent>(EMPTY);
  const [allServices, setAllServices] = useState<ServiceContent[]>([]);
  const [allArticles, setAllArticles] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<HomeContent>('/home'),
      api.get<ServiceContent[]>('/services'),
      api.get<ResourceItem[]>('/resources?tab=articles'),
    ])
      .then(([home, services, articles]) => {
        const parentServices = services.filter((s) => !s.parentSlug);
        setAllServices(parentServices);
        setAllArticles(articles);
        const merged: HomeContent = {
          ...EMPTY,
          ...home,
          heroSlides: home.heroSlides ?? [],
          heroStats: home.heroStats ?? [],
          heroCategories: home.heroCategories ?? [],
          oneStopCards: home.oneStopCards ?? [],
          whyUsItems: home.whyUsItems ?? [],
          testimonials: home.testimonials ?? [],
          stats: home.stats ?? [],
          featuredServiceSlugs: home.featuredServiceSlugs ?? [],
          latestInsights: home.latestInsights ?? [],
        };
        if (!merged.featuredServiceSlugs.length && parentServices.length > 0) {
          merged.featuredServiceSlugs = parentServices.slice(0, 8).map(s => s.slug);
        }
        if (!merged.latestInsights.length && articles.length > 0) {
          merged.latestInsights = articles.slice(0, 3).map(a => ({
            category: a.category ?? '',
            title: a.title,
            desc: a.excerpt ?? '',
            img: a.img ?? '',
            date: a.date ?? '',
            articleUrl: `/resources/${a.slug}`,
          }));
        }
        setData(merged);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const updated = await api.put<HomeContent>('/home', data);
      const savedSlugs = updated.featuredServiceSlugs?.length ? updated.featuredServiceSlugs : data.featuredServiceSlugs;
      setData({ ...EMPTY, ...updated, featuredServiceSlugs: savedSlugs, latestInsights: updated.latestInsights ?? [] });
      setDirty(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  const update = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: value }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Home Page</h1>
          <p className="text-gray-400 text-sm mt-1">Edit every piece of content shown on the homepage.</p>
        </div>
        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </PrimaryButton>
      </div>

      {dirty && !saving && (
        <div className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
          style={{ backgroundColor: 'var(--primary-dark)', fontFamily: PP }}>
          <span className="text-sm font-semibold text-white">You have unsaved changes.</span>
          <button onClick={save}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#fda102', color: '#111' }}>
            <Save size={14} /> Save Now
          </button>
        </div>
      )}
      {saved && (
        <div className="mb-5 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <CheckCircle2 size={15} /> Saved — changes are live on the site.
        </div>
      )}
      {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

      {/* ── Hero ── */}
      <Section title="Hero — Slides" description="Each slide pairs a headline with its image. The hero cycles through all slides automatically.">
        <div className="space-y-4">
          {(data.heroSlides ?? []).map((slide, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: PP }}>Slide {i + 1}</span>
                <DangerButton type="button" onClick={() => update('heroSlides', data.heroSlides.filter((_, j) => j !== i))}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Headline (white text)">
                  <TextInput value={slide.headline} onChange={(e) => {
                    const next = [...data.heroSlides]; next[i] = { ...slide, headline: e.target.value }; update('heroSlides', next);
                  }} placeholder="Five Decades of Experience." />
                </Field>
                <Field label="Accent (amber text)">
                  <TextInput value={slide.headlineAccent} onChange={(e) => {
                    const next = [...data.heroSlides]; next[i] = { ...slide, headlineAccent: e.target.value }; update('heroSlides', next);
                  }} placeholder="A New Era of Labour Laws." />
                </Field>
              </div>
              <ImageUploader
                label="Slide image (leave blank to use built-in default)"
                value={slide.imageUrl}
                onChange={(v) => { const next = [...data.heroSlides]; next[i] = { ...slide, imageUrl: v }; update('heroSlides', next); }}
                section="home"
                hint="Portrait 2:3, min 600×900 px"
              />
            </div>
          ))}
          <SecondaryButton type="button" onClick={() => update('heroSlides', [...(data.heroSlides ?? []), { headline: '', headlineAccent: '', imageUrl: '' }])}>
            <Plus size={13} /> Add slide
          </SecondaryButton>
        </div>
      </Section>

      <Section title="Hero — Text & CTAs" description="Description, typewriter phrases, category strip, and button labels.">
        <Field label="Description (paragraph below the headline)">
          <TextArea rows={3} value={data.heroDescription} onChange={(e) => update('heroDescription', e.target.value)} />
        </Field>
        <Field label="Category strip (pipe-separated labels under the brand name)">
          <div className="space-y-2">
            {(data.heroCategories ?? []).map((cat, i) => (
              <div key={i} className="flex gap-2">
                <TextInput value={cat} onChange={(e) => {
                  const next = [...(data.heroCategories ?? [])]; next[i] = e.target.value; update('heroCategories', next);
                }} placeholder="e.g. Labour Laws" />
                <DangerButton type="button" onClick={() => update('heroCategories', (data.heroCategories ?? []).filter((_, j) => j !== i))}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('heroCategories', [...(data.heroCategories ?? []), ''])}>
              <Plus size={13} /> Add category
            </SecondaryButton>
          </div>
        </Field>
        <Field label="Typewriter phrases (cycle through these after the description)">
          <div className="space-y-2">
            {(data.heroPhrases ?? []).map((p, i) => (
              <div key={i} className="flex gap-2">
                <TextInput value={p} onChange={(e) => {
                  const next = [...(data.heroPhrases ?? [])]; next[i] = e.target.value; update('heroPhrases', next);
                }} />
                <DangerButton type="button" onClick={() => update('heroPhrases', (data.heroPhrases ?? []).filter((_, j) => j !== i))}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('heroPhrases', [...(data.heroPhrases ?? []), ''])}>
              <Plus size={13} /> Add phrase
            </SecondaryButton>
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary button text"><TextInput value={data.ctaPrimaryText} onChange={(e) => update('ctaPrimaryText', e.target.value)} placeholder="Talk to Our Experts" /></Field>
          <Field label="Secondary button text"><TextInput value={data.ctaSecondaryText} onChange={(e) => update('ctaSecondaryText', e.target.value)} placeholder="Request a Compliance Review" /></Field>
        </div>
      </Section>

      <Section title="Hero — Media" description="Background video and photos used in the hero and expertise collage.">
        <ImageUploader label="Hero video" value={data.heroVideoUrl} onChange={(v) => update('heroVideoUrl', v)} accept="video/*" section="home" />
        <ImageUploader label="Hero image 1" value={data.heroImage1Url} onChange={(v) => update('heroImage1Url', v)} section="home" hint="Portrait 2:3, e.g. 600×900 px" />
        <ImageUploader label="Hero image 2" value={data.heroImage2Url} onChange={(v) => update('heroImage2Url', v)} section="home" hint="Portrait 2:3, e.g. 600×900 px" />
      </Section>

      <Section title="Credibility Stats Card" description="The four-cell white card that overlaps the bottom of the hero (e.g. 1979 · Established Since, 45+ · Years of Experience).">
        <div className="space-y-2">
          {(data.heroStats ?? []).map((s, i) => (
            <div key={i} className="flex gap-2 items-center p-3 rounded-xl border border-gray-100">
              <TextInput type="number" placeholder="Number" value={s.target} onChange={(e) => {
                const next = [...(data.heroStats ?? [])]; next[i] = { ...s, target: Number(e.target.value) }; update('heroStats', next);
              }} style={{ width: '90px' }} />
              <TextInput placeholder="Suffix (+, %, etc.)" value={s.suffix} onChange={(e) => {
                const next = [...(data.heroStats ?? [])]; next[i] = { ...s, suffix: e.target.value }; update('heroStats', next);
              }} style={{ width: '80px' }} />
              <TextInput placeholder="Label (e.g. Established Since)" value={s.label} onChange={(e) => {
                const next = [...(data.heroStats ?? [])]; next[i] = { ...s, label: e.target.value }; update('heroStats', next);
              }} style={{ flex: 1 }} />
              <DangerButton type="button" onClick={() => update('heroStats', (data.heroStats ?? []).filter((_, j) => j !== i))}>
                <Trash2 size={13} />
              </DangerButton>
            </div>
          ))}
          <SecondaryButton type="button" onClick={() => update('heroStats', [...(data.heroStats ?? []), { target: 0, decimals: 0, suffix: '', label: '' }])}>
            <Plus size={13} /> Add stat
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Core Capabilities ── */}
      <Section title="Core Capabilities Section" description="The dark amber section showing 8 service capability cards.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Label (e.g. Our Core Capabilities)"><TextInput value={data.oneStopLabel} onChange={(e) => update('oneStopLabel', e.target.value)} /></Field>
          <Field label="Heading (e.g. Compliance Beyond Checklists)"><TextInput value={data.oneStopTitle} onChange={(e) => update('oneStopTitle', e.target.value)} /></Field>
        </div>
        <Field label="Subtext">
          <TextArea rows={2} value={data.oneStopBody} onChange={(e) => update('oneStopBody', e.target.value)} />
        </Field>
        <Field label="Capability Cards">
          <div className="space-y-3">
            {(data.oneStopCards ?? []).map((c, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-100 space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <TextInput placeholder="Card title" value={c.title} onChange={(e) => {
                      const next = [...(data.oneStopCards ?? [])]; next[i] = { ...c, title: e.target.value }; update('oneStopCards', next);
                    }} />
                    <TextInput placeholder="Short description" value={c.desc} onChange={(e) => {
                      const next = [...(data.oneStopCards ?? [])]; next[i] = { ...c, desc: e.target.value }; update('oneStopCards', next);
                    }} />
                  </div>
                  <DangerButton type="button" onClick={() => update('oneStopCards', (data.oneStopCards ?? []).filter((_, j) => j !== i))}>
                    <Trash2 size={13} />
                  </DangerButton>
                </div>
                <ImageUploader
                  label="Card icon / image (replaces default animation)"
                  value={c.imgUrl ?? ''}
                  onChange={(v) => { const next = [...(data.oneStopCards ?? [])]; next[i] = { ...c, imgUrl: v }; update('oneStopCards', next); }}
                  section="home"
                  hint="Square, e.g. 400×400 px. Leave blank to use built-in animated icon."
                />
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('oneStopCards', [...(data.oneStopCards ?? []), { title: '', desc: '', imgUrl: '' }])}>
              <Plus size={13} /> Add card
            </SecondaryButton>
          </div>
        </Field>
      </Section>

      {/* ── Labour Codes Callout ── */}
      <Section title="Labour Codes Callout Section" description="Dark navy banner between Core Capabilities and the Why Choose Us section.">
        <Field label="Heading"><TextInput value={data.labourCodesCalloutHeading} onChange={(e) => update('labourCodesCalloutHeading', e.target.value)} placeholder="Is Your Organisation Labour Codes Ready?" /></Field>
        <Field label="Body text"><TextArea rows={3} value={data.labourCodesCalloutBody} onChange={(e) => update('labourCodesCalloutBody', e.target.value)} /></Field>
        <Field label="Button text"><TextInput value={data.labourCodesCalloutCta} onChange={(e) => update('labourCodesCalloutCta', e.target.value)} placeholder="Request a Labour Codes Readiness Assessment" /></Field>
      </Section>

      {/* ── Why Choose Us ── */}
      <Section title="Why Choose Us Section">
        <ImageUploader label="Logo" value={data.whyUsLogoUrl} onChange={(v) => update('whyUsLogoUrl', v)} section="home" hint="PNG with transparent background, ~80 px tall" />
        <ImageUploader label="Left panel video" value={data.whyUsVideoUrl} onChange={(v) => update('whyUsVideoUrl', v)} accept="video/*" section="home" hint="Tall video for the large left collage slot. If blank, the Hero video is used." />
        <ImageUploader label="Collage image 1 (top-right)" value={data.whyUsImage1Url} onChange={(v) => update('whyUsImage1Url', v)} section="home" hint="Portrait 2:3. If blank, Hero image 1 is used." />
        <ImageUploader label="Collage image 2 (bottom-right)" value={data.whyUsImage2Url} onChange={(v) => update('whyUsImage2Url', v)} section="home" hint="Portrait 2:3. If blank, Hero image 2 is used." />
        <Field label="Heading"><TextInput value={data.whyUsHeading} onChange={(e) => update('whyUsHeading', e.target.value)} /></Field>
        <Field label="Body text"><TextArea rows={3} value={data.whyUsBody} onChange={(e) => update('whyUsBody', e.target.value)} /></Field>
        <Field label="Numbered reasons">
          <div className="space-y-3">
            {(data.whyUsItems ?? []).map((item, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-gray-100">
                <div className="flex-1 space-y-2">
                  <TextInput placeholder="Title" value={item.title} onChange={(e) => {
                    const next = [...(data.whyUsItems ?? [])]; next[i] = { ...item, title: e.target.value }; update('whyUsItems', next);
                  }} />
                  <TextArea rows={2} placeholder="Description" value={item.desc} onChange={(e) => {
                    const next = [...(data.whyUsItems ?? [])]; next[i] = { ...item, desc: e.target.value }; update('whyUsItems', next);
                  }} />
                </div>
                <DangerButton type="button" onClick={() => update('whyUsItems', (data.whyUsItems ?? []).filter((_, j) => j !== i))}>
                  <Trash2 size={13} />
                </DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('whyUsItems', [...(data.whyUsItems ?? []), { title: '', desc: '' }])}>
              <Plus size={13} /> Add reason
            </SecondaryButton>
          </div>
        </Field>
      </Section>

      {/* ── Services Preview ── */}
      <Section title="Services Preview Section" description="Label, heading and description above the service cards grid.">
        <Field label="Section label (e.g. Our Expertise)"><TextInput value={data.servicesPreviewLabel} onChange={(e) => update('servicesPreviewLabel', e.target.value)} /></Field>
        <Field label="Heading"><TextInput value={data.servicesPreviewTitle} onChange={(e) => update('servicesPreviewTitle', e.target.value)} /></Field>
        <Field label="Description"><TextArea rows={2} value={data.servicesPreviewDescription} onChange={(e) => update('servicesPreviewDescription', e.target.value)} /></Field>
      </Section>

      {/* ── Featured Services ── */}
      <Section title="Featured Services on Homepage" description="Choose up to 8 services and set their display order.">
        {(() => {
          const slugs = data.featuredServiceSlugs ?? [];
          const featured = slugs.map(slug => allServices.find(s => s.slug === slug)).filter(Boolean) as ServiceContent[];
          const unfeatured = allServices.filter(s => !slugs.includes(s.slug));

          const moveUp = (i: number) => { if (i === 0) return; const next = [...slugs]; [next[i-1],next[i]]=[next[i],next[i-1]]; update('featuredServiceSlugs', next); };
          const moveDown = (i: number) => { if (i >= slugs.length-1) return; const next = [...slugs]; [next[i],next[i+1]]=[next[i+1],next[i]]; update('featuredServiceSlugs', next); };
          const add = (slug: string) => { if (slugs.length >= 8) return; update('featuredServiceSlugs', [...slugs, slug]); };
          const remove = (slug: string) => update('featuredServiceSlugs', slugs.filter(s => s !== slug));

          return (
            <div className="space-y-4">
              {featured.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: PP }}>Showing on homepage ({featured.length}/8)</p>
                  {featured.map((svc, i) => (
                    <div key={svc.slug} className="flex items-center gap-3 p-3 rounded-xl border bg-white" style={{ borderColor: 'var(--p-a15)' }}>
                      {svc.img && <img src={svc.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                      <span className="flex-1 text-sm font-medium truncate" style={{ fontFamily: PP, color: '#111' }}>{svc.title}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => moveUp(i)} disabled={i===0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronUp size={14} /></button>
                        <button onClick={() => moveDown(i)} disabled={i===featured.length-1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronDown size={14} /></button>
                        <DangerButton type="button" onClick={() => remove(svc.slug)}><Trash2 size={13} /></DangerButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {unfeatured.length > 0 && slugs.length < 8 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: PP }}>Add to homepage</p>
                  {unfeatured.map((svc) => (
                    <div key={svc.slug} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                      {svc.img && <img src={svc.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 opacity-60" />}
                      <span className="flex-1 text-sm text-gray-500 truncate" style={{ fontFamily: PP }}>{svc.title}</span>
                      <SecondaryButton type="button" onClick={() => add(svc.slug)}><Plus size={13} /> Add</SecondaryButton>
                    </div>
                  ))}
                </div>
              )}
              {slugs.length >= 8 && <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Maximum 8 services. Remove one to add another.</p>}
            </div>
          );
        })()}
      </Section>

      {/* ── Client Logos ── */}
      <Section title="Client Logos Section" description="The scrolling company logos strip.">
        <Field label="Section label (e.g. Serving 500+ Corporations Across India)">
          <TextInput value={data.clientsLabel} onChange={(e) => update('clientsLabel', e.target.value)} placeholder="Serving 500+ Corporations Across India" />
        </Field>
      </Section>

      {/* ── Testimonials ── */}
      <Section title="Testimonials">
        <Field label="Section heading"><TextInput value={data.testimonialsHeading} onChange={(e) => update('testimonialsHeading', e.target.value)} /></Field>
        <Field label="Testimonials">
          <div className="space-y-3">
            {(data.testimonials ?? []).map((t, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-gray-100">
                <div className="flex-1 space-y-2">
                  <TextArea rows={2} placeholder="Quote" value={t.text} onChange={(e) => {
                    const next = [...(data.testimonials ?? [])]; next[i] = { ...t, text: e.target.value }; update('testimonials', next);
                  }} />
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput placeholder="Author" value={t.author} onChange={(e) => {
                      const next = [...(data.testimonials ?? [])]; next[i] = { ...t, author: e.target.value }; update('testimonials', next);
                    }} />
                    <TextInput placeholder="Role / Company" value={t.role} onChange={(e) => {
                      const next = [...(data.testimonials ?? [])]; next[i] = { ...t, role: e.target.value }; update('testimonials', next);
                    }} />
                  </div>
                </div>
                <DangerButton type="button" onClick={() => update('testimonials', (data.testimonials ?? []).filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('testimonials', [...(data.testimonials ?? []), { text: '', author: '', role: '' }])}>
              <Plus size={13} /> Add testimonial
            </SecondaryButton>
          </div>
        </Field>
      </Section>

      {/* ── Stats bar (inside testimonials section) ── */}
      <Section title="Stats Bar" description="Count-up numbers shown inside the testimonials band.">
        <div className="space-y-2">
          {(data.stats ?? []).map((s, i) => (
            <div key={i} className="flex gap-2 items-center p-3 rounded-xl border border-gray-100">
              <TextInput type="number" placeholder="Number" value={s.target} onChange={(e) => {
                const next = [...(data.stats ?? [])]; next[i] = { ...s, target: Number(e.target.value) }; update('stats', next);
              }} style={{ width: '90px' }} />
              <TextInput placeholder="Suffix (+, %, ★)" value={s.suffix} onChange={(e) => {
                const next = [...(data.stats ?? [])]; next[i] = { ...s, suffix: e.target.value }; update('stats', next);
              }} style={{ width: '80px' }} />
              <TextInput placeholder="Label" value={s.label} onChange={(e) => {
                const next = [...(data.stats ?? [])]; next[i] = { ...s, label: e.target.value }; update('stats', next);
              }} style={{ flex: 1 }} />
              <DangerButton type="button" onClick={() => update('stats', (data.stats ?? []).filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
            </div>
          ))}
          <SecondaryButton type="button" onClick={() => update('stats', [...(data.stats ?? []), { target: 0, decimals: 0, suffix: '', label: '' }])}>
            <Plus size={13} /> Add stat
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Latest Insights ── */}
      <Section title="Latest Insights Section" description="Pick up to 3 articles from Resources to show on the homepage.">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Section label (small text above heading)">
            <TextInput value={data.insightsLabel} onChange={(e) => update('insightsLabel', e.target.value)} placeholder="Latest Insights" />
          </Field>
          <Field label="Section heading">
            <TextInput value={data.insightsHeading} onChange={(e) => update('insightsHeading', e.target.value)} placeholder="Stay informed with expert guidance" />
          </Field>
        </div>
        {(() => {
          const picked: InsightCard[] = data.latestInsights ?? [];
          const pickedSlugs = picked.map(c => c.articleUrl?.replace('/resources/', '') ?? '');
          const available = allArticles.filter(a => a.slug && !pickedSlugs.includes(a.slug));

          const addArticle = (article: ResourceItem) => {
            if (picked.length >= 3) return;
            update('latestInsights', [...picked, { category: article.category ?? '', title: article.title, desc: article.excerpt ?? '', img: article.img ?? '', date: article.date ?? '', articleUrl: `/resources/${article.slug}` }]);
          };
          const removeArticle = (i: number) => update('latestInsights', picked.filter((_, j) => j !== i));
          const moveUp = (i: number) => { if (i===0) return; const next=[...picked];[next[i-1],next[i]]=[next[i],next[i-1]];update('latestInsights',next); };
          const moveDown = (i: number) => { if (i>=picked.length-1) return; const next=[...picked];[next[i],next[i+1]]=[next[i+1],next[i]];update('latestInsights',next); };

          return (
            <div className="space-y-3">
              {picked.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: PP }}>Showing ({picked.length}/3)</p>
                  {picked.map((card, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-white" style={{ borderColor: 'var(--p-a15)' }}>
                      {card.img && <img src={card.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ fontFamily: PP, color: '#111' }}>{card.title}</p>
                        <p className="text-xs text-gray-400 truncate">{card.category} · {card.date}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => moveUp(i)} disabled={i===0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronUp size={14} /></button>
                        <button onClick={() => moveDown(i)} disabled={i>=picked.length-1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronDown size={14} /></button>
                        <DangerButton type="button" onClick={() => removeArticle(i)}><Trash2 size={13} /></DangerButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {available.length > 0 && picked.length < 3 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: PP }}>Add from Resources</p>
                  {available.map((article) => (
                    <div key={article._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                      {article.img && <img src={article.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 opacity-60" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 truncate" style={{ fontFamily: PP }}>{article.title}</p>
                        <p className="text-xs text-gray-400 truncate">{article.category} · {article.date}</p>
                      </div>
                      <SecondaryButton type="button" onClick={() => addArticle(article)}><Plus size={13} /> Add</SecondaryButton>
                    </div>
                  ))}
                </div>
              )}
              {picked.length >= 3 && <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Maximum 3 articles. Remove one to add another.</p>}
              {picked.length === 0 && <p className="text-xs text-gray-400">Currently showing built-in defaults. Pick articles above to override.</p>}
            </div>
          );
        })()}
      </Section>

      {/* ── CTA Banner ── */}
      <Section title="CTA Banner (bottom of page)" description="The full-width call-to-action strip at the very bottom of the homepage.">
        <Field label="Heading"><TextInput value={data.ctaBannerHeading} onChange={(e) => update('ctaBannerHeading', e.target.value)} placeholder="Ready to secure your compliance?" /></Field>
        <Field label="Body text"><TextArea rows={3} value={data.ctaBannerBody} onChange={(e) => update('ctaBannerBody', e.target.value)} /></Field>
        <Field label="Button text"><TextInput value={data.ctaBannerButtonText} onChange={(e) => update('ctaBannerButtonText', e.target.value)} placeholder="Schedule Consultation" /></Field>
        <ImageUploader label="Right-panel image (leave blank to use built-in gavel image)" value={data.ctaBannerImageUrl} onChange={(v) => update('ctaBannerImageUrl', v)} section="home" hint="Landscape, min 600 px wide" />
      </Section>

      <div className="flex justify-end mt-2">
        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </PrimaryButton>
      </div>
    </div>
  );
}
