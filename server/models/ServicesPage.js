import mongoose from 'mongoose';

const InsightCardSchema = new mongoose.Schema({
  category: { type: String, default: '' },
  title:    { type: String, default: '' },
  desc:     { type: String, default: '' },
  img:      { type: String, default: '' },
  date:     { type: String, default: '' },
  articleUrl: { type: String, default: '' },
}, { _id: false });

const ServicesPageSchema = new mongoose.Schema({
  singleton: { type: String, default: 'services-page', unique: true },

  // ── Services listing hero ──────────────────────────────────────────────────
  heroVideoUrl: { type: String, default: '/assets/services-hero.mp4' },
  heroTitle:    { type: String, default: 'Our Consultancy Services' },
  heroSubtitle: { type: String, default: 'Precision-crafted compliance solutions that protect your workforce, your business, and your future.' },

  // ── Services listing CTA section ──────────────────────────────────────────
  ctaLabel:      { type: String, default: 'Get Started' },
  ctaHeading:    { type: String, default: 'Need a custom compliance structure?' },
  ctaBody:       { type: String, default: 'We understand every business has unique operational needs. Contact us for a bespoke audit and advisory package tailored to your industry.' },
  ctaButtonText: { type: String, default: 'Request Custom Consultation' },

  // ── ServiceDetail sidebar ─────────────────────────────────────────────────
  sidebarCtaTag:     { type: String, default: 'Get Expert Advice' },
  sidebarCtaHeading: { type: String, default: 'Ready to secure your compliance?' },
  sidebarCtaBody:    { type: String, default: 'Speak directly with our legal experts to discuss how this service applies to your specific industry and workforce size.' },
  sidebarCtaButton1: { type: String, default: 'Request Proposal' },
  sidebarCtaButton2: { type: String, default: 'Call Now' },
  sidebarPhone:      { type: String, default: '+919876543210' },

  // ── ServiceDetail latest insights ─────────────────────────────────────────
  insightsLabel:   { type: String, default: 'Latest Insights' },
  insightsHeading: { type: String, default: 'Stay informed with expert guidance' },
  latestInsights:  { type: [InsightCardSchema], default: [] },

}, { timestamps: true });

export default mongoose.models.ServicesPage || mongoose.model('ServicesPage', ServicesPageSchema);
