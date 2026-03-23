import { ArrowRight, QrCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-10 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 mb-10 animate-fade-in cursor-default group hover:bg-white/60 transition-all duration-500 shadow-xl shadow-primary/5">
          <Sparkles className="w-4 h-4 text-[#F97316] group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold text-[#0C4A6E] dark:text-[#38BDF8] font-['Atkinson_Hyperlegible'] tracking-tight">The Modern Way to Track Attendance</span>
        </div>

        {/* Headlines */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#0C4A6E] dark:text-white max-w-5xl mb-8 font-['Crimson_Pro'] leading-[0.95]">
          Streamline Your <br/>
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#0EA5E9] to-accent italic px-2">
            Classroom
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-[#0C4A6E]/70 dark:text-white/60 max-w-2xl mb-14 font-['Atkinson_Hyperlegible'] font-medium leading-relaxed">
          Dynamic QR tracking meet scholarly precision. Effortless attendance, real-time analytics, and secure protocol generation for the modern university.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto font-['Atkinson_Hyperlegible']">
          <Link
            to="/register"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#0C4A6E] dark:bg-primary text-white font-black text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 active:scale-95 transition-all flex items-center justify-center space-x-3 group border border-white/10"
          >
            <span>Begin Integration</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl text-[#0C4A6E] dark:text-white font-black text-xl border border-white/20 hover:bg-white/60 transition-all flex items-center justify-center cursor-pointer shadow-xl shadow-black/5"
          >
            Review Modules
          </a>
        </div>

        {/* Hero Visual Mockup - Liquid Glass Dashboard */}
        <div className="mt-24 w-full max-w-6xl relative mx-auto group perspective-2000">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
          
          <div className="relative glass-bento p-1 md:p-1.5 border-white/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden transform transition-all duration-1000 ease-out hover:rotate-x-1 hover:-translate-y-4 hover:shadow-primary/20">
            {/* Fake Browser Chrome */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/20 dark:bg-white/5 backdrop-blur-md border-b border-white/10 rounded-t-[2.4rem]">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
                </div>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Atkinson_Hyperlegible']">
                  ClassTrack Admin // Protocol 04
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-[10px] font-black uppercase tracking-tighter animate-pulse">
                Live Terminal
              </div>
            </div>

            {/* The mock UI */}
            <div className="bg-[#F0F9FF] dark:bg-[#0B0F19] p-8 md:p-12 aspect-[16/9] relative overflow-hidden">
               {/* Decorative Dashboard Elements */}
               <div className="grid grid-cols-12 gap-6 h-full font-['Atkinson_Hyperlegible']">
                  <div className="col-span-8 flex flex-col gap-6">
                    <div className="h-1/3 w-full bg-white dark:bg-white/5 rounded-3xl border border-white/40 shadow-sm p-6 flex flex-col justify-end">
                       <div className="w-24 h-2 bg-primary/20 rounded-full mb-3" />
                       <div className="w-48 h-8 bg-primary/10 rounded-xl" />
                    </div>
                    <div className="flex-1 w-full bg-white dark:bg-white/5 rounded-3xl border border-white/40 shadow-sm p-8 flex items-center justify-around">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20" />
                            <div className="w-10 h-2 bg-[#0EA5E9]/5 rounded-full" />
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="col-span-4 bg-[#0C4A6E] dark:bg-primary/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <QrCode className="w-32 h-32 text-white mb-6 animate-pulse" />
                    <div className="text-white text-xl font-black font-['Crimson_Pro'] text-center">
                      CS-101 Verification
                    </div>
                    <div className="text-white/60 text-xs mt-2 font-bold tracking-widest text-center">
                      VALID: 12:44:09
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
