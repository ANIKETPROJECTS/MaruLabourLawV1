import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  heading: String,
  body:    String,
}, { _id: false });

const CATEGORIES = [
  'labour-codes',
  'compliance-alerts',
  'minimum-wages',
  'epfo-esic',
  'compliance-guides',
  'mcs-insights',
  'downloads',
];

const KnowledgeArticleSchema = new mongoose.Schema({
  category:  { type: String, enum: CATEGORIES, required: true },
  title:     { type: String, required: true },
  slug:      { type: String },
  excerpt:   { type: String, default: '' },
  date:      { type: String, default: '' },
  readTime:  { type: String, default: '' },
  author:    { type: String, default: 'MCS Team' },
  img:       { type: String, default: '' },
  featured:  { type: Boolean, default: false },
  order:     { type: Number, default: 0 },

  // Article body
  sections:      { type: [SectionSchema], default: [] },
  keyTakeaways:  { type: [String], default: [] },

  // Downloads
  fileUrl:      { type: String, default: '' },
  fileFormat:   { type: String, default: '' },
  fileSize:     { type: String, default: '' },
}, { timestamps: true });

KnowledgeArticleSchema.index({ slug: 1 }, { unique: true, sparse: true });

export default mongoose.models.KnowledgeArticle
  || mongoose.model('KnowledgeArticle', KnowledgeArticleSchema);
