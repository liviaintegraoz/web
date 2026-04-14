import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Mail, Scale, ShieldCheck, Globe, Info, ExternalLink, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchLegalTopicDetails, LegalTopicDetail } from '../services/legalService';
import { LAW_TOPICS } from '../constants';

export default function LawDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [details, setDetails] = useState<LegalTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadDetails = async () => {
    if (!topicId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLegalTopicDetails(topicId, lang);
      // Normalize URLs to ensure they are clickable
      if (data.legalActs) {
        data.legalActs = data.legalActs.map(act => ({
          ...act,
          url: act.url.startsWith('http') ? act.url : `https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/${act.url.split('/').pop()}`
        }));
      }
      setDetails(data);
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? 'Failed to fetch legal updates. Please try again.' : 'Nepodarilo sa načítať právne informácie. Skúste to znova.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
    setIsSidebarOpen(false);
  }, [topicId, lang]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-brand-secondary font-serif italic">
            {lang === 'en' ? 'Consulting legal database...' : 'Konzultujeme právnu databázu...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Info size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif">{lang === 'en' ? 'Update Failed' : 'Aktualizácia zlyhala'}</h2>
            <p className="text-brand-secondary">{error}</p>
          </div>
          <button 
            onClick={loadDetails}
            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-sm hover:bg-brand-primary/90 transition-all"
          >
            {lang === 'en' ? 'Try Again' : 'Skúsiť znova'}
          </button>
        </div>
      </div>
    );
  }

  if (!details) return null;

  return (
    <main className="py-32 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-8">
              <button 
                onClick={() => navigate('/law')}
                className="flex items-center gap-2 text-brand-secondary hover:text-brand-primary transition-colors group mb-8"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                {lang === 'en' ? 'Back to Overview' : 'Späť na prehľad'}
              </button>

              <div className="lg:hidden mb-8">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-brand-ink/10 text-brand-ink font-bold"
                >
                  <span className="flex items-center gap-3">
                    <Menu size={20} />
                    {lang === 'en' ? 'Legal Topics' : 'Právne témy'}
                  </span>
                  {isSidebarOpen ? <X size={20} /> : <ChevronLeft size={20} className="-rotate-90" />}
                </button>
              </div>

              <nav className={`${isSidebarOpen ? 'block' : 'hidden lg:block'} space-y-6`}>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-4 mb-4">
                    {lang === 'en' ? 'Legal Topics' : 'Právne témy'}
                  </h3>
                  {LAW_TOPICS.map((topic, idx) => {
                    const isActive = topic.id === topicId;
                    const topicTitle = t.law.topics[idx].title;
                    
                    return (
                      <div key={topic.id} className="space-y-1">
                        <Link
                          to={`/law/${topic.id}`}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive 
                              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                              : 'text-brand-secondary hover:bg-white hover:text-brand-primary'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'text-brand-primary'}>
                            {topic.icon}
                          </span>
                          <span className="font-medium">{topicTitle}</span>
                        </Link>

                        {isActive && details.sections.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pl-12 pr-4 py-2 space-y-2 border-l-2 border-brand-primary/20 ml-6"
                          >
                            {details.sections.map((section, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => scrollToSection(`section-${sIdx}`)}
                                className="block w-full text-left text-sm text-brand-secondary hover:text-brand-primary transition-colors py-1"
                              >
                                {section.title}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={topicId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-ink/5"
            >
              <div className="p-8 md:p-12 bg-brand-ink text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                    <Scale size={24} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif">{details.title}</h1>
                </div>
                <p className="text-white/60 text-sm italic">
                  {lang === 'en' 
                    ? 'Information is automatically updated based on current Slovak legislation.' 
                    : 'Informácie sú automaticky aktualizované na základe aktuálnej slovenskej legislatívy.'}
                </p>
              </div>

              <div className="p-8 md:p-12 space-y-12">
                {details.sections.map((section, idx) => (
                  <section key={idx} id={`section-${idx}`} className="space-y-6 scroll-mt-32">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-brand-primary rounded-full" />
                      <h2 className="text-2xl font-serif">{section.title}</h2>
                    </div>
                    <div className="prose prose-brand max-w-none text-brand-secondary leading-relaxed">
                      <p>{section.content}</p>
                      {section.items && (
                        <ul className="grid md:grid-cols-2 gap-4 mt-6 list-none p-0">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 bg-brand-bg p-4 rounded-xl text-sm">
                              <ShieldCheck size={18} className="text-brand-primary shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                ))}

                <section className="bg-brand-bg p-8 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-brand-ink font-bold uppercase tracking-widest text-xs">
                    <Globe size={16} />
                    {lang === 'en' ? 'Relevant Legal Acts' : 'Relevantné právne predpisy'}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {details.legalActs.map((act, i) => (
                      <a 
                        key={i} 
                        href={act.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white border border-brand-ink/10 rounded-xl text-xs text-brand-primary font-medium hover:border-brand-primary hover:shadow-sm transition-all flex items-center gap-2 group"
                      >
                        {act.name}
                        <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </section>

                <section className="pt-12 border-t border-brand-bg">
                  <div className="bg-brand-primary/5 p-8 rounded-3xl border border-brand-primary/10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center shrink-0">
                      <Mail size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-serif mb-2">
                        {lang === 'en' ? 'Need personalized guidance?' : 'Potrebujete osobné poradenstvo?'}
                      </h3>
                      <p className="text-brand-secondary mb-4">
                        {lang === 'en' 
                          ? 'At LiVia Integra, we provide individual consultations to help you navigate your specific situation.' 
                          : 'V LiVia Integra vám poskytneme individuálne konzultácie, ktoré vám pomôžu zorientovať sa vo vašej konkrétnej situácii.'}
                      </p>
                      <a 
                        href="mailto:info@liviaintegra.sk" 
                        className="text-brand-primary font-bold hover:underline text-lg"
                      >
                        info@liviaintegra.sk
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
