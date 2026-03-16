import { ArrowRight, QrCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-10 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-secondary/50 backdrop-blur-md border border-primary/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in cursor-default group hover:bg-secondary/80 transition-colors">
          <Sparkles className="w-4 h-4 text-accent group-hover:animate-pulse" />
          <span className="text-sm font-medium text-primary">The modern way to track attendance</span>
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl mb-6">
          Effortless Attendance with{' '}
          <span className="relative inline-block text-transparent bg-clip-text vibrant-gradient">
            Intelligent QR Tracking
            <svg
              className="absolute -bottom-2 left-0 w-full text-accent"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              style={{ height: '0.2em' }}
            >
              <path d="M0,5 Q50,15 100,5" stroke="currentColor" strokeWidth="3" fill="none" className="path-draw" />
            </svg>
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-12 sm:leading-relaxed">
          Generate secure dynamic QR codes in seconds. Get real-time class analytics, 
          instant PDF reports, and give back teaching time to educators.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Start for free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-foreground font-medium text-lg hover:bg-white/50 transition-all flex items-center justify-center cursor-pointer"
          >
            Explore features
          </a>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-20 w-full max-w-5xl relative mx-auto group perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 sm:h-32 bottom-0 top-auto" />
          <div className="glass-card rounded-2xl md:rounded-[2rem] p-2 md:p-4 border-white/20 shadow-2xl overflow-hidden relative transform transition-transform duration-700 ease-out group-hover:rotate-x-2 group-hover:-translate-y-2 group-hover:shadow-3xl bg-white/40">
            {/* Fake Browser Window */}
            <div className="flex items-center space-x-2 px-4 pb-4 pt-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            {/* The mock UI */}
            <div className="bg-background rounded-b-xl overflow-hidden aspect-video relative flex items-center justify-center">
              <div className="text-center p-8 glass-card max-w-sm w-full mx-4 rounded-2xl transform transition-transform duration-500 hover:scale-105">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner">
                  <QrCode className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-2">CS101 Session</h3>
                <p className="text-sm text-muted-foreground mb-6">Scan to mark present</p>
                <div className="aspect-square bg-white rounded-xl mx-auto w-48 shadow-sm flex items-center justify-center p-4">
                  {/* Mock QR */}
                  <div className="w-full h-full border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                    <QrCode className="w-16 h-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
