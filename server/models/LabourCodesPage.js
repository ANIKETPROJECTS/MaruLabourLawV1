import mongoose from 'mongoose';

const LabourCodesPageSchema = new mongoose.Schema({
  singleton: { type: String, default: 'labour-codes-page', unique: true },

  // ── Listing page hero ────────────────────────────────────────────────────
  heroLabel:   { type: String, default: 'Labour Codes Advisory' },
  heroHeading: { type: String, default: "Navigating India's New Labour Law Framework" },
  heroSubtext: { type: String, default: 'India has consolidated 29 Central labour laws into four Labour Codes. MCS helps employers understand the business impact and implement compliant, workable processes.' },

  // ── Four-codes grid section ──────────────────────────────────────────────
  gridLabel:   { type: String, default: 'The four codes' },
  gridHeading: { type: String, default: 'From interpretation to implementation.' },
  gridSubtext: { type: String, default: 'Our Labour Codes readiness review can cover wage structures, payroll, social security, gratuity, bonus, appointment letters, HR policies, standing orders, contractor management, working conditions and related processes.' },

  // ── CTA strip ───────────────────────────────────────────────────────────
  ctaLabel:      { type: String, default: 'MCS Labour Codes Readiness Review' },
  ctaHeading:    { type: String, default: 'Is your organisation Labour Codes ready?' },
  ctaSteps:      { type: [String], default: ['Compliance Status', 'Gap Analysis', 'Risk Classification', 'Corrective Actions', 'Implementation Roadmap'] },
  ctaButtonText: { type: String, default: 'Request a Readiness Assessment' },

  // ── Disclaimer (shared by listing and detail) ───────────────────────────
  disclaimer: { type: String, default: 'The information on this page is for general informational purposes and is not a substitute for advice based on the facts of a specific matter. Requirements may vary by establishment, workforce, location and applicable Central and State provisions.' },

  // ── Detail page section labels ───────────────────────────────────────────
  detailBreadcrumb:      { type: String, default: 'Labour Codes Advisory' },
  detailAboutHeading:    { type: String, default: 'About This Code' },
  detailCoveringHeading: { type: String, default: 'What We Cover' },
  detailCoveringSubtext: { type: String, default: 'Key areas addressed under this Code.' },
  detailOtherCodes:      { type: String, default: 'Other Labour Codes' },
  detailAllCodes:        { type: String, default: 'All Four Labour Codes' },

  // ── Detail page sidebar ──────────────────────────────────────────────────
  sidebarTag:     { type: String, default: 'Get Expert Advice' },
  sidebarHeading: { type: String, default: 'Ready to assess your compliance?' },
  sidebarBody:    { type: String, default: 'Speak with our experts to understand how this Code impacts your organisation.' },
  sidebarPhone:   { type: String, default: '+919876543210' },
  sidebarCallText:{ type: String, default: 'Call Now' },

}, { timestamps: true });

export default mongoose.models.LabourCodesPage || mongoose.model('LabourCodesPage', LabourCodesPageSchema);
