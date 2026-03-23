import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="glass-bento p-16 md:p-24 text-center relative overflow-hidden group border-white/40 shadow-primary/10">
          
          {/* Internal Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-200" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#F97316]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-[#F97316]/20 shadow-inner">
               <Sparkles className="w-10 h-10 text-[#F97316] animate-pulse" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-[#0C4A6E] dark:text-white font-['Crimson_Pro'] tracking-tighter leading-none">
              Ready to Save <br />
              <span className="italic text-primary">Teaching Time?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-[#0C4A6E]/70 dark:text-white/60 mb-12 max-w-2xl mx-auto font-['Atkinson_Hyperlegible'] font-bold leading-relaxed">
              Join the growing community of educators using ClassTrack to streamline attendance, 
              engage students, and generate powerful insights instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 font-['Atkinson_Hyperlegible']">
              <Link
                to="/register"
                className="px-10 py-5 rounded-2xl bg-[#0C4A6E] dark:bg-primary text-white font-black text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 group border border-white/10"
              >
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
            
            <p className="mt-8 text-sm font-bold text-[#0C4A6E]/40 dark:text-white/30 tracking-widest uppercase font-['Atkinson_Hyperlegible']">
              NO CREDIT CARD REQUIRED. v2.0 SECURE PLATFORM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
