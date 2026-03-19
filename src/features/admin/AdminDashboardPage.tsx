import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Users, BookOpen, Activity, AlertCircle, TrendingUp, 
  Plus, ShieldCheck, Server, Database, ServerCrash,
  Zap, Globe, LayoutGrid, Layers, Hexagon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const userGrowthData = [
  { name: 'Week 1', users: 400 },
  { name: 'Week 2', users: 650 },
  { name: 'Week 3', users: 850 },
  { name: 'Week 4', users: 1234 },
];

const activeCoursesData = [
  { name: 'CS101', students: 120 },
  { name: 'ENG201', students: 85 },
  { name: 'MAT301', students: 65 },
  { name: 'PHY101', students: 150 },
  { name: 'HIS102', students: 90 },
];

const recentActivity = [
  { id: 1, action: "New course created", detail: "Dr. Smith published 'Advanced Physics'", time: "2h ago", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, action: "User flagged", detail: "Suspicious login attempt from 192.168.1.1", time: "4h ago", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: 3, action: "Bulk import", detail: "Added 250 new student records", time: "1d ago", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 4, action: "System update", detail: "v2.1 kernel deployment successful", time: "1d ago", icon: Server, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{displayValue.toLocaleString()}</span>;
};

const GlassCard = ({ children, className = "", noHover = false, style = {} }: { children: React.ReactNode, className?: string, noHover?: boolean, style?: React.CSSProperties }) => (
  <div 
    className={cn(
      "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
      !noHover && "hover:shadow-primary/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1.5 hover:scale-[1.01]",
      className
    )}
    style={style}
  >
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    {children}
  </div>
);

const KPICard = ({ title, value, change, icon: Icon, colorClass, delay = "0ms" }: any) => (
  <GlassCard className={cn("p-6 flex flex-col justify-between h-48 animate-in fade-in slide-in-from-bottom-4 group")} style={{ animationDelay: delay }}>
    <div className="flex justify-between items-start">
      <div className="p-3 bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
        <Icon className={cn("w-6 h-6", colorClass)} />
      </div>
      {change && (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
           {change}
        </Badge>
      )}
    </div>
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-1">{title}</h3>
      <div className="text-4xl font-black tracking-tighter font-mono">
        <AnimatedNumber value={value} />
      </div>
    </div>
  </GlassCard>
);

const AdminDashboardPage = () => {
  return (
    <div className="relative min-h-screen p-4 md:p-8 space-y-8 font-sans overflow-hidden">
      {/* Immersive Background Decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse duration-[10s]" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 animate-pulse delay-700 duration-[15s]" />
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary backdrop-blur-md">
                <LayoutGrid className="w-5 h-5" />
             </div>
             <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Command Nucleus</Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400">
            System <span className="italic">Orchestra</span>
          </h1>
          <p className="text-xl font-medium text-muted-foreground/80 max-w-2xl leading-relaxed flex items-center gap-3">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </span>
             Omniscient control over the ClassTrack enterprise ecosystem.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/20 dark:bg-black/40 p-2.5 rounded-[2.5rem] border border-white/20 backdrop-blur-2xl shadow-2xl">
           <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-white/40 dark:hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
             <Globe className="w-6 h-6" />
           </Button>
           <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-white/40 dark:hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
             <Layers className="w-6 h-6" />
           </Button>
           <div className="w-[1px] h-8 bg-white/20 mx-2" />
           <Button className="h-14 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.8rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
              <span>Provision User</span>
           </Button>
        </div>
      </div>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* KPI: Users */}
        <div className="lg:col-span-3">
          <KPICard title="Total Nuclei" value={1234} change="+24.2%" icon={Users} colorClass="text-indigo-500" />
        </div>

        {/* KPI: Courses */}
        <div className="lg:col-span-3">
          <KPICard title="Active Orbs" value={56} change="+5 New" icon={BookOpen} colorClass="text-amber-500" delay="100ms" />
        </div>

        {/* Global Performance: Area Chart */}
        <GlassCard className="lg:col-span-6 lg:row-span-2 p-8 flex flex-col" noHover>
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
               <h3 className="text-xl font-black tracking-tight">Enterprise Scaling</h3>
               <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Global Onboarding Velocity</p>
            </div>
            <div className="px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Live Sync
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="currentColor" className="opacity-40" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="currentColor" className="opacity-40" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontWeight: 'black'
                  }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* KPI: Sessions */}
        <div className="lg:col-span-3">
          <KPICard title="Live Loops" value={12} icon={Activity} colorClass="text-emerald-500" delay="200ms" />
        </div>

        {/* KPI: Security */}
        <div className="lg:col-span-3">
          <KPICard title="Shield Vector" value={2} change="Action Required" icon={AlertCircle} colorClass="text-rose-500" delay="300ms" />
        </div>

        {/* System Journal: Activity feed */}
        <GlassCard className="lg:col-span-4 lg:row-span-2 p-8 space-y-8" noHover>
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black tracking-tight">System Journal</h3>
              <Badge variant="outline" className="font-mono text-[10px] opacity-40">STREAMS://LOGS</Badge>
           </div>
           <div className="space-y-6">
              {recentActivity.map((item, i) => (
                <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                   <div className={cn("mt-1 p-2 rounded-xl border border-white/10 shrink-0 transform group-hover:rotate-12 transition-transform", item.bg)}>
                      <item.icon className={cn("w-4 h-4", item.color)} />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                         <span className="text-sm font-black tracking-tight">{item.action}</span>
                         <span className="text-[9px] font-black uppercase text-muted-foreground/40">{item.time}</span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground/60 leading-relaxed">{item.detail}</p>
                   </div>
                </div>
              ))}
           </div>
           <Button variant="ghost" className="w-full h-12 rounded-[1.2rem] font-black uppercase tracking-widest text-[10px] hover:bg-white/5 border border-white/5">
              Access Full Archive
           </Button>
        </GlassCard>

        {/* Course Engagement: Bar Chart */}
        <GlassCard className="lg:col-span-4 lg:row-span-2 p-8" noHover>
           <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Orb Engagement
           </h3>
           <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeCoursesData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="currentColor" className="opacity-80" />
                  <Tooltip cursor={{ fill: 'currentColor', opacity: 0.05 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'black' }} />
                  <Bar dataKey="students" radius={[0, 20, 20, 0]} barSize={20}>
                    {activeCoursesData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f59e0b' : '#fb923c'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </GlassCard>

        {/* Infrastructure: Stats Grid */}
        <GlassCard className="lg:col-span-4 lg:row-span-2 bg-slate-900 group overflow-hidden" noHover>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_70%)]" />
           <div className="relative p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em]">Shield Status</span>
                    <span className="text-lg font-black text-white tracking-tight">Active Parity</span>
                 </div>
              </div>
              <div className="space-y-6 flex-1">
                 {[
                   { label: "API CLUSTER", value: 12, color: "bg-indigo-500", icon: Server, status: "Healthy" },
                   { label: "DATABASE", value: 45, color: "bg-emerald-500", icon: Database, status: "Stable" },
                   { label: "STORAGE CORE", value: 78, color: "bg-amber-500", icon: ServerCrash, status: "Peak" }
                 ].map((item) => (
                   <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40">
                         <span className="flex items-center gap-2 text-white/60"><item.icon className="w-3 h-3" /> {item.label}</span>
                         <span>{item.status}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                         <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.value}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
              <Button className="mt-8 w-full h-12 bg-white text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">
                 <Zap className="w-4 h-4 mr-2" />
                 Audit Nodes
              </Button>
           </div>
        </GlassCard>

      </div>
      
      {/* Decorative Footer Elements */}
      <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 font-mono text-[9px] tracking-[0.5em] uppercase">
         <div className="flex items-center gap-4">
            <Hexagon className="w-3 h-3" />
            <span>ClassTrack Central Command Node</span>
         </div>
         <div className="flex items-center gap-4">
            <span>Uptime: 99.999%</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cluster parity synced</span>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
