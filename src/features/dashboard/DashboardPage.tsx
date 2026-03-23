import { 
  ArrowUpRight, ArrowDownRight, Users, BookOpen, Clock, Activity, 
  Loader2, TrendingUp, RefreshCw, Zap, Calendar, 
  Sparkles, Brain, Target, Plus
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// --- Types ---
interface DashboardStats {
  total_courses: number;
  active_sessions_today: number;
  students_present_today: number;
  avg_attendance_rate: number;
  attendance_change: string;
  is_positive: boolean;
}

interface ChartDataPoint {
  name: string;
  rate: number;
}

interface CourseDistribution {
  name: string;
  students: number;
}

interface RecentSession {
  id: number;
  course: string;
  date: string;
  present: number;
  total: number;
  rate: string;
}

// --- Premium Components ---
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
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
  return <span className="font-mono tabular-nums">{displayValue.toLocaleString()}{suffix}</span>;
};

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <div className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
    !noHover && "hover:shadow-primary/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1.5 hover:scale-[1.01]",
    className
  )}>
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

const StatCard = ({ title, value, change, isPositive, icon: Icon, suffix = "", colorClass = "indigo" }: { title: string; value: number; change: string; isPositive: boolean; icon: React.ComponentType<{ className?: string }>; suffix?: string; colorClass?: string }) => (
  <GlassCard className="p-8 flex flex-col justify-between" noHover>
    <div className="flex justify-between items-start">
      <div className={cn("p-4 rounded-2xl shadow-inner border border-white/20", `bg-${colorClass}-500/10`)}>
        <Icon className={cn("w-6 h-6", `text-${colorClass}-600 dark:text-${colorClass}-400`)} aria-hidden />
      </div>
      <div className={cn(
        "flex items-center text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm border",
        isPositive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
      )}>
        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
        {change}
      </div>
    </div>
    <div className="mt-8">
      <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.3em]">{title}</p>
      <div className="text-5xl font-black mt-2 tracking-tighter text-foreground italic">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
    </div>
  </GlassCard>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['weekly-trend'] });
    queryClient.invalidateQueries({ queryKey: ['course-distribution'] });
    queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
  };

  // --- Queries ---
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get('/analytics/dashboard')).data,
  });

  const { data: trendData, isLoading: trendLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ['weekly-trend'],
    queryFn: async () => (await api.get('/analytics/weekly-trend')).data,
  });

  const { data: distributionData, isLoading: distLoading } = useQuery<CourseDistribution[]>({
    queryKey: ['course-distribution'],
    queryFn: async () => (await api.get('/analytics/course-distribution')).data,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery<RecentSession[]>({
    queryKey: ['recent-sessions'],
    queryFn: async () => (await api.get('/analytics/recent-sessions')).data,
  });

  const isLoading = statsLoading || trendLoading || distLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-12 font-sans p-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Immersive Background */}
      <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[10%] w-[50rem] h-[50rem] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[5%] w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse transition-all duration-[time:4000ms]" />
      </div>

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Brain className="w-5 h-5 text-primary" />
             </div>
             <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">Overview</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground leading-[0.8] flex items-center gap-4">
            Dash<span className="text-primary italic">board</span>
            <div className="flex gap-1.5 mt-2">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
            </div>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xl">
            Real-time attendance tracking and academic performance insights.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button size="lg" onClick={handleRefresh} className="rounded-2xl h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-xl shadow-2xl font-black uppercase text-[10px] tracking-widest transition-all gap-3 active:scale-95">
            <RefreshCw className="w-4 h-4 opacity-60" />
            Dashboard
          </Button>
          <Button size="lg" className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 font-black uppercase text-[10px] tracking-widest transition-all gap-3 overflow-hidden group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            New Session
          </Button>
        </div>
      </header>

      {/* Bento Stat Matrix */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <StatCard title="Total Courses" value={stats?.total_courses ?? 0} change="+2" isPositive={true} icon={BookOpen} colorClass="indigo" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <StatCard title="Active Today" value={stats?.active_sessions_today ?? 0} change="PROD" isPositive={true} icon={Zap} colorClass="amber" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <StatCard title="Present Now" value={stats?.students_present_today ?? 0} change="SYNC" isPositive={true} icon={Users} colorClass="emerald" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <StatCard title="Attendance" value={stats?.avg_attendance_rate ?? 0} suffix="%" change={stats?.attendance_change ?? '0%'} isPositive={stats?.is_positive ?? true} icon={Activity} colorClass="purple" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Performance Delta */}
        <div className="col-span-12 lg:col-span-8">
          <GlassCard className="p-10 relative overflow-hidden group" noHover>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4">
                    Performance Comparison
                    <Badge variant="outline" className="text-[9px] border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-mono tracking-widest">LIVE_STREAM</Badge>
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 italic">Weekly Performance Metrics</p>
                </div>
                <div className="flex gap-2">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                      <TrendingUp className="w-5 h-5 text-primary" />
                   </div>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} 
                      dy={15} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} 
                      dx={-15} 
                      domain={[0, 100]} 
                    />
                    <Tooltip
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '8 8' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '24px', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        padding: '16px',
                        color: 'white'
                      }}
                      itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 900 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={6} 
                      fillOpacity={1} 
                      fill="url(#colorRate)" 
                      animationDuration={2500} 
                      strokeLinecap="round" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Demographics Mix */}
        <div className="col-span-12 lg:col-span-4">
          <GlassCard className="p-10 flex flex-col h-full bg-emerald-500/[0.02]" noHover>
            <div className="flex justify-between items-start mb-12">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                     Student Distribution
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 italic">Course breakdown</p>
               </div>
               <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-inner">
                  <Target className="w-5 h-5 text-emerald-500" />
               </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
               <div className="h-[280px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={distributionData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.1} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 10, fontWeight: 900 }} width={80} />
                     <Tooltip 
                       cursor={{ fill: 'hsl(var(--emerald-500) / 0.05)', radius: 16 }} 
                       contentStyle={{ 
                         backgroundColor: 'black',
                         borderRadius: '20px', 
                         border: 'none',
                         fontWeight: 'bold',
                         color: 'white'
                       }}
                     />
                     <Bar dataKey="students" fill="url(#emeraldGradient)" radius={[0, 16, 16, 0]} barSize={32} animationDuration={2000}>
                       <defs>
                         <linearGradient id="emeraldGradient" x1="0" y1="0" x2="1" y2="0">
                           <stop offset="0%" stopColor="#10b981" />
                           <stop offset="100%" stopColor="#34d399" />
                         </linearGradient>
                       </defs>
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/10 border-dashed">
                  <div className="flex items-center gap-4 text-emerald-500">
                     <Sparkles className="w-5 h-5 animate-pulse" />
                     <p className="text-xs font-bold leading-relaxed opacity-60">High engagement detected in Advanced Physics this cycle.</p>
                  </div>
               </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Academic Event Log */}
      <GlassCard className="overflow-visible" noHover>
        <div className="p-10 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white/5">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4">
              Recent Sessions
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(30,64,175,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
              </div>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">Successfully recorded attendance sessions</p>
          </div>
          <Button variant="ghost" size="lg" onClick={() => navigate('/reports')} className="rounded-2xl border border-white/10 hover:bg-white/10 transition-all px-10 font-black text-[10px] uppercase tracking-[0.2em] shadow-inner active:scale-95">
            Full History Array
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="py-8 font-black text-muted-foreground/30 uppercase tracking-[0.3em] text-[10px] pl-12">Course Name</th>
                <th className="py-8 font-black text-muted-foreground/30 uppercase tracking-[0.3em] text-[10px]">Date & Time</th>
                <th className="py-8 font-black text-muted-foreground/30 uppercase tracking-[0.3em] text-[10px]">Attendance</th>
                <th className="py-8 font-black text-muted-foreground/30 uppercase tracking-[0.3em] text-[10px]">Attendance Rate</th>
                <th className="py-8 font-black text-muted-foreground/30 uppercase tracking-[0.3em] text-[10px] text-right pr-12">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions?.map((session, idx) => (
                <tr 
                  key={session.id} 
                  className="group hover:bg-white/[0.04] transition-all duration-700 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                >
                  <td className="py-10 pl-12">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(30,64,175,0.5)] scale-0 group-hover:scale-100 transition-transform duration-700" />
                         <span className="font-black text-2xl text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none uppercase italic">{session.course}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground/40 font-mono tracking-widest pl-6">ID:://TRANS_X{session.id.toString().padStart(6, '0')}</span>
                    </div>
                  </td>
                  <td className="py-10 text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2.5 text-foreground italic">
                        <Calendar className="w-4 h-4 text-primary opacity-40" />
                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2.5 opacity-30 pl-6">
                         <Clock className="w-3.5 h-3.5" />
                         {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="py-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-primary italic font-mono tracking-tighter tabular-nums">{session.present}</span>
                      <span className="text-muted-foreground/20 font-black text-sm">/ {session.total.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-2.5 bg-white/5 rounded-full relative overflow-hidden border border-white/5 shadow-inner group-hover:border-white/10 transition-colors">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-r from-primary to-indigo-400 group-hover:shadow-[0_0_15px_rgba(30,64,175,0.4)]"
                          style={{ width: session.rate }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-black tracking-tighter text-foreground italic opacity-60 tabular-nums">{session.rate}</span>
                    </div>
                  </td>
                  <td className="py-10 pr-12 text-right">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/reports')} className="rounded-[1.25rem] w-14 h-14 bg-white/5 border border-white/10 hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all shadow-2xl group-hover:shadow-primary/30">
                      <ArrowUpRight className="w-7 h-7" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardPage;
