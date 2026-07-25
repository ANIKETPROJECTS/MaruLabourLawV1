import { ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import manufacturingImg from '../assets/sectors/manufacturing.jpg';
import hospitalityImg from '../assets/sectors/hospitality.jpg';
import logisticsImg from '../assets/sectors/logistics.jpg';
import itImg from '../assets/sectors/it.jpg';
import healthcareImg from '../assets/sectors/healthcare.jpg';
import othersImg from '../assets/sectors/others.jpg';

const sectors = [
  { name: 'Multinational Companies', image: itImg, text: 'Structured support for complex, multi-location workforce and governance requirements.' },
  { name: 'Manufacturing', image: manufacturingImg, text: 'Practical support across factories, workmen, contractors, registers and working conditions.' },
  { name: 'Infrastructure & Construction', image: logisticsImg, text: 'Compliance guidance for project workforces, contractors, migrant workers and site operations.' },
  { name: 'Hospitality', image: hospitalityImg, text: 'Employment, wage, social-security and establishment compliance for dynamic teams.' },
  { name: 'Logistics', image: logisticsImg, text: 'Workforce compliance processes designed for distributed operations and multiple locations.' },
  { name: 'Education', image: othersImg, text: 'Clear employment documentation, payroll and statutory compliance for institutions.' },
  { name: 'Dairy, Storage & Allied Businesses', image: manufacturingImg, text: 'Sector-aware advisory for operational establishments and varied workforce structures.' },
  { name: 'Professional & Business Services', image: healthcareImg, text: 'Modern HR policies, wage structures and Labour Codes readiness for knowledge businesses.' },
];

const Industries = () => (
  <div className="w-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
    <section className="py-20 lg:py-28" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="max-w-4xl mx-auto px-5 lg:px-10 text-center">
        <p className="uppercase tracking-[0.28em] font-semibold text-sm mb-4" style={{ color: '#fda102' }}>Industries We Serve</p>
        <h1 className="text-white text-4xl lg:text-6xl font-medium leading-tight mb-5">Trusted across industries for decades.</h1>
        <p className="text-white/80 text-base lg:text-xl leading-relaxed">Over the decades, MCS has supported organisations across diverse sectors and workforce environments.</p>
      </div>
    </section>
    <section className="py-12 lg:py-20" style={{ backgroundColor: '#f8fafb' }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {sectors.map((sector, index) => (
            <motion.article key={sector.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-40 overflow-hidden"><img src={sector.image} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-5">
                <Building2 size={20} style={{ color: 'var(--primary)' }} className="mb-3" />
                <h2 className="text-lg font-medium text-[#111] mb-2">{sector.name}</h2>
                <p className="text-sm leading-relaxed text-gray-600">{sector.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
    <section className="py-12 lg:py-16 bg-white text-center">
      <h2 className="text-3xl lg:text-4xl font-medium text-[#111] mb-4">Need sector-specific compliance support?</h2>
      <p className="max-w-2xl mx-auto px-5 text-gray-600 leading-relaxed mb-7">Our approach is aligned to your industry, establishment type, workforce structure, geography and risk profile.</p>
      <Link to="/contact" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white" style={{ backgroundColor: 'var(--primary)' }}>
        Talk to MCS <ArrowRight size={17} />
      </Link>
    </section>
  </div>
);

export default Industries;