import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen } from 'lucide-react';

export default function Articles() {
  const { t } = useLanguage();

  const articles = [
    { id: 1, date: '2026-03-15', category: 'Integration' },
    { id: 2, date: '2026-02-28', category: 'Community' },
    { id: 3, date: '2026-01-10', category: 'Guide' },
  ];

  return (
    <section className="py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl mb-4">{t.articles.title}</h1>
          <p className="text-brand-secondary text-lg">{t.articles.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-brand-bg group cursor-pointer"
            >
              <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2 block">{article.category}</span>
              <h3 className="text-xl mb-4">Sample Article Title {article.id}</h3>
              <p className="text-brand-secondary text-sm mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <span className="text-xs text-brand-secondary">{article.date}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
