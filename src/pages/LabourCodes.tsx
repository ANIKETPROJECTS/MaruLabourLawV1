import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PP = 'Poppins, sans-serif';

const codes = [
  {
    number: '01',
    title: 'Code on Wages, 2019',
    description: 'Review wage definitions, inclusions and exclusions, the 50% exclusion threshold, minimum wages, deductions, overtime, bonus and salary structures.',
    services: ['Definition and computation of wages', 'Salary and CTC restructuring', 'Payroll compliance review'],
  },
  {
    number: '02',
    title: 'Code on Social Security, 2020',
    description: 'Assess PF, ESI, gratuity, maternity benefits, employee compensation, fixed-term employment and wider social-security coverage.',
    services: ['PF, ESI and gratuity reviews', 'Contribution and benefit assessments', 'Records, processes and documentation'],
  },
  {
    number: '03',
    title: 'Industrial Relations Code, 2020',
    description: 'Build practical systems for standing orders, worker classification, fixed-term employment, disciplinary matters and workforce restructuring.',
    services: ['Trade union and grievance matters', 'Domestic enquiries and disputes', 'Retrenchment, lay-off and closure advisory'],
  },
  {
    number: '04',
    title: 'OSH & Working Conditions Code, 2020',
    description: 'Strengthen establishment, principal employer and contractor compliance across registrations, working conditions, safety and statutory records.',
    services: ['Contract labour and licensing', 'Working hours, leave and welfare', 'Appointment letters and statutory registers'],
  },
];

const LabourCodes = () => (
  <div className="w-full" style={{ fontFamily: PP }}>
    <section className="relative overflow-hidden py-20 lg:py-28" style={{ backgroundColor: '#172632' }}>
      <div className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full border-[70px] border-white/[0.05]" />
      <div className="absolute -left-20 -bottom-40 w-[360px] h-[360px] rounded-full border-[45px] border-[#fda102]/10" />
      <div className="relative z-10 max-w-5xl mx-auto px-5 lg:px-10 text-center">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="uppercase tracking-[0.28em] text-sm font-semibold mb-4" style={{ color: '#fda102' }}>
          Labour Codes Advisory
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }} className="text-white font-medium text-4xl lg:text-6xl leading-tight mb-6">
          Navigating India’s New Labour Law Framework
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }} className="max-w-3xl mx-auto text-white/80 text-base lg:text-xl leading-relaxed">
          India has consolidated 29 Central labour laws into four Labour Codes. MCS helps employers understand the business impact and implement compliant, workable processes.
        </motion.p>
      </div>
    </section>

    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="max-w-3xl mb-10 lg:mb-14">
          <p className="uppercase tracking-[0.22em] font-semibold text-sm mb-3" style={{ color: 'var(--primary)' }}>The four codes</p>
          <h2 className="text-3xl lg:text-5xl font-medium text-[#111] leading-tight mb-4">From interpretation to implementation.</h2>
          <p className="text-gray-600 leading-relaxed">
            Our Labour Codes readiness review can cover wage structures, payroll, social security, gratuity, bonus, appointment letters, HR policies, standing orders, contractor management, working conditions and related processes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 lg:gap-7">
          {codes.map((code, index) => (
            <motion.article key={code.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.07 }}
              className="rounded-2xl border border-gray-100 bg-[#f8fafb] p-6 lg:p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-5">
                <span className="text-3xl font-semibold" style={{ color: '#fda102' }}>{code.number}</span>
                <ShieldCheck size={25} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="text-xl lg:text-2xl font-medium text-[#111] mb-3">{code.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-5">{code.description}</p>
              <ul className="space-y-2">
                {code.services.map((item) => <li key={item} className="flex gap-2 text-sm text-gray-700"><CheckCircle2 size={17} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />{item}</li>)}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 lg:py-16" style={{ backgroundColor: '#fff8ed' }}>
      <div className="max-w-5xl mx-auto px-5 lg:px-10 text-center">
        <p className="uppercase tracking-[0.22em] font-semibold text-sm mb-3" style={{ color: 'var(--primary)' }}>MCS Labour Codes Readiness Review</p>
        <h2 className="text-3xl lg:text-4xl font-medium text-[#111] mb-5">Is your organisation Labour Codes ready?</h2>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Compliance Status', 'Gap Analysis', 'Risk Classification', 'Corrective Actions', 'Implementation Roadmap'].map((step) => (
            <span key={step} className="px-4 py-2 rounded-full bg-white border border-[#fda102]/30 text-sm font-medium text-gray-700">{step}</span>
          ))}
        </div>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white" style={{ backgroundColor: 'var(--primary)' }}>
          Request a Readiness Assessment <ArrowRight size={17} />
        </Link>
      </div>
    </section>

    <section className="py-8 bg-white border-t border-gray-100">
      <p className="max-w-5xl mx-auto px-5 lg:px-10 text-xs text-gray-500 leading-relaxed">
        The information on this page is for general informational purposes and is not a substitute for advice based on the facts of a specific matter. Requirements may vary by establishment, workforce, location and applicable Central and State provisions.
      </p>
    </section>
  </div>
);

export default LabourCodes;