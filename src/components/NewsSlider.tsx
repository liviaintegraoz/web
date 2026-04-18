import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import { fetchLatestSlovakLegalNews, NewsItem } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

export default function NewsSlider() {
  const { lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const data = await fetchLatestSlovakLegalNews(lang);
      setNews(data);
      setLoading(false);
    }
    loadNews();
  }, [lang]);

  useEffect(() => {
    if (news.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 8000); // Rotate every 8 seconds
    return () => clearInterval(timer);
  }, [news]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % news.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
          <p className="text-brand-secondary font-serif italic">Fetching latest legal updates...</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) return null;

  const current = news[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-brand-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={current.imageUrl} 
            alt={current.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {current.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs">
                    <Clock size={12} />
                    {current.date}
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-6xl text-white mb-6 leading-tight font-serif">
                  {current.title}
                </h2>
                
                <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light">
                  {current.summary}
                </p>

                <div className="flex items-center gap-6">
                  <button className="px-8 py-4 bg-white text-brand-ink font-bold uppercase tracking-widest rounded-sm hover:bg-brand-primary hover:text-white transition-all flex items-center gap-2 group">
                    {lang === 'en' ? 'Read Full Update' : 'Celý článok'}
                    <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-6 md:right-12 flex items-center gap-4 z-20">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          {news.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-8 bg-brand-primary' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Bar */}
      <motion.div 
        key={`progress-${currentIndex}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 8, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary origin-left z-30"
      />
    </div>
  );
}
