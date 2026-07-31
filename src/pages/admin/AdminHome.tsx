import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { api } from '../../lib/api';
import type { HomeContent, ServiceContent, InsightCard, ResourceItem } from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

const EMPTY: HomeContent = {
  heroLine1: '', heroPhrases: [], heroLine2: '', heroDescription: '',
  heroVideoUrl: '', heroImage1Url: '', heroImage2Url: '',
  ctaPrimaryText: '', ctaSecondaryText: '',
  oneStopLabel: '', oneStopTitle: '', oneStopCards: [],
  whyUsLogoUrl: '', whyUsHeading: '', whyUsBody: '', whyUsItems: [],
  whyUsVideoUrl: '', whyUsImage1Url: '', whyUsImage2Url: '',
  servicesPreviewLabel: '', servicesPreviewTitle: '', servicesPreviewDescription: '',
  testimonialsHeading: '', testimonials: [],
  stats: [],
  featuredServiceSlugs: [],
  latestInsights: [],
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
        const parentServices = services.filter((service) => !service.parentSlug);
        setAllServices(parentServices);
        setAllArticles(articles);
        const merged = { ...home, featuredServiceSlugs: home.featuredServiceSlugs ?? [], latestInsights: home.latestInsights ?? [] };
        if (!merged.featuredServiceSlugs.length && parentServices.length > 0) {
          merged.featuredServiceSlugs = parentServices.slice(0, 8).map(s => s.slug);
        }
        // Pre-populate insights with first 3 articles so admin sees what's live
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
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const updated = await api.put<HomeContent>('/home', data);
      // Keep featured slugs from local state if server returns empty
      // (can happen if the field is new and DB hasn't been written yet)
      const savedSlugs = updated.featuredServiceSlugs?.length
        ? updated.featuredServiceSlugs
        : data.featuredServiceSlugs;
      setData({ ...updated, featuredServiceSlugs: savedSlugs, latestInsights: updated.latestInsights ?? [] });
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading…</p>;
  }

  const update = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: value }));
  };

  const updatePhrase = (i: number, value: string) => {
    const next = [...data.heroPhrases];
    next[i] = value;
    update('heroPhrases', next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>Home Page</h1>
          <p className="text-gray-400 text-sm mt-1">Edit the text and images shown on your homepage.</p>
        </div>
        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </PrimaryButton>
      </div>

      {/* Sticky unsaved-changes bar */}
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

      <Section title="Hero Section" description="The top banner visitors see first.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Line before phrase"><TextInput value={data.heroLine1} onChange={(e) => update('heroLine1', e.target.value)} /></Field>
          <Field label="Line after phrase"><TextInput value={data.heroLine2} onChange={(e) => update('heroLine2', e.target.value)} /></Field>
        </div>
        <Field label="Rotating phrases">
          <div className="space-y-2">
            {data.heroPhrases.map((p, i) => (
              <div key={i} className="flex gap-2">
                <TextInput value={p} onChange={(e) => updatePhrase(i, e.target.value)} />
                <DangerButton type="button" onClick={() => update('heroPhrases', data.heroPhrases.filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('heroPhrases', [...data.heroPhrases, ''])}><Plus size={13} /> Add phrase</SecondaryButton>
          </div>
        </Field>
        <Field label="Description"><TextArea rows={3} value={data.heroDescription} onChange={(e) => update('heroDescription', e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary button text"><TextInput value={data.ctaPrimaryText} onChange={(e) => update('ctaPrimaryText', e.target.value)} /></Field>
          <Field label="Secondary button text"><TextInput value={data.ctaSecondaryText} onChange={(e) => update('ctaSecondaryText', e.target.value)} /></Field>
        </div>
        <ImageUploader label="Hero video" value={data.heroVideoUrl} onChange={(v) => update('heroVideoUrl', v)} accept="video/*" section="home" />
        <ImageUploader label="Hero image 1" value={data.heroImage1Url} onChange={(v) => update('heroImage1Url', v)} section="home" hint="Portrait 2:3, e.g. 600 × 900 px — displayed tall in the right-side photo collage" />
        <ImageUploader label="Hero image 2" value={data.heroImage2Url} onChange={(v) => update('heroImage2Url', v)} section="home" hint="Portrait 2:3, e.g. 600 × 900 px — displayed tall in the right-side photo collage" />
      </Section>

      <Section title="One Stop Consultancy Partner">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Label"><TextInput value={data.oneStopLabel} onChange={(e) => update('oneStopLabel', e.target.value)} /></Field>
          <Field label="Title"><TextInput value={data.oneStopTitle} onChange={(e) => update('oneStopTitle', e.target.value)} /></Field>
        </div>
        <Field label="Cards">
          <div className="space-y-3">
            {data.oneStopCards.map((c, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-gray-100">
                <div className="flex-1 space-y-2">
                  <TextInput placeholder="Title" value={c.title} onChange={(e) => {
                    const next = [...data.oneStopCards]; next[i] = { ...c, title: e.target.value }; update('oneStopCards', next);
                  }} />
                  <TextInput placeholder="Description" value={c.desc} onChange={(e) => {
                    const next = [...data.oneStopCards]; next[i] = { ...c, desc: e.target.value }; update('oneStopCards', next);
                  }} />
                </div>
                <DangerButton type="button" onClick={() => update('oneStopCards', data.oneStopCards.filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('oneStopCards', [...data.oneStopCards, { title: '', desc: '' }])}><Plus size={13} /> Add card</SecondaryButton>
          </div>
        </Field>
      </Section>

      <Section title="Expertise Section (Why Choose Us)">
        <ImageUploader label="Logo" value={data.whyUsLogoUrl} onChange={(v) => update('whyUsLogoUrl', v)} section="home" hint="Any width × ~80 px tall — PNG with transparent background works best" />
        <ImageUploader label="Left panel video" value={data.whyUsVideoUrl} onChange={(v) => update('whyUsVideoUrl', v)} accept="video/*" section="home" hint="Tall video for the large left slot in the photo collage. If left blank, the Hero video is used." />
        <ImageUploader label="Collage image 1 (top-right)" value={data.whyUsImage1Url} onChange={(v) => update('whyUsImage1Url', v)} section="home" hint="Portrait 2:3, e.g. 600 × 900 px. If left blank, Hero image 1 is used." />
        <ImageUploader label="Collage image 2 (bottom-right)" value={data.whyUsImage2Url} onChange={(v) => update('whyUsImage2Url', v)} section="home" hint="Portrait 2:3, e.g. 600 × 900 px. If left blank, Hero image 2 is used." />
        <Field label="Heading"><TextInput value={data.whyUsHeading} onChange={(e) => update('whyUsHeading', e.target.value)} /></Field>
        <Field label="Body text"><TextArea rows={3} value={data.whyUsBody} onChange={(e) => update('whyUsBody', e.target.value)} /></Field>
        <Field label="Reasons">
          <div className="space-y-3">
            {data.whyUsItems.map((item, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-gray-100">
                <div className="flex-1 space-y-2">
                  <TextInput placeholder="Title" value={item.title} onChange={(e) => {
                    const next = [...data.whyUsItems]; next[i] = { ...item, title: e.target.value }; update('whyUsItems', next);
                  }} />
                  <TextArea rows={2} placeholder="Description" value={item.desc} onChange={(e) => {
                    const next = [...data.whyUsItems]; next[i] = { ...item, desc: e.target.value }; update('whyUsItems', next);
                  }} />
                </div>
                <DangerButton type="button" onClick={() => update('whyUsItems', data.whyUsItems.filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('whyUsItems', [...data.whyUsItems, { title: '', desc: '' }])}><Plus size={13} /> Add reason</SecondaryButton>
          </div>
        </Field>
      </Section>

      <Section title="Comprehensive Compliance Solutions (Services Preview)" description="Controls the 'Our Expertise' label, heading, and description shown above the services card grid on the homepage. The cards below are pulled from the Featured Services list.">
        <Field label="Section label (e.g. Our Expertise)"><TextInput value={data.servicesPreviewLabel} onChange={(e) => update('servicesPreviewLabel', e.target.value)} /></Field>
        <Field label="Heading (e.g. Comprehensive Compliance Solutions)"><TextInput value={data.servicesPreviewTitle} onChange={(e) => update('servicesPreviewTitle', e.target.value)} /></Field>
        <Field label="Description (shown below heading)"><TextArea rows={2} value={data.servicesPreviewDescription} onChange={(e) => update('servicesPreviewDescription', e.target.value)} /></Field>
      </Section>

      <Section title="Featured Services on Homepage" description="Choose up to 8 services and set their display order. If none are selected all services appear in their default order.">
        {(() => {
          const slugs = data.featuredServiceSlugs ?? [];
          // Services currently featured (in order)
          const featured = slugs
            .map(slug => allServices.find(s => s.slug === slug))
            .filter(Boolean) as ServiceContent[];
          // Services not yet featured
          const unfeatured = allServices.filter(s => !slugs.includes(s.slug));

          const moveUp = (i: number) => {
            if (i === 0) return;
            const next = [...slugs]; [next[i - 1], next[i]] = [next[i], next[i - 1]];
            update('featuredServiceSlugs', next);
          };
          const moveDown = (i: number) => {
            if (i >= slugs.length - 1) return;
            const next = [...slugs]; [next[i], next[i + 1]] = [next[i + 1], next[i]];
            update('featuredServiceSlugs', next);
          };
          const add = (slug: string) => {
            if (slugs.length >= 8) return;
            update('featuredServiceSlugs', [...slugs, slug]);
          };
          const remove = (slug: string) => update('featuredServiceSlugs', slugs.filter(s => s !== slug));

          return (
            <div className="space-y-4">
              {/* Featured list */}
              {featured.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Showing on homepage ({featured.length}/8)
                  </p>
                  {featured.map((svc, i) => (
                    <div key={svc.slug}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-white"
                      style={{ borderColor: 'var(--p-a15)' }}>
                      {svc.img && <img src={svc.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                      <span className="flex-1 text-sm font-medium truncate" style={{ fontFamily: PP, color: '#111' }}>{svc.title}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => moveUp(i)} disabled={i === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move up">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveDown(i)} disabled={i === featured.length - 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move down">
                          <ChevronDown size={14} />
                        </button>
                        <DangerButton type="button" onClick={() => remove(svc.slug)}>
                          <Trash2 size={13} />
                        </DangerButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add from remaining */}
              {unfeatured.length > 0 && slugs.length < 8 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Add to homepage
                  </p>
                  {unfeatured.map((svc) => (
                    <div key={svc.slug}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                      {svc.img && <img src={svc.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 opacity-60" />}
                      <span className="flex-1 text-sm text-gray-500 truncate" style={{ fontFamily: PP }}>{svc.title}</span>
                      <SecondaryButton type="button" onClick={() => add(svc.slug)}>
                        <Plus size={13} /> Add
                      </SecondaryButton>
                    </div>
                  ))}
                </div>
              )}

              {slugs.length >= 8 && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" style={{ fontFamily: PP }}>
                  Maximum 8 services reached. Remove one to add another.
                </p>
              )}
            </div>
          );
        })()}
      </Section>

      <Section title="Latest Insights" description="Pick up to 3 articles from Resources to show on the homepage. Leave empty to use the built-in defaults.">
        {(() => {
          const picked: InsightCard[] = data.latestInsights ?? [];
          // slugs already picked (to avoid duplicates in the "add" list)
          const pickedSlugs = picked.map(c => c.articleUrl?.replace('/resources/', '') ?? '');
          const available = allArticles.filter(a => a.slug && !pickedSlugs.includes(a.slug));

          const addArticle = (article: ResourceItem) => {
            if (picked.length >= 3) return;
            const card: InsightCard = {
              category: article.category ?? '',
              title: article.title,
              desc: article.excerpt ?? '',
              img: article.img ?? '',
              date: article.date ?? '',
              articleUrl: `/resources/${article.slug}`,
            };
            update('latestInsights', [...picked, card]);
          };

          const removeArticle = (i: number) =>
            update('latestInsights', picked.filter((_, j) => j !== i));

          const moveUp = (i: number) => {
            if (i === 0) return;
            const next = [...picked]; [next[i - 1], next[i]] = [next[i], next[i - 1]];
            update('latestInsights', next);
          };
          const moveDown = (i: number) => {
            if (i >= picked.length - 1) return;
            const next = [...picked]; [next[i], next[i + 1]] = [next[i + 1], next[i]];
            update('latestInsights', next);
          };

          return (
            <div className="space-y-4">
              {/* Picked articles */}
              {picked.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Showing on homepage ({picked.length}/3)
                  </p>
                  {picked.map((card, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-white"
                      style={{ borderColor: 'var(--p-a15)' }}>
                      {card.img && <img src={card.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ fontFamily: PP, color: '#111' }}>{card.title}</p>
                        <p className="text-xs text-gray-400 truncate">{card.category} · {card.date}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => moveUp(i)} disabled={i === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move up">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveDown(i)} disabled={i === picked.length - 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Move down">
                          <ChevronDown size={14} />
                        </button>
                        <DangerButton type="button" onClick={() => removeArticle(i)}>
                          <Trash2 size={13} />
                        </DangerButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Available articles to add */}
              {available.length > 0 && picked.length < 3 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Add from Resources
                  </p>
                  {available.map((article) => (
                    <div key={article._id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                      {article.img && <img src={article.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 opacity-60" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 truncate" style={{ fontFamily: PP }}>{article.title}</p>
                        <p className="text-xs text-gray-400 truncate">{article.category} · {article.date}</p>
                      </div>
                      <SecondaryButton type="button" onClick={() => addArticle(article)}>
                        <Plus size={13} /> Add
                      </SecondaryButton>
                    </div>
                  ))}
                </div>
              )}

              {picked.length >= 3 && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" style={{ fontFamily: PP }}>
                  Maximum 3 articles reached. Remove one to add another.
                </p>
              )}

              {picked.length === 0 && (
                <p className="text-xs text-gray-400" style={{ fontFamily: PP }}>
                  Currently showing built-in defaults. Pick articles above to override them.
                </p>
              )}
            </div>
          );
        })()}
      </Section>

      <Section title="Testimonials">
        <Field label="Section heading"><TextInput value={data.testimonialsHeading} onChange={(e) => update('testimonialsHeading', e.target.value)} /></Field>
        <Field label="Testimonials">
          <div className="space-y-3">
            {data.testimonials.map((t, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-gray-100">
                <div className="flex-1 space-y-2">
                  <TextArea rows={2} placeholder="Quote" value={t.text} onChange={(e) => {
                    const next = [...data.testimonials]; next[i] = { ...t, text: e.target.value }; update('testimonials', next);
                  }} />
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput placeholder="Author" value={t.author} onChange={(e) => {
                      const next = [...data.testimonials]; next[i] = { ...t, author: e.target.value }; update('testimonials', next);
                    }} />
                    <TextInput placeholder="Role" value={t.role} onChange={(e) => {
                      const next = [...data.testimonials]; next[i] = { ...t, role: e.target.value }; update('testimonials', next);
                    }} />
                  </div>
                </div>
                <DangerButton type="button" onClick={() => update('testimonials', data.testimonials.filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => update('testimonials', [...data.testimonials, { text: '', author: '', role: '' }])}><Plus size={13} /> Add testimonial</SecondaryButton>
          </div>
        </Field>
      </Section>

      <Section title="Stats Bar">
        <div className="space-y-3">
          {data.stats.map((s, i) => (
            <div key={i} className="flex gap-2 items-center p-3 rounded-xl border border-gray-100">
              <TextInput type="number" placeholder="Target" value={s.target} onChange={(e) => {
                const next = [...data.stats]; next[i] = { ...s, target: Number(e.target.value) }; update('stats', next);
              }} className="w-24" />
              <TextInput placeholder="Suffix (+, %, ★)" value={s.suffix} onChange={(e) => {
                const next = [...data.stats]; next[i] = { ...s, suffix: e.target.value }; update('stats', next);
              }} className="w-32" />
              <TextInput placeholder="Label" value={s.label} onChange={(e) => {
                const next = [...data.stats]; next[i] = { ...s, label: e.target.value }; update('stats', next);
              }} className="flex-1" />
              <DangerButton type="button" onClick={() => update('stats', data.stats.filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
            </div>
          ))}
          <SecondaryButton type="button" onClick={() => update('stats', [...data.stats, { target: 0, decimals: 0, suffix: '', label: '' }])}><Plus size={13} /> Add stat</SecondaryButton>
        </div>
      </Section>

      <div className="flex justify-end">
        <PrimaryButton onClick={save} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </PrimaryButton>
      </div>
    </div>
  );
}
