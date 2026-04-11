import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Smartphone, Apple, PlayCircle } from 'lucide-react';

export default function Download() {
  const { t } = useLanguage();

  return (
    <section className="py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl mb-8 leading-tight">{t.download.title}</h1>
            <p className="text-xl text-brand-secondary mb-12 leading-relaxed">
              {t.download.subtitle} Get access to local guides, administrative checklists, and community events directly on your phone.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-brand-ink text-white rounded-xl flex items-center gap-3 hover:bg-brand-ink/90 transition-all">
                <Apple size={24} />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-60 leading-none">Download on the</p>
                  <p className="text-lg font-bold leading-none">App Store</p>
                </div>
              </button>
              <button className="px-8 py-4 bg-brand-ink text-white rounded-xl flex items-center gap-3 hover:bg-brand-ink/90 transition-all">
                <PlayCircle size={24} />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-60 leading-none">Get it on</p>
                  <p className="text-lg font-bold leading-none">Google Play</p>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex justify-center"
          >
            <div className="w-64 h-[500px] bg-brand-ink rounded-[3rem] border-8 border-brand-ink shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-brand-ink rounded-b-2xl z-20" />
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800" 
                alt="App screenshot" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative circles */}
            <div className="absolute -z-10 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
