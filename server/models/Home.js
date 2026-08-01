import mongoose from 'mongoose';

const WhyUsItem = new mongoose.Schema({
  title: String,
  desc: String,
}, { _id: false });

const Testimonial = new mongoose.Schema({
  text: String,
  author: String,
  role: String,
}, { _id: false });

const StatItem = new mongoose.Schema({
  target: Number,
  decimals: { type: Number, default: 0 },
  suffix: String,
  label: String,
}, { _id: false });

const OneStopCard = new mongoose.Schema({
  title: String,
  desc: String,
  imgUrl: String,
}, { _id: false });

const HomeSchema = new mongoose.Schema({
  singleton: { type: String, default: 'home', unique: true },

  // ── Hero ──────────────────────────────────────────────
  heroLine1: String,        // legacy (kept for compat)
  heroLine2: String,        // legacy (kept for compat)
  heroPhrases: [String],    // typewriter phrases
  heroCategories: [String], // pipe-separated strip under brand name
  heroDescription: String,
  heroVideoUrl: String,
  heroImage1Url: String,
  heroImage2Url: String,
  ctaPrimaryText: String,
  ctaSecondaryText: String,

  // Hero slides — headline + accent + image cycling together
  heroSlides: [{
    headline: String,
    headlineAccent: String,
    imageUrl: String,
    _id: false,
  }],

  // Credibility stats card (overlapping bottom of hero)
  heroStats: [{
    target: Number,
    decimals: { type: Number, default: 0 },
    suffix: String,
    label: String,
    _id: false,
  }],

  // ── Core Capabilities (dark section) ──────────────────
  oneStopLabel: String,
  oneStopTitle: String,
  oneStopBody: String,
  oneStopCards: [OneStopCard],

  // ── Labour Codes Callout ───────────────────────────────
  labourCodesCalloutHeading: String,
  labourCodesCalloutBody: String,
  labourCodesCalloutCta: String,

  // ── Why Choose Us ─────────────────────────────────────
  whyUsLogoUrl: String,
  whyUsHeading: String,
  whyUsBody: String,
  whyUsItems: [WhyUsItem],
  whyUsVideoUrl: String,
  whyUsImage1Url: String,
  whyUsImage2Url: String,

  // ── Services Preview ──────────────────────────────────
  servicesPreviewLabel: String,
  servicesPreviewTitle: String,
  servicesPreviewDescription: String,
  featuredServiceSlugs: { type: [String], default: [] },

  // ── Client Logos ──────────────────────────────────────
  clientsLabel: String,

  // ── Testimonials ──────────────────────────────────────
  testimonialsHeading: String,
  testimonials: [Testimonial],
  stats: [StatItem],   // count-up bar inside testimonials section

  // ── Latest Insights ───────────────────────────────────
  insightsLabel: String,
  insightsHeading: String,
  latestInsights: [{
    category: String,
    title: String,
    desc: String,
    img: String,
    date: String,
    articleUrl: String,
    _id: false,
  }],

  // ── CTA Banner ────────────────────────────────────────
  ctaBannerHeading: String,
  ctaBannerBody: String,
  ctaBannerButtonText: String,
  ctaBannerImageUrl: String,

}, { timestamps: true });

export default mongoose.models.Home || mongoose.model('Home', HomeSchema);
