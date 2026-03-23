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
  Cell
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Award,
  Loader2,
  Activity,
  Clock,
  Zap,
  ShieldCheck,
  BrainCircuit,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

// --- Types ---
interface ChartDataPoint {
  name: string;
  rate: number;
  rate2: number;
}

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

interface EngagementPoint {
  name: string;
  value: number;
  color: string;
}

interface PeakPeriod {
  time: string;
  volume: number;
  icon: string;
  color: string;
}

const AnalyticsPage = () => {
  // --- Queries ---
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => (await api.get('/analytics/dashboard')).data,
  });

  const { data: trendData = [], isLoading: isLoadingTrend } = useQuery<ChartDataPoint[]>({
    queryKey: ['analytics-trend'],
    queryFn: async () => (await api.get('/analytics/weekly-trend')).data,
  });

  const { data: distributionData = [], isLoading: isLoadingDist } = useQuery<CourseDistribution[]>({
    queryKey: ['analytics-dist'],
    queryFn: async () => (await api.get('/analytics/course-distribution')).data,
  });

  const { data: engagementData = [], isLoading: isLoadingEngagement } = useQuery<EngagementPoint[]>({
    queryKey: ['analytics-engagement'],
    queryFn: async () => (await api.get('/analytics/engagement-profile')).data,
  });

  const { data: peakPeriods = [], isLoading: isLoadingPeak } = useQuery<PeakPeriod[]>({
    queryKey: ['analytics-peak'],
    queryFn: async () => (await api.get('/analytics/peak-periods')).data,
  });

  const isLoading = isLoadingStats || isLoadingTrend || isLoadingDist || isLoadingEngagement || isLoadingPeak;

  const metrics = [
    { title: 'Attendance Rate', value: `${stats?.avg_attendance_rate ?? 0}%`, label: stats?.attendance_change, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { title: 'Total Courses', value: String(stats?.total_courses ?? 0), label: 'Current courses', icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { title: 'Top Course', value: distributionData[0]?.name ?? '0.0', label: 'Course code', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { title: 'Sessions Today', value: String(stats?.active_sessions_today ?? 0), label: 'Scheduled sessions for today', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <BrainCircuit className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 pb-20">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 fill-current" />
            Real-time Analytics
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-tight">
            Analytics <span className="italic text-primary">Hub</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-xl">
            Real-time analysis of attendance and student engagement.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-2 rounded-3xl border border-white shadow-xl">
           <div className="p-4 bg-indigo-900 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <div className="pr-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Integrity</span>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                 <span className="font-black text-slate-900 tracking-tight">Active & Secure</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {metrics.map((metric, i) => (
          <div key={i} className={`glass-card p-8 group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 border-none bg-white/40`}>
            {/* Hover Decor */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${metric.bg} rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl ${metric.bg} ${metric.color} shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full ${metric.bg} translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000 delay-100`} />
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{metric.title}</h3>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black tracking-tighter text-slate-900">{metric.value}</span>
                  <span className={`text-[10px] font-bold mb-1.5 ${metric.color} opacity-60`}>/ LIVE</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                   <span className={`w-1 h-1 rounded-full ${metric.bg}`} />
                   {metric.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
        <div className="lg:col-span-12 glass-card p-12 rounded-[3.5rem] bg-white/60">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Attendance Trends</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Weekly attendance comparison</p>
              </div>
              <div className="flex gap-4 p-1.5 bg-slate-100/50 rounded-2xl backdrop-blur-md">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase">Current Week</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-black uppercase text-slate-400">Previous Phase</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[28rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <defs>
                   <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                  dy={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                  dx={-20} 
                  domain={[0, 100]} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    padding: '16px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate2" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="8 8"
                  dot={false}
                  animationDuration={2000}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={6} 
                  dot={{ r: 0 }} 
                  activeDot={{ r: 8, strokeWidth: 4, fill: 'white', stroke: 'hsl(var(--primary))' }} 
                  animationDuration={1500} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-8 glass-card p-12 rounded-[3.5rem] bg-indigo-900 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse" />
           
           <div className="relative mb-16">
              <h2 className="text-3xl font-black tracking-tight uppercase italic">Course Attendance Breakdown</h2>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-2">Attendance Volume per Course</p>
           </div>
           
           <div className="relative h-[25rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <defs>
                  <linearGradient id="barGradientNexus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="white" opacity={0.05} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }} 
                  dx={-15} 
                />
                <Tooltip
                  cursor={{ fill: 'white', opacity: 0.05, radius: 20 }}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    padding: '16px'
                  }}
                />
                <Bar 
                  dataKey="students" 
                  fill="url(#barGradientNexus)" 
                  radius={[16, 16, 16, 16]} 
                  barSize={50} 
                  animationDuration={2000} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-12 rounded-[3.5rem] bg-white/60">
           <div className="mb-12 text-center">
              <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-6">
                 <PieChartIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Engagement</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2"> Timing and attendance status </p>
           </div>
           
           <div className="flex flex-col items-center">
            <div className="h-72 w-full relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-2">
                 <span className="text-4xl font-black text-slate-900 tracking-tighter">{engagementData[0]?.value ?? 0}%</span>
                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">On Time</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={10}
                    dataKey="value"
                    animationDuration={1500}
                    stroke="none"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                     contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      fontWeight: 900
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full mt-10">
              {engagementData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-12 rounded-[3.5rem] bg-white/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Peak Attendance Times</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Peak attendance times across the institution</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-2xl">
             <Clock className="w-6 h-6 text-slate-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {peakPeriods.map((item, i) => (
            <div key={i} className="space-y-6 group">
              <div className="flex flex-col gap-1">
                 <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-400">{item.time}</span>
                    <span className="text-lg font-black text-slate-900">{item.volume}%</span>
                 </div>
              </div>
              <div className="h-48 w-full bg-slate-100/50 rounded-3xl relative overflow-hidden border border-slate-100">
                <div
                  className={`absolute bottom-0 inset-x-0 bg-gradient-to-t ${item.color} transition-all duration-1000 ease-out flex items-start justify-center pt-4`}
                  style={{ height: `${item.volume}%` }}
                >
                  <Activity className="w-4 h-4 text-white/40 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;