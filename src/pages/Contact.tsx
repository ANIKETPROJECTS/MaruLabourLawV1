import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { ContactContent } from '../types/content';
import heroVideo from '@assets/7683053-hd_1920_1080_24fps_1783584828907.mp4';
import iconLocation from '@assets/placeholder_1783488477011.png';
import iconCall from '@assets/call_1783488542810.png';
import iconMail from '@assets/communication_1783488559887.png';
import chatIcon from '@assets/chat_1783587012486.png';
import iconInternet from '@assets/internet_1785391505434.png';
import iconWhatsapp from '@assets/apple_1785391621302.png';

const DEFAULTS: ContactContent = {
  heroEyebrow:    'Complex Laws. Clear Solutions.',
  heroHeading:    'Talk to Our Labour Law Experts',
  heroSubtext:    'Whether you are implementing the Labour Codes, reviewing salary structures, strengthening contractor compliance, preparing for an inspection or seeking greater confidence in your statutory compliance framework, our team can assist.',
  formTitle:      'Schedule a Consultation',
  formSubtext:    'Share your requirement and our team will respond with the right next step.',
  phone1:         '022-35725001',
  phone2:         '+91-8169800969',
  email1:         'info@labourlaws.co.in',
  email2:         'maru.labourlaw@gmail.com',
  addressLine1:   '614, Exim-Link (property registration bldg) Near Runwal Greens,',
  addressLine2:   'Mulund Goregaon Link Road, Nahur(west), Mumbai 400 078',
  addressLine3:   '',
  hoursWeekdays:  'Monday – Friday: 9:30 AM – 6:30 PM',
  hoursWeekend:   'Saturday & Sunday: Closed',
  serviceOptions: [
    'Labour Law Compliance',
    'Payroll & Salary Structuring',
    'Statutory Compliance & Filings',
    'Audits & Governance',
    'Contract Staffing',
    'Registrations & Licensing',
    'HR Policy & Advisory',
    'Legal Representation',
    'Training & Workshops',
    'Other / General Inquiry',
  ],
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.9!2d72.8232!3d18.9256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c6cfb3b99b%3A0x4a5a3a6d7e5f4f1a!2sNariman%20Point%2C%20Mumbai%2C%20Maharashtra%20400021!5e0!3m2!1sen!2sin!4v1700000000000',
};

const PP = 'Poppins, sans-serif';

const IconCall = ({ size = 18 }: { size?: number }) => (
  <img src={iconCall} alt="" className="object-contain" style={{ width: size, height: size }} />
);
const IconMail = ({ size = 18 }: { size?: number }) => (
  <img src={iconMail} alt="" className="object-contain" style={{ width: size, height: size }} />
);
const IconLocation = ({ size = 18 }: { size?: number }) => (
  <img src={iconLocation} alt="" className="object-contain" style={{ width: size, height: size }} />
);

const FIELD_STYLE: React.CSSProperties = {
  fontFamily: PP,
  fontSize: '0.92rem',
  width: '100%',
  border: '1.5px solid #e5e7eb',
  borderRadius: '12px',
  padding: '12px 16px',
  outline: 'none',
  backgroundColor: '#fafafa',
  color: '#111',
  transition: 'border-color 0.2s',
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: PP,
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--primary)',
  display: 'block',
  marginBottom: '6px',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const Contact = () => {
  const [apiData, setApiData] = useState<ContactContent>(DEFAULTS);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [focused, setFocused] = useState('');

  const fetchContact = () => {
    api.get<ContactContent>('/contact').then(res => setApiData({
      heroEyebrow:    res.heroEyebrow    ?? DEFAULTS.heroEyebrow,
      heroHeading:    res.heroHeading    ?? DEFAULTS.heroHeading,
      heroSubtext:    res.heroSubtext    ?? DEFAULTS.heroSubtext,
      formTitle:      res.formTitle      ?? DEFAULTS.formTitle,
      formSubtext:    res.formSubtext    ?? DEFAULTS.formSubtext,
      phone1:         res.phone1         ?? DEFAULTS.phone1,
      phone2:         res.phone2         ?? DEFAULTS.phone2,
      email1:         res.email1         ?? DEFAULTS.email1,
      email2:         res.email2         ?? DEFAULTS.email2,
      addressLine1:   res.addressLine1   ?? DEFAULTS.addressLine1,
      addressLine2:   res.addressLine2   ?? DEFAULTS.addressLine2,
      addressLine3:   res.addressLine3   ?? DEFAULTS.addressLine3,
      hoursWeekdays:  res.hoursWeekdays  ?? DEFAULTS.hoursWeekdays,
      hoursWeekend:   res.hoursWeekend   ?? DEFAULTS.hoursWeekend,
      serviceOptions: res.serviceOptions?.length ? res.serviceOptions : DEFAULTS.serviceOptions,
      mapEmbedUrl:    res.mapEmbedUrl    ?? DEFAULTS.mapEmbedUrl,
    })).catch(() => {/* keep defaults on error */});
  };
  useEffect(fetchContact, []);
  useLiveContent(fetchContact);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Submission failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputProps = (name: string) => ({
    style: { ...FIELD_STYLE, borderColor: focused === name ? 'var(--primary)' : '#e5e7eb' },
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(''),
  });

  return (
    <div className="w-full" style={{ fontFamily: PP }}>

      {/* ── Hero ── */}
      <section className="flex items-center justify-center overflow-hidden relative"
        style={{ minHeight: '260px', maxHeight: '420px', height: '48vh' }}>
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 15%' }}
          src={heroVideo}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(30,10,0,0.62)' }} />
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-2 sm:px-8 w-full max-w-6xl mx-auto relative z-10">
          <p className="uppercase tracking-[0.3em] font-light mb-3"
            style={{ fontFamily: PP, fontSize: '1.4rem', color: '#fda102' }}>
            {apiData.heroEyebrow}
          </p>
          <h1 className="font-medium mb-4"
            style={{ fontFamily: PP, fontSize: 'min(5vw, 3.6rem)', fontWeight: 500, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
            {apiData.heroHeading}
          </h1>
          <p style={{
            fontFamily: PP, fontWeight: 300, fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
            color: 'rgba(255,255,255,0.88)', maxWidth: '1000px', width: '100%', margin: '0 auto', lineHeight: 1.7,
            paddingLeft: '2rem', paddingRight: '2rem',
          }}>
            Labour Code implementation, payroll structuring, contractor compliance &amp; inspection readiness — our experts deliver clear, confident guidance.
          </p>
        </motion.div>
      </section>

      {/* ── Form + Info ── */}
      <section className="py-16" style={{ backgroundColor: '#f8fafb' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-4 sm:px-10 py-6 border-b border-gray-100 flex items-center gap-3">
                <img src={chatIcon} alt="" className="object-contain" style={{ width: 34, height: 34 }} />
                <div>
                  <h3 className="font-bold leading-none" style={{ fontFamily: PP, fontSize: '1.1rem', color: '#111' }}>
                    {apiData.formTitle}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: PP }}>
                    {apiData.formSubtext}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-8 md:p-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-md"
                      style={{ backgroundColor: 'var(--p-a09)' }}>
                      <CheckCircle size={32} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h3 className="font-bold mb-2" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
                      Message Sent!
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm leading-relaxed" style={{ fontFamily: PP }}>
                      Thank you for reaching out. One of our compliance experts will get back to you within 1 business day.
                    </p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' }); }}
                      className="mt-7 font-semibold text-sm flex items-center gap-1.5 transition-opacity hover:opacity-70"
                      style={{ fontFamily: PP, color: 'var(--primary)' }}>
                      Send another message <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label style={LABEL_STYLE}>Full Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} required
                          type="text" placeholder="Your full name" {...inputProps('name')} />
                      </div>
                      <div>
                        <label style={LABEL_STYLE}>Email Address *</label>
                        <input name="email" value={form.email} onChange={handleChange} required
                          type="email" placeholder="your@email.com" {...inputProps('email')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label style={LABEL_STYLE}>Phone Number *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} required
                          type="tel" placeholder="+91 98765 43210" {...inputProps('phone')} />
                      </div>
                      <div>
                        <label style={LABEL_STYLE}>Company Name</label>
                        <input name="company" value={form.company} onChange={handleChange}
                          type="text" placeholder="Your company" {...inputProps('company')} />
                      </div>
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Service Interest</label>
                      <select name="service" value={form.service} onChange={handleChange}
                        style={{ ...FIELD_STYLE, borderColor: focused === 'service' ? 'var(--primary)' : '#e5e7eb', appearance: 'none' }}
                        onFocus={() => setFocused('service')} onBlur={() => setFocused('')}>
                        <option value="">Select a service...</option>
                        {apiData.serviceOptions.map((opt, i) => (
                          <option key={i}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Your Message</label>
                      <textarea name="message" value={form.message} onChange={handleChange}
                        rows={5} placeholder="Describe your compliance challenge or query..."
                        style={{ ...FIELD_STYLE, borderColor: focused === 'message' ? 'var(--primary)' : '#e5e7eb', resize: 'none' }}
                        onFocus={() => setFocused('message')} onBlur={() => setFocused('')} />
                    </div>
                    {submitError && (
                      <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5" style={{ fontFamily: PP }}>
                        {submitError}
                      </p>
                    )}
                    <button type="submit" disabled={submitting}
                      className="w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
                      style={{ fontFamily: PP, backgroundColor: 'var(--primary)', color: '#fff' }}>
                      {submitting ? 'Sending…' : <><span>Send Message</span><ArrowRight size={16} /></>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── Info Sidebar ── */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Contact info card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="px-7 py-4 text-xs font-bold uppercase tracking-widest text-center"
                  style={{ backgroundColor: 'var(--primary)', color: '#fda102', fontFamily: PP }}>
                  Contact Details
                </div>
                <div className="bg-white p-7 space-y-6">

                  {/* Partners */}
                  <div className="grid grid-cols-2 gap-4 pb-5 border-b border-gray-100">
                    {[
                      { name: 'Mr. Pankhil Maru', phone: '+91-9819405423', email: 'pankhil.maru@labourlaws.co.in' },
                      { name: 'Mr. Nishit Maru',  phone: '+91-9833872761', email: 'nishit.maru@labourlaws.co.in' },
                    ].map((p, i) => (
                      <div key={i}>
                        <p className="font-bold text-sm" style={{ fontFamily: PP, color: '#111' }}>{p.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: PP }}>Managing Partner</p>
                        <a href={`tel:${p.phone.replace(/\s/g,'')}`}
                          className="block text-xs mt-1.5 transition-opacity hover:opacity-60"
                          style={{ fontFamily: PP, color: '#444' }}>{p.phone}</a>
                        <a href={`mailto:${p.email}`}
                          className="block text-xs mt-0.5 transition-opacity hover:opacity-60 break-all"
                          style={{ fontFamily: PP, color: '#444' }}>{p.email}</a>
                      </div>
                    ))}
                  </div>

                  {/* Company name + address */}
                  <div className="flex items-start gap-4">
                    <IconLocation size={28} />
                    <div>
                      <p className="font-bold text-sm mb-1" style={{ fontFamily: PP, color: '#111' }}>Maru Consultancy Services</p>
                      <p className="text-sm leading-relaxed" style={{ fontFamily: PP, color: '#444', textAlign: 'justify' }}>
                        {[apiData.addressLine1, apiData.addressLine2, apiData.addressLine3].filter(Boolean).join(' ')}
                      </p>
                    </div>
                  </div>

                  {/* Telephone */}
                  <div className="flex items-start gap-4">
                    <IconCall size={28} />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: PP, color: 'var(--primary)' }}>Telephone</p>
                      {[
                        { label: apiData.phone1, href: `tel:${apiData.phone1.replace(/\s/g,'')}` },
                        { label: '+91-8104031092', href: 'tel:+918104031092' },
                      ].map((t, j) => (
                        <a key={j} href={t.href}
                          className="block text-sm leading-relaxed transition-opacity hover:opacity-60"
                          style={{ fontFamily: PP, color: '#444' }}>
                          {t.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <img src={iconWhatsapp} alt="WhatsApp" className="shrink-0 object-contain" style={{ width: 28, height: 28, borderRadius: 6 }} />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: PP, color: 'var(--primary)' }}>WhatsApp</p>
                      {[
                        { label: '+91-8169800969', href: 'tel:+918169800969' },
                        { label: '+91-9819420371', href: 'tel:+919819420371' },
                      ].map((t, j) => (
                        <a key={j} href={t.href}
                          className="block text-sm leading-relaxed transition-opacity hover:opacity-60"
                          style={{ fontFamily: PP, color: '#444' }}>
                          {t.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <IconMail size={28} />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: PP, color: 'var(--primary)' }}>E-mail</p>
                      {[apiData.email1, apiData.email2].filter(Boolean).map((em, j) => (
                        <a key={j} href={`mailto:${em}`}
                          className="block text-sm leading-relaxed transition-opacity hover:opacity-60"
                          style={{ fontFamily: PP, color: '#444' }}>{em}</a>
                      ))}
                    </div>
                  </div>

                  {/* Website */}
                  <div className="flex items-start gap-4">
                    <img src={iconInternet} alt="Website" className="shrink-0 object-contain" style={{ width: 28, height: 28 }} />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: PP, color: 'var(--primary)' }}>Website</p>
                      <a href="https://www.labourlaws.co.in" target="_blank" rel="noopener noreferrer"
                        className="text-sm transition-opacity hover:opacity-60"
                        style={{ fontFamily: PP, color: '#444' }}>www.labourlaws.co.in</a>
                    </div>
                  </div>

                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                style={{ height: '260px', position: 'relative' }}>
                <iframe
                  src={apiData.mapEmbedUrl}
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Maru Consultancy Office Location"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
