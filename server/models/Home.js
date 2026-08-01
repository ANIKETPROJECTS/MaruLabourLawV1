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

  heroLine1: String,
  heroPhrases: [String],
  heroLine2: String,
  heroDescription: String,
  heroVideoUrl: String,
  heroImage1Url: String,
  heroImage2Url: String,
  ctaPrimaryText: String,
  ctaSecondaryText: String,

  oneStopLabel: String,
  oneStopTitle: String,
  oneStopBody: String,
  oneStopCards: [OneStopCard],

  whyUsLogoUrl: String,
  whyUsHeading: String,
  whyUsBody: String,
  whyUsItems: [WhyUsItem],
  whyUsVideoUrl: String,
  whyUsImage1Url: String,
  whyUsImage2Url: String,

  servicesPreviewLabel: String,
  servicesPreviewTitle: String,
  servicesPreviewDescription: String,

  testimonialsHeading: String,
  testimonials: [Testimonial],

  stats: [StatItem],

  // Hero slides — each slide pairs a headline with an image
  heroSlides: [{
    headline: String,
    headlineAccent: String,
    imageUrl: String,
    _id: false,
  }],

  // Which services appear on the homepage, in what order (array of slugs)
  featuredServiceSlugs: { type: [String], default: [] },

  // Latest Insights cards shown on the homepage
  latestInsights: [{
    category: String,
    title: String,
    desc: String,
    img: String,
    date: String,
    articleUrl: String,
    _id: false,
  }],
}, { timestamps: true });

export default mongoose.models.Home || mongoose.model('Home', HomeSchema);
