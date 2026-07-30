import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
}, { _id: false });

const KnowledgeCentreSchema = new mongoose.Schema({
  singleton: { type: String, default: 'knowledge-centre', unique: true },

  // Hero
  heroEyebrow:  { type: String, default: 'Compliance Knowledge That Helps You Act' },
  heroHeading:  { type: String, default: 'MCS Knowledge Centre' },
  heroSubtext:  { type: String, default: 'A practical resource for employers, HR professionals, payroll teams and management — staying current with India\'s evolving labour and compliance framework.' },
  heroBgType:   { type: String, enum: ['video', 'image', 'color'], default: 'color' },
  heroVideoUrl: { type: String, default: '' },
  heroImageUrl: { type: String, default: '' },

  // Section intro text
  introText: { type: String, default: '' },

  // FAQ section
  faqTitle:   { type: String, default: 'Frequently Asked Questions' },
  faqSubtext: { type: String, default: 'Common questions from employers and HR professionals about India\'s Labour Codes and MCS services.' },
  faqs: { type: [FAQSchema], default: [] },
}, { timestamps: true });

export default mongoose.models.KnowledgeCentre
  || mongoose.model('KnowledgeCentre', KnowledgeCentreSchema);
