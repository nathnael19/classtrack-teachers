import LandingNav from './components/LandingNav';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import CTASection from './components/CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#0B0F19] relative selection:bg-primary/30 selection:text-primary overflow-x-hidden pt-20">
      {/* Immersive Atmospheric Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Primary Indigo Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        
        {/* Scholarly Sky Blue Accent */}
        <div className="absolute top-[20%] -right-[15%] w-[50%] h-[50%] bg-[#0EA5E9]/10 rounded-full blur-[100px] animate-blob" />
        
        {/* Soft Pink warmth */}
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-pink-400/5 rounded-full blur-[130px] animate-blob animation-delay-4000" />

        {/* High-Fidelity Mesh Grid */}
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0EA5E9 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      <LandingNav />
      {/* Main Content Area */}
      <main className="relative z-10">
        <HeroSection />
        <FeatureSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#0EA5E9]/10 py-16 relative z-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-black font-['Crimson_Pro'] bg-clip-text text-transparent bg-gradient-to-r from-[#0C4A6E] to-[#0EA5E9] dark:from-white dark:to-[#38BDF8] mb-4 block">
                ClassTrack
              </span>
              <p className="text-muted-foreground max-w-sm font-['Atkinson_Hyperlegible']">
                Redefining academic presence through intelligent tracking and spatial insights. Built for the modern educator.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#0C4A6E] dark:text-white mb-4 font-['Atkinson_Hyperlegible']">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-['Atkinson_Hyperlegible']">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0C4A6E] dark:text-white mb-4 font-['Atkinson_Hyperlegible']">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-['Atkinson_Hyperlegible']">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Trust Center</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#0EA5E9]/5 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4 font-['Atkinson_Hyperlegible']">
            <p>© {new Date().getFullYear()} ClassTrack Protocol. All rights reserved.</p>
            <div className="flex space-x-6">
              <span>Status: Operational</span>
              <span>v2.0.4 Premium</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
