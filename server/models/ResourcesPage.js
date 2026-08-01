import mongoose from 'mongoose';

const ResourcesPageSchema = new mongoose.Schema({
  singleton: { type: String, default: 'resources', unique: true },

  // Hero
  heroEyebrow: { type: String, default: 'Knowledge Hub' },
  heroHeading: { type: String, default: 'Insights, Blogs & Downloads' },
  heroSubtext: {
    type: String,
    default: 'Expert insights, regulatory updates, and practical compliance resources to keep your business protected.',
  },
  // 'color' (default solid brand background), 'image', or 'video'
  heroBgType: { type: String, enum: ['color', 'image', 'video'], default: 'color' },
  heroImageUrl: { type: String, default: '' },
  heroVideoUrl: { type: String, default: '' },

  // Downloads section
  downloadsLabel:   { type: String, default: 'Free Resources' },
  downloadsHeading: { type: String, default: 'Templates & Downloads' },
  downloadsSubtext: { type: String, default: 'Practical compliance templates, checklists, and reference documents — free to download.' },

  // Newsletter section
  newsletterLabel:       { type: String, default: 'Stay Updated' },
  newsletterHeading:     { type: String, default: 'Never miss a compliance update' },
  newsletterBody:        { type: String, default: 'Subscribe for critical regulatory alerts, new circulars, and expert analysis delivered directly to your inbox.' },
  newsletterButtonText:  { type: String, default: 'Subscribe' },
  newsletterPlaceholder: { type: String, default: 'Your business email' },
}, { timestamps: true });

export default mongoose.models.ResourcesPage || mongoose.model('ResourcesPage', ResourcesPageSchema);
