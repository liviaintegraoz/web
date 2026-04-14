import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LAW_TOPICS } from '../constants';

export default function Law() {
  const { t } = useLanguage();

  return (
    <section className="py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl mb-4">{t.law.title}</h1>
          <p className="text-brand-secondary text-lg">{t.law.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {t.law.topics.map((topic: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6"
            >
              <div className="text-brand-primary">{LAW_TOPICS[idx].icon}</div>
              <h3 className="text-2xl">{topic.title}</h3>
              <p className="text-brand-secondary leading-relaxed">
                {topic.description}
              </p>
              <Link 
                to={`/law/${LAW_TOPICS[idx].id}`}
                className="inline-block text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline"
              >
                {t.law.readMore}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
