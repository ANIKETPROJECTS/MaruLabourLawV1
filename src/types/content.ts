export type WhyUsItem = { title: string; desc: string };
export type Testimonial = { text: string; author: string; role: string };
export type StatItem = { target: number; decimals: number; suffix: string; label: string };
export type OneStopCard = { title: string; desc: string; imgUrl?: string };

export type ResourceSection = { heading: string; body: string };

export type ResourceItem = {
  _id: string;
  tab: 'articles' | 'downloads';
  title: string;
  category?: string;
  order: number;
  // article fields
  slug?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  author?: string;
  img?: string;
  sections?: ResourceSection[];
  keyTakeaways?: string[];
  // download fields
  desc?: string;
  size?: string;
  format?: string;
  downloadType?: 'Download' | 'Resource';
  fileUrl?: string;
};

export type InsightCard = {
  category: string;
  title: string;
  desc: string;
  img: string;
  date: string;
  articleUrl: string;
};

export type HeroSlide = { headline: string; headlineAccent: string; imageUrl: string };

export type HomeContent = {
  _id?: string;
  // Hero
  heroLine1: string;
  heroLine2: string;
  heroPhrases: string[];
  heroCategories: string[];
  heroSlides: HeroSlide[];
  heroStats: StatItem[];
  heroDescription: string;
  heroVideoUrl: string;
  heroImage1Url: string;
  heroImage2Url: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  // Core Capabilities
  oneStopLabel: string;
  oneStopTitle: string;
  oneStopBody: string;
  oneStopCards: OneStopCard[];
  // Labour Codes Callout
  labourCodesCalloutHeading: string;
  labourCodesCalloutBody: string;
  labourCodesCalloutCta: string;
  // Why Choose Us
  whyUsLogoUrl: string;
  whyUsHeading: string;
  whyUsBody: string;
  whyUsItems: WhyUsItem[];
  whyUsVideoUrl: string;
  whyUsImage1Url: string;
  whyUsImage2Url: string;
  // Services Preview
  servicesPreviewLabel: string;
  servicesPreviewTitle: string;
  servicesPreviewDescription: string;
  featuredServiceSlugs: string[];
  // Client logos
  clientsLabel: string;
  // Testimonials
  testimonialsHeading: string;
  testimonials: Testimonial[];
  stats: StatItem[];
  // Latest Insights
  insightsLabel: string;
  insightsHeading: string;
  latestInsights: InsightCard[];
  // CTA Banner
  ctaBannerHeading: string;
  ctaBannerBody: string;
  ctaBannerButtonText: string;
  ctaBannerImageUrl: string;
};

export type Deliverable = { title: string; desc: string; slug?: string };

export type ServiceContent = {
  _id: string;
  slug: string;
  title: string;
  img: string;
  desc: string;
  parentSlug?: string;
  headline?: string;
  subhead?: string;
  intro?: string;
  body?: string;
  deliverables?: Deliverable[];
  order?: number;
};

export type AboutHeroStat     = { value: string; label: string };
export type AboutStorySlide   = { heading: string; headingHighlight: string; body: string };
export type AboutCoreValue    = { title: string; img: string };
export type AboutMilestone    = { year: string; event: string; img: string; description: string };
export type AboutWhyItem      = { point: string; sub: string };
export type AboutTeamMember   = { name: string; qualification: string; role: string; img: string };

export type AboutContent = {
  _id?: string;
  // Hero
  heroEyebrow:           string;
  heroHeadlineTop:       string;
  heroHeadlineHighlight: string;
  heroHeadlineBottom:    string;
  heroSubtext:           string;
  // Hero right-panel video (falls back to bundled hero video when blank)
  heroVideoUrl:          string;
  // Bento video
  videoUrl:              string;
  // Rotating images in the "Our Story" bento's large left panel
  storyImages:          string[];
  // Below-hero content
  heroStats:            AboutHeroStat[];
  marqueeServices:      string[];
  storySlides:          AboutStorySlide[];
  pullQuoteLine1:       string;
  pullQuoteLine2:       string;
  pullQuoteLine3:       string;
  pullQuoteAttribution: string;
  coreValues:           AboutCoreValue[];
  journeyMilestones:    AboutMilestone[];
  whyChooseItems:       AboutWhyItem[];
  teamMembers:          AboutTeamMember[];

  // Hero right-panel image
  heroImageUrl:         string;

  // Story bento
  estYear:              string;

  // Our Approach
  approachLabel:        string;
  approachHeading:      string;
  approachDescription:  string;
  approachSteps:        string[];

  // Why MCS
  whyMcsLabel:            string;
  whyMcsHeading:          string;
  whyMcsHeadingHighlight: string;
  whyMcsHeadingEnd:       string;
  whyMcsBadge1Value:      string;
  whyMcsBadge1Label:      string;
  whyMcsBadge2Value:      string;
  whyMcsBadge2Label:      string;
  whyMcsImageUrl:         string;

  // Journey
  journeyLabel:   string;
  journeyHeading: string;

  // Management Visibility
  mgmtLabel:     string;
  mgmtHeading:   string;
  mgmtQuestions: string[];

  // Team
  teamHeading: string;
  teamSubtext: string;

  // Video CTA
  ctaLabel:        string;
  ctaHeadingLine1: string;
  ctaHeadingLine2: string;
  ctaVideoUrl:     string;
  ctaButton1Text:  string;
  ctaButton2Text:  string;
};

export type ClienteleStat        = { target: number; decimals: number; suffix: string; label: string };
export type ClienteleIndustry    = { name: string; count: string; image: string };
export type ClienteleTestimonial = { text: string; author: string; role: string };

export type PortfolioClient = { name: string; logoUrl: string };
export type PortfolioSector = { sector: string; clients: PortfolioClient[] };

export type ClienteleContent = {
  _id?: string;
  heroEyebrow:  string;
  heroHeadline: string;
  heroSubtext:  string;
  stats:        ClienteleStat[];
  industries:   ClienteleIndustry[];
  testimonials: ClienteleTestimonial[];
  portfolio:    PortfolioSector[];
};

export type ContactContent = {
  _id?: string;
  heroEyebrow:   string;
  heroHeading:   string;
  heroSubtext:   string;
  heroBgType:    'video' | 'image';
  heroVideoUrl:  string;
  heroImageUrl:  string;
  formTitle:     string;
  formSubtext:   string;
  // Telephone
  phone1:        string;
  phone2:        string;
  phone3:        string;
  // WhatsApp
  whatsapp1:     string;
  whatsapp2:     string;
  // Email
  email1:        string;
  email2:        string;
  // Website
  website:       string;
  // Partners
  partner1Name:  string;
  partner1Role:  string;
  partner1Phone: string;
  partner1Email: string;
  partner2Name:  string;
  partner2Role:  string;
  partner2Phone: string;
  partner2Email: string;
  // Address
  addressLine1:  string;
  addressLine2:  string;
  addressLine3:  string;
  hoursWeekdays: string;
  hoursWeekend:  string;
  serviceOptions: string[];
  mapEmbedUrl:   string;
};

export type CareersPageContent = {
  _id?: string;
  heroEyebrow:  string;
  heroHeading:  string;
  heroSubtext:  string;
  heroBgType:   'video' | 'image';
  heroVideoUrl: string;
  heroImageUrl: string;
};

export type ResourcesPageContent = {
  _id?: string;
  heroEyebrow:  string;
  heroHeading:  string;
  heroSubtext:  string;
  heroBgType:   'color' | 'image' | 'video';
  heroImageUrl: string;
  heroVideoUrl: string;
};

export type KnowledgeFAQ = { question: string; answer: string };

export const KNOWLEDGE_CATEGORIES = [
  { value: 'labour-codes',      label: 'Labour Codes Updates' },
  { value: 'compliance-alerts', label: 'Compliance Alerts' },
  { value: 'minimum-wages',     label: 'Minimum Wages' },
  { value: 'epfo-esic',         label: 'EPFO & ESIC Updates' },
  { value: 'compliance-guides', label: 'Compliance Guides' },
  { value: 'mcs-insights',      label: 'MCS Insights' },
  { value: 'downloads',         label: 'Downloads' },
] as const;

export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number]['value'];

export type KnowledgeArticleType = {
  _id: string;
  category: KnowledgeCategory;
  title: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  author?: string;
  img?: string;
  featured?: boolean;
  order?: number;
  sections?: ResourceSection[];
  keyTakeaways?: string[];
  fileUrl?: string;
  fileFormat?: string;
  fileSize?: string;
};

export type KnowledgeCentrePageContent = {
  _id?: string;
  heroEyebrow:  string;
  heroHeading:  string;
  heroSubtext:  string;
  heroBgType:   'video' | 'image' | 'color';
  heroVideoUrl: string;
  heroImageUrl: string;
  introText:    string;
  faqTitle:     string;
  faqSubtext:   string;
  faqs:         KnowledgeFAQ[];
};

export type LabourCodeContent = {
  _id: string;
  slug: string;
  codeNumber: string;
  title: string;
  subtitle?: string;
  intro?: string;
  body?: string;
  coveringAreas?: string[];
  ctaLabel?: string;
  img?: string;
  order?: number;
};

export type JobContent = {
  _id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  department: string;
  experience: string;
  category: 'internal' | 'client';
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  ctc: string;
  postedOn: string;
  order?: number;
};

export type FooterBottomLink = { label: string; href: string };

export type FooterContent = {
  _id?: string;
  tagline: string;
  whatsappUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  address: string;
  phone1: string;
  phone1Href: string;
  phone2: string;
  phone2Href: string;
  email: string;
  newsletterText: string;
  mapEmbedUrl: string;
  copyrightName: string;
  devByText: string;
  devByUrl: string;
  bottomLinks: FooterBottomLink[];
};
