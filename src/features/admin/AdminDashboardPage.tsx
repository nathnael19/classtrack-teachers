import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Users, BookOpen, Activity, AlertCircle, TrendingUp } from 'lucide-react';

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

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
    {children}
  </Card>
);

const AdminDashboardPage = () => {
  return (
    <div className="relative space-y-8 font-sans p-2">
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
          Command Center
        </h1>
        <p className="text-muted-foreground font-medium flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          All systems operating at peak efficiency
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <GlassCard className="group hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Users</CardTitle>
            <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tabular-nums tracking-tight">1,234</div>
            <p className="text-sm font-bold mt-2 flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +20% this month
            </p>
          </CardContent>
        </GlassCard>

        {/* Active Courses */}
        <GlassCard className="group hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Courses</CardTitle>
            <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tabular-nums tracking-tight">56</div>
            <p className="text-sm font-bold mt-2 flex items-center text-amber-600 dark:text-amber-400 bg-amber-500/10 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> 5 new this term
            </p>
          </CardContent>
        </GlassCard>

        {/* Active Sessions */}
        <GlassCard className="group hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Sessions</CardTitle>
            <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-black tabular-nums tracking-tight">12</div>
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
              </span>
            </div>
            <p className="text-sm font-bold mt-2 text-muted-foreground">Classes running now</p>
          </CardContent>
        </GlassCard>

        {/* System Alerts */}
        <GlassCard className="group hover:-translate-y-1 border-rose-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">System Alerts</CardTitle>
            <div className="p-2 bg-rose-500/10 dark:bg-rose-500/20 rounded-xl group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tabular-nums tracking-tight text-rose-600 dark:text-rose-400">2</div>
            <p className="text-sm font-bold mt-2 text-rose-600 dark:text-rose-400 bg-rose-500/10 w-fit px-2 py-0.5 rounded-full">
              Action Required
            </p>
          </CardContent>
        </GlassCard>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <GlassCard className="col-span-4">
          <CardHeader>
            <CardTitle className="font-bold text-lg">Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500 }} dy={10} stroke="currentColor" className="opacity-50" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500 }} dx={-10} stroke="currentColor" className="opacity-50" />
                  <Tooltip 
                    cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.3)', 
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      fontWeight: 'bold',
                      color: '#0f172a'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="url(#colorUsers)" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} 
                  />
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard className="col-span-3">
          <CardHeader>
            <CardTitle className="font-bold text-lg">Top Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeCoursesData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500 }} stroke="currentColor" className="opacity-50" />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 700 }} stroke="currentColor" className="opacity-80" />
                  <Tooltip 
                    cursor={{ fill: 'currentColor', opacity: 0.05 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      backdropFilter: 'blur(12px)',
                      borderRadius: '12px', 
                      border: '1px solid rgba(255, 255, 255, 0.3)', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontWeight: 'bold',
                      color: '#0f172a'
                    }}
                  />
                  <Bar dataKey="students" radius={[0, 12, 12, 0]}>
                    {activeCoursesData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f59e0b' : '#d97706'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
