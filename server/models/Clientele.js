import mongoose from 'mongoose';

const StatSchema        = new mongoose.Schema({ target: Number, decimals: { type: Number, default: 0 }, suffix: String, label: String }, { _id: false });
const IndustrySchema    = new mongoose.Schema({ name: String, count: String, image: String }, { _id: false });
const TestimonialSchema = new mongoose.Schema({ text: String, author: String, role: String }, { _id: false });
const PortfolioClientSchema  = new mongoose.Schema({ name: String, logoUrl: { type: String, default: '' } }, { _id: false });
const PortfolioSectorSchema  = new mongoose.Schema({ sector: String, clients: [PortfolioClientSchema] }, { _id: false });

const TestimonialsStatSchema = new mongoose.Schema({
  target: { type: Number, default: 0 },
  decimals: { type: Number, default: 0 },
  suffix: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false });

const ClienteleSchema = new mongoose.Schema({
  singleton:    { type: String, default: 'clientele', unique: true },
  stats:        [StatSchema],
  industries:   [IndustrySchema],
  testimonials: [TestimonialSchema],

  // Hero
  heroEyebrow: String,
  heroHeadline: String,
  heroSubtext:  String,

  // Industries section labels
  sectionIndustryLabel:   { type: String, default: 'Industry Spread' },
  sectionIndustryHeading: { type: String, default: 'Sectors We Serve' },
  sectionIndustrySubtext: { type: String, default: 'Our compliance expertise spans every major sector of the Indian economy — from factory floors to fintech offices.' },

  // Portfolio section labels
  sectionPortfolioLabel:   { type: String, default: 'Our Portfolio' },
  sectionPortfolioHeading: { type: String, default: "Companies We've Served" },
  sectionPortfolioSubtext: { type: String, default: 'From nimble startups to Fortune 500 conglomerates — our expertise spans every scale of Indian industry.' },

  // Marquee strip
  marqueeText: { type: String, default: 'Serving 500+ Corporations Across India' },

  // Testimonials section
  testimonialsHeading: { type: String, default: 'Trusted by Industry Leaders' },
  testimonialsStats: { type: [TestimonialsStatSchema], default: [
    { target: 500, decimals: 0, suffix: '+',  label: 'Clients Served' },
    { target: 4.9, decimals: 1, suffix: '★', label: 'Average Rating' },
    { target: 15,  decimals: 0, suffix: '+',  label: 'Years of Expertise' },
    { target: 98,  decimals: 0, suffix: '%',  label: 'Retention Rate' },
  ]},

  // CTA section
  ctaLabel:      { type: String, default: 'Join Our Clientele' },
  ctaHeading:    { type: String, default: 'Join Industry Leaders Who Trust Maru Consultancy' },
  ctaBody:       { type: String, default: "Let's discuss how we can support your compliance and HR requirements across every state you operate in." },
  ctaButtonText: { type: String, default: 'Discuss Your Requirements' },

  // Our Portfolio (sector tabs + client logos)
  portfolio: [PortfolioSectorSchema],
}, { timestamps: true });

export default mongoose.models.Clientele || mongoose.model('Clientele', ClienteleSchema);
