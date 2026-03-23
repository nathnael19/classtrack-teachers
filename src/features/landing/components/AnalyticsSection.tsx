import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, ShieldCheck, Zap } from 'lucide-react';

const engagementData = [
  { time: '08:00', value: 45 },
  { time: '09:00', value: 52 },
  { time: '10:00', value: 48 },
  { time: '11:00', value: 61 },
  { time: '12:00', value: 55 },
  { time: '13:00', value: 67 },
  { time: '14:00', value: 72 },
  { time: '15:00', value: 65 },
];

const AnalyticsSection = () => {
  return (
    <section id="analytics" className="py-24 relative z-10 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-[#0EA5E9] text-xs font-black tracking-widest uppercase font-['Atkinson_Hyperlegible']">
              <Activity className="w-3 h-3" />
              <span>Real-time Tracking</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white leading-[0.95] tracking-tighter">
              Academic <br />
              <span className="italic text-primary">Insights for Every Session.</span>
            </h2>
            
            <p className="text-xl text-[#0C4A6E]/70 dark:text-white/60 font-['Atkinson_Hyperlegible'] font-medium leading-relaxed max-w-md">
              Transform raw attendance data into actionable academic insights. Monitor cohort health, session trends, and attendance patterns in a single, high-fidelity dashboard.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 font-['Atkinson_Hyperlegible']">
              <div className="space-y-1">
                <div className="text-3xl font-black text-[#0C4A6E] dark:text-white">99.8%</div>
                <div className="text-xs font-bold text-[#0C4A6E]/40 dark:text-white/40 uppercase tracking-widest">System Accuracy</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-[#0C4A6E] dark:text-white">&lt; 2s</div>
                <div className="text-xs font-bold text-[#0C4A6E]/40 dark:text-white/40 uppercase tracking-widest">Verification Latency</div>
              </div>
            </div>
          </div>

          {/* Visualization Zone */}
          <div className="lg:col-span-7 relative">
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 blur-[80px] opacity-50" />
            
            <div className="relative glass-bento p-8 border-white/30 shadow-2xl space-y-8 overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0C4A6E] dark:text-white font-['Atkinson_Hyperlegible']">Session Attendance Data</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Fira_Code']">Active Course Session</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <div className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Live Stream</div>
                </div>
              </div>

              {/* Main Chart */}
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        backdropFilter: 'blur(8px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontSize: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-4 font-['Atkinson_Hyperlegible']">
                <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-[#0EA5E9]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0C4A6E]/50 dark:text-white/50">Trend</span>
                  </div>
                  <div className="text-lg font-black text-[#0C4A6E] dark:text-white">+12.4%</div>
                </div>
                <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0C4A6E]/50 dark:text-white/50">Integrity</span>
                  </div>
                  <div className="text-lg font-black text-[#0C4A6E] dark:text-white">Optimal</div>
                </div>
                <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/20">
                   <div className="h-full flex items-center justify-center">
                      <div className="flex gap-1 items-end">
                        {[20, 40, 30, 60].map((h, i) => (
                          <div key={i} className="w-1.5 h-full bg-primary/20 rounded-full overflow-hidden">
                             <div className="w-full bg-primary" style={{ height: `${h}%` }} />
                          </div>
                        ))}
                      </div>
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

export default AnalyticsSection;
