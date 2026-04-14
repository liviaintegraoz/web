import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Gallery() {
  const { lang, t } = useLanguage();

  const images: string[] = [];

  return (
    <section className="py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl mb-4">{t.gallery.title}</h1>
          <p className="text-brand-secondary text-lg">{t.gallery.subtitle}</p>
        </motion.div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="aspect-square overflow-hidden rounded-lg group"
              >
                <img 
                  src={src} 
                  alt={`Gallery ${idx}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-brand-ink/5 italic text-brand-secondary">
            {lang === 'en' ? 'Gallery is being updated. New photos coming soon.' : 'Galéria sa aktualizuje. Nové fotografie čoskoro pribudnú.'}
          </div>
        )}
      </div>
    </section>
  );
}
