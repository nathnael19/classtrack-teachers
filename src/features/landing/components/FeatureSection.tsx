import { ShieldCheck, BarChart3, FileText, Clock, Zap, QrCode } from 'lucide-react';

const FeatureSection = () => {
  return (
    <section id="features" className="py-32 relative z-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-5xl md:text-7xl font-black mb-8 font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white tracking-tight">
            Modern Academic Platform
          </h2>
          <p className="text-xl md:text-2xl text-[#0C4A6E]/70 dark:text-white/60 font-['Atkinson_Hyperlegible'] font-medium">
            ClassTrack replaces outdated roll calls with a fast, modern system built for 21st-century educators.
          </p>
        </div>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px] font-['Atkinson_Hyperlegible']">
          
          {/* Main Feature: Dynamic QR (Large) */}
          <div className="md:col-span-8 md:row-span-2 glass-bento p-12 flex flex-col justify-end group cursor-pointer bg-gradient-to-br from-white/60 to-[#0EA5E9]/5 dark:from-white/10 dark:to-transparent">
             <div className="w-20 h-20 rounded-[2rem] bg-[#0C4A6E] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 transition-transform group-hover:scale-110 duration-500">
                <Zap className="w-10 h-10 text-white animate-pulse" />
             </div>
             <h3 className="text-4xl font-black mb-4 font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white">QR Code Attendance</h3>
             <p className="text-lg text-[#0C4A6E]/70 dark:text-white/60 max-w-sm font-bold">
                Proprietary QR refresh logic prevents proxy attendance by regenerating secure tokens every 5 seconds.
             </p>
             <div className="absolute top-12 right-12 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                <QrCode className="w-64 h-64" />
             </div>
          </div>

          {/* Feature: Analytics (Tall) */}
          <div className="md:col-span-4 md:row-span-2 glass-bento p-10 flex flex-col group cursor-pointer border-primary/20 bg-[#0C4A6E] dark:bg-primary/20 text-white overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
             <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                <BarChart3 className="w-7 h-7 text-white" />
             </div>
             <h3 className="text-3xl font-black mb-4 font-['Crimson_Pro'] leading-none">Real-time Intelligence</h3>
             <p className="text-white/80 font-bold mb-8">
                Instant visualizations of classroom trends and at-risk student engagement metrics.
             </p>
             <div className="mt-auto pt-8 border-t border-white/10 flex items-end justify-between">
                <div className="flex gap-1.5 h-24 items-end">
                   {[40, 70, 45, 90, 60].map((h, i) => (
                     <div key={i} className="w-3 rounded-full bg-white/30 group-hover:bg-accent transition-all duration-500" style={{ height: `${h}%` }} />
                   ))}
                </div>
                <div className="text-4xl font-black font-['Crimson_Pro']">99.2%</div>
             </div>
          </div>

          {/* Feature: Security */}
          <div className="md:col-span-4 glass-bento p-8 flex flex-col group cursor-pointer hover:bg-[#F97316]/5 dark:hover:bg-[#F97316]/10">
             <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center mb-6 text-[#F97316]">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-black mb-2 font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white">Secure Radius</h3>
             <p className="text-sm text-[#0C4A6E]/70 dark:text-white/60 font-bold">
                Geofencing ensures students are physically present in the laboratory or lecture hall.
             </p>
          </div>

          {/* Feature: Export */}
          <div className="md:col-span-4 glass-bento p-8 flex flex-col group cursor-pointer hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10">
             <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
                <FileText className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-black mb-2 font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white">Instant Artifacts</h3>
             <p className="text-sm text-[#0C4A6E]/70 dark:text-white/60 font-bold">
                One-click PDF/CSV deployments for administrative regulatory compliance.
             </p>
          </div>

          {/* Feature: Time Saving */}
          <div className="md:col-span-4 glass-bento p-8 flex flex-col group cursor-pointer hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10">
             <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-500">
                <Clock className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-black mb-2 font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white">Time Saving</h3>
             <p className="text-sm text-[#0C4A6E]/70 dark:text-white/60 font-bold">
                Reclaim 12-15 minutes of instructional time per session through automated validation.
             </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
