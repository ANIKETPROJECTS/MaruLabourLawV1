import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { api, deleteCloudinaryAsset } from '../../lib/api';
import type {
  AboutContent, AboutHeroStat, AboutStorySlide,
  AboutCoreValue, AboutMilestone, AboutWhyItem, AboutTeamMember,
} from '../../types/content';
import { Section, Field, TextInput, TextArea, PrimaryButton, SecondaryButton, DangerButton } from '../../components/admin/FormBits';
import ImageUploader from '../../components/admin/ImageUploader';

const PP = 'Poppins, sans-serif';

const EMPTY: AboutContent = {
  heroEyebrow:           'About Maru Consultancy Services',
  heroHeadlineTop:       "India's Most\nTrusted",
  heroHeadlineHighlight: 'Labour Law',
  heroHeadlineBottom:    'Partner.',
  heroSubtext:           'Two decades of expertise in labour law compliance, HR governance, statutory filings, and workforce management across 15+ Indian states.',
  heroVideoUrl:          '',
  heroImageUrl:          '',
  videoUrl:              '',
  storyImages: [
    '/assets/hero-office.png',
    '/assets/service-audits.png',
    '/assets/service-legal.png',
  ],
  estYear: '1979',
  heroStats: [
    { value: '500+', label: 'Corporate Clients' },
    { value: '21+',  label: 'Years' },
    { value: '15+',  label: 'States' },
  ],
  marqueeServices: [
    'Labour Law Compliance', 'Payroll & Salary Structuring', 'Statutory Compliance & Filings',
    'People Outsourcing & Staffing', 'Audits & Governance', 'Registrations & Licensing',
    'HR Policy & Advisory', 'Legal Representation', 'Training & Workshops',
  ],
  storySlides: [
    { heading: 'Founded on a vision of', headingHighlight: 'simplified compliance.', body: "What started as a boutique advisory in Mumbai has grown into a pan-India powerhouse trusted by some of India's most respected corporations. We manage compliance for 500+ organisations — from dynamic startups to Fortune 500 conglomerates." },
    { heading: 'Built on deep expertise,', headingHighlight: 'not guesswork.', body: "Every engagement is led by consultants who live and breathe labour law — tracking every amendment across 15+ states so our clients never have to. That rigor is what turned a single Mumbai office into a nationwide practice." },
    { heading: 'Powered by technology,', headingHighlight: 'guided by people.', body: "Our proprietary compliance dashboards give clients real-time visibility into every filing and audit — backed by a dedicated consultant who's always a call away. It's how we keep 98% of our clients year after year." },
  ],
  pullQuoteLine1: 'Compliance is not a checkbox',
  pullQuoteLine2: "It's the foundation on which",
  pullQuoteLine3: 'every great business is built',
  pullQuoteAttribution: 'Deepak Maru, Founder & Managing Partner',
  coreValues: [
    { title: 'Absolute Integrity',     img: '/assets/service-legal.png' },
    { title: 'Unmatched Excellence',   img: '/assets/service-labour.png' },
    { title: 'Client Partnership',     img: '/assets/service-staffing.png' },
    { title: 'Continuous Innovation',  img: '/assets/service-audits.png' },
  ],
  journeyMilestones: [
    { year: '2003', event: 'Founded',             img: '/assets/service-statutory.png', description: 'Established as a boutique advisory firm in Mumbai, focused on compliance.' },
    { year: '2009', event: 'Pan-India',           img: '/assets/service-payroll.png',   description: 'Expanded to Delhi NCR and Bangalore, becoming a true pan-India compliance firm.' },
    { year: '2016', event: 'Tech-Enabled',        img: '/assets/service-training.png',  description: 'Launched proprietary compliance software with real-time dashboards.' },
    { year: '2023', event: 'New Codes Authority', img: '/assets/service-hr.png',        description: "Became India's go-to authority on the New Labour Codes nationwide." },
  ],
  whyChooseItems: [
    { point: 'Pan-India presence across 15+ states',   sub: 'State-specific expertise from Kashmir to Kanyakumari, covering all major industrial hubs.' },
    { point: 'Experts in New Labour Codes',            sub: "One of India's earliest and most trusted authorities on the consolidated labour code framework." },
    { point: 'Proactive risk identification',          sub: 'We audit for vulnerabilities before they become penalties — not after. Reactive compliance is a liability.' },
    { point: 'Dedicated consultant per client',        sub: 'Every client gets a named consultant who knows their business, their sector, and their risk profile.' },
    { point: 'Tech-enabled tracking & reporting',      sub: 'Real-time dashboards and automated reminders so nothing ever slips through the cracks.' },
  ],
  teamMembers: [
    { name: 'Deepak Maru',  qualification: 'B.Com (Hons), LL.B',  role: 'Advocate\nFounder & Managing Partner', img: '/assets/service-legal.png' },
    { name: 'Sanjeev Maru', qualification: 'B.Com, LL.B',         role: 'Co-founder & Managing Partner',        img: '/assets/service-staffing.png' },
    { name: 'Pankhil Maru', qualification: 'B.E (I.T), MBA (HR)', role: 'Managing Partner',                     img: '/assets/service-hr.png' },
    { name: 'Nishit Maru',  qualification: 'BLS, LL.B, CS',       role: 'Managing Partner',                     img: '/assets/service-audits.png' },
  ],
  // Our Approach
  approachLabel: 'How We Work',
  approachHeading: 'Our Approach',
  approachDescription: 'A structured, end-to-end methodology that ensures every client engagement is practical, measurable and aligned to their business reality.',
  approachSteps: ['Understand', 'Assess', 'Advise', 'Implement', 'Monitor', 'Update'],
  // Why MCS
  whyMcsLabel: 'Why MCS',
  whyMcsHeading: 'Experience.',
  whyMcsHeadingHighlight: 'Interpretation.',
  whyMcsHeadingEnd: 'Execution.',
  whyMcsBadge1Value: '98%',
  whyMcsBadge1Label: 'Client Retention',
  whyMcsBadge2Value: '500+',
  whyMcsBadge2Label: 'Clients Served',
  whyMcsImageUrl: '',
  // Journey
  journeyLabel: 'Our Journey',
  journeyHeading: "Three decades of building India's compliance backbone",
  // Management Visibility
  mgmtLabel: 'Management Visibility',
  mgmtHeading: 'Our objective is to help management answer five questions clearly.',
  mgmtQuestions: ['Where are we compliant?', 'Where are the gaps?', 'What is the risk?', 'What must be corrected?', 'By when?'],
  // Team
  teamHeading: 'Meet the Experts Behind Your Success',
  teamSubtext: 'Our experienced team of labour law, payroll, HR, and compliance professionals is committed to delivering practical solutions that help your business stay compliant and grow with confidence.',
  // Video CTA
  ctaLabel: 'Ready to Get Compliant?',
  ctaHeadingLine1: "Let's build your compliance",
  ctaHeadingLine2: 'framework together',
  ctaVideoUrl: '',
  ctaButton1Text: 'Schedule a Consultation',
  ctaButton2Text: 'Join Our Team',
};

export default function AdminAbout() {
  const [data, setData] = useState<AboutContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [initialEyebrow, setInitialEyebrow] = useState('');
  const [confirmEmptyEyebrow, setConfirmEmptyEyebrow] = useState(false);

  useEffect(() => {
    api.get<AboutContent>('/about')
      .then(res => {
        // Merge: use fetched arrays only if non-empty, else keep EMPTY defaults
        setInitialEyebrow(res.heroEyebrow ?? '');
        setData({
          heroEyebrow:           res.heroEyebrow           ?? EMPTY.heroEyebrow,
          heroHeadlineTop:       res.heroHeadlineTop       ?? EMPTY.heroHeadlineTop,
          heroHeadlineHighlight: res.heroHeadlineHighlight ?? EMPTY.heroHeadlineHighlight,
          heroHeadlineBottom:    res.heroHeadlineBottom    ?? EMPTY.heroHeadlineBottom,
          heroSubtext:           res.heroSubtext           ?? EMPTY.heroSubtext,
          heroVideoUrl:          res.heroVideoUrl          ?? EMPTY.heroVideoUrl,
          heroImageUrl:          res.heroImageUrl          ?? EMPTY.heroImageUrl,
          videoUrl:              res.videoUrl              ?? EMPTY.videoUrl,
          storyImages:          res.storyImages?.length ? res.storyImages : EMPTY.storyImages,
          estYear:              res.estYear               ?? EMPTY.estYear,
          heroStats:            res.heroStats?.length            ? res.heroStats            : EMPTY.heroStats,
          marqueeServices:      res.marqueeServices?.length      ? res.marqueeServices      : EMPTY.marqueeServices,
          storySlides:          res.storySlides?.length          ? res.storySlides          : EMPTY.storySlides,
          pullQuoteLine1:       res.pullQuoteLine1       ?? EMPTY.pullQuoteLine1,
          pullQuoteLine2:       res.pullQuoteLine2       ?? EMPTY.pullQuoteLine2,
          pullQuoteLine3:       res.pullQuoteLine3       ?? EMPTY.pullQuoteLine3,
          pullQuoteAttribution: res.pullQuoteAttribution ?? EMPTY.pullQuoteAttribution,
          coreValues:           res.coreValues?.length           ? res.coreValues           : EMPTY.coreValues,
          journeyMilestones:    res.journeyMilestones?.length    ? res.journeyMilestones    : EMPTY.journeyMilestones,
          whyChooseItems:       res.whyChooseItems?.length       ? res.whyChooseItems       : EMPTY.whyChooseItems,
          teamMembers:          res.teamMembers?.length          ? res.teamMembers          : EMPTY.teamMembers,
          // Our Approach
          approachLabel:       res.approachLabel       ?? EMPTY.approachLabel,
          approachHeading:     res.approachHeading     ?? EMPTY.approachHeading,
          approachDescription: res.approachDescription ?? EMPTY.approachDescription,
          approachSteps:       res.approachSteps?.length ? res.approachSteps : EMPTY.approachSteps,
          // Why MCS
          whyMcsLabel:            res.whyMcsLabel            ?? EMPTY.whyMcsLabel,
          whyMcsHeading:          res.whyMcsHeading          ?? EMPTY.whyMcsHeading,
          whyMcsHeadingHighlight: res.whyMcsHeadingHighlight ?? EMPTY.whyMcsHeadingHighlight,
          whyMcsHeadingEnd:       res.whyMcsHeadingEnd       ?? EMPTY.whyMcsHeadingEnd,
          whyMcsBadge1Value:      res.whyMcsBadge1Value      ?? EMPTY.whyMcsBadge1Value,
          whyMcsBadge1Label:      res.whyMcsBadge1Label      ?? EMPTY.whyMcsBadge1Label,
          whyMcsBadge2Value:      res.whyMcsBadge2Value      ?? EMPTY.whyMcsBadge2Value,
          whyMcsBadge2Label:      res.whyMcsBadge2Label      ?? EMPTY.whyMcsBadge2Label,
          whyMcsImageUrl:         res.whyMcsImageUrl         ?? EMPTY.whyMcsImageUrl,
          // Journey
          journeyLabel:   res.journeyLabel   ?? EMPTY.journeyLabel,
          journeyHeading: res.journeyHeading ?? EMPTY.journeyHeading,
          // Management Visibility
          mgmtLabel:     res.mgmtLabel     ?? EMPTY.mgmtLabel,
          mgmtHeading:   res.mgmtHeading   ?? EMPTY.mgmtHeading,
          mgmtQuestions: res.mgmtQuestions?.length ? res.mgmtQuestions : EMPTY.mgmtQuestions,
          // Team
          teamHeading: res.teamHeading ?? EMPTY.teamHeading,
          teamSubtext: res.teamSubtext ?? EMPTY.teamSubtext,
          // Video CTA
          ctaLabel:        res.ctaLabel        ?? EMPTY.ctaLabel,
          ctaHeadingLine1: res.ctaHeadingLine1 ?? EMPTY.ctaHeadingLine1,
          ctaHeadingLine2: res.ctaHeadingLine2 ?? EMPTY.ctaHeadingLine2,
          ctaVideoUrl:     res.ctaVideoUrl     ?? EMPTY.ctaVideoUrl,
          ctaButton1Text:  res.ctaButton1Text  ?? EMPTY.ctaButton1Text,
          ctaButton2Text:  res.ctaButton2Text  ?? EMPTY.ctaButton2Text,
        });
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const doSave = async () => {
    setConfirmEmptyEyebrow(false);
    setFieldErrors({});
    setSaving(true); setError(''); setSaved(false);
    try {
      await api.put<AboutContent>('/about', data);
      setDirty(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    if (!data.heroEyebrow.trim()) {
      // Had a value originally but admin cleared it → hard error
      if (initialEyebrow.trim()) {
        setFieldErrors({ heroEyebrow: 'Eyebrow text is required.' });
        return;
      }
      // Was always empty → ask
      setConfirmEmptyEyebrow(true);
      return;
    }
    setConfirmEmptyEyebrow(false);
    await doSave();
  };


  const set = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) => {
    setDirty(true);
    setData(d => ({ ...d, [key]: value }));
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  // ── helpers for each list type ──────────────────────────────────────

  const listOf = <T,>(
    key: keyof AboutContent,
    items: T[],
    render: (item: T, i: number, onChange: (updated: T) => void, onRemove: () => void) => React.ReactNode,
    empty: T,
    /** Return all Cloudinary image URLs from an item so they're cleaned up when the item is removed. */
    getImages?: (item: T) => string[],
  ) => (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          {render(
            item,
            i,
            (updated) => { const n = [...items]; n[i] = updated; set(key, n as AboutContent[typeof key]); },
            () => {
              // Delete any Cloudinary assets belonging to this item before removing it
              if (getImages) getImages(item).forEach(url => { if (url) deleteCloudinaryAsset(url).catch(() => {}); });
              set(key, items.filter((_, j) => j !== i) as AboutContent[typeof key]);
            },
          )}
        </div>
      ))}
      <SecondaryButton type="button" onClick={() => set(key, [...items, { ...empty }] as AboutContent[typeof key])}>
        <Plus size={13} /> Add item
      </SecondaryButton>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>About Page</h1>
          <p className="text-gray-400 text-sm mt-1">Edit the content shown on the About page.</p>
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
      <Section title="Hero Content" description="The left-panel headline and subtext shown on the About page hero.">
        <Field label="Eyebrow (small caps above the headline)" error={fieldErrors.heroEyebrow}>
          <TextInput value={data.heroEyebrow}
            onChange={e => {
              set('heroEyebrow', e.target.value);
              setFieldErrors(fe => ({ ...fe, heroEyebrow: '' }));
              setConfirmEmptyEyebrow(false);
            }}
            placeholder="e.g. About Maru Consultancy Services"
            style={{ borderColor: fieldErrors.heroEyebrow ? '#dc2626' : undefined }} />
          {confirmEmptyEyebrow && (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="text-sm text-amber-800 font-medium flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Eyebrow is empty — the label above the headline won't appear on the page. Save anyway?
              </span>
              <button
                type="button"
                onClick={doSave}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--primary)', color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                Keep empty
              </button>
              <button
                type="button"
                onClick={() => setConfirmEmptyEyebrow(false)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-300 bg-white text-gray-700 transition-opacity hover:opacity-80"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
                Fill in
              </button>
            </div>
          )}
        </Field>
        <Field label="Headline — lines before the amber highlight (use ↵ Enter for a line break)">
          <TextArea rows={2} value={data.heroHeadlineTop}
            onChange={e => set('heroHeadlineTop', e.target.value)}
            placeholder={"India's Most\nTrusted"} />
        </Field>
        <Field label="Headline — amber highlight line">
          <TextInput value={data.heroHeadlineHighlight}
            onChange={e => set('heroHeadlineHighlight', e.target.value)}
            placeholder="Labour Law" />
        </Field>
        <Field label="Headline — final line">
          <TextInput value={data.heroHeadlineBottom}
            onChange={e => set('heroHeadlineBottom', e.target.value)}
            placeholder="Partner." />
        </Field>
        <Field label="Subtext paragraph">
          <TextArea rows={3} value={data.heroSubtext}
            onChange={e => set('heroSubtext', e.target.value)}
            placeholder="Two decades of expertise in labour law compliance..." />
        </Field>
      </Section>

      {/* ── Hero Stats ── */}
      <Section title="Hero Stats" description="Three numbers shown at the bottom of the hero panel (e.g. 500+, Corporate Clients).">
        {listOf<AboutHeroStat>(
          'heroStats', data.heroStats,
          (item, _i, onChange, onRemove) => (
            <div className="flex gap-2 items-center">
              <TextInput placeholder="Value (e.g. 500+)" value={item.value}
                onChange={e => onChange({ ...item, value: e.target.value })} className="w-28" />
              <TextInput placeholder="Label (e.g. Corporate Clients)" value={item.label}
                onChange={e => onChange({ ...item, label: e.target.value })} />
              <DangerButton type="button" onClick={onRemove}><Trash2 size={13} /></DangerButton>
            </div>
          ),
          { value: '', label: '' },
        )}
      </Section>

      {/* ── Hero Video ── */}
      <Section title="Hero Video" description="Right-side video in the hero section. Upload a video file from your device, or paste a YouTube/Vimeo embed URL below the upload button. Leave blank to keep the default.">
        <ImageUploader label="Hero video" value={data.heroVideoUrl} onChange={(v) => set('heroVideoUrl', v)}
          accept="video/*" section="about" hint="Leave blank to keep the default background video." />
      </Section>

      {/* ── Marquee Strip ── */}
      <Section title="Marquee Strip" description="The scrolling service tags shown on the amber band beneath the hero.">
        <div className="space-y-2">
          {data.marqueeServices.map((svc, i) => (
            <div key={i} className="flex gap-2">
              <TextInput value={svc} onChange={e => {
                const n = [...data.marqueeServices]; n[i] = e.target.value; set('marqueeServices', n);
              }} placeholder="e.g. Labour Law Compliance" />
              <DangerButton type="button" onClick={() => set('marqueeServices', data.marqueeServices.filter((_, j) => j !== i))}>
                <Trash2 size={13} />
              </DangerButton>
            </div>
          ))}
          <SecondaryButton type="button" onClick={() => set('marqueeServices', [...data.marqueeServices, ''])}>
            <Plus size={13} /> Add service
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Story Bento — Side Image Carousel ── */}
      <Section title="Story Bento — Side Images" description="The rotating photos in the large left panel of the bento grid (behind the 'Est. 2003' label). Add 1 or more images — they cross-fade automatically on the site.">
        <div className="space-y-3">
          {data.storyImages.map((img, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <ImageUploader label={`Image ${i + 1}`} value={img}
                  onChange={url => { const n = [...data.storyImages]; n[i] = url; set('storyImages', n); }}
                  section="about" hint="Portrait or square, min 800 × 580 px — fills the large left panel" />
              </div>
              <DangerButton type="button" className="mt-8"
                onClick={() => {
                  if (img) deleteCloudinaryAsset(img).catch(() => {});
                  set('storyImages', data.storyImages.filter((_, j) => j !== i));
                }}>
                <Trash2 size={13} />
              </DangerButton>
            </div>
          ))}
          <SecondaryButton type="button" onClick={() => set('storyImages', [...data.storyImages, ''])}>
            <Plus size={13} /> Add image
          </SecondaryButton>
        </div>
      </Section>

      {/* ── Story Bento — Video ── */}
      <Section title="Story Bento — Video" description="Video shown in the dark panel of the bento grid (the stats + video card below the 'Est.' photo). Upload a video file from your device, or paste a YouTube/Vimeo embed URL below the upload button. Leave blank to show the 'Video coming soon' placeholder.">
        <ImageUploader label="Bento video" value={data.videoUrl} onChange={(v) => set('videoUrl', v)}
          accept="video/*" section="about" />
      </Section>

      {/* ── Story Slides ── */}
      <Section title="Our Story Carousel" description="The three rotating slides in the bento grid. Heading splits into a normal part and an amber-coloured highlight.">
        {listOf<AboutStorySlide>(
          'storySlides', data.storySlides,
          (item, _i, onChange, onRemove) => (
            <div className="p-4 rounded-xl border border-gray-100 space-y-2">
              <div className="flex gap-2">
                <TextInput placeholder="Heading (normal)" value={item.heading}
                  onChange={e => onChange({ ...item, heading: e.target.value })} />
                <DangerButton type="button" onClick={onRemove}><Trash2 size={13} /></DangerButton>
              </div>
              <TextInput placeholder="Heading highlight (amber colour)" value={item.headingHighlight}
                onChange={e => onChange({ ...item, headingHighlight: e.target.value })} />
              <TextArea rows={3} placeholder="Slide body text" value={item.body}
                onChange={e => onChange({ ...item, body: e.target.value })} />
            </div>
          ),
          { heading: '', headingHighlight: '', body: '' },
        )}
      </Section>

      {/* ── Pull Quote ── */}
      <Section title="Pull Quote" description="The full-width quote section on the brand-colour background.">
        <Field label="Line 1 (normal colour)">
          <TextInput value={data.pullQuoteLine1} onChange={e => set('pullQuoteLine1', e.target.value)} />
        </Field>
        <Field label="Line 2 (normal colour)">
          <TextInput value={data.pullQuoteLine2} onChange={e => set('pullQuoteLine2', e.target.value)} />
        </Field>
        <Field label="Line 3 (amber colour)">
          <TextInput value={data.pullQuoteLine3} onChange={e => set('pullQuoteLine3', e.target.value)} />
        </Field>
        <Field label="Attribution">
          <TextInput value={data.pullQuoteAttribution} onChange={e => set('pullQuoteAttribution', e.target.value)}
            placeholder="e.g. Deepak Maru, Founder & Managing Partner" />
        </Field>
      </Section>

      {/* ── Core Values ── */}
      <Section title="Core Values" description="Four poster-image cards. Numbers are assigned automatically (01–04).">
        {listOf<AboutCoreValue>(
          'coreValues', data.coreValues,
          (item, i, onChange, onRemove) => (
            <div className="p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <TextInput placeholder="Value title (e.g. Absolute Integrity)" value={item.title}
                  onChange={e => onChange({ ...item, title: e.target.value })} />
                <DangerButton type="button" onClick={onRemove}><Trash2 size={13} /></DangerButton>
              </div>
              <ImageUploader label="Background image" value={item.img} onChange={url => onChange({ ...item, img: url })} section="about" hint="Portrait, min 600 × 380 px — shown as card background" />
            </div>
          ),
          { title: '', img: '' },
          (item) => [item.img],
        )}
      </Section>

      {/* ── Journey Milestones ── */}
      <Section title="Journey Timeline" description="The four milestone nodes on the horizontal timeline.">
        {listOf<AboutMilestone>(
          'journeyMilestones', data.journeyMilestones,
          (item, _i, onChange, onRemove) => (
            <div className="p-4 rounded-xl border border-gray-100 space-y-2">
              <div className="flex gap-2">
                <TextInput placeholder="Year (e.g. 2003)" value={item.year} className="w-24"
                  onChange={e => onChange({ ...item, year: e.target.value })} />
                <TextInput placeholder="Event label (e.g. Founded)" value={item.event}
                  onChange={e => onChange({ ...item, event: e.target.value })} />
                <DangerButton type="button" onClick={onRemove}><Trash2 size={13} /></DangerButton>
              </div>
              <TextArea rows={2} placeholder="Description paragraph" value={item.description}
                onChange={e => onChange({ ...item, description: e.target.value })} />
              <ImageUploader label="Milestone image" value={item.img} onChange={url => onChange({ ...item, img: url })} section="about" hint="Landscape 16:9, min 800 × 176 px — wide horizontal strip on the timeline" />
            </div>
          ),
          { year: '', event: '', img: '', description: '' },
          (item) => [item.img],
        )}
      </Section>

      {/* ── Why Choose Us ── */}
      <Section title="Why Choose Us — Checklist" description="The five bullet points on the right side of the 'What sets us apart' section.">
        {listOf<AboutWhyItem>(
          'whyChooseItems', data.whyChooseItems,
          (item, _i, onChange, onRemove) => (
            <div className="p-3 rounded-xl border border-gray-100 space-y-2">
              <div className="flex gap-2">
                <TextInput placeholder="Main point (bold)" value={item.point}
                  onChange={e => onChange({ ...item, point: e.target.value })} />
                <DangerButton type="button" onClick={onRemove}><Trash2 size={13} /></DangerButton>
              </div>
              <TextArea rows={2} placeholder="Supporting detail (smaller text)" value={item.sub}
                onChange={e => onChange({ ...item, sub: e.target.value })} />
            </div>
          ),
          { point: '', sub: '' },
        )}
      </Section>

      {/* ── Team Members ── */}
      <Section title="Team Members" description="The photo cards in the 'Meet the Experts' section.">
        <Field label="Section heading">
          <TextInput value={data.teamHeading} onChange={e => set('teamHeading', e.target.value)} placeholder="Meet the Experts Behind Your Success" />
        </Field>
        <Field label="Section subtext">
          <TextArea rows={2} value={data.teamSubtext} onChange={e => set('teamSubtext', e.target.value)} />
        </Field>
        {listOf<AboutTeamMember>(
          'teamMembers', data.teamMembers,
          (item, _i, onChange, onRemove) => (
            <div className="p-4 rounded-xl border border-gray-100 space-y-2">
              <div className="flex gap-2">
                <TextInput placeholder="Full name" value={item.name}
                  onChange={e => onChange({ ...item, name: e.target.value })} />
                <DangerButton type="button" onClick={onRemove}><Trash2 size={13} /></DangerButton>
              </div>
              <TextInput placeholder="Qualifications (e.g. B.Com (Hons), LL.B)" value={item.qualification}
                onChange={e => onChange({ ...item, qualification: e.target.value })} />
              <TextInput placeholder="Role / title" value={item.role}
                onChange={e => onChange({ ...item, role: e.target.value })} />
              <ImageUploader label="Photo" value={item.img} onChange={url => onChange({ ...item, img: url })} section="team" hint="Portrait 5:4, min 400 × 320 px — face centred, cropped to fill the card" />
            </div>
          ),
          { name: '', qualification: '', role: '', img: '' },
          (item) => [item.img],
        )}
      </Section>

      {/* ── Hero Right-Panel Image ── */}
      <Section title="Hero — Right Panel Image" description="Background image shown in the hero right panel when no video is set. Leave blank to use the built-in default.">
        <ImageUploader label="Hero background image" value={data.heroImageUrl} onChange={v => set('heroImageUrl', v)} section="about" hint="Landscape or portrait, min 800 px wide" />
      </Section>

      {/* ── Our Approach ── */}
      <Section title="Our Approach Section" description="The numbered step flow showing how MCS works.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Section label (small caps)">
            <TextInput value={data.approachLabel} onChange={e => set('approachLabel', e.target.value)} placeholder="How We Work" />
          </Field>
          <Field label="Section heading">
            <TextInput value={data.approachHeading} onChange={e => set('approachHeading', e.target.value)} placeholder="Our Approach" />
          </Field>
        </div>
        <Field label="Description paragraph below the steps">
          <TextArea rows={2} value={data.approachDescription} onChange={e => set('approachDescription', e.target.value)} />
        </Field>
        <Field label="Steps (each becomes a numbered node)">
          <div className="space-y-2">
            {(data.approachSteps ?? []).map((step, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <TextInput value={step} onChange={e => { const n = [...(data.approachSteps ?? [])]; n[i] = e.target.value; set('approachSteps', n); }} placeholder="e.g. Understand" />
                <DangerButton type="button" onClick={() => set('approachSteps', (data.approachSteps ?? []).filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => set('approachSteps', [...(data.approachSteps ?? []), ''])}>
              <Plus size={13} /> Add step
            </SecondaryButton>
          </div>
        </Field>
      </Section>

      {/* ── Why MCS ── */}
      <Section title="Why MCS Section" description="The checklist section with the large image and floating stat badges.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Section label">
            <TextInput value={data.whyMcsLabel} onChange={e => set('whyMcsLabel', e.target.value)} placeholder="Why MCS" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Heading part 1">
            <TextInput value={data.whyMcsHeading} onChange={e => set('whyMcsHeading', e.target.value)} placeholder="Experience." />
          </Field>
          <Field label="Heading highlight (brand colour)">
            <TextInput value={data.whyMcsHeadingHighlight} onChange={e => set('whyMcsHeadingHighlight', e.target.value)} placeholder="Interpretation." />
          </Field>
          <Field label="Heading part 3">
            <TextInput value={data.whyMcsHeadingEnd} onChange={e => set('whyMcsHeadingEnd', e.target.value)} placeholder="Execution." />
          </Field>
        </div>
        <ImageUploader label="Section image (left panel)" value={data.whyMcsImageUrl} onChange={v => set('whyMcsImageUrl', v)} section="about" hint="Portrait, min 600 × 900 px. Leave blank to use the hero image." />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl border border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: PP }}>Amber badge (bottom-right)</p>
            <div className="flex gap-2">
              <TextInput placeholder="Value (e.g. 98%)" value={data.whyMcsBadge1Value} onChange={e => set('whyMcsBadge1Value', e.target.value)} style={{ width: '90px' }} />
              <TextInput placeholder="Label (e.g. Client Retention)" value={data.whyMcsBadge1Label} onChange={e => set('whyMcsBadge1Label', e.target.value)} />
            </div>
          </div>
          <div className="p-3 rounded-xl border border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: PP }}>Dark badge (top-left)</p>
            <div className="flex gap-2">
              <TextInput placeholder="Value (e.g. 500+)" value={data.whyMcsBadge2Value} onChange={e => set('whyMcsBadge2Value', e.target.value)} style={{ width: '90px' }} />
              <TextInput placeholder="Label (e.g. Clients Served)" value={data.whyMcsBadge2Label} onChange={e => set('whyMcsBadge2Label', e.target.value)} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Journey Section ── */}
      <Section title="Journey Section — Label & Heading" description="The label and headline above the timeline. Edit milestones in the Journey Timeline section above.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Label (amber caps)">
            <TextInput value={data.journeyLabel} onChange={e => set('journeyLabel', e.target.value)} placeholder="Our Journey" />
          </Field>
          <Field label="Heading">
            <TextInput value={data.journeyHeading} onChange={e => set('journeyHeading', e.target.value)} placeholder="Three decades of building India's compliance backbone" />
          </Field>
        </div>
      </Section>

      {/* ── Story Bento Est. Year ── */}
      <Section title="Story Bento — Founded Year" description="The large 'Est. XXXX' overlay shown on the left image panel.">
        <Field label="Year (e.g. 1979)">
          <TextInput value={data.estYear} onChange={e => set('estYear', e.target.value)} placeholder="1979" style={{ maxWidth: '140px' }} />
        </Field>
      </Section>

      {/* ── Management Visibility ── */}
      <Section title="Management Visibility Section" description="The dark band with 5 numbered question cards.">
        <Field label="Section label (amber caps)">
          <TextInput value={data.mgmtLabel} onChange={e => set('mgmtLabel', e.target.value)} placeholder="Management Visibility" />
        </Field>
        <Field label="Section heading">
          <TextArea rows={2} value={data.mgmtHeading} onChange={e => set('mgmtHeading', e.target.value)} />
        </Field>
        <Field label="Questions (each becomes a numbered card)">
          <div className="space-y-2">
            {(data.mgmtQuestions ?? []).map((q, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <TextInput value={q} onChange={e => { const n = [...(data.mgmtQuestions ?? [])]; n[i] = e.target.value; set('mgmtQuestions', n); }} placeholder="e.g. Where are we compliant?" />
                <DangerButton type="button" onClick={() => set('mgmtQuestions', (data.mgmtQuestions ?? []).filter((_, j) => j !== i))}><Trash2 size={13} /></DangerButton>
              </div>
            ))}
            <SecondaryButton type="button" onClick={() => set('mgmtQuestions', [...(data.mgmtQuestions ?? []), ''])}>
              <Plus size={13} /> Add question
            </SecondaryButton>
          </div>
        </Field>
      </Section>

      {/* ── Video CTA ── */}
      <Section title="Video CTA Section (bottom of page)" description="The full-width video section at the bottom with the two call-to-action buttons.">
        <ImageUploader label="Background video" value={data.ctaVideoUrl} onChange={v => set('ctaVideoUrl', v)} accept="video/*" section="about" hint="Leave blank to keep the default background video." />
        <Field label="Eyebrow label (small amber caps)">
          <TextInput value={data.ctaLabel} onChange={e => set('ctaLabel', e.target.value)} placeholder="Ready to Get Compliant?" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Headline line 1 (white)">
            <TextInput value={data.ctaHeadingLine1} onChange={e => set('ctaHeadingLine1', e.target.value)} placeholder="Let's build your compliance" />
          </Field>
          <Field label="Headline line 2 (amber)">
            <TextInput value={data.ctaHeadingLine2} onChange={e => set('ctaHeadingLine2', e.target.value)} placeholder="framework together" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Button 1 text (links to /contact)">
            <TextInput value={data.ctaButton1Text} onChange={e => set('ctaButton1Text', e.target.value)} placeholder="Schedule a Consultation" />
          </Field>
          <Field label="Button 2 text (links to /careers)">
            <TextInput value={data.ctaButton2Text} onChange={e => set('ctaButton2Text', e.target.value)} placeholder="Join Our Team" />
          </Field>
        </div>
      </Section>
    </div>
  );
}
