import { Camera, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const { t } = useI18n();

  const footerLinks = [
    {
      title: t('footer.about'),
      links: [
        { label: t('about.title'), href: '/about' },
        { label: t('about.contact'), href: '/contact' },
        { label: t('about.faq'), href: '/faq' },
      ],
    },
    {
      title: t('nav.services'),
      links: [
        { label: t('services.wedding'), href: '/services' },
        { label: t('services.portrait'), href: '/services' },
        { label: t('services.fashion'), href: '/services' },
      ],
    },
    {
      title: t('footer.help'),
      links: [
        { label: t('footer.faq'), href: '/faq' },
        { label: t('footer.terms'), href: '/terms' },
        { label: t('footer.privacy'), href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className={`bg-primary text-white ${className}`}>
      <div className="container-wide lg:mr-72 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-secondary/20">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black">لومینو</span>
            </Link>
            <p className="text-white/50 leading-relaxed mb-6 text-sm">
              {t('about.subtitle')}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-all duration-300 border border-white/5"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-all duration-300 border border-white/5"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-all duration-300 border border-white/5"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-lg mb-5">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-secondary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} لومینو. {t('footer.copyright')}
            </p>
            <p className="text-white/30 text-sm flex items-center gap-1.5">
              {t('footer.madeWith')} <Heart className="w-3.5 h-3.5 text-accent fill-accent" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FooterContact() {
  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center gap-3 text-white/50 hover:text-secondary transition-colors">
        <Mail className="w-4 h-4" />
        <span className="text-sm">info@lumio.ir</span>
      </div>
      <div className="flex items-center gap-3 text-white/50 hover:text-secondary transition-colors">
        <Phone className="w-4 h-4" />
        <span className="text-sm">۰۲۱-۱۲۳۴۵۶۷۸</span>
      </div>
      <div className="flex items-center gap-3 text-white/50 hover:text-secondary transition-colors">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">تهران، خیابان ولیعصر</span>
      </div>
    </div>
  );
}
