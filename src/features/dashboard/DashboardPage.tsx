import { ArrowUpRight, ArrowDownRight, Users, BookOpen, Clock, Activity, Loader2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { useState, useEffect } from 'react';

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

// --- Helper Components ---
const CountUp = ({ value, duration = 1000, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

const StatCard = ({ title, value, change, isPositive, icon: Icon, suffix = "" }: { title: string; value: number; change: string; isPositive: boolean; icon: React.ComponentType<{ className?: string }>; suffix?: string }) => (
  <div className="glass-card p-6 flex flex-col group cursor-pointer border-indigo-50/50">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 rounded-2xl text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 shadow-sm shadow-primary/20">
        <Icon className="w-6 h-6" aria-hidden />
      </div>
      <div className={`flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm ${isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden />}
        <span>{change.split(' ')[0]}</span>
      </div>
    </div>
    <div>
      <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      <div className="text-4xl font-black mt-2 tracking-tighter tabular-nums text-foreground flex items-baseline gap-1">
        <CountUp value={value} />
        <span className="text-xl opacity-20">{suffix}</span>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
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
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 -left-60 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground leading-tight">Insight<span className="text-primary italic">Live</span></h1>
          <p className="text-muted-foreground/80 mt-1 font-semibold">Real-time academic performance & attendance tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="rounded-2xl px-8 border-indigo-100 hover:bg-primary/5 hover:text-primary transition-all font-bold"> Audit Log </Button>
          <Button size="lg" className="rounded-2xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"> Refresh Dash </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Courses" value={stats?.total_courses ?? 0} change="+0" isPositive={true} icon={BookOpen} />
        <StatCard title="Active Today" value={stats?.active_sessions_today ?? 0} change="+0" isPositive={true} icon={Activity} />
        <StatCard title="Present Now" value={stats?.students_present_today ?? 0} change="-0" isPositive={false} icon={Users} />
        <StatCard title="Attendance" value={stats?.avg_attendance_rate ?? 0} suffix="%" change={stats?.attendance_change ?? '0%'} isPositive={stats?.is_positive ?? true} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border-indigo-50/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-32 h-32 text-primary" />
          </div>
          <h2 className="text-2xl font-black mb-10 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full" />
            Performance Delta
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} dx={-15} domain={[0, 100]} />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '24px', 
                    border: '1px solid rgba(var(--primary), 0.1)', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    padding: '16px'
                  }}
                />
                <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={5} fillOpacity={1} fill="url(#colorRate)" animationDuration={2000} strokeLinecap="round" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border-emerald-50/50">
          <h2 className="text-2xl font-black mb-10 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
            Demographics
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 10, fontWeight: 900 }} width={60} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--emerald-500) / 0.05)', radius: 12 }} 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    borderRadius: '16px', 
                    border: '1px solid #f0f0f0',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="students" fill="url(#emeraldGradient)" radius={[0, 12, 12, 0]} barSize={24} animationDuration={2000}>
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
        </div>
      </div>

      <section className="glass-card p-10 rounded-[3rem] border-indigo-50/50 shadow-sm relative overflow-hidden" aria-labelledby="recent-sessions-heading">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 id="recent-sessions-heading" className="text-3xl font-black tracking-tight flex items-center gap-4">
              Academic Event Log
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
              </div>
            </h2>
            <p className="text-muted-foreground/70 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Latest verified classroom captures</p>
          </div>
          <Button variant="ghost" size="lg" className="rounded-2xl border border-indigo-50 hover:bg-slate-50 transition-all px-10 font-bold text-xs uppercase tracking-widest">
            Full History
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="pb-6 pt-2 font-black text-muted-foreground/40 uppercase tracking-[0.2em] text-[10px]">Registry</th>
                <th className="pb-6 pt-2 font-black text-muted-foreground/40 uppercase tracking-[0.2em] text-[10px]">Temporal Index</th>
                <th className="pb-6 pt-2 font-black text-muted-foreground/40 uppercase tracking-[0.2em] text-[10px]">Volume</th>
                <th className="pb-6 pt-2 font-black text-muted-foreground/40 uppercase tracking-[0.2em] text-[10px]">Intensity</th>
                <th className="pb-6 pt-2 font-black text-muted-foreground/40 uppercase tracking-[0.2em] text-[10px] text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sessions?.map((session) => (
                <tr key={session.id} className="group hover:bg-indigo-50/30 transition-all duration-500 cursor-pointer">
                  <td className="py-7 pr-4">
                    <div className="flex flex-col">
                      <span className="font-black text-lg text-foreground leading-none group-hover:text-primary transition-colors">{session.course}</span>
                      <span className="text-[10px] text-muted-foreground mt-1.5 font-bold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">ID: CT-{session.id.toString().padStart(4, '0')}</span>
                    </div>
                  </td>
                  <td className="py-7 text-muted-foreground font-black text-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <span className="pl-5 opacity-40">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="py-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-primary">{session.present}</span>
                      <span className="text-muted-foreground/30 font-bold">/ {session.total}</span>
                    </div>
                  </td>
                  <td className="py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2.5 bg-slate-100 rounded-full relative overflow-hidden shadow-inner border border-slate-200/50">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-r from-primary to-indigo-400 shadow-sm"
                          style={{ width: session.rate }}
                        />
                      </div>
                      <span className="font-black text-xs text-foreground tabular-nums">{session.rate}</span>
                    </div>
                  </td>
                  <td className="py-7 text-right">
                    <Button variant="ghost" size="icon" className="rounded-2xl w-12 h-12 bg-slate-50/50 hover:bg-primary hover:text-white hover:scale-110 active:scale-90 transition-all shadow-sm group-hover:shadow-primary/20">
                      <ArrowUpRight className="w-6 h-6" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
