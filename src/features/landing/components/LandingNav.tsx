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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:top-4 md:left-4 md:right-4 md:rounded-2xl',
        scrolled
          ? 'glass-card border-b md:border shadow-sm py-3 px-6'
          : 'bg-transparent py-5 px-6'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <BookOpen className="w-6 h-6 text-primary relative z-10" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            ClassTrack
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer">
            Features
          </a>
          <a href="#analytics" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer">
            Analytics
          </a>
          <a href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer">
            Testimonials
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Log in</span>
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium px-5 py-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Sign up free</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
