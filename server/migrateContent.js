/**
 * Publishes the approved Website Content Master Document into the existing CMS.
 *
 * This migration is intentionally non-destructive: singleton page content is
 * updated, requested service slugs are upserted, and older CMS records are
 * preserved so an administrator can review or remove them from the panel.
 */
import { connectDB } from './db.js';
import Home from './models/Home.js';
import About from './models/About.js';
import Clientele from './models/Clientele.js';
import Contact from './models/Contact.js';
import ResourcesPage from './models/ResourcesPage.js';
import Service from './models/Service.js';

const serviceImage = {
  codes: '/assets/service-labour.png',
  audit: '/assets/service-audits.png',
  contract: '/assets/service-staffing.png',
  payroll: '/assets/service-payroll.png',
  relations: '/assets/service-legal.png',
  inspections: '/assets/service-legal.png',
  registrations: '/assets/service-licensing.png',
  manpower: '/assets/service-staffing.png',
  apprenticeship: '/assets/service-training.png',
  policies: '/assets/service-hr.png',
};

const services = [
  {
    slug: 'labour-codes-readiness',
    title: 'Labour Codes Advisory & Implementation',
    img: serviceImage.codes,
    desc: 'Assess the impact of the four Labour Codes on wages, payroll, social security, employment documentation, contractors and working conditions.',
    headline: 'Five Decades of Experience. A New Era of Labour Laws.',
    subhead: 'Labour Codes Advisory & Implementation',
    intro: 'MCS helps employers move from understanding the consolidated Labour Codes framework to implementing workable, compliant processes.',
    body: 'India has consolidated 29 Central labour laws into four Labour Codes covering wages, social security, industrial relations, and occupational safety, health and working conditions. Our readiness review examines the business impact and converts findings into a practical implementation roadmap.',
    deliverables: [
      { title: 'Compliance Status', desc: 'Review current wage, payroll, social-security, documentation and workforce processes.' },
      { title: 'Gap Analysis', desc: 'Identify gaps across policies, registers, contractors, employment classifications and records.' },
      { title: 'Risk Classification', desc: 'Translate observations into clear legal, operational and management priorities.' },
      { title: 'Corrective Actions', desc: 'Define practical actions for HR, payroll, finance, operations and compliance teams.' },
      { title: 'Implementation Roadmap', desc: 'Sequence changes with ownership, timelines and management visibility.' },
    ],
    order: 0,
  },
  {
    slug: 'labour-law-compliance',
    title: 'Labour Law & Statutory Compliance',
    img: '/assets/service-statutory.png',
    desc: 'Ongoing statutory compliance support across applicable Central and State labour requirements, records, returns and compliance calendars.',
    headline: 'Compliance Management That Goes Beyond Filing.',
    subhead: 'Labour Law & Statutory Compliance',
    intro: 'Accurate records, timely filings and management visibility across the employment compliance lifecycle.',
    body: 'MCS supports establishments with PF, ESI, Professional Tax, Labour Welfare Fund, bonus, gratuity, minimum wages, Shops & Establishments requirements, factory-related labour compliance, POSH support, registers, notices, returns and regulatory updates.',
    deliverables: [
      { title: 'Periodic Compliance', desc: 'Support for applicable monthly, quarterly and annual statutory requirements.' },
      { title: 'Registers and Records', desc: 'Inspection-ready registers, notices, abstracts and employment records.' },
      { title: 'Compliance Calendar', desc: 'Clear deadlines, ownership and management reporting.' },
      { title: 'Regulatory Updates', desc: 'Practical updates on important Central and State notifications.' },
    ],
    order: 1,
  },
  {
    slug: 'labour-law-audit-due-diligence',
    title: 'Labour Law Audit & Due Diligence',
    img: serviceImage.audit,
    desc: 'Structured labour-law audits and employment compliance due diligence to identify gaps, exposure and corrective action.',
    headline: 'Find the Gaps Before They Become Liabilities.',
    subhead: 'Labour Law Audit & Due Diligence',
    intro: 'MCS reviews the current statutory position and translates findings into actionable risk categories for management.',
    body: 'Audits can cover Labour Codes readiness, wage and payroll compliance, PF, ESI, PT, LWF, gratuity, bonus, employment documentation, contractors, registers, working hours, establishment-specific requirements, notices and historical non-compliance. For transactions and restructuring, our due diligence highlights workforce-related statutory exposure.',
    deliverables: [
      { title: 'Observation and Position', desc: 'Document the finding and the applicable legal or compliance position.' },
      { title: 'Risk Rating', desc: 'Prioritise observations by likelihood, impact and urgency.' },
      { title: 'Potential Exposure', desc: 'Explain the business and statutory implications for decision-makers.' },
      { title: 'Corrective Action', desc: 'Provide a prioritised remediation plan with practical next steps.' },
    ],
    order: 2,
  },
  {
    slug: 'contract-labour-principal-employer',
    title: 'Contract Labour & Principal Employer Compliance',
    img: serviceImage.contract,
    desc: 'Contractor governance, licensing, wage and social-security verification, monitoring and principal employer risk assessment.',
    headline: 'Control Contractor Risk Before It Becomes Principal Employer Risk.',
    subhead: 'Contract Labour & Principal Employer Compliance',
    intro: 'Build a structured contractor-governance framework from onboarding and documentation to periodic verification.',
    body: 'MCS assists organisations with contractor onboarding due diligence, registration and licensing advisory, core activity assessment, wage and social-security verification, vendor audits, monthly monitoring, register verification and corrective-action tracking.',
    deliverables: [
      { title: 'Contractor Due Diligence', desc: 'Review licences, registrations, workforce records and vendor documentation.' },
      { title: 'Monthly Monitoring', desc: 'Verify wage, PF, ESI and statutory records on a recurring basis.' },
      { title: 'Principal Employer Risk Review', desc: 'Identify gaps that may create exposure for the principal employer.' },
    ],
    order: 3,
  },
  {
    slug: 'payroll-wage-advisory',
    title: 'Payroll & Wage Advisory',
    img: serviceImage.payroll,
    desc: 'Salary and CTC structuring, Labour Codes wage-definition review, payroll processing, statutory deductions and F&F support.',
    headline: 'Accurate Payroll. Compliant Wage Structures.',
    subhead: 'Payroll & Wage Advisory',
    intro: 'Payroll processes aligned with employment, wage and social-security requirements.',
    body: 'MCS supports salary and CTC structuring, time and attendance inputs, leave inputs, payroll processing, statutory deductions, payslips, Full & Final Settlement, MIS reporting, reimbursement administration and payroll compliance audits.',
    deliverables: [
      { title: 'Wage Structure Review', desc: 'Review salary components against the applicable definition of wages.' },
      { title: 'Payroll Processing', desc: 'Coordinate payroll inputs, deductions, payslips and compliance outputs.' },
      { title: 'Full & Final Settlement', desc: 'Support accurate separation calculations and documentation.' },
      { title: 'Payroll Audit', desc: 'Test payroll records and processes for recurring compliance gaps.' },
    ],
    order: 4,
  },
  {
    slug: 'industrial-relations-employment-advisory',
    title: 'Industrial Relations & Employment Advisory',
    img: serviceImage.relations,
    desc: 'Practical advice on disciplinary matters, domestic enquiries, Standing Orders, disputes, retrenchment, trade unions and separation.',
    headline: 'Practical Advice for Complex Employment Matters.',
    subhead: 'Industrial Relations & Employment Advisory',
    intro: 'Balance statutory compliance, procedural fairness, employee relations and business continuity.',
    body: 'MCS advises on misconduct, show-cause notices, charge sheets, domestic enquiries, suspension, termination, retrenchment, workforce restructuring, industrial disputes, conciliation, trade-union matters, Standing Orders, grievances, fixed-term employment and separation processes.',
    deliverables: [
      { title: 'Disciplinary Processes', desc: 'Support show-cause notices, charge sheets, enquiries and outcomes.' },
      { title: 'Workforce Restructuring', desc: 'Advise on retrenchment, separation and continuity considerations.' },
      { title: 'Industrial Relations', desc: 'Assist with grievances, unions, Standing Orders and conciliation.' },
    ],
    order: 5,
  },
  {
    slug: 'inspections-notices-representation',
    title: 'Inspections, Notices & Representation',
    img: serviceImage.inspections,
    desc: 'Support for labour, EPFO and ESIC inspections, notices, hearings, submissions, corrective compliance and liaison.',
    headline: 'From Notice to Resolution.',
    subhead: 'Inspections, Notices & Representation',
    intro: 'Timely assessment, reliable records and carefully prepared responses for regulatory matters.',
    body: 'MCS assists with labour department inspections, EPFO and ESIC proceedings, notice review, document reconciliation, replies and submissions, hearing preparation, representation and post-inspection compliance strengthening.',
    deliverables: [
      { title: 'Notice Review', desc: 'Clarify observations, deadlines, documents and response strategy.' },
      { title: 'Submission Preparation', desc: 'Compile records and support drafting of replies and submissions.' },
      { title: 'Hearing Support', desc: 'Prepare management and records for applicable hearings and proceedings.' },
      { title: 'Corrective Compliance', desc: 'Track actions after inspection and strengthen future readiness.' },
    ],
    order: 6,
  },
  {
    slug: 'registrations-licensing',
    title: 'Registrations & Licensing',
    img: serviceImage.registrations,
    desc: 'Assistance with Shops & Establishments, PF, ESI, PT, contract labour, factory and applicable labour registrations and licences.',
    headline: 'Get Establishment Compliance Started Correctly.',
    subhead: 'Registrations & Licensing',
    intro: 'Registrations, licences, amendments, renewals and closures subject to applicable Central and State requirements.',
    body: 'MCS assists organisations with Shops & Establishments, EPF, ESIC, Professional Tax, Labour Welfare Fund-related compliance, contract labour registrations and licences, building and construction-related compliance, factory-related labour support, amendments, renewals and closure applications.',
    deliverables: [
      { title: 'New Registrations', desc: 'Assess applicability and support establishment and employer registrations.' },
      { title: 'Licensing and Renewals', desc: 'Coordinate applicable licences, renewals and amendments.' },
      { title: 'Closure and Surrender', desc: 'Support closure, surrender and related documentation.' },
    ],
    order: 7,
  },
  {
    slug: 'manpower-outsourcing-employee-lifecycle',
    title: 'Manpower Outsourcing & Employee Lifecycle Support',
    img: serviceImage.manpower,
    desc: 'Structured manpower and employee-administration support backed by statutory compliance management.',
    headline: 'Employee Lifecycle Support with Compliance Built In.',
    subhead: 'Manpower Outsourcing & Employee Lifecycle Support',
    intro: 'Support from mass hiring and joining formalities through payroll coordination, F&F and relieving.',
    body: 'MCS supports mass hiring, induction, joining formalities, payroll processing, employee compliance management, attendance and payroll coordination, Full & Final Settlement, relieving formalities and employee documentation. Where staffing is delivered through an associated entity, the contracting entity and scope should be clearly identified.',
    deliverables: [
      { title: 'Joining and Documentation', desc: 'Coordinate appointment, joining and employee records.' },
      { title: 'Payroll Coordination', desc: 'Connect attendance, payroll inputs and compliance administration.' },
      { title: 'Employee Separation', desc: 'Support F&F, relieving and exit documentation.' },
    ],
    order: 8,
  },
  {
    slug: 'apprenticeship-advisory',
    title: 'Apprenticeship Advisory',
    img: serviceImage.apprenticeship,
    desc: 'Applicability, registration, NAPS/NATS, documentation, stipend compliance and apprentice lifecycle support.',
    headline: 'Build a Compliant Apprenticeship Framework.',
    subhead: 'Apprenticeship Advisory',
    intro: 'Practical support for establishments administering applicable apprenticeship requirements.',
    body: 'MCS assists with applicability assessment, establishment registration, apprentice engagement frameworks, NAPS/NATS-related advisory, documentation and portal assistance, stipend compliance guidance, periodic support and apprentice lifecycle administration.',
    deliverables: [
      { title: 'Applicability Assessment', desc: 'Review workforce and establishment requirements.' },
      { title: 'Registration and Portal Support', desc: 'Assist with applicable registrations and documentation.' },
      { title: 'Lifecycle Administration', desc: 'Support engagement, records, stipend and periodic compliance.' },
    ],
    order: 9,
  },
  {
    slug: 'hr-policies-employment-documentation',
    title: 'HR Policies & Employment Documentation',
    img: serviceImage.policies,
    desc: 'Appointment letters, employment agreements, HR policies, disciplinary procedures, grievance processes and Labour Codes-aligned documentation.',
    headline: 'Strong Compliance Begins with Clear Documentation.',
    subhead: 'HR Policies & Employment Documentation',
    intro: 'Clear, consistent and legally aligned employment documents and internal processes.',
    body: 'MCS supports appointment letters, employment agreements, HR policy manuals, leave and working-hours policies, codes of conduct, disciplinary procedures, grievance processes, contractor agreements from a labour-compliance perspective, separation documentation and Labour Codes-aligned processes.',
    deliverables: [
      { title: 'Employment Documentation', desc: 'Review and prepare appointment letters and employment agreements.' },
      { title: 'HR Policy Manuals', desc: 'Align policies with applicable employment and compliance requirements.' },
      { title: 'Disciplinary and Grievance Processes', desc: 'Create consistent procedures for workplace matters.' },
    ],
    order: 10,
  },
];

const home = {
  heroLine1: 'Five Decades of Experience.',
  heroPhrases: ['Labour Laws', 'Labour Codes', 'Industrial Relations', 'Statutory Compliance'],
  heroLine2: 'A New Era of Labour Laws.',
  heroDescription: 'Established in Mumbai in 1979, Maru Consultancy Services provides specialised advisory, compliance, audit and representation support to organisations navigating India’s labour and employment regulatory framework.',
  ctaPrimaryText: 'Talk to Our Experts',
  ctaSecondaryText: 'Request a Compliance Review',
  oneStopLabel: 'Our Core Capabilities',
  oneStopTitle: 'Compliance Beyond Checklists',
  oneStopCards: [
    { title: 'Labour Codes Advisory & Implementation', desc: 'Readiness reviews and implementation roadmaps' },
    { title: 'Labour Law & Statutory Compliance', desc: 'Records, returns, calendars and updates' },
    { title: 'Labour Law Audits & Due Diligence', desc: 'Find gaps before they become liabilities' },
    { title: 'Contract Labour Compliance', desc: 'Contractor governance and principal employer risk' },
    { title: 'Payroll & Wage Advisory', desc: 'Compliant salary structures and payroll processes' },
    { title: 'Industrial Relations Advisory', desc: 'Employment matters, disputes and workforce support' },
  ],
  whyUsHeading: 'Experience. Interpretation. Execution.',
  whyUsBody: 'MCS works with management, HR, payroll, finance and compliance teams to identify obligations, assess risks and convert statutory requirements into workable business processes.',
  whyUsItems: [
    { title: 'Experience Since 1979', desc: 'Decades of practical exposure to labour laws, statutory compliance and workforce-related regulatory matters.' },
    { title: 'Multi-Disciplinary Expertise', desc: 'Leadership combining legal, HR, technology, corporate compliance and business-management perspectives.' },
    { title: 'Risk-Based Approach', desc: 'We examine whether compliance can be demonstrated through reliable records and processes, not merely whether a document exists.' },
  ],
  servicesPreviewLabel: 'Our Services',
  servicesPreviewTitle: 'End-to-End Labour Compliance Support',
  servicesPreviewDescription: 'From registrations and monthly compliance to audits, due diligence, notices, industrial relations and Labour Codes implementation.',
  testimonialsHeading: 'Trusted Across Industries for Decades',
  stats: [
    { target: 1979, decimals: 0, suffix: '', label: 'Serving Since' },
    { target: 45, decimals: 0, suffix: '+', label: 'Years of Experience' },
    { target: 4, decimals: 0, suffix: '', label: 'Labour Codes' },
    { target: 300, decimals: 0, suffix: '+', label: 'Clients Served' },
  ],
  featuredServiceSlugs: services.slice(0, 8).map((service) => service.slug),
};

const about = {
  heroEyebrow: 'About Maru Consultancy Services',
  heroHeadlineTop: 'Over Four Decades of',
  heroHeadlineHighlight: 'Labour Law Expertise',
  heroHeadlineBottom: '',
  heroSubtext: 'Established in 1979 in Mumbai, MCS is a specialised Labour Law, Industrial Relations and Statutory Compliance consultancy supporting employers in managing India’s evolving employment regulatory framework.',
  heroStats: [
    { value: '1979', label: 'Established' },
    { value: '45+', label: 'Years of Experience' },
    { value: '4', label: 'Labour Codes' },
  ],
  marqueeServices: ['Labour Codes Advisory', 'Statutory Compliance', 'Labour Audits', 'Contract Labour', 'Payroll & Wage Advisory', 'Industrial Relations', 'Inspections & Representation', 'HR Documentation'],
  storySlides: [
    { heading: 'Practical experience,', headingHighlight: 'built since 1979.', body: 'For over four decades, MCS has worked alongside organisations to interpret labour legislation, manage statutory compliances, address regulatory issues and establish practical systems for workforce compliance.' },
    { heading: 'From routine filings to', headingHighlight: 'compliance assurance.', body: 'Our services extend across establishment registrations, payroll and social security, audits, contractor governance, inspections, industrial relations, regulatory proceedings and Labour Codes implementation.' },
    { heading: 'Built for the next era of', headingHighlight: 'employment compliance.', body: 'MCS combines decades of practical experience with a contemporary approach aligned to each client’s industry, workforce structure, geography and business requirements.' },
  ],
  pullQuoteLine1: 'Interpret. Implement.',
  pullQuoteLine2: 'Comply with confidence.',
  pullQuoteLine3: '',
  pullQuoteAttribution: 'Maru Consultancy Services',
  coreValues: [
    { title: 'Professional Integrity', img: '/assets/service-legal.png' },
    { title: 'Responsiveness', img: '/assets/service-statutory.png' },
    { title: 'Practical Interpretation', img: '/assets/service-labour.png' },
    { title: 'Process Excellence', img: '/assets/service-audits.png' },
    { title: 'Customised Solutions', img: '/assets/service-hr.png' },
    { title: 'Continuous Learning', img: '/assets/service-training.png' },
  ],
  journeyMilestones: [
    { year: '1979', event: 'Established in Mumbai', img: '/assets/service-legal.png', description: 'Maru Consultancy Services begins its labour law and compliance practice.' },
    { year: 'Today', event: 'Contemporary Compliance', img: '/assets/service-labour.png', description: 'MCS brings legacy experience to India’s four Labour Codes and evolving employment framework.' },
  ],
  whyChooseItems: [
    { point: 'Experience Since 1979', sub: 'Decades of practical exposure to labour law and employment compliance matters.' },
    { point: 'Multi-disciplinary leadership', sub: 'Legal, HR, technology, corporate compliance and business-management perspectives.' },
    { point: 'Practical and customised advice', sub: 'Solutions aligned to industry, establishment type, workforce structure, geography and risk profile.' },
    { point: 'End-to-end capability', sub: 'From registrations and monthly compliance to audits, notices, disputes and strategic advisory.' },
    { point: 'Management visibility', sub: 'Clear answers on where the organisation is compliant, what is at risk and what must be corrected.' },
  ],
  teamMembers: [
    { name: 'Deepak Maru', qualification: 'B.Com (Hons.), LL.B., Advocate', role: 'Founder & Managing Partner', img: '/assets/service-legal.png' },
    { name: 'Sanjeev Maru', qualification: 'B.Com., LL.B.', role: 'Co-founder & Managing Partner', img: '/assets/service-staffing.png' },
    { name: 'Pankhil Maru', qualification: 'B.E. (I.T.), MBA (HR)', role: 'Managing Partner', img: '/assets/service-hr.png' },
    { name: 'Nishit Maru', qualification: 'BLS, LL.B., CS', role: 'Managing Partner', img: '/assets/service-audits.png' },
  ],
};

const clientele = {
  heroEyebrow: 'Industries We Serve',
  heroHeadline: 'Trusted Across Industries for Decades',
  heroSubtext: 'MCS supports organisations across diverse sectors and workforce environments. Client names and logos should be published only where permission or appropriate usage rights are confirmed.',
  stats: [
    { target: 1979, suffix: '', decimals: 0, label: 'Serving Since' },
    { target: 45, suffix: '+', decimals: 0, label: 'Years of Experience' },
    { target: 8, suffix: '+', decimals: 0, label: 'Industries' },
    { target: 4, suffix: '', decimals: 0, label: 'Labour Codes' },
  ],
  industries: [
    { name: 'Multinational Companies', count: '', image: '' },
    { name: 'Manufacturing', count: '', image: '' },
    { name: 'Infrastructure & Construction', count: '', image: '' },
    { name: 'Hospitality', count: '', image: '' },
    { name: 'Logistics', count: '', image: '' },
    { name: 'Education', count: '', image: '' },
    { name: 'Dairy, Storage & Allied Businesses', count: '', image: '' },
    { name: 'Professional & Business Services', count: '', image: '' },
  ],
  testimonials: [],
  portfolio: [],
};

const contact = {
  heroEyebrow: 'Complex Laws. Clear Solutions.',
  heroHeading: 'Talk to Our Labour Law Experts',
  heroSubtext: 'Whether you are implementing the Labour Codes, reviewing salary structures, strengthening contractor compliance, preparing for an inspection or seeking greater confidence in your statutory compliance framework, our team can assist.',
  formTitle: 'Schedule a Consultation',
  formSubtext: 'Share your requirement and our team will respond with the right next step.',
  phone1: '022-35725001',
  phone2: '022-35725001',
  email1: 'info@labourlaws.co.in',
  email2: 'info@labourlaws.co.in',
  addressLine1: '614, Exim-Link (Property Registration Building),',
  addressLine2: 'Near Runwal Greens, Mulund-Goregaon Link Road,',
  addressLine3: 'Nahur (West), Mumbai – 400 078',
  hoursWeekdays: 'Monday – Friday: 9:30 AM – 6:30 PM',
  hoursWeekend: 'Saturday & Sunday: Closed',
  serviceOptions: [
    'Labour Codes Readiness Review',
    'Labour Law Audit & Due Diligence',
    'Contract Labour Compliance',
    'Payroll & Wage Advisory',
    'Industrial Relations Advisory',
    'Inspections, Notices & Representation',
    'Registrations & Licensing',
    'Other / General Inquiry',
  ],
};

async function run() {
  await connectDB();

  await Home.findOneAndUpdate({ singleton: 'home' }, { $set: home }, { upsert: true, new: true });
  await About.findOneAndUpdate({ singleton: 'about' }, { $set: about }, { upsert: true, new: true });
  await Clientele.findOneAndUpdate({ singleton: 'clientele' }, { $set: clientele }, { upsert: true, new: true });
  await Contact.findOneAndUpdate({ singleton: 'contact' }, { $set: contact }, { upsert: true, new: true });
  await ResourcesPage.findOneAndUpdate({
    singleton: 'resources',
  }, {
    $set: {
      heroEyebrow: 'Knowledge Centre',
      heroHeading: 'Compliance Knowledge That Helps You Act',
      heroSubtext: 'Practical updates, articles, compliance alerts and employer resources covering Labour Codes, PF, ESI, minimum wages and employment compliance.',
      heroBgType: 'color',
      heroImageUrl: '',
      heroVideoUrl: '',
    },
  }, { upsert: true, new: true });

  for (const service of services) {
    await Service.findOneAndUpdate({ slug: service.slug }, { $set: service }, { upsert: true, new: true, runValidators: true });
  }

  console.log(`[migrate:content] Updated page content and upserted ${services.length} service pages.`);
  await import('mongoose').then(({ default: mongoose }) => mongoose.connection.close());
}

run().catch(async (error) => {
  console.error('[migrate:content] Failed', error);
  process.exitCode = 1;
  try {
    await import('mongoose').then(({ default: mongoose }) => mongoose.connection.close());
  } catch {
    // Preserve the original migration error.
  }
});