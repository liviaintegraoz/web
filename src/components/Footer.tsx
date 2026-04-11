import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t border-brand-secondary/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-serif font-bold">
          LiVia <span className="text-brand-primary italic">Integra</span>
        </div>
        <div className="text-sm text-brand-secondary text-center">
          {t.footer.rights}
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-secondary font-medium uppercase tracking-widest">
          <MapPin size={14} className="text-brand-primary" />
          {t.footer.location}
        </div>
      </div>
    </footer>
  );
}
