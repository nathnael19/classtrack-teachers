import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Users, BookOpen, Activity, AlertCircle, TrendingUp, 
  Clock, Plus, ShieldCheck, Server, Database, ServerCrash,
  ArrowUpRight, Zap, Globe, Cpu
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
  { id: 1, action: "New course created", detail: "Dr. Smith published 'Advanced Physics'", time: "2 hours ago", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, action: "User flagged", detail: "System detected suspicious login attempt", time: "4 hours ago", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: 3, action: "Bulk import complete", detail: "Added 250 new student records", time: "Yesterday", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 4, action: "System update", detail: "v2.1 deployed successfully", time: "Yesterday", icon: Server, color: "text-indigo-500", bg: "bg-indigo-500/10" },
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

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <Card className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-xl transition-all duration-500",
    !noHover && "hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none" />
    {children}
  </Card>
);

const AdminDashboardPage = () => {
  return (
    <div className="relative space-y-8 font-sans p-2">
      {/* Background Decorative Orbs - Optimized with will-change and reduced opacity */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse duration-[10s] will-change-transform" />
      <div className="absolute bottom-[-100px] left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse duration-[15s] will-change-transform" />
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Zap className="w-3 h-3 mr-1" /> System Live
             </Badge>
             <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter">Region: US-EAST-1</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400 pb-1">
            Command Center
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Real-time analytics for ClassTrack Enterprise
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-4 bg-white/20 dark:bg-black/20 p-2 rounded-[2rem] border border-white/20 backdrop-blur-md">
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-2xl hover:bg-white/40 dark:hover:bg-black/40 text-muted-foreground hover:text-primary transition-all shadow-sm">
            <Globe className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-2xl hover:bg-white/40 dark:hover:bg-black/40 text-muted-foreground hover:text-primary transition-all shadow-sm">
            <Cpu className="w-5 h-5" />
          </Button>
          <div className="w-[1px] h-8 bg-white/20 mx-1" />
          <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-t border-indigo-400/30 px-6 h-12 rounded-[1.5rem] font-bold">
            <Plus className="w-4 h-4 mr-2" />
            New User
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <GlassCard className="group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Total Users</CardTitle>
            <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-inner">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl lg:text-5xl font-black tabular-nums tracking-tighter">
              <AnimatedNumber value={1234} />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 20.4%
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 italic">vs last month</span>
            </div>
          </CardContent>
        </GlassCard>

        {/* Active Courses */}
        <GlassCard className="group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Active Courses</CardTitle>
            <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-500 shadow-inner">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl lg:text-5xl font-black tabular-nums tracking-tighter">
              <AnimatedNumber value={56} />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg flex items-center">
                <Plus className="w-3 h-3 mr-0.5" /> 5
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 italic">New this term</span>
            </div>
          </CardContent>
        </GlassCard>

        {/* Active Sessions */}
        <GlassCard className="group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Live Sessions</CardTitle>
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500 shadow-inner">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl lg:text-5xl font-black tabular-nums tracking-tighter">
                <AnimatedNumber value={12} />
              </div>
              <span className="relative flex h-3 w-3 mb-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 italic mt-3 tracking-widest">Active nodes synchronized</p>
          </CardContent>
        </GlassCard>

        {/* System Alerts */}
        <GlassCard className="group bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600/60 dark:text-rose-400/60">Security Alerts</CardTitle>
            <div className="p-3 bg-rose-500/10 dark:bg-rose-500/20 rounded-2xl group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-500 shadow-inner">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl lg:text-5xl font-black tabular-nums tracking-tighter text-rose-600 dark:text-rose-400 italic">
              <AnimatedNumber value={2} />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg flex items-center animate-pulse">
                Action Required
              </span>
            </div>
          </CardContent>
        </GlassCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Analytics Charts - Left Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <GlassCard className="flex-1 overflow-visible">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                   <CardTitle className="font-black text-xl tracking-tight">Enterprise Scaling</CardTitle>
                   <CardDescription>User onboarding trends across all departments</CardDescription>
                </div>
                <div className="px-4 py-1.5 bg-white/30 dark:bg-black/30 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Live Data</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 700 }} dy={10} stroke="currentColor" className="opacity-40" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 700 }} dx={-10} stroke="currentColor" className="opacity-40" />
                    <Tooltip 
                      cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        backdropFilter: 'blur(8px)',
                        borderRadius: '24px', 
                        border: '1px solid rgba(99, 102, 241, 0.3)', 
                        boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
                        padding: '16px',
                        fontWeight: 'bold',
                        color: '#1e1b4b'
                      }}
                      itemStyle={{ color: '#4f46e5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#6366f1" 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="group">
              <CardHeader className="pb-2">
                <CardTitle className="font-black text-lg tracking-tight flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-amber-500" />
                   Course Engagement
                </CardTitle>
                <CardDescription>Enrollment density by course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeCoursesData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }} barSize={18}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" className="opacity-10" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 900 }} stroke="currentColor" className="opacity-80" />
                      <Tooltip 
                        cursor={{ fill: 'currentColor', opacity: 0.03 }}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          backdropFilter: 'blur(8px)',
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontWeight: 'black',
                          color: '#0f172a'
                        }}
                      />
                      <Bar dataKey="students" radius={[0, 20, 20, 0]} animationDuration={1500}>
                        {activeCoursesData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f59e0b' : '#fb923c'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard className="p-1">
              <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-white/50 dark:from-slate-900/50 dark:to-black/50 rounded-[inherit] h-full flex flex-col">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="font-black text-lg tracking-tight">System Resources</CardTitle>
                  <CardDescription>Real-time compute performance</CardDescription>
                </CardHeader>
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  {[
                    { label: "API Cluster", value: 12, color: "bg-indigo-500", icon: Server, status: "Healthy" },
                    { label: "Database", value: 45, color: "bg-emerald-500", icon: Database, status: "Stable" },
                    { label: "Storage", value: 78, color: "bg-amber-500", icon: ServerCrash, status: "Critical" }
                  ].map((item) => (
                    <div key={item.label} className="group/stat">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground/80 group-hover/stat:text-primary transition-colors">
                            <item.icon className="w-4 h-4" /> {item.label}
                         </span>
                         <span className="text-[10px] font-black text-muted-foreground bg-white/40 dark:bg-black/40 px-2 py-0.5 rounded-md border border-white/20">{item.status}</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full h-3 p-0.5 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", item.color)} style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column - Recent Activity & Security */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="flex-1 min-h-[500px]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                   <CardTitle className="font-black text-xl tracking-tight">System Journal</CardTitle>
                   <CardDescription>Live telemetry stream</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-slate-100 dark:border-slate-800/50 ml-6 space-y-10 pb-4 mt-6">
                {recentActivity.map((item) => (
                  <div key={item.id} className="relative pl-10 group">
                    <div className={cn(
                      "absolute -left-[1.35rem] top-0 h-10 w-10 rounded-2xl border-4 border-white dark:border-black flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300",
                      item.bg
                    )}>
                      <item.icon className={cn("h-4 w-4", item.color)} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{item.action}</span>
                        <div className="flex items-center gap-1.5 opacity-60">
                           <Clock className="w-3 h-3" />
                           <span className="text-[10px] font-black uppercase tracking-tighter">{item.time}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/30 dark:bg-black/30 rounded-2xl border border-white/20 text-xs font-bold text-muted-foreground/80 leading-relaxed shadow-sm">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {/* Security Deep Card */}
          <GlassCard className="bg-[#1C1917] dark:bg-[#0C0A09] border-[#CA8A04]/30 p-1 group overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,138,4,0.15),transparent_70%)]" />
            <div className="relative p-6 border border-[#CA8A04]/20 rounded-[inherit] space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#CA8A04]/10 flex items-center justify-center border border-[#CA8A04]/20 shadow-lg shadow-yellow-500/5 group-hover:scale-110 transition-transform duration-500">
                     <ShieldCheck className="w-8 h-8 text-[#CA8A04]" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-black text-white uppercase tracking-[0.2em] opacity-60">Shield Active</span>
                     <span className="text-xl font-black text-white tracking-tight">Enterprise Guard</span>
                  </div>
               </div>
               
               <p className="text-[#CA8A04]/60 text-xs font-bold leading-relaxed">
                  Advanced threat detection is active. All nodes are reporting healthy status. Last intrusion scan completed at 23:45 UTC.
               </p>

               <div className="grid grid-cols-2 gap-3 pb-2">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1 hover:bg-white/10 transition-colors">
                     <span className="text-[10px] font-black text-white/40 uppercase">Safe Nodes</span>
                     <span className="text-lg font-black text-white">100%</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1 hover:bg-white/10 transition-colors">
                     <span className="text-[10px] font-black text-white/40 uppercase">Threats</span>
                     <span className="text-lg font-black text-rose-500 group-hover:animate-pulse">None</span>
                  </div>
               </div>

               <Button className="w-full h-12 bg-[#CA8A04] hover:bg-[#B47B04] text-[#1C1917] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-yellow-500/20 active:scale-95 group-hover:shadow-yellow-500/40">
                  <Zap className="w-4 h-4 mr-2" />
                  Audit Protocol
               </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
