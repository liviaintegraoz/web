import { motion } from 'motion/react';
import { Globe, Handshake, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary mb-4 block">
              {t.nav.about}
            </span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
              {t.about.title}
            </h2>
            <p className="text-lg text-brand-secondary leading-relaxed mb-10">
              {t.about.description}
            </p>
            
            <div className="space-y-6">
              {t.about.services.map((service, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    {idx === 0 ? <Globe size={20} /> : idx === 1 ? <Handshake size={20} /> : <Users size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xl mb-1">{service.title}</h3>
                    <p className="text-brand-secondary text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative max-w-sm w-full">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-brand-bg">
                <img 
                  src="https://res.cloudinary.com/dof3jb9jb/image/upload/f_auto,q_auto/Foto_link_rmz0o0" 
                  alt="Lívia Hamráčková" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 md:-left-12 glass p-6 rounded-xl shadow-xl max-w-[240px]">
                <p className="font-serif italic text-brand-primary mb-2 text-base leading-tight">
                  "Bridging the gap between cultures."
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-ink mb-1">
                  Lívia Hamráčková
                </p>
                <p className="text-[9px] text-brand-secondary leading-tight">
                  CEO and Founder of LiVia Integra o.z
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
