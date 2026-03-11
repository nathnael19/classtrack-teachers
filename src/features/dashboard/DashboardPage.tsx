import { ArrowUpRight, ArrowDownRight, Users, BookOpen, Clock, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

// --- Dummy Data ---
const performanceData = [
  { name: 'Mon', rate: 75, rate2: 80 },
  { name: 'Tue', rate: 85, rate2: 82 },
  { name: 'Wed', rate: 90, rate2: 85 },
  { name: 'Thu', rate: 82, rate2: 83 },
  { name: 'Fri', rate: 95, rate2: 89 },
];

const courseDistributionData = [
  { name: 'CS101', students: 120 },
  { name: 'CS202', students: 85 },
  { name: 'MATH101', students: 150 },
  { name: 'PHY201', students: 60 },
  { name: 'ENG101', students: 200 },
];

const recentSessions = [
  { id: '1', course: 'Computer Science 101', date: '2023-10-25 09:00 AM', present: 110, total: 120, rate: '92%' },
  { id: '2', course: 'Machine Learning', date: '2023-10-24 02:00 PM', present: 45, total: 50, rate: '90%' },
  { id: '3', course: 'Database Systems', date: '2023-10-24 10:00 AM', present: 75, total: 85, rate: '88%' },
  { id: '4', course: 'Advanced Algorithms', date: '2023-10-23 01:00 PM', present: 38, total: 40, rate: '95%' },
  { id: '5', course: 'Web Development', date: '2023-10-22 11:00 AM', present: 95, total: 100, rate: '95%' },
];
// ------------------

const getRateVariant = (rate: string) => {
  const n = parseInt(rate, 10);
  if (n >= 90) return 'bg-success';
  if (n >= 80) return 'bg-warning';
  return 'bg-destructive';
};

// --- Helper Components ---
const StatCard = ({ title, value, change, isPositive, icon: Icon }: { title: string; value: string; change: string; isPositive: boolean; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="group p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col transition-all duration-200 hover:shadow-md hover:border-border/80">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-primary/10 rounded-xl text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="w-5 h-5" aria-hidden />
      </div>
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1 shrink-0" aria-hidden /> : <ArrowDownRight className="w-4 h-4 mr-1 shrink-0" aria-hidden />}
        <span>{change}</span>
      </div>
    </div>
    <div>
      <p className="text-muted-foreground text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1 tracking-tight tabular-nums">{value}</p>
    </div>
  </div>
);
// -------------------------

const DashboardPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1.5 text-base">Welcome back, Dr. Smith. Here&apos;s your overview for today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Courses" value="12" change="+2 from last term" isPositive={true} icon={BookOpen} />
        <StatCard title="Active Sessions Today" value="4" change="+1 from yesterday" isPositive={true} icon={Activity} />
        <StatCard title="Students Present Today" value="342" change="-12 from yesterday" isPositive={false} icon={Users} />
        <StatCard title="Average Attendance Rate" value="89.5%" change="+2.4% this week" isPositive={true} icon={Clock} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" aria-label="Charts">
        <div className="lg:col-span-2 p-6 rounded-xl border bg-card shadow-sm">
          <h2 className="text-lg font-semibold mb-6 tracking-tight">Weekly Attendance Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="rate2" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth={2} dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h2 className="text-lg font-semibold mb-6 tracking-tight">Course Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseDistributionData} layout="vertical" margin={{ top: 0, right: 8, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-xl border bg-card shadow-sm" aria-labelledby="recent-sessions-heading">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 id="recent-sessions-heading" className="text-lg font-semibold tracking-tight">Recent Attendance Sessions</h2>
          <Button variant="ghost" size="sm" className="text-primary font-medium">
            View all
          </Button>
        </div>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold rounded-tl-lg">Course</th>
                <th scope="col" className="px-4 py-3 font-semibold">Session Date</th>
                <th scope="col" className="px-4 py-3 font-semibold">Students Present</th>
                <th scope="col" className="px-4 py-3 font-semibold">Attendance Rate</th>
                <th scope="col" className="px-4 py-3 font-semibold rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session, index) => (
                <tr
                  key={session.id}
                  className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${index === recentSessions.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-4 py-4 font-medium text-foreground">{session.course}</td>
                  <td className="px-4 py-4 text-muted-foreground">{session.date}</td>
                  <td className="px-4 py-4 tabular-nums">
                    <span className="font-medium">{session.present}</span>
                    <span className="text-muted-foreground text-xs ml-1">/ {session.total}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden" role="img" aria-label={`Attendance ${session.rate}`}>
                        <div
                          className={`h-full rounded-full ${getRateVariant(session.rate)}`}
                          style={{ width: session.rate }}
                        />
                      </div>
                      <span className="font-medium tabular-nums">{session.rate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      View
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
