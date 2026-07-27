import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  singleton: { type: String, default: 'contact', unique: true },

  // Hero
  heroEyebrow: String,
  heroHeading:  String,
  heroSubtext:  String,

  // Form card
  formTitle:   String,
  formSubtext: String,

  // Quick-strip + contact details
  phone1: String,
  phone2: String,
  whatsapp1: String,
  whatsapp2: String,
  phone3: String,
  email1: String,
  email2: String,
  website: String,
  partner1Name: String,
  partner1Role: String,
  partner1Phone: String,
  partner1Email: String,
  partner2Name: String,
  partner2Role: String,
  partner2Phone: String,
  partner2Email: String,
  addressLine1: String,
  addressLine2: String,
  addressLine3: String,
  hoursWeekdays: String,
  hoursWeekend:  String,

  // Service dropdown options on the enquiry form
  serviceOptions: [String],

  // Google Maps embed URL
  mapEmbedUrl: String,
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
