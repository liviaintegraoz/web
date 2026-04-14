import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="relative">
            <h1 className="text-[12rem] font-serif font-bold text-brand-ink/5 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                <Home size={48} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-serif">
              {lang === 'en' ? 'Page Not Found' : 'Stránka nebola nájdená'}
            </h2>
            <p className="text-brand-secondary">
              {lang === 'en' 
                ? "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." 
                : "Stránka, ktorú hľadáte, mohla byť odstránená, premenovaná alebo je dočasne nedostupná."}
            </p>
          </div>

          <div className="pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-bold uppercase tracking-widest rounded-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
            >
              <ArrowLeft size={18} />
              {lang === 'en' ? 'Back to Home' : 'Späť na domov'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
