import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { LabourCodeContent, LabourCodesPageContent } from '../types/content';

const PP = 'Poppins, sans-serif';

const accentColor = (num: string) => {
  const map: Record<string, string> = { '01': '#fda102', '02': '#0ea5e9', '03': '#10b981', '04': '#8b5cf6' };
  return map[num] ?? '#fda102';
};

/* Static defaults shown when the DB is empty */
const DEFAULT_CODES: Omit<LabourCodeContent, '_id'>[] = [
  {
    slug: 'code-on-wages',
    codeNumber: '01',
    title: 'Code on Wages, 2019',
    subtitle: 'MCS assists employers in evaluating the implications of the Code on Wages on compensation structures, payroll and statutory benefits.',
    coveringAreas: ['Definition and computation of wages', 'Review of inclusions and exclusions in remuneration', '50% exclusion-threshold analysis', 'Minimum wages and applicable wage requirements', 'Payment of wages and permissible deductions', 'Overtime implications', 'Statutory bonus', 'Equal remuneration principles', 'Salary and CTC restructuring', 'Payroll compliance review', 'Employment documentation alignment'],
    ctaLabel: 'Request a Wage Structure Review',
  },
  {
    slug: 'code-on-social-security',
    codeNumber: '02',
    title: 'Code on Social Security, 2020',
    subtitle: 'MCS supports employers in assessing and managing social-security obligations under the consolidated framework.',
    coveringAreas: ["Employees' Provident Fund", "Employees' State Insurance", 'Gratuity', 'Maternity benefits', "Employees' compensation", 'Fixed-term employee implications', 'Social-security coverage and contribution reviews', 'Building and construction worker-related social-security requirements', 'Employee benefit compliance assessments', 'Relevant records, processes and documentation'],
    ctaLabel: 'Request a Social Security Review',
  },
  {
    slug: 'industrial-relations-code',
    codeNumber: '03',
    title: 'Industrial Relations Code, 2020',
    subtitle: 'MCS provides strategic and operational advisory on industrial relations and employment matters.',
    coveringAreas: ['Industrial relations strategy', 'Standing Orders', 'Worker classification', 'Fixed-term employment', 'Trade-union matters', 'Grievance redressal mechanisms', 'Disciplinary proceedings and domestic enquiries', 'Lay-off, retrenchment and closure', 'Industrial disputes and conciliation', 'Negotiating unions and negotiating councils', 'Reskilling Fund requirements', 'Workforce restructuring'],
    ctaLabel: 'Request an IR Advisory',
  },
  {
    slug: 'osh-working-conditions-code',
    codeNumber: '04',
    title: 'OSH & Working Conditions Code, 2020',
    subtitle: 'MCS assists establishments, principal employers and contractors with compliance requirements relating to occupational safety, health and working conditions.',
    coveringAreas: ['Establishment registration and applicable licensing', 'Contract labour compliance', 'Principal employer obligations', 'Core and non-core activity assessment', 'Inter-State migrant worker requirements', 'Working hours, leave and welfare provisions', 'Health and safety requirements', 'Appointment letters and employment documentation', 'Statutory registers, records and notices', 'Contractor governance and compliance monitoring'],
    ctaLabel: 'Request an OSH Compliance Review',
  },
];

const PAGE_DEFAULTS: LabourCodesPageContent = {
  heroLabel:   'Labour Codes Advisory',
  heroHeading: "Navigating India's New Labour Law Framework",
  heroSubtext: 'India has consolidated 29 Central labour laws into four Labour Codes. MCS helps employers understand the business impact and implement compliant, workable processes.',
  gridLabel:   'The four codes',
  gridHeading: 'From interpretation to implementation.',
  gridSubtext: 'Our Labour Codes readiness review can cover wage structures, payroll, social security, gratuity, bonus, appointment letters, HR policies, standing orders, contractor management, working conditions and related processes.',
  ctaLabel:      'MCS Labour Codes Readiness Review',
  ctaHeading:    'Is your organisation Labour Codes ready?',
  ctaSteps:      ['Compliance Status', 'Gap Analysis', 'Risk Classification', 'Corrective Actions', 'Implementation Roadmap'],
  ctaButtonText: 'Request a Readiness Assessment',
  disclaimer: 'The information on this page is for general informational purposes and is not a substitute for advice based on the facts of a specific matter. Requirements may vary by establishment, workforce, location and applicable Central and State provisions.',
  detailBreadcrumb:      'Labour Codes Advisory',
  detailAboutHeading:    'About This Code',
  detailCoveringHeading: 'What We Cover',
  detailCoveringSubtext: 'Key areas addressed under this Code.',
  detailOtherCodes:      'Other Labour Codes',
  detailAllCodes:        'All Four Labour Codes',
  sidebarTag:      'Get Expert Advice',
  sidebarHeading:  'Ready to assess your compliance?',
  sidebarBody:     'Speak with our experts to understand how this Code impacts your organisation.',
  sidebarPhone:    '+919876543210',
  sidebarCallText: 'Call Now',
};

const LabourCodes = () => {
  const [codes, setCodes] = useState<LabourCodeContent[]>([]);
  const [page, setPage] = useState<LabourCodesPageContent>(PAGE_DEFAULTS);

  const loadCodes = () => { api.get<LabourCodeContent[]>('/labour-codes').then(setCodes).catch(() => {}); };
  const loadPage = () => { api.get<LabourCodesPageContent>('/labour-codes-page').then(d => setPage({ ...PAGE_DEFAULTS, ...d })).catch(() => {}); };

  useEffect(() => { loadCodes(); loadPage(); }, []);
  useLiveContent(() => { loadCodes(); loadPage(); });

  const displayCodes = codes.length > 0 ? codes : (DEFAULT_CODES as LabourCodeContent[]);

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ backgroundColor: '#172632' }}>
        <div className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full border-[70px] border-white/[0.05]" />
        <div className="absolute -left-20 -bottom-40 w-[360px] h-[360px] rounded-full border-[45px] border-[#fda102]/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 lg:px-10 text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="uppercase tracking-[0.28em] text-sm font-semibold mb-4" style={{ color: '#fda102', fontFamily: PP }}>
            {page.heroLabel}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }} className="text-white font-bold text-4xl lg:text-6xl leading-tight mb-6" style={{ fontFamily: PP }}>
            {page.heroHeading}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }} className="max-w-3xl mx-auto text-white/80 text-base lg:text-xl leading-relaxed" style={{ fontFamily: PP }}>
            {page.heroSubtext}
          </motion.p>
        </div>
      </section>

      {/* ── Four codes grid ── */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="max-w-3xl mb-10 lg:mb-14">
            <p className="uppercase tracking-[0.22em] font-semibold text-sm mb-3" style={{ color: 'var(--primary)', fontFamily: PP }}>
              {page.gridLabel}
            </p>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#111] leading-tight mb-4" style={{ fontFamily: PP }}>
              {page.gridHeading}
            </h2>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: PP }}>
              {page.gridSubtext}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-7">
            {displayCodes.map((code, index) => {
              const accent = accentColor(code.codeNumber);
              const preview = (code.coveringAreas ?? []).slice(0, 4);
              return (
                <motion.article key={code.slug ?? index}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.07 }}
                  className="group rounded-2xl border border-gray-100 bg-[#f8fafb] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">

                  {/* Card header */}
                  <div className="p-6 lg:p-8 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span className="text-3xl font-bold" style={{ color: accent, fontFamily: PP }}>
                        {code.codeNumber}
                      </span>
                      <ShieldCheck size={24} style={{ color: 'var(--primary)', opacity: 0.7 }} />
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-[#111] mb-3 group-hover:text-[var(--primary)] transition-colors"
                      style={{ fontFamily: PP }}>
                      {code.title}
                    </h3>

                    {code.subtitle && (
                      <p className="text-gray-600 leading-relaxed mb-5 text-sm lg:text-base" style={{ fontFamily: PP }}>
                        {code.subtitle}
                      </p>
                    )}

                    {/* Preview bullet points */}
                    <ul className="space-y-2 mb-4">
                      {preview.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-700" style={{ fontFamily: PP }}>
                          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent, marginTop: '6px' }} />
                          {item}
                        </li>
                      ))}
                      {(code.coveringAreas?.length ?? 0) > 4 && (
                        <li className="text-xs text-gray-400 pl-3.5" style={{ fontFamily: PP }}>
                          +{(code.coveringAreas?.length ?? 0) - 4} more areas covered
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Card footer */}
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <div className="h-px bg-gray-200 mb-5" />
                    <Link
                      to={`/labour-codes/${code.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-sm rounded-full px-5 py-2.5 transition-all"
                      style={{ backgroundColor: accent + '15', color: accent, fontFamily: PP }}>
                      Explore This Code <ArrowRight size={15} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: '#fff8ed' }}>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 text-center">
          <p className="uppercase tracking-[0.22em] font-semibold text-sm mb-3" style={{ color: 'var(--primary)', fontFamily: PP }}>
            {page.ctaLabel}
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] mb-5" style={{ fontFamily: PP }}>
            {page.ctaHeading}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {page.ctaSteps.map((step) => (
              <span key={step}
                className="px-4 py-2 rounded-full bg-white border border-[#fda102]/30 text-sm font-medium text-gray-700"
                style={{ fontFamily: PP }}>
                {step}
              </span>
            ))}
          </div>
          <Link to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', fontFamily: PP }}>
            {page.ctaButtonText} <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-8 bg-white border-t border-gray-100">
        <p className="max-w-5xl mx-auto px-5 lg:px-10 text-xs text-gray-500 leading-relaxed" style={{ fontFamily: PP }}>
          {page.disclaimer}
        </p>
      </section>
    </div>
  );
};

export default LabourCodes;
