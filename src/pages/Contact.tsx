import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, MessageSquare, Handshake, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-4">{t.contact.title}</h2>
            <p className="text-brand-secondary text-lg">{t.contact.subtitle}</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-1">Email</p>
                <p className="text-lg font-medium">info@liviaintegra.sk</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-1">Location</p>
                <p className="text-lg font-medium">Mlynské nivy 5/A, 821 09 Bratislava, Slovakia</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-1">Social</p>
                <div className="flex gap-4 mt-2">
                  <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors">LinkedIn</a>
                  <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors">Instagram</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-brand-bg"
            >
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Handshake size={32} />
                  </div>
                  <h3 className="text-2xl mb-2">{t.contact.success}</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary">{t.contact.name}</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-brand-bg border-none rounded-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary">{t.contact.email}</label>
                      <input 
                        required
                        type="email" 
                        className="w-full px-4 py-3 bg-brand-bg border-none rounded-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary">{t.contact.message}</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 bg-brand-bg border-none rounded-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 bg-brand-primary text-white font-bold uppercase tracking-widest rounded-sm hover:bg-brand-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formStatus === 'submitting' ? '...' : t.contact.submit}
                    <ChevronRight size={18} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
