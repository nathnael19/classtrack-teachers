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
import api from "@/services/api";
import { GlassCard } from "@/components/ui/glass-card";



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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/analytics/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Dashboard Sync Failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
           <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Loading Admin Dashboard...</p>
           </div>
        </div>
     );
  }

  const { stats, user_growth, course_engagement, recent_activity, system_health } = data || {
    stats: { total_users: 0, total_courses: 0, live_sessions: 0, security_alerts: 0, user_growth_change: "0%", is_growth_positive: true },
    user_growth: [],
    course_engagement: [],
    recent_activity: [],
    system_health: { api_cluster: 0, database: 0, storage_core: 0 }
  };

  const activityWithIcons = recent_activity.map((a: any) => ({
    ...a,
    icon: a.icon === "Users" ? Users : BookOpen
  }));

  return (
    <div className="relative min-h-screen p-4 md:p-8 space-y-8 font-sans overflow-hidden">
      {/* Immersive Background Decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse [animation-duration:10s]" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 animate-pulse delay-700 [animation-duration:15s]" />
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary backdrop-blur-md">
                <LayoutGrid className="w-5 h-5" />
             </div>
             <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Admin Dashboard</Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400">
            System <span className="italic">Overview</span>
          </h1>
          <p className="text-xl font-medium text-muted-foreground/80 max-w-2xl leading-relaxed flex items-center gap-3">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </span>
             Manage users, courses, and system settings across the platform.
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
              <span>Create User</span>
           </Button>
        </div>
      </div>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* KPI: Users */}
        <div className="lg:col-span-3">
          <KPICard title="Total Users" value={stats.total_users} change={stats.user_growth_change} icon={Users} colorClass="text-indigo-500" />
        </div>

        {/* KPI: Courses */}
        <div className="lg:col-span-3">
          <KPICard title="Active Courses" value={stats.total_courses} change={stats.course_growth_change} icon={BookOpen} colorClass="text-amber-500" delay="100ms" />
        </div>

        {/* Global Performance: Area Chart */}
        <GlassCard className="lg:col-span-6 lg:row-span-2 p-8 flex flex-col" noHover>
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
               <h3 className="text-xl font-black tracking-tight">Enterprise Scaling</h3>
               <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">New User Trends</p>
            </div>
            <div className="px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Live Sync
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={user_growth}>
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
          <KPICard title="Active Sessions" value={stats.live_sessions} icon={Activity} colorClass="text-emerald-500" delay="200ms" />
        </div>

        {/* KPI: Security */}
        <div className="lg:col-span-3">
          <KPICard title="Security Alerts" value={stats.security_alerts} change={stats.security_alerts > 0 ? "Action Required" : "No Alerts"} icon={AlertCircle} colorClass="text-rose-500" delay="300ms" />
        </div>

        {/* System Journal: Activity feed */}
        <GlassCard className="lg:col-span-4 lg:row-span-2 p-8 space-y-8" noHover>
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black tracking-tight">System Logs</h3>
              <Badge variant="outline" className="font-mono text-[10px] opacity-40">ACTIVITY://LOGS</Badge>
           </div>
           <div className="space-y-6">
              {activityWithIcons.map((item: any, i: number) => (
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
              View All Logs
           </Button>
        </GlassCard>

        {/* Course Engagement: Bar Chart */}
        <GlassCard className="lg:col-span-4 lg:row-span-2 p-8" noHover>
           <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Course Engagement
           </h3>
           <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={course_engagement} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="currentColor" className="opacity-80" />
                  <Tooltip cursor={{ fill: 'currentColor', opacity: 0.05 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'black' }} />
                  <Bar dataKey="students" radius={[0, 20, 20, 0]} barSize={20}>
                    {course_engagement.map((_entry: any, index: number) => (
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
                    <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em]">Security Status</span>
                    <span className="text-lg font-black text-white tracking-tight">All Systems Operational</span>
                 </div>
              </div>
              <div className="space-y-6 flex-1">
                 {[
                   { label: "API NODES", value: system_health.api_cluster, color: "bg-indigo-500", icon: Server, status: system_health.api_cluster > 90 ? "Healthy" : "Load" },
                   { label: "DATABASE", value: system_health.database, color: "bg-emerald-500", icon: Database, status: "Stable" },
                   { label: "CLOUD STORAGE", value: system_health.storage_core, color: "bg-amber-500", icon: ServerCrash, status: "Peak" }
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
                 System Audit
              </Button>
           </div>
        </GlassCard>

      </div>
      
      {/* Decorative Footer Elements */}
      <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 font-mono text-[9px] tracking-[0.5em] uppercase">
         <div className="flex items-center gap-4">
            <Hexagon className="w-3 h-3" />
            <span>ClassTrack Administration</span>
         </div>
         <div className="flex items-center gap-4">
            <span>Uptime: 99.999%</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems synchronized</span>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
