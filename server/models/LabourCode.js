import mongoose from 'mongoose';

const LabourCodeSchema = new mongoose.Schema({
  slug:          { type: String, required: true, unique: true, trim: true },
  codeNumber:    String,   // "01", "02", "03", "04"
  title:         { type: String, required: true },
  subtitle:      String,   // Short paragraph shown on the listing card
  intro:         String,   // Opening line on the detail page hero
  body:          String,   // Full body (double-newline = paragraph break)
  coveringAreas: [String], // Bullet-point checklist items
  ctaLabel:      String,   // e.g. "Request a Wage Structure Review"
  img:           String,   // Cloudinary URL
  order:         { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.LabourCode || mongoose.model('LabourCode', LabourCodeSchema);
