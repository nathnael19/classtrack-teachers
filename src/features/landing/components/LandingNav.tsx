import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';

const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 md:top-6 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl',
        scrolled
          ? 'bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b md:border md:rounded-3xl border-white/20 shadow-2xl py-3 px-8 mx-auto'
          : 'bg-transparent py-6 px-8'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden ring-1 ring-white/20 shadow-inner">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <BookOpen className="w-6 h-6 text-primary relative z-10 transition-transform group-hover:scale-110" />
          </div>
          <span className="text-2xl font-black font-['Crimson_Pro'] bg-clip-text text-transparent bg-gradient-to-r from-[#0C4A6E] to-[#0EA5E9] dark:from-white dark:to-[#38BDF8] tracking-tight">
            ClassTrack
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-10 font-['Atkinson_Hyperlegible']">
          {['Features', 'Analytics', 'Testimonials'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-bold text-[#0C4A6E]/70 dark:text-white/70 hover:text-primary dark:hover:text-primary transition-all cursor-pointer relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-5 font-['Atkinson_Hyperlegible']">
          <Link
            to="/login"
            className="text-sm font-bold text-[#0C4A6E] dark:text-white hover:text-primary transition-colors flex items-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Log in</span>
          </Link>
          <Link
            to="/register"
            className="text-sm font-bold px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0C4A6E] to-[#0EA5E9] dark:from-primary dark:to-[#38BDF8] text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center space-x-2 border border-white/10"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline font-black tracking-wide">Enter Protocol</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
