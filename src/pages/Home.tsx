import { motion } from 'motion/react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import NewsSlider from '../components/NewsSlider';

export default function Home() {
  const { t, lang } = useLanguage();

  return (
    <main>
      <header id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596436807386-532397568940?auto=format&fit=crop&q=80&w=2070" 
            alt="Bratislava" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-transparent to-brand-bg" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl leading-[0.9] mb-8 text-balance">
                {t.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-brand-secondary font-light mb-10 max-w-xl leading-relaxed">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact" 
                  className="px-8 py-4 bg-brand-primary text-white font-semibold rounded-sm hover:bg-brand-primary/90 transition-all flex items-center gap-2 group"
                >
                  {t.hero.cta}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about" 
                  className="px-8 py-4 border border-brand-secondary text-brand-ink font-semibold rounded-sm hover:bg-brand-ink hover:text-white transition-all"
                >
                  {t.nav.about}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] w-64 h-64 rounded-full border border-brand-primary/20 hidden lg:block"
        />
      </header>

      {/* News Slider Section */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
                <Newspaper size={16} />
                {lang === 'en' ? 'Latest Updates' : 'Najnovšie správy'}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif">
                {lang === 'en' ? 'Legal & Integration News' : 'Právne a integračné novinky'}
              </h2>
            </div>
            <Link to="/articles" className="hidden md:flex items-center gap-2 text-brand-ink font-bold uppercase tracking-widest text-xs hover:text-brand-primary transition-colors">
              {lang === 'en' ? 'View All Articles' : 'Všetky články'}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <NewsSlider />
      </section>
    </main>
  );
}
