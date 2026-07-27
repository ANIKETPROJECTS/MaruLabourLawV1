const parentCopy = {
  payroll: {
    slug: 'payroll-management',
    title: 'Payroll Management',
    img: '/assets/service-payroll.png',
    desc: 'Accurate, timely payroll operations that keep salaries, statutory deductions, and employee records on track.',
    headline: 'Payroll Management Made Simple and Reliable.',
    subhead: 'Payroll Management Services',
    intro: 'Practical payroll support for accurate processing, clear reporting, and a better employee experience.',
    body: 'Our payroll management services bring structure and consistency to every stage of the monthly payroll cycle. We help businesses maintain accurate employee data, calculate earnings and deductions, and deliver clear payroll reports on time.\n\nFrom salary structuring to employee self-service, our team provides a dependable operating framework that supports HR teams and reduces avoidable payroll errors.',
  },
  labour: {
    slug: 'labour-laws-compliances',
    title: 'Labour Laws Compliances',
    img: '/assets/service-labour.png',
    desc: 'End-to-end support for statutory registrations, returns, employee benefits, and workplace labour law obligations.',
    headline: 'Confident Compliance Across Every Labour Law.',
    subhead: 'Labour Laws Compliance Services',
    intro: 'A practical compliance framework for the labour laws that affect your workforce and establishment.',
    body: 'Labour law compliance requires accurate records, timely filings, and a clear understanding of the rules applicable to each establishment. Our advisory team helps businesses organise these responsibilities into a reliable monthly and annual compliance calendar.\n\nThe following services are designed as focused building blocks, so you can engage support for one obligation or build a complete compliance programme around your workforce.',
  },
  audit: {
    slug: 'audit-and-compliance',
    title: 'Audit and Compliance',
    img: '/assets/service-audits.png',
    desc: 'Structured establishment, vendor, and statutory audits that identify gaps and provide clear corrective actions.',
    headline: 'Audit and Compliance with a Clear Action Plan.',
    subhead: 'Audit and Compliance Services',
    intro: 'Independent reviews that make compliance gaps visible, prioritised, and easier to close.',
    body: 'Our audit and compliance support gives management a clear view of how labour law obligations are being handled across establishments, vendors, and records. Each review combines document checks with practical observations from the workplace.\n\nYou receive a concise findings report, a prioritised remediation plan, and guidance for keeping the organisation inspection-ready after the audit is complete.',
  },
  manpower: {
    slug: 'manpower-outsourcing',
    title: 'Manpower Outsourcing',
    img: '/assets/service-staffing.png',
    desc: 'Flexible workforce support covering hiring, joining, payroll, compliance coordination, and employee exits.',
    headline: 'Flexible Manpower Support for Growing Teams.',
    subhead: 'Manpower Outsourcing Services',
    intro: 'End-to-end workforce coordination that helps businesses scale while keeping people processes organised.',
    body: 'Manpower outsourcing works best when recruitment, joining formalities, payroll, and compliance are managed as one connected process. Our team supports businesses with a practical workforce model that can adapt to seasonal requirements and changing headcount.\n\nFrom mass hiring through employee relieving formalities, we coordinate the documentation and operational steps needed to keep the employee lifecycle smooth and accountable.',
  },
};

const child = (parent, title, slug, order, description) => ({
  slug,
  title,
  parentSlug: parent.slug,
  img: parent.img,
  desc: description,
  headline: `${title} — Practical Support for Your Team.`,
  subhead: `${parent.title} Services`,
  intro: `Dummy service content for ${title.toLowerCase()}, designed to give your team a clear and dependable process.`,
  body: `Our ${title.toLowerCase()} service helps businesses organise this important part of their ${parent.title.toLowerCase()} programme. We review the current process, highlight gaps, and set up practical steps that can be followed consistently by HR and operations teams.\n\nThis dummy content can be replaced with your final scope, deliverables, turnaround times, and commercial details from the admin panel whenever you are ready.`,
  deliverables: [
    { title: 'Initial Assessment', desc: `We review your current ${title.toLowerCase()} process, records, and immediate business requirements.` },
    { title: 'Process & Documentation Support', desc: 'Clear templates, checklists, and practical guidance for consistent execution.' },
    { title: 'Ongoing Coordination', desc: 'Regular follow-up and status updates to keep the work on schedule and inspection-ready.' },
  ],
  order,
});

const category = (parent, children) => ({
  ...parent,
  deliverables: children.map(({ title, slug, description }) => ({
    title,
    slug,
    desc: description,
  })),
  children: children.map(({ title, slug, description }, index) =>
    child(parent, title, slug, parent.order * 100 + index + 1, description),
  ),
});

const payroll = category(
  { ...parentCopy.payroll, order: 0 },
  [
    { title: 'Salary Structuring', slug: 'salary-structuring', description: 'Design balanced salary components aligned with business policies and statutory requirements.' },
    { title: 'Time & Attendance', slug: 'time-and-attendance', description: 'Organise attendance inputs, shifts, overtime, and leave data for accurate payroll.' },
    { title: 'Leave Management', slug: 'leave-management', description: 'Maintain leave rules, balances, approvals, and payroll-ready leave records.' },
    { title: 'Payroll Compliance', slug: 'payroll-compliance', description: 'Check payroll calculations and deductions against applicable compliance requirements.' },
    { title: 'Payslip & Pay Sheet Generation', slug: 'payslip-pay-sheet-generation', description: 'Generate clear payslips and consolidated pay sheets for each payroll cycle.' },
    { title: 'MIS Reports Generation', slug: 'mis-reports-generation', description: 'Create management reports that make payroll costs, trends, and exceptions easy to review.' },
    { title: 'Employee Self Service', slug: 'employee-self-service', description: 'Give employees convenient access to payslips, attendance, leave, and profile information.' },
    { title: 'Tax Management', slug: 'tax-management', description: 'Coordinate payroll tax deductions and maintain supporting records for employees.' },
    { title: 'Form 16 Generation', slug: 'form-16-generation', description: 'Prepare accurate Form 16 information and coordinate timely employee distribution.' },
    { title: 'Reimbursement Claims', slug: 'reimbursement-claims', description: 'Set up a consistent review and approval flow for employee reimbursement claims.' },
    { title: 'Performance Management', slug: 'performance-management', description: 'Support goal, review, and appraisal processes with structured HR records.' },
  ],
);

const labour = category(
  { ...parentCopy.labour, order: 1 },
  [
    { title: 'Provident Fund (PF)', slug: 'provident-fund-pf', description: 'Support PF registration, contribution coordination, employee records, and monthly compliance.' },
    { title: 'Employees State Insurance (ESI)', slug: 'employees-state-insurance-esi', description: 'Manage ESI contribution inputs, employee coverage records, and return support.' },
    { title: 'Professional Tax (PT)', slug: 'professional-tax-pt', description: 'Coordinate state-wise professional tax deductions, payments, and records.' },
    { title: 'Labour Welfare Fund (LWF)', slug: 'labour-welfare-fund-lwf', description: 'Maintain LWF applicability checks, contribution schedules, and statutory documentation.' },
    { title: 'Bonus & Gratuity', slug: 'bonus-and-gratuity', description: 'Support bonus eligibility, gratuity calculations, and related employee documentation.' },
    { title: 'Minimum Wages', slug: 'minimum-wages', description: 'Review wage structures against applicable state, category, and scheduled employment rates.' },
    { title: 'Contract Labour (CLRA)', slug: 'contract-labour-clra', description: 'Coordinate principal employer and contractor obligations under contract labour requirements.' },
    { title: 'Building & Constructions (BOCW)', slug: 'building-constructions-bocw', description: 'Support BOCW applicability reviews, registrations, records, and contribution processes.' },
    { title: 'Shops & Establishment (S&E)', slug: 'shops-establishment-se', description: 'Manage state-specific Shops and Establishments registration and ongoing obligations.' },
    { title: 'Factories Registration & Compliances', slug: 'factories-registration-compliances', description: 'Coordinate factory registration, renewal, registers, and day-to-day compliance checks.' },
    { title: 'Prevention of Sexual Harassment (POSH)', slug: 'prevention-sexual-harassment-posh', description: 'Set up POSH policies, awareness support, and Internal Committee documentation.' },
    { title: 'Labour & Industrial Laws', slug: 'labour-industrial-laws', description: 'Provide practical guidance across core labour, employment, and industrial relations laws.' },
  ],
);

const audit = category(
  { ...parentCopy.audit, order: 2 },
  [
    { title: 'Establishment Visits and Audits', slug: 'establishment-visits-audits', description: 'Conduct structured visits to review workplace practices, records, and compliance readiness.' },
    { title: 'Verification of Registers & Records of Principal Employer', slug: 'verification-registers-records-principal-employer', description: 'Check statutory registers and principal employer records for completeness and consistency.' },
    { title: 'Attending Inspection & Visiting Concerned Departmental Officers', slug: 'attending-inspection-departmental-officers', description: 'Support management during inspections and coordinate communication with relevant authorities.' },
    { title: 'Vendor Compliances & Audit', slug: 'vendor-compliances-audit', description: 'Review vendor and contractor documents, filings, wage records, and compliance responsibilities.' },
    { title: 'Registration, Renewal & Amendment of Principal Employer & Vendor Licenses', slug: 'registration-renewal-amendment-employer-vendor-licenses', description: 'Coordinate license applications, renewals, amendments, and supporting documentation.' },
  ],
);

const manpower = category(
  { ...parentCopy.manpower, order: 3 },
  [
    { title: 'Mass Hiring', slug: 'mass-hiring', description: 'Plan and coordinate high-volume recruitment drives with organised candidate documentation.' },
    { title: 'Induction & Joining Formalities', slug: 'induction-joining-formalities', description: 'Create a smooth joining journey with complete employee and statutory documentation.' },
    { title: 'Payroll Processing', slug: 'outsourced-payroll-processing', description: 'Process outsourced workforce payroll with attendance checks, deductions, and reports.' },
    { title: 'Employee Compliance Management', slug: 'employee-compliance-management', description: 'Maintain workforce records and coordinate recurring employee compliance activities.' },
    { title: 'Full & Final Settlement', slug: 'outsourced-full-final-settlement', description: 'Coordinate accurate exit calculations, clearances, and full and final settlements.' },
    { title: 'Employee Relieving Formalities', slug: 'employee-relieving-formalities', description: 'Manage notices, clearances, documentation, and a professional employee exit process.' },
  ],
);

export const servicesSeed = [payroll, labour, audit, manpower].flatMap(({ children, ...parent }) => [
  parent,
  ...children,
]);