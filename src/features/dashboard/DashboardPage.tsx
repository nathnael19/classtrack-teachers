import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Users, BookOpen, Clock, Activity, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

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
  rate2?: number;
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

const getRateVariant = (rate: string) => {
  const n = parseInt(rate, 10);
  if (n >= 90) return 'bg-success';
  if (n >= 80) return 'bg-warning';
  return 'bg-destructive';
};

// --- Helper Components ---
const StatCard = ({ title, value, change, isPositive, icon: Icon }: { title: string; value: string; change: string; isPositive: boolean; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="glass-card p-6 flex flex-col group cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 rounded-2xl text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-6">
        <Icon className="w-6 h-6" aria-hidden />
      </div>
      <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-0.5 shrink-0" aria-hidden /> : <ArrowDownRight className="w-4 h-4 mr-0.5 shrink-0" aria-hidden />}
        <span>{change}</span>
      </div>
    </div>
    <div>
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-bold mt-2 tracking-tight tabular-nums text-glow">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<ChartDataPoint[]>([]);
  const [distributionData, setDistributionData] = useState<CourseDistribution[]>([]);
  const [sessions, setSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendRes, distRes, sessionsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/weekly-trend'),
          api.get('/analytics/course-distribution'),
          api.get('/analytics/recent-sessions'),
        ]);
        setStats(statsRes.data);
        setTrendData(trendRes.data);
        setDistributionData(distRes.data);
        setSessions(sessionsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in duration-700">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10" />

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">Welcome back to ClassTrack. Here&apos;s your attendance overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Courses" value={String(stats?.total_courses ?? 0)} change="+2 from last term" isPositive={true} icon={BookOpen} />
        <StatCard title="Active Sessions" value={String(stats?.active_sessions_today ?? 0)} change="+1 from yesterday" isPositive={true} icon={Activity} />
        <StatCard title="Total Present" value={String(stats?.students_present_today ?? 0)} change="-12 from yesterday" isPositive={false} icon={Users} />
        <StatCard title="Avg. Attendance" value={`${stats?.avg_attendance_rate ?? 0}%`} change={stats?.attendance_change ?? '0%'} isPositive={stats?.is_positive ?? true} icon={Clock} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10" aria-label="Charts">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-8 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Weekly Attendance Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.4)', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
                  }}
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: 'white', stroke: 'hsl(var(--primary))', strokeWidth: 2 }} 
                  activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                  animationDuration={1500}
                />
                <Line type="monotone" dataKey="rate2" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" opacity={0.3} dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-8 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Course Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 600 }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.4)', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
                  }}
                />
                <Bar dataKey="students" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} barSize={32} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 rounded-3xl overflow-hidden" aria-labelledby="recent-sessions-heading">
        <div className="flex justify-between items-center mb-8">
          <h2 id="recent-sessions-heading" className="text-2xl font-bold tracking-tight">Recent Sessions</h2>
          <Button variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-all px-6">
            Everything
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50">
                <th className="pb-4 pt-2 font-bold text-muted-foreground uppercase tracking-wider text-xs">Course Name</th>
                <th className="pb-4 pt-2 font-bold text-muted-foreground uppercase tracking-wider text-xs">Date & Time</th>
                <th className="pb-4 pt-2 font-bold text-muted-foreground uppercase tracking-wider text-xs">Students</th>
                <th className="pb-4 pt-2 font-bold text-muted-foreground uppercase tracking-wider text-xs">Rate</th>
                <th className="pb-4 pt-2 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sessions.map((session) => (
                <tr key={session.id} className="group hover:bg-primary/5 transition-all duration-300 translate-x-0 hover:translate-x-1">
                  <td className="py-5 font-bold text-foreground text-base underline decoration-primary/10 group-hover:decoration-primary/40 underline-offset-4 transition-all">{session.course}</td>
                  <td className="py-5 text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary/40" />
                      {new Date(session.date).toLocaleDateString()}
                      <span className="text-xs opacity-50">•</span>
                      {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-5 font-bold tabular-nums">
                    <span className="text-primary">{session.present}</span>
                    <span className="text-muted-foreground/40 font-normal"> / {session.total}</span>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-muted rounded-full relative overflow-hidden shadow-inner">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${getRateVariant(session.rate)}`}
                          style={{ width: session.rate }}
                        />
                      </div>
                      <span className="font-black text-xs min-w-[32px]">{session.rate}</span>
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-white transition-all shadow-sm">
                      <ArrowUpRight className="w-5 h-5" />
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
