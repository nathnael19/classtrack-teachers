import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Users, BookOpen, Activity, AlertCircle } from 'lucide-react';

const userGrowthData = [
  { name: 'Week 1', users: 400 },
  { name: 'Week 2', users: 600 },
  { name: 'Week 3', users: 800 },
  { name: 'Week 4', users: 1234 },
];

const activeCoursesData = [
  { name: 'CS101', students: 120 },
  { name: 'ENG201', students: 85 },
  { name: 'MAT301', students: 65 },
  { name: 'PHY101', students: 150 },
  { name: 'HIS102', students: 90 },
];

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'Fira Code, monospace' }}>
            System Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-l-[#CA8A04]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#CA8A04]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Fira Code, monospace' }}>1,234</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              ↑ 20% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-l-slate-800 dark:border-l-slate-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Fira Code, monospace' }}>56</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              ↑ 5 new this term
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Fira Code, monospace' }}>12</div>
            <p className="text-xs text-muted-foreground font-medium flex items-center mt-1">
              Ongoing classes right now
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600" style={{ fontFamily: 'Fira Code, monospace' }}>2</div>
            <p className="text-xs text-rose-600 font-medium flex items-center mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Fira Code, monospace' }}>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 500 }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#CA8A04" strokeWidth={3} dot={{ r: 4, fill: '#CA8A04', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Fira Code, monospace' }}>Top Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeCoursesData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1E293B', fontWeight: 600 }} px={10} />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="students" fill="#1C1917" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
