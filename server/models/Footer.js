import mongoose from 'mongoose';

const BottomLinkSchema = new mongoose.Schema(
  { label: String, href: { type: String, default: '#' } },
  { _id: false }
);

const FooterSchema = new mongoose.Schema({
  singleton:      { type: String, default: 'footer', unique: true },
  // Brand column
  tagline:        String,
  // Social links (URLs only; icons are static assets)
  whatsappUrl:    String,
  instagramUrl:   String,
  linkedinUrl:    String,
  facebookUrl:    String,
  twitterUrl:     String,
  // Contact column
  address:        String,
  phone1:         String,
  phone1Href:     String,
  phone2:         String,
  phone2Href:     String,
  email:          String,
  // Newsletter column
  newsletterText: String,
  // Google Maps
  mapEmbedUrl:    String,
  // Bottom bar
  copyrightName:  String,
  devByText:      String,
  devByUrl:       String,
  bottomLinks:    { type: [BottomLinkSchema], default: [] },
}, { timestamps: true });

export default mongoose.models.Footer || mongoose.model('Footer', FooterSchema);
