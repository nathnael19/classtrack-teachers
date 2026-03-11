import { ArrowUpRight, ArrowDownRight, Users, BookOpen, Clock, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// --- Helper Components ---
const StatCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {change}
      </div>
    </div>
    <div>
      <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      <div className="text-3xl font-bold mt-1 tracking-tight">{value}</div>
    </div>
  </div>
);
// -------------------------

const DashboardPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, Dr. Smith. Here's your overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Courses" value="12" change="+2 from last term" isPositive={true} icon={BookOpen} />
        <StatCard title="Active Sessions Today" value="4" change="+1 from yesterday" isPositive={true} icon={Activity} />
        <StatCard title="Students Present Today" value="342" change="-12 from yesterday" isPositive={false} icon={Users} />
        <StatCard title="Average Attendance Rate" value="89.5%" change="+2.4% this week" isPositive={true} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 p-6 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Weekly Attendance Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{stroke: '#f3f4f6', strokeWidth: 2}}
                />
                <Line type="monotone" dataKey="rate" stroke="#171717" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="rate2" stroke="#d1d5db" strokeWidth={3} dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Course Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseDistributionData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#374151', fontSize: 12, fontWeight: 500}} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Bar dataKey="students" fill="#171717" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold tracking-tight">Recent Attendance Sessions</h3>
          <button className="text-sm font-medium text-primary hover:underline transition-all">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-lg">Course</th>
                <th className="px-4 py-3 font-semibold">Session Date</th>
                <th className="px-4 py-3 font-semibold">Students Present</th>
                <th className="px-4 py-3 font-semibold">Attendance Rate</th>
                <th className="px-4 py-3 font-semibold rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session, index) => (
                <tr key={session.id} className={`border-b border-muted/50 hover:bg-muted/20 transition-colors ${index === recentSessions.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-4 py-4 font-medium text-foreground">{session.course}</td>
                  <td className="px-4 py-4 text-muted-foreground">{session.date}</td>
                  <td className="px-4 py-4">
                    <span className="font-medium">{session.present}</span>
                    <span className="text-muted-foreground text-xs ml-1">/ {session.total}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${parseInt(session.rate) >= 90 ? 'bg-green-500' : parseInt(session.rate) >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} 
                          style={{width: session.rate}}
                        />
                      </div>
                      <span className="font-medium">{session.rate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-muted-foreground hover:text-primary transition-colors hover:bg-muted p-1.5 rounded-md">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
