import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Award,
  ArrowDown,
  Loader2,
  Activity,
  Clock,

} from 'lucide-react';
import api from '@/services/api';

// --- Types ---
interface ChartDataPoint {
  name: string;
  rate: number;
  rate2?: number;
}
// ... rest of the file stays same until chart lines ...

interface CourseDistribution {
  name: string;
  students: number;
}

interface DashboardStats {
  total_courses: number;
  active_sessions_today: number;
  students_present_today: number;
  avg_attendance_rate: number;
  attendance_change: string;
  is_positive: boolean;
}

const AnalyticsPage = () => {
  const [trendData, setTrendData] = useState<ChartDataPoint[]>([]);
  const [distributionData, setDistributionData] = useState<CourseDistribution[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trendRes, distRes, statsRes] = await Promise.all([
          api.get('/analytics/weekly-trend'),
          api.get('/analytics/course-distribution'),
          api.get('/analytics/dashboard'),
        ]);
        setTrendData(trendRes.data);
        setDistributionData(distRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const metrics = [
    { title: 'Avg. Attendance', value: `${stats?.avg_attendance_rate ?? 0}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Courses', value: String(stats?.total_courses ?? 0), icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Top Performer', value: distributionData[0]?.name ?? 'N/A', icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Total Sessions', value: String(stats?.active_sessions_today ?? 0), icon: ArrowDown, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const participationData = [
    { name: 'On Time', value: 85, color: '#10b981' },
    { name: 'Late', value: 10, color: '#f59e0b' },
    { name: 'Absent', value: 5, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Analytics Insights</h1>
        <p className="text-muted-foreground mt-2 text-lg">Detailed visualization of attendance performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((metric, i) => (
          <div key={i} className="glass-card p-6 flex flex-col group cursor-pointer hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color} transition-transform group-hover:scale-110 duration-300`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <Activity className="w-4 h-4 text-muted-foreground/30" />
            </div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{metric.title}</h3>
            <div className="text-3xl font-bold mt-2 tracking-tight text-glow">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="glass-card p-8 rounded-3xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight">Attendance by Course</h2>
            <p className="text-sm text-muted-foreground mt-1">Total student volume per active course module.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} domain={[0, 'auto']} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 8 }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="students" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight">Attendance Trajectory</h2>
            <p className="text-sm text-muted-foreground mt-1">Visualizing participation rates over the past week.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: 'white', strokeWidth: 2 }} activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }} animationDuration={1000} />
                <Line type="monotone" dataKey="rate2" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: 'white', strokeWidth: 2 }} activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }} animationDuration={1200} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-3xl lg:col-span-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-center">Engagement Profile</h2>
            <p className="text-xs text-muted-foreground mt-1 text-center">Student arrival status breakdown.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full mt-4 px-4">
              {participationData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  <span className="text-sm font-black tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight">Daily Peak Periods</h2>
            <p className="text-sm text-muted-foreground mt-1">Average student arrival volume by time segment.</p>
          </div>
          <div className="space-y-6">
            {[
              { time: '08:00 AM', volume: 95, icon: Clock, color: 'from-emerald-400 to-emerald-600' },
              { time: '10:00 AM', volume: 88, icon: Clock, color: 'from-blue-400 to-blue-600' },
              { time: '12:00 PM', volume: 65, icon: Clock, color: 'from-amber-400 to-amber-600' },
              { time: '02:00 PM', volume: 72, icon: Clock, color: 'from-indigo-400 to-indigo-600' },
              { time: '04:00 PM', volume: 45, icon: Clock, color: 'from-rose-400 to-rose-600' },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>{item.time}</span>
                  </div>
                  <span className="text-glow transition-all group-hover:scale-110">{item.volume}% Average</span>
                </div>
                <div className="w-full h-3 bg-muted/30 rounded-full relative overflow-hidden shadow-inner border border-white/5">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.volume}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;