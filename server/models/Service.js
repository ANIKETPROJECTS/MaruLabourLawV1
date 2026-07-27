import mongoose from 'mongoose';

const Deliverable = new mongoose.Schema({
  title: String,
  desc: String,
  slug: String,
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true },
  img: String,
  desc: String,
  // Parent services have no parentSlug. Child services link back to a parent.
  parentSlug: { type: String, trim: true, index: true },

  // Detail-page fields (all optional; ServiceDetail falls back gracefully)
  headline: String,
  subhead: String,
  intro: String,
  body: String,
  deliverables: [Deliverable],

  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
