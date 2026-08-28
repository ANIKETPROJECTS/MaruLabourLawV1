import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import iconLocation from '@assets/placeholder_1783488477011.png';
import iconCall from '@assets/call_1783488542810.png';
import iconMail from '@assets/communication_1783488559887.png';
import { api } from '../lib/api';
import { useLiveContent } from '../hooks/useLiveContent';
import type { ServiceContent, FooterContent } from '../types/content';

const SOCIAL_ICONS: Record<string, string> = {
  whatsappUrl:  '/assets/social-whatsapp.png',
  instagramUrl: '/assets/social-instagram.png',
  linkedinUrl:  '/assets/social-linkedin.png',
  facebookUrl:  '/assets/social-facebook.png',
  twitterUrl:   '/assets/social-twitter.png',
};
const SOCIAL_LABELS: Record<string, string> = {
  whatsappUrl: 'WhatsApp', instagramUrl: 'Instagram', linkedinUrl: 'LinkedIn',
  facebookUrl: 'Facebook', twitterUrl: 'Twitter',
};

const FOOTER_DEFAULTS: FooterContent = {
  tagline: "India's trusted labour law consultancy specializing in HR compliance, statutory filings, payroll, and staffing solutions across 15+ states.",
  whatsappUrl:  'https://wa.me/919876543210',
  instagramUrl: 'https://instagram.com/maruconsultancy',
  linkedinUrl:  'https://linkedin.com/company/maruconsultancy',
  facebookUrl:  'https://facebook.com/maruconsultancy',
  twitterUrl:   'https://twitter.com/maruconsultancy',
  address:      '15th Floor, Nariman Point, Mumbai, Maharashtra 400021',
  phone1: '+91 98765 43210', phone1Href: 'tel:+919876543210',
  phone2: '022 4567 8900',   phone2Href: 'tel:02245678900',
  email: 'contact@labourcodes.in',
  newsletterText: 'Subscribe for critical compliance alerts and regulatory updates.',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.0530!2d72.82161!3d18.92556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c2a26c9969%3A0x9b74cf8ec1c57f40!2sNariman%20Point%2C%20Mumbai%2C%20Maharashtra%20400021!5e0!3m2!1sen!2sin!4v1720343000000!5m2!1sen!2sin',
  copyrightName: 'Maru Consultancy Services Pvt. Ltd.',
  devByText: 'Airavata Technologies',
  devByUrl:  'https://www.airavatatechnologies.com/',
  bottomLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Sitemap', href: '#' },
  ],
};

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setServicesOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredServiceParent, setHoveredServiceParent] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [footer, setFooter] = useState<FooterContent>(FOOTER_DEFAULTS);
  const location = useLocation();

  const fetchServices = () => {
    api.get<ServiceContent[]>('/services').then(setServices).catch(() => {});
  };
  const fetchFooter = () => {
    api.get<FooterContent>('/footer')
      .then((d) => setFooter({ ...FOOTER_DEFAULTS, ...d, bottomLinks: d.bottomLinks?.length ? d.bottomLinks : FOOTER_DEFAULTS.bottomLinks }))
      .catch(() => {});
  };
  useEffect(fetchServices, []);
  useEffect(fetchFooter, []);
  useLiveContent(fetchServices);
  useLiveContent(fetchFooter);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setServicesOpen(false);
    setHoveredServiceParent(null);
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        const prev = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        el.scrollIntoView({ block: 'start' });
        document.documentElement.style.scrollBehavior = prev;
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Labour Codes', path: '/labour-codes' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Industries', path: '/industries' },
    { name: 'Resources & Knowledge', path: '/resources' },
    { name: 'Careers', path: '/careers' },
  ];

  // Live from the CMS (Admin → Services), already sorted by rank via the API.
  // Parent categories power the navigation; child services appear in the
  // adjacent panel when a parent is hovered.
  const serviceLinks = services
    .filter((s) => !s.parentSlug)
    .map((s) => ({ name: s.title, slug: s.slug }));
  const serviceGroups = serviceLinks.map((parent) => ({
    ...parent,
    children: services
      .filter((service) => service.parentSlug === parent.slug)
      .map((service) => ({ name: service.title, slug: service.slug })),
  }));
  const activeServiceGroup = serviceGroups.find((group) => group.slug === hoveredServiceParent)
    ?? serviceGroups[0];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>

        {/* ── Main nav bar (dark) ── */}
        <div style={{ backgroundColor: '#172632' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-[56px] lg:h-[76px] flex justify-between items-center">

            {/* Logo */}
            <Link to="/" className="self-stretch flex items-center lg:-ml-10 shrink-0">
              <img
                src="/assets/maru-logo-new.png"
                alt="Maru Labour Laws — Consultants & Practitioners"
                className="w-auto object-contain block h-[46px] lg:h-[68px] bg-white rounded-md p-1"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const highlighted = active || hoveredLink === link.name;
                return link.hasDropdown ? (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => {
                      setHoveredLink(link.name);
                      setHoveredServiceParent(activeServiceGroup?.slug ?? null);
                    }}
                    onMouseLeave={() => {
                      setHoveredLink(null);
                      setHoveredServiceParent(null);
                    }}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center gap-0.5 font-semibold text-[0.88rem] px-2.5 py-2.5 transition-colors duration-200"
                      style={{ fontFamily: 'Poppins, sans-serif', color: highlighted ? '#fda102' : '#ffffff' }}
                    >
                      {link.name}
                      <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-200" />
                    </Link>
                    {/* Hover underline */}
                    <span
                      className="absolute bottom-1 left-2.5 right-2.5 h-[2px] transition-transform duration-300 pointer-events-none"
                      style={{ backgroundColor: '#fda102', transform: highlighted ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }}
                    />
                    <div className="absolute top-full left-0 mt-1 w-[560px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="grid grid-cols-[230px_1fr] min-h-[220px]">
                        <div className="border-r border-gray-100 bg-gray-50/80 py-2">
                          {serviceGroups.map((parent) => (
                            <Link
                              key={parent.slug}
                              to={`/services/${parent.slug}`}
                              onMouseEnter={() => setHoveredServiceParent(parent.slug)}
                              className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition-colors duration-150"
                              style={{
                                fontFamily: 'Poppins, sans-serif',
                                color: activeServiceGroup?.slug === parent.slug ? '#fda102' : '#374151',
                                backgroundColor: activeServiceGroup?.slug === parent.slug ? '#fff8ed' : 'transparent',
                              }}>
                              <span>{parent.name}</span>
                              <span aria-hidden="true" className="text-base leading-none">›</span>
                            </Link>
                          ))}
                        </div>
                        <div className="py-4 px-5">
                          <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--primary)', fontFamily: 'Poppins, sans-serif' }}>
                            {activeServiceGroup?.name}
                          </p>
                          <div className="grid grid-cols-1 gap-0.5">
                            {(activeServiceGroup?.children ?? []).map((child) => (
                              <Link
                                key={child.slug}
                                to={`/services/${child.slug}`}
                                className="rounded-lg px-2.5 py-2 text-sm text-gray-600 font-medium transition-colors duration-150 hover:bg-[#fff8ed] hover:text-[#fda102]"
                                style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <Link
                      to={link.path}
                      className="font-semibold text-[0.88rem] px-2.5 py-2.5 block transition-colors duration-200"
                      style={{ fontFamily: 'Poppins, sans-serif', color: highlighted ? '#fda102' : '#ffffff' }}
                    >
                      {link.name}
                    </Link>
                    {/* Hover underline */}
                    <span
                      className="absolute bottom-1 left-2.5 right-2.5 h-[2px] transition-transform duration-300 pointer-events-none"
                      style={{ backgroundColor: '#fda102', transform: highlighted ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }}
                    />
                  </div>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/contact"
                className="px-5 py-2 rounded-full font-bold text-[0.82rem] transition-all duration-200 shadow-sm whitespace-nowrap"
                style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fda102', color: '#ffffff', border: '2px solid #fda102' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#fda102'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fda102'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}>
                Contact Us
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
              style={{ color: '#ffffff' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>{/* end dark nav bar */}

        {/* Mobile Nav — slides in from the RIGHT */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Drawer panel — full width on mobile */}
              <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-[60] flex flex-col overflow-y-auto">

                {/* Drawer header */}
                <div className="flex justify-between items-center px-5 py-4 shrink-0" style={{ backgroundColor: '#172632' }}>
                  <img src="/assets/maru-logo-new.png" alt="Maru Labour Laws" className="h-9 w-auto object-contain bg-white rounded-md p-1" />
                  <button onClick={() => setIsMenuOpen(false)} style={{ color: '#ffffff' }} aria-label="Close menu">
                    <X size={22} />
                  </button>
                </div>

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto">
                  {navLinks.map((link, i) => (
                    <motion.div key={link.name}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.045 }}>
                      <Link
                        to={link.path}
                        className="block px-5 py-4 border-b border-gray-100 font-bold text-base transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif', color: isActive(link.path) ? '#fda102' : '#111111', backgroundColor: isActive(link.path) ? '#fff8ed' : '' }}
                        onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                      </Link>
                      {link.hasDropdown && (
                        <div className="bg-gray-50">
                          {serviceGroups.map((parent) => (
                            <div key={parent.slug}>
                              <Link to={`/services/${parent.slug}`}
                                className="block pl-9 pr-5 py-3 border-b border-gray-100 text-sm font-semibold transition-colors"
                                style={{ fontFamily: 'Poppins, sans-serif', color: '#555555' }}
                                onClick={() => setIsMenuOpen(false)}>
                                › {parent.name}
                              </Link>
                              {parent.children.map((child) => (
                                <Link key={child.slug} to={`/services/${child.slug}`}
                                  className="block pl-14 pr-5 py-2.5 border-b border-gray-100 text-xs font-medium transition-colors"
                                  style={{ fontFamily: 'Poppins, sans-serif', color: '#777777' }}
                                  onClick={() => setIsMenuOpen(false)}>
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bottom contacts */}
                <div className="p-5 border-t border-gray-100 shrink-0 flex flex-col gap-3">
                  <a href="tel:+912235725001" className="flex items-center gap-2 text-sm text-gray-600">
                    <img src={iconCall} alt="" className="w-4 h-4 object-contain" /> 022-35725001
                  </a>
                  <a href="mailto:info@labourlaws.co.in" className="flex items-center gap-2 text-sm text-gray-600">
                    <img src={iconMail} alt="" className="w-4 h-4 object-contain" /> info@labourlaws.co.in
                  </a>
                  <Link to="/contact"
                    className="mt-1 block w-full text-center text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
                    style={{ backgroundColor: 'var(--primary)' }}
                    onClick={() => setIsMenuOpen(false)}>
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-white border-t-4" style={{ borderTopColor: 'var(--primary)' }}>

        {/* Main content grid */}
        <div className="max-w-7xl mx-auto px-4 lg:px-10 pt-8 lg:pt-14 pb-8 lg:pb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mb-8 lg:mb-12">

            {/* ── Col 1: Brand — full width on mobile ── */}
            <motion.div className="col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="mb-3 lg:mb-5">
                <img src="/assets/maru-logo-new.png" alt="Maru Consultancy Services"
                  className="h-12 lg:h-16 w-auto object-contain bg-white rounded-md p-1" />
              </div>
              <p className="text-xs lg:text-sm leading-relaxed mb-4 lg:mb-6 text-justify"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#111111' }}>
                {footer.tagline}
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {(Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).map((key) => {
                  const href = footer[key as keyof FooterContent] as string;
                  if (!href) return null;
                  return (
                    <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={SOCIAL_LABELS[key]}
                      className="w-8 h-8 lg:w-10 lg:h-10 hover:scale-110 transition-transform duration-200">
                      <img src={SOCIAL_ICONS[key]} alt={SOCIAL_LABELS[key]} className="w-full h-full object-contain" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Col 2: Our Services ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 className="font-bold text-xs lg:text-sm mb-4 lg:mb-6 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--primary)' }}>Our Services</h3>
              <ul className="space-y-2 lg:space-y-3">
                {serviceLinks.slice(0, 8).map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`}
                      className="text-xs lg:text-sm flex items-center gap-2 transition-colors duration-200"
                      style={{ fontFamily: 'Poppins, sans-serif', color: '#111111' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#111111'; }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#fda102' }} />
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Col 3: Contact Us ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h3 className="font-bold text-xs lg:text-sm mb-4 lg:mb-6 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--primary)' }}>Contact Us</h3>
              <ul className="space-y-3 lg:space-y-5">
                <li className="flex gap-2.5" style={{ fontFamily: 'Poppins, sans-serif', color: '#111111' }}>
                  <img src={iconLocation} alt="" aria-hidden="true" className="w-4 h-4 lg:w-5 lg:h-5 shrink-0 mt-0.5 object-contain" />
                  <span className="text-xs lg:text-sm leading-snug">{footer.address}</span>
                </li>
                <li className="flex gap-2.5" style={{ fontFamily: 'Poppins, sans-serif', color: '#111111' }}>
                  <img src={iconCall} alt="" aria-hidden="true" className="w-4 h-4 lg:w-5 lg:h-5 shrink-0 mt-0.5 object-contain" />
                  <div className="text-xs lg:text-sm">
                    {footer.phone1 && (
                      <a href={footer.phone1Href || `tel:${footer.phone1.replace(/\s+/g, '')}`}
                        className="block transition-colors duration-200 font-medium"
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ''; }}>
                        {footer.phone1}
                      </a>
                    )}
                    {footer.phone2 && (
                      <a href={footer.phone2Href || `tel:${footer.phone2.replace(/\s+/g, '')}`}
                        className="block transition-colors duration-200"
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ''; }}>
                        {footer.phone2}
                      </a>
                    )}
                  </div>
                </li>
                {footer.email && (
                  <li className="flex gap-2.5" style={{ fontFamily: 'Poppins, sans-serif', color: '#111111' }}>
                    <img src={iconMail} alt="" aria-hidden="true" className="w-4 h-4 lg:w-5 lg:h-5 shrink-0 mt-0.5 object-contain" />
                    <a href={`mailto:${footer.email}`}
                      className="text-xs lg:text-sm transition-colors duration-200 font-medium break-all"
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ''; }}>
                      {footer.email}
                    </a>
                  </li>
                )}
              </ul>
            </motion.div>

            {/* ── Col 4: Newsletter — full width on mobile ── */}
            <motion.div className="col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h3 className="font-bold text-xs lg:text-sm mb-4 lg:mb-6 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--primary)' }}>Newsletter</h3>
              <p className="text-xs lg:text-sm mb-3 lg:mb-5 leading-relaxed"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#111111' }}>
                {footer.newsletterText}
              </p>
              <form className="flex flex-col gap-2.5 lg:gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="rounded-lg px-3 py-2.5 lg:px-4 lg:py-3 text-xs lg:text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: '#f9fafb',
                    border: '1.5px solid #e5e7eb',
                    color: '#111111',
                  }}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
                />
                <button type="submit"
                  className="px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg text-xs lg:text-sm font-bold text-white transition-all duration-200"
                  style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--primary)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#fda102';
                    (e.currentTarget as HTMLElement).style.color = '#1a1a1a';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)';
                    (e.currentTarget as HTMLElement).style.color = '#ffffff';
                  }}>
                  Subscribe Now
                </button>
              </form>
            </motion.div>
          </div>

          {/* ── Google Map ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="w-full rounded-xl lg:rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-6 lg:mb-10"
            style={{ height: '220px' }}>
            {footer.mapEmbedUrl && (
              <iframe
                title="Maru Consultancy Services Location"
                src={footer.mapEmbedUrl}
                width="100%"
                height="220"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </motion.div>

          {/* ── Bottom bar ── */}
          <div className="pt-4 lg:pt-6 border-t border-gray-200 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="text-center md:text-left" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <p className="text-xs font-medium" style={{ color: '#111111' }}>
                &copy; {new Date().getFullYear()} {footer.copyrightName} All rights reserved.
              </p>
              {footer.devByText && footer.devByUrl && (
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                  Designed &amp; Developed by{' '}
                  <a href={footer.devByUrl} target="_blank" rel="noreferrer"
                    className="font-semibold transition-colors duration-200"
                    style={{ color: 'var(--primary)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fda102'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}>
                    {footer.devByText}
                  </a>
                </p>
              )}
            </div>
            {footer.bottomLinks.length > 0 && (
              <div className="flex gap-4 flex-wrap justify-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {footer.bottomLinks.map(({ label, href }) => (
                  <Link key={label} to={href || '#'}
                    className="text-xs font-medium transition-colors duration-200"
                    style={{ color: '#111111' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#111111'; }}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Scroll to Top — hidden when mobile menu is open */}
      {scrolled && !isMenuOpen && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
          style={{ backgroundColor: 'var(--primary)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fda102'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)'; }}
          aria-label="Scroll to top">
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
};

export default Layout;
