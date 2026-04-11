import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { lang, t, toggleLang } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const utilityLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.contact, path: '/contact' },
    { name: t.nav.download, path: '/download' },
  ];

  const mainLinks = [
    { name: t.nav.about, path: '/about' },
    { name: t.nav.articles, path: '/articles' },
    { name: t.nav.law, path: '/law' },
    { name: t.nav.gallery, path: '/gallery' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm' : 'bg-transparent'}`}>
      {/* Top Utility Bar */}
      <div className="border-b border-brand-ink/5 py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-end items-center gap-6">
          {utilityLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-[10px] uppercase font-bold tracking-widest text-brand-secondary hover:text-brand-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={toggleLang}
            className="text-[10px] font-bold text-brand-primary border border-brand-primary px-2 py-0.5 rounded hover:bg-brand-primary hover:text-white transition-all"
          >
            {lang === 'en' ? 'SK' : 'EN'}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`${scrolled ? 'py-3' : 'py-6'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
            LiVia <span className="text-brand-primary italic">Integra</span>
          </Link>

          {/* Desktop Main Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-6 text-sm font-medium uppercase tracking-widest text-brand-secondary">
              {mainLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`hover:text-brand-primary transition-colors ${location.pathname === link.path ? 'text-brand-primary' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={toggleLang} className="text-xs font-bold text-brand-primary border border-brand-primary px-2 py-1 rounded">
              {lang === 'en' ? 'SK' : 'EN'}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-ink">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-brand-ink/20 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-brand-bg">
                <span className="text-xl font-serif font-bold">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-brand-ink">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col gap-1">
                  {[...utilityLinks, ...mainLinks].map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      className={`py-4 px-4 rounded-lg text-lg font-serif transition-all ${
                        location.pathname === link.path 
                          ? 'bg-brand-primary text-white shadow-md' 
                          : 'text-brand-ink hover:bg-brand-bg'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-brand-bg">
                <button 
                  onClick={toggleLang}
                  className="w-full py-3 border-2 border-brand-primary text-brand-primary font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-all"
                >
                  {lang === 'en' ? 'Switch to Slovensky' : 'Prepnúť na English'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
