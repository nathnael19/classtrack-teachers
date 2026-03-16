import LandingNav from './components/LandingNav';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import CTASection from './components/CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
      {/* Universal Grid pattern for background texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at center, black 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <LandingNav />
      {/* Main Content Area */}
      <main>
        <HeroSection />
        <FeatureSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 relative z-10 glass-card bg-background/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} ClassTrack. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
