import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Mail, Scale, ShieldCheck, Globe, Info, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchLegalTopicDetails, LegalTopicDetail } from '../services/legalService';

export default function LawDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [details, setDetails] = useState<LegalTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      if (!topicId) return;
      setLoading(true);
      try {
        const data = await fetchLegalTopicDetails(topicId, lang);
        setDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [topicId, lang]);

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

  if (!details) return null;

  return (
    <main className="py-32 min-h-screen bg-brand-bg">
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate('/law')}
          className="flex items-center gap-2 text-brand-secondary hover:text-brand-primary transition-colors mb-12 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {lang === 'en' ? 'Back to Law' : 'Späť na Právo'}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              <section key={idx} className="space-y-6">
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
                    href="mailto:info@liviaintegraoz.sk" 
                    className="text-brand-primary font-bold hover:underline text-lg"
                  >
                    info@liviaintegraoz.sk
                  </a>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
