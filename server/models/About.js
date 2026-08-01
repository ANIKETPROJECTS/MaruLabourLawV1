import mongoose from 'mongoose';

const StatItem   = new mongoose.Schema({ value: String, label: String }, { _id: false });
const StorySlide = new mongoose.Schema({ heading: String, headingHighlight: String, body: String }, { _id: false });
const CoreValue  = new mongoose.Schema({ title: String, img: String }, { _id: false });
const Milestone  = new mongoose.Schema({ year: String, event: String, img: String, description: String }, { _id: false });
const WhyItem    = new mongoose.Schema({ point: String, sub: String }, { _id: false });
const TeamMember = new mongoose.Schema({ name: String, qualification: String, role: String, img: String }, { _id: false });

const AboutSchema = new mongoose.Schema({
  singleton: { type: String, default: 'about', unique: true },

  heroStats:      [StatItem],
  marqueeServices: [String],
  storySlides:    [StorySlide],

  pullQuoteLine1:        String,
  pullQuoteLine2:        String,
  pullQuoteLine3:        String,   // amber-coloured line
  pullQuoteAttribution:  String,

  coreValues:         [CoreValue],
  journeyMilestones:  [Milestone],
  whyChooseItems:     [WhyItem],
  teamMembers:        [TeamMember],

  // Hero section
  heroEyebrow:          String,
  heroHeadlineTop:      String,
  heroHeadlineHighlight:String,
  heroHeadlineBottom:   String,
  heroSubtext:          String,

  // Hero right-panel video (falls back to bundled hero video when blank)
  heroVideoUrl: { type: String, default: '' },

  // Story-bento video panel
  videoUrl: { type: String, default: '' },

  // Rotating images in the "Our Story" bento's large left panel
  storyImages: [String],

  // Hero right-panel background image (shown when no video)
  heroImageUrl: { type: String, default: '' },

  // Story bento — "Est." year overlay
  estYear: { type: String, default: '1979' },

  // Our Approach section
  approachLabel:       { type: String, default: 'How We Work' },
  approachHeading:     { type: String, default: 'Our Approach' },
  approachDescription: { type: String, default: '' },
  approachSteps:       [String],

  // Why MCS section
  whyMcsLabel:            { type: String, default: 'Why MCS' },
  whyMcsHeading:          { type: String, default: 'Experience.' },
  whyMcsHeadingHighlight: { type: String, default: 'Interpretation.' },
  whyMcsHeadingEnd:       { type: String, default: 'Execution.' },
  whyMcsBadge1Value:      { type: String, default: '98%' },
  whyMcsBadge1Label:      { type: String, default: 'Client Retention' },
  whyMcsBadge2Value:      { type: String, default: '500+' },
  whyMcsBadge2Label:      { type: String, default: 'Clients Served' },
  whyMcsImageUrl:         { type: String, default: '' },

  // Journey section
  journeyLabel:   { type: String, default: 'Our Journey' },
  journeyHeading: { type: String, default: "Three decades of building India's compliance backbone" },

  // Management Visibility section
  mgmtLabel:     { type: String, default: 'Management Visibility' },
  mgmtHeading:   { type: String, default: 'Our objective is to help management answer five questions clearly.' },
  mgmtQuestions: [String],

  // Team section
  teamHeading: { type: String, default: 'Meet the Experts Behind Your Success' },
  teamSubtext: { type: String, default: '' },

  // Video CTA section
  ctaLabel:        { type: String, default: 'Ready to Get Compliant?' },
  ctaHeadingLine1: { type: String, default: "Let's build your compliance" },
  ctaHeadingLine2: { type: String, default: 'framework together' },
  ctaVideoUrl:     { type: String, default: '' },
  ctaButton1Text:  { type: String, default: 'Schedule a Consultation' },
  ctaButton2Text:  { type: String, default: 'Join Our Team' },
}, { timestamps: true });

export default mongoose.models.About || mongoose.model('About', AboutSchema);
